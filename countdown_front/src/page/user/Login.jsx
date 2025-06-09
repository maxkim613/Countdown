import React, { useState, useRef, useEffect } from 'react';
import { useLoginMutation } from '../../features/user/UserApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import { clearUser } from '../../features/user/userSlice';
import { persistor } from '../../app/store';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const userIdRef = useRef();
  const passwordRef = useRef();
  const { showAlert } = useCmDialog();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    persistor.purge();
    dispatch(clearUser());
  }, [dispatch]);

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
      const response = await login({ userId, password }).unwrap();
      if (response.success) {
        showAlert("로그인 성공 홈으로 이동합니다.",() => {
          dispatch(setUser(response.data));
          if (window.Android && window.Android.receiveMessage) {
            window.Android.receiveMessage(JSON.stringify({
              type: "LOGIN",
              userId: response?.data?.userId
            }));
          }
          navigate("/");
        });
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
        height: '640px',
        maxWidth: '360px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h4" gutterBottom>로그인</Typography>

      <TextField
        label="아이디"
        fullWidth
        margin="normal"
        value={userId}
        inputRef={userIdRef}
        onChange={(e) => setUserId(e.target.value)}
      />

      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        inputRef={passwordRef}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        onClick={handleLoginClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        로그인
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => navigate('/user/join.do')}
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>

       <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
      <Typography
        variant="body2"
        sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
        onClick={() => navigate('/user/findId.do')}
      >
        아이디 찾기
      </Typography>

      <Typography
        variant="body2"
        sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
        onClick={() => navigate('/user/rpassword.do')}
      >
        비밀번호 찾기
      </Typography>
    </Box>
    </Box>
  );
};

export default Login;
