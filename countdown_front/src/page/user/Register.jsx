import React, { useState, useRef } from 'react'; // React 훅 import
import { useRegisterMutation } from '../../features/user/userApi'; // 회원가입 API 호출 훅
import { useNavigate } from 'react-router-dom'; // 페이지 이동
import { TextField, Button, Box, Typography } from '@mui/material'; // MUI UI 컴포넌트
import { useCmDialog } from '../../cm/CmDialogUtil';  // 커스텀 다이얼로그 훅
import { CmUtil } from '../../cm/CmUtil'; // 유틸 함수 모음
import CmPostCode from '../../cm/CmPostCode'; // 주소 검색 컴포넌트

const Register = () => {
  const [userId, setUserId] = useState(''); // 아이디 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [username, setUsername] = useState(''); // 이름 상태
  const [email, setEmail] = useState(''); // 이메일 상태

  // 각 입력창의 ref (포커스 처리용)
  const userIdRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();

  // 주소 관련 상태
  const [addr, setAddr] = useState("");
  const [addrD, setAddrD] = useState("");
  const [postCode, setPostCode] = useState("");
  const postRef = useRef();

  const { showAlert } = useCmDialog(); // 알림창 함수
  const [register] = useRegisterMutation(); // 회원가입 API 호출 훅
  const navigate = useNavigate(); // 페이지 이동 함수

  // 회원가입 버튼 클릭 핸들러
  const handleRegisterClick = async () => {
    // 입력값 유효성 검사
    if (CmUtil.isEmpty(userId)) {
      showAlert('아이디를 입력해주세요.');
      userIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(password)) {
      showAlert('비밀번호를 입력해주세요.');
      passwordRef.current?.focus();
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

    try {
      const response = await register({ userId, password, username, email }).unwrap();
      if (response.success) {
        showAlert("회원가입에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => {
          navigate('/user/login.do');
        });
      } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
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
      <Typography variant="h4" gutterBottom>회원가입</Typography>

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

      {/* 주소 검색 컴포넌트 */}
      <CmPostCode
        addr={addr}
        setAddr={setAddr}
        addrD={addrD}
        setAddrD={setAddrD}
        postCode={postCode}
        setPostCode={setPostCode}
        ref={postRef}
      />

      {/* 회원가입 버튼 */}
      <Button
        onClick={handleRegisterClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>

      {/* 로그인 이동 버튼 */}
      <Button
        onClick={() => navigate('/user/login.do')}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        로그인
      </Button>
    </Box>
  );
};

export default Register; // 컴포넌트 내보내기
