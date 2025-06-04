import React, { useState, useRef, useEffect } from 'react'; // React 훅 import
import { useLoginMutation } from '../../features/user/userApi'; // 로그인 API 호출 훅
import { useDispatch } from 'react-redux'; // Redux dispatch
import { setUser } from '../../features/user/userSlice'; // 로그인 성공 시 사용자 저장
import { useNavigate } from 'react-router-dom'; // 페이지 이동
import { TextField, Button, Box, Typography } from '@mui/material'; // MUI 컴포넌트
import { useCmDialog } from '../../cm/CmDialogUtil';  // 커스텀 다이얼로그
import { CmUtil } from '../../cm/CmUtil'; // 유틸 함수
import { clearUser } from '../../features/user/userSlice'; // 사용자 초기화 액션
import { persistor } from '../../app/store'; // Redux persist 사용 시 스토어 초기화용

const Login = () => {
  const [userId, setUserId] = useState(''); // 사용자 ID 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const userIdRef = useRef(); // ID 입력창 ref
  const passwordRef = useRef(); // 비밀번호 입력창 ref
  const { showAlert } = useCmDialog(); // 알림창 함수
  const [login] = useLoginMutation(); // 로그인 API 호출
  const dispatch = useDispatch(); // 액션 디스패치 함수
  const navigate = useNavigate(); // 페이지 이동 함수

  // 컴포넌트 마운트 시 스토어 초기화 (로그아웃 효과)
  useEffect(() => {
    persistor.purge(); // localStorage 초기화
    dispatch(clearUser()); // Redux 사용자 상태 초기화
  }, [dispatch]);

  // 로그인 버튼 클릭 핸들러
  const handleLoginClick = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert("ID를 입력해주세요.");
      userIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(password)) {
      showAlert("비밀번호를 입력해주세요.");
      passwordRef.current?.focus();
      return;
    }

    try {
      const response = await login({ userId, password }).unwrap(); // 로그인 요청
      if (response.success) {
        showAlert("로그인 성공 홈으로 이동합니다.", () => {
          dispatch(setUser(response.data)); // 사용자 상태 저장
          navigate("/"); // 홈으로 이동
        });
        if (window.Android && window.Android.receiveMessage) {
            window.Android.receiveMessage(JSON.stringify({
              type: "LOGIN",
              userId: response?.data?.userId
            }));
          }
      } else {
        showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
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
      <Typography variant="h4" gutterBottom>로그인</Typography>

      {/* 아이디 입력 */}
      <TextField
        label="아이디"
        fullWidth
        margin="normal"
        value={userId}
        inputRef={userIdRef}
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* 비밀번호 입력 */}
      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        inputRef={passwordRef}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 로그인 버튼 */}
      <Button
        onClick={handleLoginClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        로그인
      </Button>

      {/* 회원가입 버튼 */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => navigate('/user/join.do')}
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>
    </Box>
  );
};

export default Login; // 컴포넌트 내보내기
