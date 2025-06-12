import React, { useState, useEffect } from 'react';
import {  Box,  Typography,  Button,} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {  useViewQuery,  useUserUpdateMutation, // 상태 변경용 API 가정
} from '../../features/user/userApi';
import { useCmDialog } from '../../cm/CmDialogUtil';

const AdminUserview = () => {
  const { userId } = useParams(); // URL 파라미터로 유저 아이디 받기
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();

  const { data, isSuccess } = useViewQuery({ userId });
  const [userStatusUpdate] = useUserUpdateMutation();

  // 유저 정보 상태값
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    email: '',
    userTel: '',
    addr: '',
    addrD: '',
    postCode: '',
    profileImage: null,
    status: '',
    delYn: 'N',
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      setUserInfo(data.data);
    }
  }, [isSuccess, data]);

  // 상태 변경 핸들러
  const handleChangeStatus = async (newStatus) => {
    if (newStatus === userInfo.status && (newStatus !== '탈퇴')) {
      showAlert(`이미 ${newStatus} 상태입니다.`);
      return;
    }

    if (newStatus === '탈퇴' && userInfo.delYn === 'Y') {
      showAlert('이미 탈퇴한 회원입니다.');
      return;
    }

    try {
      const res = await userStatusUpdate({
        userId,
        status: newStatus,
      }).unwrap();

      if (res.success) {
        showAlert(`${newStatus} 상태로 변경되었습니다.`, () => {
          // 상태 반영을 위해 다시 조회하거나 페이지 이동
          navigate(0); // 페이지 새로고침 (간단하게 처리)
        });
      } else {
        showAlert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      showAlert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const defaultProfileImg = 'https://i.stack.imgur.com/l60Hf.png';

  return (
    <Box
     sx={{
        width: '350px',
        height: '640px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'sans-serif',
        mt: '50px',
        boxSizing: 'border-box',
      }}
    >
     <Box
  sx={{
    p: 2,
    mb: 3,
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  }}
>
  <Box display="flex" alignItems="center">
    <img
      src={userInfo.profileImage || defaultProfileImg}
      alt="프로필"
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ccc',
        marginRight: '16px',
      }}
    />

    <Box>
      <Typography variant="h6" fontWeight="bold">
        이름 : {userInfo.nickname || '이름 없음'}
      </Typography>

      <Typography variant="body2" color={
        userInfo.delYn === 'Y' ? 'gray' :
        userInfo.status === '정지' ? 'red' : 'green'
      }>
        상태: {
          userInfo.delYn === 'Y'
            ? '탈퇴'
            : userInfo.status === '정지'
            ? '정지'
            : '활성'
        }
      </Typography>
    </Box>
  </Box>
</Box>

      {/* 기본 정보 */}
     
       <Typography variant="body2" color="textSecondary" mb={1}>
        닉네임: {userInfo.nickname}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={1}>
        아이디: {userInfo.userId}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={1}>
        이메일: {userInfo.email}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={1}>
        전화번호: {userInfo.userTel || '-'}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={1}>
        주소: {userInfo.addr} {userInfo.addrD}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        우편번호: {userInfo.postCode || '-'}
      </Typography>

      {/* 상태 버튼 */}
      <Box display="flex" justifyContent="space-between" gap={1}>
        <Button
          variant={userInfo.delYn === 'Y' ? 'outlined' : userInfo.status === '활성' ? 'contained' : 'outlined'}
          color="success"
          sx={{ flex: 1 }}
          onClick={() => handleChangeStatus('활성')}
          disabled={userInfo.delYn === 'Y'}
        >
          활성
        </Button>
        <Button
          variant={userInfo.delYn === 'Y' ? 'outlined' : userInfo.status === '정지' ? 'contained' : 'outlined'}
          color="error"
          sx={{ flex: 1 }}
          onClick={() => handleChangeStatus('정지')}
          disabled={userInfo.delYn === 'Y'}
        >
          정지
        </Button>
        <Button
          variant={userInfo.delYn === 'Y' ? 'contained' : 'outlined'}
          color="secondary"
          sx={{ flex: 1 }}
          onClick={() => handleChangeStatus('탈퇴')}
        >
          탈퇴
        </Button>
      </Box>
    </Box>
  );
};

export default AdminUserview;
