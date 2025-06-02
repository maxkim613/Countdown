import React, { useState, useEffect, useRef } from 'react'; // React 훅 import
import { useUserUpdateMutation, useUserDeleteMutation, useViewQuery } from '../../features/user/userApi'; // 사용자 정보 API
import { useSelector } from 'react-redux'; // Redux 상태 조회
import { useNavigate } from 'react-router-dom'; // 페이지 이동
import { TextField, Button, Box, Typography } from '@mui/material'; // MUI UI 컴포넌트
import { useCmDialog } from '../../cm/CmDialogUtil';  // 커스텀 다이얼로그
import { CmUtil } from '../../cm/CmUtil'; // 유틸 함수

const UserUpdate = () => {
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
  const navigate = useNavigate(); // 페이지 이동 함수

  // 입력값 상태 정의
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // 입력창 참조
  const userIdRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();

  const { showAlert } = useCmDialog(); // 알림창 함수
  const [userUpdate] = useUserUpdateMutation(); // 사용자 정보 수정 API
  const [userDelete] = useUserDeleteMutation(); // 사용자 탈퇴 API
  const { data, isSuccess } = useViewQuery({ userId: user?.userId }); // 사용자 정보 조회 API

  // 사용자 정보 불러와서 상태 설정
  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      setUserId(info.userId);
      setUsername(info.username);
      setEmail(info.email);
    }
  }, [isSuccess, data]);

  // 회원 정보 수정 처리
  const handleUpdateClick = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert('아이디를 입력해주세요.');
      userIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(username)) {
      showAlert('이름을 입력해주세요.');
      usernameRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(email)) {
      showAlert('이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }

    if (!CmUtil.isEmail(email)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      emailRef.current?.focus();
      return;
    }

    const response = await userUpdate({ userId, password, username, email }).unwrap();
    try {
      if (response.success) {
        showAlert("회원정보 수정에 성공 하셨습니다. 홈화면으로 이동합니다.", () => navigate('/'));
      } else {
        showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
    } 
  };

  // 회원 탈퇴 처리
  const handleDeleteClick = async () => {
    try {
      const response = await userDelete({ userId }).unwrap();
      if (response.success) {
        showAlert("회원탈퇴에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => navigate('/user/login.do'));
      } else {
        showAlert('회원탈퇴에에 실패했습니다.');
      }
    } catch (error) {
      showAlert('회원탈퇴에에 실패했습니다.');
    } 
  };

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
      <Typography variant="h4" gutterBottom>회원정보 수정</Typography>

      {/* 아이디 (수정 불가) */}
      <TextField
        label="아이디"
        value={userId}
        disabled
        fullWidth
        inputRef={userIdRef}
        margin="normal"
      />

      {/* 비밀번호 입력 (선택 사항) */}
      <TextField
        label="새 비밀번호 (변경 시 입력)"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        inputRef={passwordRef}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 이름 입력 */}
      <TextField
        label="이름"
        fullWidth
        margin="normal"
        value={username}
        inputRef={usernameRef}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* 이메일 입력 */}
      <TextField
        label="이메일"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        inputRef={emailRef}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* 수정 버튼 */}
      <Button
        onClick={handleUpdateClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원 정보 수정
      </Button>

      {/* 탈퇴 버튼 */}
      <Button
        onClick={handleDeleteClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원 탈퇴
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
    </Box>
  );
};

export default UserUpdate; // 컴포넌트 내보내기
