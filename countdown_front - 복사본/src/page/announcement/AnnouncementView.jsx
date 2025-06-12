import React, { useEffect, useState } from 'react'; // React 훅 import
import { useSearchParams, useNavigate } from 'react-router-dom'; // URL 파라미터 및 페이지 이동
import { useSelector } from 'react-redux'; // Redux 상태 조회
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material'; // MUI 컴포넌트
import { useBoardViewQuery } from '../../features/board/boardApi'; // 게시글 조회 API 훅
import CmComment from '../../cm/CmComment'; // 댓글 컴포넌트

const BoardView = () => {
  const [searchParams] = useSearchParams(); // URL 파라미터 추출 훅
  const id = searchParams.get('id'); // 게시글 ID 추출
  const user = useSelector((state) => state.user.user); // 로그인한 사용자 정보 가져오기

  // 게시글 조회 API 호출
  const { data, isLoading, error, isSuccess, refetch } = useBoardViewQuery({ boardId: id });

  const [board, setBoard] = useState(null); // 게시글 데이터 상태
  const navigate = useNavigate(); // 페이지 이동 훅

  // 게시글 조회 성공 시 board 상태 설정
  useEffect(() => {
    if (isSuccess) {
      setBoard(data?.data);
    }
  }, [isSuccess, data]);

  return (
    <Box
      sx={{
        maxWidth: '800px',
        mx: 'auto',
        my: 4,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {isLoading ? ( // 로딩 중이면 로딩 스피너 표시
        <CircularProgress />
      ) : error ? ( // 에러 발생 시 경고 표시
        <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>
      ) : board ? ( // 게시글이 존재할 경우
        <>
          {/* 게시글 제목 */}
          <Typography variant="h4" gutterBottom>
            {board.title}
          </Typography>

          {/* 작성자 및 작성일 */}
          <Box display="flex" justifyContent="space-between" color="text.secondary" fontSize={14}>
            <span>작성자: {board.createId}</span>
            <span>{board.createDt}</span>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 게시글 본문 */}
          <Paper elevation={2} sx={{ p: 2, minHeight: '200px', maxHeight: '500px', overflow: 'auto' }}>
            <div dangerouslySetInnerHTML={{ __html: board.content }} />
          </Paper>

          {/* 첨부파일 표시 */}
          {board.postFiles && board.postFiles.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                첨부파일
              </Typography>
              {board.postFiles.map((file) => (
                <Typography key={file.fileId}>
                  <a
                    href={`${process.env.REACT_APP_API_BASE_URL}/file/down.do?fileId=${file.fileId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.fileName}
                  </a>
                </Typography>
              ))}
            </Box>
          )}

          {/* 수정 및 목록 버튼 */}
          <Box display="flex" gap={1} mt={2}>
            {user?.userId === board?.createId && ( // 작성자 본인일 경우 수정 가능
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/board/update.do?id=${board.boardId}`, { state: { reset: true } })}
              >
                수정
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/board/list.do')}
            >
              목록으로
            </Button>
          </Box>

          {/* 댓글 컴포넌트 */}
          <CmComment
            comments={data?.data?.comments || []}
            user={user}
            boardId={board.boardId}
            refetchComments={refetch}  // 댓글 작성 후 목록 갱신용
          />
        </>
      ) : null}
    </Box>
  );
};

export default BoardView; // 컴포넌트 내보내기
