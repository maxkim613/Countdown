import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useSendCertiNumMutation, useVerifyCertiNumMutation, useResetPasswordMutation } from '../../features/user/UserApi';
import { useNavigate } from 'react-router-dom';

// 공통 모달 컴포넌트
const Modal = ({ isOpen, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          border: '2px solid #B00020',
          maxWidth: 280,
        }}
      >
        {children}
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ mt: 3, bgcolor: '#B00020', ':hover': { bgcolor: '#8a001a' } }}
        >
          확인
        </Button>
      </Box>
    </Box>
  );
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [certiNum, setCertiNum] = useState('');
  const [isCertiSent, setIsCertiSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [sendCertiNum, { isLoading: sending }] = useSendCertiNumMutation();
  const [verifyCertiNum, { isLoading: verifying }] = useVerifyCertiNumMutation();
  const [resetPassword] = useResetPasswordMutation();

  const handleSendCerti = async () => {
    try {
      await sendCertiNum({ username, userId, email }).unwrap();
      alert('인증번호가 전송되었습니다.');
      setIsCertiSent(true);
    } catch {
      alert('인증번호 전송 실패');
    }
  };

  const handleVerifyCerti = async () => {
    try {
      await verifyCertiNum({ email, certiNum }).unwrap();
      setModalOpen(true);
    } catch {
      alert('인증 실패');
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    setIsVerified(true);
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await resetPassword({ userId, password }).unwrap();
      alert('비밀번호가 변경되었습니다.');
      navigate('/user/login.do');
    } catch {
      alert('비밀번호 변경 실패');
    }
  };

  return (
    <Box
      sx={{
        width: 350,
        height: 640,
        m: '0 auto',
        p: 3,
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', marginTop: '40px' }}
      >
        비밀번호 재설정
      </Typography>

      {/* 이름 입력 */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>
          이름 입력
          <Box component="span" sx={{ color: '#B00020', ml: 0.3 }}>*</Box>
        </InputLabel>
        <OutlinedInput
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="이름 입력"
          sx={{ height: 40, mt: '7px' }}
        />
      </FormControl>

      {/* 아이디 입력 */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>
          아이디 입력
          <Box component="span" sx={{ color: '#B00020', ml: 0.3 }}>*</Box>
        </InputLabel>
        <OutlinedInput
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          label="아이디 입력"
          sx={{ height: 40, mt: '7px' }}
        />
      </FormControl>

      {/* 이메일 입력 + 인증번호 받기 버튼 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FormControl sx={{ flexGrow: 1 }}>
          <InputLabel>
            이메일 입력
            <Box component="span" sx={{ color: '#B00020', ml: 0.3 }}>*</Box>
          </InputLabel>
          <OutlinedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="이메일 입력"
            sx={{ height: 40, mt: '7px' }}
          />
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSendCerti}
          disabled={sending}
          sx={{
            bgcolor: '#B00020',
            color: '#fff',
            fontSize: 12,
            whiteSpace: 'nowrap',
            height: 40,
            px: 2,
            borderRadius: 20,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: '#8a001a' },
          }}
        >
          {sending ? '전송 중...' : '인증번호 받기'}
        </Button>
      </Box>

      {/* 인증번호 입력 + 인증 확인 */}
      {isCertiSent && !isVerified && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel>인증번호 입력</InputLabel>
              <OutlinedInput
                value={certiNum}
                onChange={(e) => setCertiNum(e.target.value)}
                label="인증번호 입력"
                sx={{ height: 40, mt: '7px' }}
              />
            </FormControl>
            <Button
              variant="contained"
              onClick={handleVerifyCerti}
              disabled={verifying}
              sx={{
                bgcolor: '#B00020',
                color: '#fff',
                fontSize: 12,
                whiteSpace: 'nowrap',
                height: 40,
                px: 2,
                borderRadius: 20,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: '#8a001a' },
              }}
            >
              {verifying ? '확인 중...' : '인증번호 확인'}
            </Button>
          </Box>
        </>
      )}

      {/* 비밀번호 재설정 폼 */}
      {isVerified && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>새 비밀번호 입력</InputLabel>
            <OutlinedInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="새 비밀번호 입력"
              sx={{ height: 40,marginTop:'7px' }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>비밀번호 확인</InputLabel>
            <OutlinedInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="비밀번호 확인"
              sx={{ height: 40,marginTop:'7px' }}
            />
          </FormControl>

          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleResetPassword}
              sx={{ px: 5, borderRadius: '20px' }}
            >
              확인
            </Button>
          </Box>
        </>
      )}

      {/* 인증 완료 모달 */}
      <Modal isOpen={modalOpen} onConfirm={handleModalConfirm}>
        <Typography sx={{ mb: 2 }}>인증이 완료되었습니다.</Typography>
      </Modal>
    </Box>
  );
};

export default ResetPassword;
