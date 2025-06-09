import React, { useState, useRef} from 'react';
import { useRegisterMutation } from '../../features/user/userApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';
import  CmPostCode  from '../../cm/CmPostCode';
import { useCheckUserIdMutation } from '../../features/user/userApi';
import { useCheckNicknameMutation } from '../../features/user/userApi';
import { useCheckEmailMutation } from '../../features/user/userApi';

const Register = () => {

  const [checkUserId] = useCheckUserIdMutation();
  const [checkNickname] = useCheckNicknameMutation();
  const [checkEmail] = useCheckEmailMutation();

  const handleCheckId = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert('아이디를 입력해주세요.');
      userIdRef.current?.focus();
      return;
    }
    try {
      const res = await checkUserId({userId}).unwrap();
      if (res.data === true){
        showAlert('이미 사용중인 아이디 입니다.');
      }else {
        showAlert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      showAlert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleCheckNickname = async () => {
    if (CmUtil.isEmpty(nickname)) {
      showAlert('닉네임을 입력해주세요.');
      nicknameRef.current?.focus();
      return;
    }
    try {
      const res = await checkNickname({nickname}).unwrap();
      if (res.data === true){
        showAlert('이미 사용중인 닉네임 입니다.');
      }else {
        showAlert('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      showAlert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleCheckEmail = async () => {
    if (CmUtil.isEmpty(email)) {
      showAlert('이메일을 입력해주세요.');
      nicknameRef.current?.focus();
      return;
    }
    try {
      const res = await checkEmail({email}).unwrap();
      if (res.data === true){
        showAlert('이미 사용중인 이메일 입니다.');
      }else {
        showAlert('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      showAlert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };


  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [nickname, setUsernickname] = useState('');
  const [password, setPassword] = useState('');  
  const [email, setEmail] = useState('');
  const [userTel, setusertel] = useState('');

  const userIdRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const nicknameRef = useRef();
  const emailRef = useRef();
  const usettelRef = useRef();

  const [addr, setAddr] = useState("");
  const [addrD, setAddrD] = useState("");
  const [postCode, setPostCode] = useState("");
  const postRef = useRef();
  
  const { showAlert } = useCmDialog();
 
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegisterClick = async () => {

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

    if (CmUtil.isEmail(nickname)) {
      showAlert('닉네임을 입력해주세요.');
      nicknameRef.current?.focus();
      return;
    }

    
    try {
      const response = await register({ userId, password, username, nickname, email, userTel, addr, addrD, postCode }).unwrap();
      if (response.success) {
        showAlert("회원가입에 성공 하셨습니다. 로그인화면으로 이동합니다.",()=>{navigate('/user/login.do');});
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
        maxWidth: '360px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h4" gutterBottom>회원가입</Typography>

      <Box sx={{ display: 'flex', width: '100%', gap: 1, alignItems: 'center', mt: 2 }}>

       
         
          <TextField
            label="아이디"
            fullWidth
            value={userId}
            inputRef={userIdRef}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button
            onClick={handleCheckId}
            variant="outlined"            
            sx={{ 
              backgroundColor:'#B00020',
              color: 'white',
              '&:hover': {
                backgroundColor: '#cc0000',
              },
              whiteSpace: 'nowrap',
              height: '56px'
            }}
          >
            중복 확인
          </Button>
      </Box>

        <TextField
        label="이름"
        fullWidth
        margin="normal"
        value={username}
        inputRef={usernameRef}
        onChange={(e) => setUsername(e.target.value)}
      />       

      <Box sx={{ display: 'flex', width: '100%', gap: 1, alignItems: 'center', mt: 2 }}>

      <TextField
            label="닉네임"
            fullWidth
            value={nickname}
            inputRef={nicknameRef}
            onChange={(e) => setUsernickname(e.target.value)}
          />
          <Button
            onClick={handleCheckNickname}
            variant="outlined"            
            sx={{ 
              backgroundColor:'#B00020',
              color: 'white',
              '&:hover': {
                backgroundColor: '#cc0000',
              },
              whiteSpace: 'nowrap',
              height: '56px'
            }}
          >
            중복 확인
          </Button>

          </Box>

      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        inputRef={passwordRef}
        onChange={(e) => setPassword(e.target.value)}
      />


      <Box sx={{ display: 'flex', width: '100%', gap: 1, alignItems: 'center', mt: 2 }}>

     

      <TextField
        label="이메일"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        inputRef={emailRef}
        onChange={(e) => setEmail(e.target.value)}
      />
     <Button
            onClick={handleCheckEmail}
            variant="outlined"            
            sx={{ 
              backgroundColor:'#B00020',
              color: 'white',
              '&:hover': {
                backgroundColor: '#cc0000',
              },
              whiteSpace: 'nowrap',
              height: '56px'
            }}
          >
            중복 확인
          </Button>
      </Box>

       <TextField
        label="전화번호"
        type="tel"
        fullWidth
        margin="normal"
        value={userTel}
        inputRef={usettelRef}
        onChange={(e) => setusertel(e.target.value)}
      />

      <CmPostCode
        addr={addr}
        setAddr={setAddr}
        addrD={addrD}
        setAddrD={setAddrD}
        postCode={postCode}
        setPostCode={setPostCode}
        ref={postRef}
      />
      <Box sx={{ display: 'flex', width: '100%', gap: 2, mt: 2 }}>
  <Button
    onClick={handleRegisterClick}
    variant="contained"
    sx={{
    backgroundColor: '#B00020',  // 배경 빨간색
    color: '#fff',               // 글자색 흰색
    '&:hover': {
      backgroundColor: '#8C001A',  // 마우스 오버 시 색상
    },
    flex: 1,
    height: 38
  }}
  >
    가입
  </Button>
  <Button
    onClick={() => navigate('/user/login.do')}
    variant="contained"
     sx={{
    backgroundColor: '#B00020',  // 배경 빨간색
    color: '#fff',               // 글자색 흰색
    '&:hover': {
      backgroundColor: '#8C001A',  // 마우스 오버 시 색상
    },
    flex: 1,
    height: 38
  }}
  >
    취소
  </Button>
</Box>
    </Box>
  );
};

export default Register;
