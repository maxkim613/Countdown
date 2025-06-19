import React, { useRef } from 'react';


import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button} from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';


import logoImage from '../../css/icons/logo.png';

const FirstPage = () => {

  const userIdRef = useRef();
  const passwordRef = useRef();
  const { showAlert } = useCmDialog();
 
  const navigate = useNavigate();


 

  return (
    <Box
      sx={{
        width: '350px',
        height: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #5F1111, #A83A3A)',
        color: '#fff',
        pt: 8,
      }}
    >
      <img
        src={logoImage}
        alt="logo"
        style={{ width: '200px', marginTop : '120px',marginBottom: '120px' }}
      />

     

      <Button
          onClick={() => navigate('/user/join.do')}
        sx={{
          width: '110px',
          height: '38px',
          backgroundColor: '#B00020',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          borderRadius: '6px',
          '&:hover': {
            backgroundColor: '#8C001A',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.35)',
          }
        }}
      >
        시작하기
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, width: '240px', mt: 3 }}>
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer',  color: '#fff' }}          
        >
          이미 계정이 있으신가요?
        </Typography>
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'underline', color: '#00FF1E' }}
          onClick={() => navigate('/user/login.do')}
        >
          로그인
        </Typography>
      </Box>
    </Box>
  );
};

export default FirstPage;
