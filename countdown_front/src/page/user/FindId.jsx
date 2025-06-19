import React, { useState } from 'react';
import {  Box,  Typography,  FormControl,  InputLabel,  OutlinedInput,  Button,} from '@mui/material';
import { useSendCertiNumMutation, useVerifyCertiNumMutation } from '../../features/user/UserApi';
import { useNavigate } from 'react-router-dom';

// 모달 컴포넌트 (MUI 스타일로 재작성 가능)
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

const FindId = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [certiNum, setCertiNum] = useState('');
  const [isCertiSent, setIsCertiSent] = useState(false);
  const [certiResult, setCertiResult] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [foundUsername, setFoundUsername] = useState('');
  const [foundUserId, setFoundUserId] = useState('');

  const [sendCertiNum, { isLoading: sending }] = useSendCertiNumMutation();
  const [verifyCertiNum, { isLoading: verifying }] = useVerifyCertiNumMutation();

  const handleSendCerti = async () => {
    try {
      const res = await sendCertiNum({ username, email }).unwrap();
      alert(res.message);
      setIsCertiSent(true);
    } catch {
      alert('인증번호 전송에 실패했습니다.');
    }
  };

  const handleVerifyCerti = async () => {
    try {
      const res = await verifyCertiNum({ email, certiNum }).unwrap();
      setFoundUsername(res.data.username);
      setFoundUserId(res.data.userId);
      setModalOpen(true);
      setCertiResult(res.message);
    } catch {
      alert('인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    navigate('/user/login.do');
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
        아이디 찾기
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
          {isCertiSent && (
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

      {/* 모달 */}
      <Modal isOpen={modalOpen} onConfirm={handleModalConfirm}>
        <Typography>
          <strong style={{ color: '#B00020' }}>{foundUsername}</strong>님의 아이디는{' '}
          <strong style={{ color: '#B00020' }}>{foundUserId}</strong>입니다.
        </Typography>
      </Modal>
    </Box>
  );
};

export default FindId;
