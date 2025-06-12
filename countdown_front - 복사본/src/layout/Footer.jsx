import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate,Link } from 'react-router-dom';
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '45px',
        backgroundColor: 'lightgrey',
        color: '#ecf0f1',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      <Link to="/auc/auclist.do">
          <img
            src="/home.webp"
            alt="로고"
            style={{
              height: 25,
              margin: 0,
              padding: 0,
              display: 'block', // ✅ 공백 방지
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Link>
        <Link to="/auc/auccreate.do">
          <img
            src="/register.webp"
            alt="로고"
            style={{
              height: 25,
              margin: 0,
              padding: 0,
              display: 'block', // ✅ 공백 방지
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Link>
        <Link to="/auc/auclist.do">
          <img
            src="/message.webp"
            alt="로고"
            style={{
              height: 25,
              margin: 0,
              padding: 0,
              display: 'block', // ✅ 공백 방지
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Link>
        <Link to="/auc/auclist.do">
          <img
            src="/like.webp"
            alt="로고"
            style={{
              height: 25,
              margin: 0,
              padding: 0,
              display: 'block', // ✅ 공백 방지
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Link>
        <Link to="/auc/auclist.do">
          <img
            src="/my.png"
            alt="로고"
            style={{
              height: 25,
              margin: 0,
              padding: 0,
              display: 'block', // ✅ 공백 방지
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Link>
    </Box>
  );
}
