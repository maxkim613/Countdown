import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useViewQuery } from '../../features/user/UserApi';

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data, isSuccess } = useViewQuery({ userId: id });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setUserInfo(data?.data);
    }
  }, [isSuccess, data]);

  if (!userInfo) return null;

  // 기본 프로필 이미지
  const defaultProfileImg = '/default-profile.png';

  // 메뉴 리스트
  const menuItems = [
    '내 거래 내역',
    '관심 상품',
    '내 경매 승인 현황',
    '참여 중인 경매',   
    '경매 진행중인 나의 상품',   
    '문의 하기',
    '공지 사항',
    '로그 아웃',
  ];

  return (
    <Box
      sx={{
        width: '350px',
        height: '640px',
        margin: '40px auto 0',
        padding: '1rem',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* 프로필 박스 */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={userInfo.profileUrl || defaultProfileImg}
          alt="프로필"
          sx={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #ccc',
            marginRight: '16px',
            backgroundColor: '#ccc',
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold" mb={0.5}>
            사용자 이름: {userInfo.username || '이름 없음'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            닉네임: {userInfo.nickname || '-'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            borderRadius: '20px',
            fontSize: '12px',
            padding: '6px 12px',
            bgcolor: '#B00020',
          }}
          onClick={() => navigate('/user/update.do')}
        >
          프로필 수정
        </Button>
      </Box>

      {/* 메뉴 목록 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              backgroundColor: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
              width: '87%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              border: '1px solid #eee',
              transition: 'box-shadow 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              },
              userSelect: 'none',
            }}
            onClick={() => {
              // 필요시 클릭 동작 추가
              if (item === '로그 아웃') {
                // 로그아웃 처리 예시
                // authLogout();
                navigate('/login');
              } else if (item === '내 거래 내역') {
                  navigate(`/userA/useral`);
              } else if (item === '참여 중인 경매') {
                  navigate(`/userA/userabid`);
              } else if (item ===  '경매 진행중인 나의 상품') {
                  navigate(`/userA/userasell`);
              } else if (item ===  '내 경매 승인 현황') {
                  navigate(`/userA/userawaite`);
              } else if (item ===  '관심 상품') {
                  navigate(`/userA/useralike`);
              } else {
                // 그 외 메뉴 클릭 처리  
              }
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserProfile;
