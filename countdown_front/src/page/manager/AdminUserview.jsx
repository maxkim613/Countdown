import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useViewQuery, useUpdateUserStatusMutation } from '../../features/user/UserApi';
import { useCmDialog } from '../../cm/CmDialogUtil';

const AdminUserview = () => {
  const { userId } = useParams();
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();

  const { data, isSuccess, refetch } = useViewQuery({ userId });
  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();

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
    accYn: 'N',
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const user = data.data;
      let status = '활성';
      if (user.delYn === 'Y') status = '탈퇴';
      else if (user.accYn === 'Y') status = '정지';

      setUserInfo({ ...user, status });
    }
  }, [isSuccess, data, refetch]);

 const handleChangeStatus = async (newStatus) => {
  try {
    await updateUserStatus({ userId, status: newStatus }).unwrap();
    showAlert('상태 변경 성공');

    setTimeout(() => {
      navigate('/manager/alist');
    }); 
  } catch (error) {
    showAlert('상태 변경 실패: ' + (error?.data?.message || error.message || '알 수 없는 오류'));
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

          <Box sx={{ marginLeft: '28px'}}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '4px'}}>
              이름 : {userInfo.nickname || '이름 없음'}
            </Typography>

            <Typography
              variant="body2"
              color={
                userInfo.delYn === 'Y'
                  ? 'gray'
                  : userInfo.status === '정지'
                  ? 'red'
                  : 'green'
              }
            >
              상태:{' '}
              {userInfo.delYn === 'Y'
                ? '탈퇴'
                : userInfo.status === '정지'
                ? '정지'
                : '활성'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 기본 정보 */}
      <Typography variant="body2" color="textSecondary" mb={2}>
        닉네임: {userInfo.nickname}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        아이디: {userInfo.userId}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        이메일: {userInfo.email}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        전화번호: {userInfo.userTel || '-'}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        주소: {userInfo.addr} {userInfo.addrD}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        우편번호: {userInfo.postCode || '-'}
      </Typography>


      {/* 상태 버튼 */}
      <Box display="flex" justifyContent="space-between" gap={1}>
        <Button
          variant={
            userInfo.delYn === 'Y'
              ? 'outlined'
              : userInfo.status === '활성'
              ? 'contained'
              : 'outlined'
          }
          color="success"
          sx={{ flex: 1 }}
          onClick={() => handleChangeStatus('활성')}
          disabled={userInfo.delYn === 'Y' || isLoading}
        >
          활성
        </Button>

        <Button
          variant={
            userInfo.delYn === 'Y'
              ? 'outlined'
              : userInfo.status === '정지'
              ? 'contained'
              : 'outlined'
          }
          color="error"
          sx={{ flex: 1 }}
          onClick={() => handleChangeStatus('정지')}
          disabled={userInfo.delYn === 'Y' || isLoading}
        >
          정지
        </Button>
        <Button
          variant={userInfo.delYn === 'Y' ? 'contained' : 'outlined'}
          color="secondary"
          sx={{ flex: 1 }}
          onClick={() => handleChangeStatus('탈퇴')}
          disabled={isLoading}
        >
          탈퇴
        </Button>
      </Box>
    </Box>
  );
};

export default AdminUserview;
