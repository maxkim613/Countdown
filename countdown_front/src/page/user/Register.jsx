import React, { useState, useRef } from 'react';
import { useRegisterMutation, useCheckUserIdMutation, useCheckNicknameMutation, useCheckEmailMutation } from '../../features/user/userApi';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import CmPostCode from '../../cm/CmPostCode';


const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useCmDialog();

  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userTel, setUserTel] = useState('');
  const [addr, setAddr] = useState('');
  const [addrD, setAddrD] = useState('');
  const [postCode, setPostCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const userIdRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const nicknameRef = useRef();
  const emailRef = useRef();
  const userTelRef = useRef();

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const passwordConfirmRef = useRef();

  const [register] = useRegisterMutation();
  const [checkUserId] = useCheckUserIdMutation();
  const [checkNickname] = useCheckNicknameMutation();
  const [checkEmail] = useCheckEmailMutation();

  // 아이디 중복 확인
  const handleCheckId = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert('아이디를 입력해주세요.');
      userIdRef.current?.focus();
      return;
    }
    try {
      const res = await checkUserId({ userId }).unwrap();
      showAlert(res.data ? '이미 사용중인 아이디 입니다.' : '사용 가능한 아이디입니다.');
    } catch {
      showAlert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (CmUtil.isEmpty(nickname)) {
      showAlert('닉네임을 입력해주세요.');
      nicknameRef.current?.focus();
      return;
    }
    try {
      const res = await checkNickname({ nickname }).unwrap();
      showAlert(res.data ? '이미 사용중인 닉네임 입니다.' : '사용 가능한 닉네임입니다.');
    } catch {
      showAlert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (CmUtil.isEmpty(email)) {
      showAlert('이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }
    try {
      const res = await checkEmail({ email }).unwrap();
      showAlert(res.data ? '이미 사용중인 이메일 입니다.' : '사용 가능한 이메일입니다.');
    } catch {
      showAlert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 회원가입 처리
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
    if (password !== passwordConfirm) {
      showAlert('비밀번호가 일치하지 않습니다.');
      passwordConfirmRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(username)) {
      showAlert('이름을 입력해주세요.');
      usernameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(nickname)) {
      showAlert('닉네임을 입력해주세요.');
      nicknameRef.current?.focus();
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
    if (CmUtil.isEmpty(userTel)) {
      showAlert('전화번호를 입력해주세요.');
      userTelRef.current?.focus();
      return;
    }

    try {
      const userData = {
        userId,
        password,
        username,
        nickname,
        email,
        userTel,
        addr,
        addrD,
        postCode,
      };
      const response = await register(userData).unwrap();
      if (response.success) {
        showAlert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.', () => navigate('/user/login.do'));
      } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

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
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: '#B00020' }}>
        회원가입
      </Typography>

      {/* 아이디 */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>아이디</InputLabel>
          <OutlinedInput
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            inputRef={userIdRef}
            label="아이디"
            sx={{
              height: '40px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#B00020',
                borderRadius: '12px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8C001A',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8C001A',
              },
            }}
          />
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCheckId}
          sx={{
            backgroundColor: '#B00020',
            borderColor: '#B00020',
            height: '40px',
            whiteSpace: 'nowrap',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          중복 확인
        </Button>
      </Box>

      {/* 비밀번호 */}
      <FormControl size="small" sx={{ mb: 2 }}>
        <InputLabel>비밀번호</InputLabel>
        <OutlinedInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputRef={passwordRef}
          label="비밀번호"
          sx={{
            width: '315px',
            height: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#B00020',
              borderRadius: '12px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
          }}
        />
      </FormControl>

      <FormControl size="small" sx={{ mb: 2 }}>
        <InputLabel>비밀번호 재확인</InputLabel>
        <OutlinedInput
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          inputRef={passwordConfirmRef}
          label="비밀번호 재확인"
          sx={{
            width: '315px',
            height: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#B00020',
              borderRadius: '12px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
          }}
        />
      </FormControl>


      {/* 이름 */}
      <FormControl size="small" sx={{ mb: 2 }}>
        <InputLabel>이름</InputLabel>
        <OutlinedInput
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          inputRef={usernameRef}
          label="이름"
          sx={{
            width: '315px',
            height: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#B00020',
              borderRadius: '12px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
          }}
        />
      </FormControl>

      {/* 닉네임 */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>닉네임</InputLabel>
          <OutlinedInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            inputRef={nicknameRef}
            label="닉네임"
            sx={{
              height: '40px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#B00020',
                borderRadius: '12px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8C001A',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8C001A',
              },
            }}
          />
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCheckNickname}
          sx={{
            backgroundColor: '#B00020',
            borderColor: '#B00020',
            height: '40px',
            whiteSpace: 'nowrap',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          중복 확인
        </Button>
      </Box>

      {/* 이메일 */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>이메일</InputLabel>
          <OutlinedInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputRef={emailRef}
            label="이메일"
            sx={{
              height: '40px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#B00020',
                borderRadius: '12px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8C001A',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8C001A',
              },
            }}
          />
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCheckEmail}
          sx={{
            backgroundColor: '#B00020',
            borderColor: '#B00020',
            height: '40px',
            whiteSpace: 'nowrap',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          중복 확인
        </Button>
      </Box>

      {/* 전화번호 */}
      <FormControl size="small" sx={{ mb: 2 }}>
        <InputLabel>전화번호</InputLabel>
        <OutlinedInput
          value={userTel}
          onChange={(e) => setUserTel(e.target.value)}
          inputRef={userTelRef}
          label="전화번호"
          sx={{
            width: '315px',
            height: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#B00020',
              borderRadius: '12px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C001A',
            },
          }}
        />
      </FormControl>

      {/* 우편번호 + 주소 검색 버튼 */}
<Box display="flex" alignItems="center" gap={1} mb={2}>
  <FormControl size="small">
    <InputLabel shrink>우편번호</InputLabel>
    <OutlinedInput
      value={postCode}
      readOnly
      label="우편번호"
      sx={{
        width: '240px',
        height: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#B00020',
          borderRadius: '12px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
      }}
    />
  </FormControl>

  <Button
    onClick={() => setModalOpen(true)}
    variant="outlined"
   sx={{
      backgroundColor: '#B00020',
      borderColor: '#B00020',
      height: '40px',
      width: '70px',
      whiteSpace: 'nowrap',
      borderRadius: '20px',
      color : 'white'      
    }}
  >
    주소 검색
  </Button>
</Box>

{/* 기본주소 */}
<FormControl size="small" sx={{ mb: 2 }}>
  <InputLabel shrink>기본주소</InputLabel>
  <OutlinedInput
    value={addr}
    readOnly
    label="기본주소"
    sx={{
      width: '315px',
      height: '40px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#B00020',
        borderRadius: '12px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
    }}
  />
</FormControl>

{/* 상세주소 */}
<FormControl size="small">
  <InputLabel>상세주소</InputLabel>
  <OutlinedInput
    value={addrD}
    onChange={(e) => setAddrD(e.target.value)}
    label="상세주소"
    sx={{
      width: '315px',
      height: '40px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#B00020',
        borderRadius: '12px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
    }}
  />
</FormControl>



      {/* 주소 모달 */}
      {modalOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}
        >
          <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: '8px', maxWidth: '300px' }}>
            <CmPostCode
              addr={addr}
              setAddr={setAddr}
              addrD={addrD}
              setAddrD={setAddrD}
              postCode={postCode}
              setPostCode={setPostCode}
              onConfirm={() => setModalOpen(false)}
            />
            <Button onClick={() => setModalOpen(false)} fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#B00020' }}>확인</Button>
          </Box>
        </Box>
      )}
    

      

      {/* 회원가입 버튼 */}
      <Button
        variant="contained"
        onClick={handleRegisterClick}
        sx={{
          backgroundColor: '#B00020',
          borderRadius: '20px',
          height: '40px',
          width: '315px',
          mt: 2,
          '&:hover': {
            backgroundColor: '#8C001A',
          },
        }}
      >
        회원가입
      </Button>

     
    </Box>
  );
};

export default Register;
