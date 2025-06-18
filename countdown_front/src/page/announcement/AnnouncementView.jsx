import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAnnouncementViewQuery } from "../../features/announcement/announcementApi";
import {
    Box, Typography, Button, CircularProgress, 
    Paper, Alert, Stack, // Alert는 에러 메시지 표시용
} from '@mui/material';

const AnnouncementView = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const user = useSelector((state) => state.user.user);
  const { data, isLoading, error, isSuccess } = useAnnouncementViewQuery({ annId: Number(id) });

  const [announcement, setAnnouncement] = useState(null);
  const navigate = useNavigate();

  // ✅ 관리자만 접근 가능하도록
  useEffect(() => {
    if (!user || user.adminYn !== "Y") {
      alert("관리자만 접근 가능합니다.");
      navigate("/"); // 또는 로그인 화면이나 홈 화면 등으로 리디렉션
    }
  }, [user, navigate]);

  console.log("AnnouncementView - 컴포넌트 렌더링 시작");
  console.log("AnnouncementView - URL에서 읽어온 ID:", id); // 이 ID 값이 정확한지 확인
  console.log("AnnouncementView - Number(id) 변환 결과:", Number(id)); // 숫자로 제대로 변환되는지 확인
  
  useEffect(() => {
      if (isSuccess) {
          console.log("AnnouncementView - API에서 받은 데이터:", data); // 전체 data 객체
          console.log("AnnouncementView - 실제 공지 데이터 (data.data):", data?.data); // data.data 확인
          setAnnouncement(data?.data);
      }
  }, [isSuccess, data]);

  const handleEdit = () => {
    navigate(`/ann/annupdate.do?id=${announcement.annId}`);
  };

  const handleCancel = () => {
    navigate('/ann/annlist.do');
  };

  return (
    <Box sx={{ px: 2, py: 4 }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>공지사항을 불러오는 중...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error">
          게시글을 불러오는 데 실패했습니다: {error?.message || "알 수 없는 오류"}
          <Button onClick={() => navigate("/ann/annlist.do")} sx={{ ml: 2 }}>
            목록으로
          </Button>
        </Alert>
      ) : announcement ? (
        <Box>
          {/* 제목 */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            [{announcement.annTitle}]
          </Typography>

          {/* 등록일 */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            등록일 : {new Date(announcement.createDt).toISOString().split("T")[0]}
          </Typography>

          {/* 본문 */}
          <Paper elevation={1} sx={{ p: 2, whiteSpace: "pre-line", mb: 3 }}>
            {announcement.annContent}
          </Paper>

          {/* 버튼 영역 */}
          <Stack direction="row" spacing={2} justifyContent="center">
            {user?.adminYn === 'Y' && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#B00020",
                  color: "#fff",
                  '&:hover': { backgroundColor: "#9A001C" },
                  fontWeight: "bold",
                  px: 4
                }}
                onClick={handleEdit}
              >
                수정
              </Button>
            )}
            <Button
              variant="outlined"
              sx={{
                color: "#333",
                borderColor: "#ccc",
                backgroundColor: "#f5f5f5",
                '&:hover': {
                  backgroundColor: "#eee",
                },
                px: 4
              }}
              onClick={handleCancel}
            >
              목록
            </Button>
          </Stack>
        </Box>
      ) : (
        <Typography variant="body1">공지사항을 찾을 수 없습니다.</Typography>
      )}
    </Box>
  );
};

export default AnnouncementView;