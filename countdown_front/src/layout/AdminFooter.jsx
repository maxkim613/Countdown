import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AdminFooter() {
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
          src="/adminhome.png"
          alt="홈"
          style={{
            height: 25,
            cursor: 'pointer',
          }}
        />
      </Link>
      <Link to="/auc/admauclist.do">
        <img
          src="/adminauction.png"
          alt="경매"
          style={{
            height: 25,
            cursor: 'pointer',
          }}
        />
      </Link>
      <Link to="/auc/userlist.do">
        <img
          src="/adminuser.png"
          alt="유저"
          style={{
            height: 25,
            cursor: 'pointer',
          }}
        />
      </Link>
      <Link to="/ann/annlist.do">
        <img
          src="/adminnotification.png"
          alt="공지"
          style={{
            height: 25,
            cursor: 'pointer',
          }}
        />
      </Link>
      <Link to="/auc/messagelist.do">
        <img
          src="/adminmessage.png"
          alt="쪽지"
          style={{
            height: 25,
            cursor: 'pointer',
          }}
        />
      </Link>
    </Box>
  );
}
