import React, { useEffect, useState } from 'react'; // React 훅 import
import { useNavigate, useSearchParams } from 'react-router-dom'; // URL 파라미터 및 페이지 이동
import { useViewQuery } from '../../features/user/userApi'; // 사용자 정보 조회 API
import { Paper, Typography, Box, Button, CircularProgress, Alert } from '@mui/material'; // MUI 컴포넌트

const UserView = () => {
  const [searchParams] = useSearchParams(); // URL에서 쿼리 파라미터 추출
  const id = searchParams.get('id'); // 'id' 파라미터 값 가져오기
  const { data, isLoading, error, isSuccess } = useViewQuery({ userId: id }); // 사용자 정보 API 호출
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const navigate = useNavigate(); // 페이지 이동 함수

  // API 호출 결과가 성공하면 사용자 정보 상태 업데이트
  useEffect(() => {
    if (isSuccess) {
      setUserInfo(data?.data);
    }
  }, [isSuccess, data]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      {/* 로딩 상태 */}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">회원 정보를 불러오는 데 실패했습니다.</Alert>
      ) : userInfo ? (
        <>
          <Typography variant="h4" gutterBottom>회원 정보</Typography>

          {/* 사용자 정보 카드 */}
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              p: 3,
              borderRadius: 2,
              backgroundColor: '#f9f9f9'
            }}
          >
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              아이디
            </Typography>
            <Typography variant="body1" fontWeight="500" gutterBottom>
              {userInfo.userId}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              이름
            </Typography>
            <Typography variant="body1" fontWeight="500" gutterBottom>
              {userInfo.username}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              이메일
            </Typography>
            <Typography variant="body1" fontWeight="500" gutterBottom>
              {userInfo.email}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              가입일
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {userInfo.createDt}
            </Typography>
          </Paper>

          {/* 수정 버튼 */}
          <Button
            onClick={() => navigate('/user/update.do')}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            수정
          </Button>

          {/* 목록 이동 버튼 */}
          <Button
            onClick={() => navigate('/user/list.do')}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            목록
          </Button>

          {/* 홈 이동 버튼 */}
          <Button
            onClick={() => navigate('/')}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            홈
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default UserView; // 컴포넌트 내보내기
