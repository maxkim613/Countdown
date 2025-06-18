import React, { useEffect } from "react";
import { 
  Box, Typography, List, ListItemButton,
  ListItemText, Fab, CircularProgress
 } from "@mui/material";
 import { useSelector } from "react-redux";
import { useAnnouncementListQuery } from "../../features/announcement/announcementApi";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { CmUtil } from "../../cm/CmUtil";

const AnnouncementList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보

  const { data, refetch, isLoading, isError, error } = useAnnouncementListQuery({
    startDate: CmUtil.addDate(CmUtil.getToday(), { months: -3 }),
    endDate: CmUtil.getToday(),
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // 데이터가 로드될 때만 정렬을 수행합니다.
  const sortedAnnouncements = React.useMemo(() => {
    if (data?.data?.list) {
      // slice()를 사용하여 원본 배열을 변경하지 않고 복사본을 정렬합니다.
      return [...data.data.list].sort((a, b) => {
        const dateA = new Date(a.createDt);
        const dateB = new Date(b.createDt);
        // 최신 날짜가 위로 오도록 내림차순 정렬 (B - A)
        // 만약 날짜가 같다면 annId를 기준으로 내림차순 정렬
        if (dateA.getTime() === dateB.getTime()) {
          return b.annId - a.annId; // annId가 숫자라고 가정
        }
        return dateB.getTime() - dateA.getTime();
      });
    }
    return [];
  }, [data]); // data가 변경될 때마다 재정렬
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>데이터를 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography color="error">공지사항 목록을 불러오는 중 오류가 발생했습니다.</Typography>
        <Typography variant="body2" color="textSecondary">{error.message || '알 수 없는 오류'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* 공지사항 리스트 */}
      <List sx={{ mt: '64px' }}>
        {sortedAnnouncements.map((announcement) => (
          <ListItemButton
            key={announcement.annId}
            sx={{
              bgcolor: '#fff',
              m: 1,
              borderRadius: 1,
              boxShadow: 1,
              px: 2
            }}
            onClick={() => navigate(`/ann/annview.do?id=${announcement.annId}`)}
          >
            <ListItemText
              primary={`[${announcement.annTitle}]`}
              secondary={new Date(announcement.createDt).toISOString().split('T')[0]}
              primaryTypographyProps={{ fontWeight: 'bold' }}
              secondaryTypographyProps={{ align: 'right' }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* 공지 작성 버튼 */}
      {user?.adminYn === 'Y' && (
        <Fab
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          bgcolor: '#B00020',
          color: '#fff',
          '&:hover': {
            bgcolor: '#8a0010',
          },
        }}
        onClick={() => navigate('/ann/anncreate.do')}
        >
        <EditIcon />
      </Fab>
      )}
    </Box>
  );
};

export default AnnouncementList;
