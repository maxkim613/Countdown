import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useViewQuery } from '../features/user/UserApi';
import { setAlertCheck } from '../features/user/userSlice';
import { Box } from '@mui/material';

export default function Header() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { refetch } = useViewQuery({});
  const alertCheck = useSelector((state) => state.user.alertCheck);

  const checkAuth = useCallback(async () => {
    if (user?.userId && !alertCheck) {
      const result = await refetch();
      if (result?.error?.status === 401) {
        dispatch(setAlertCheck(true));
        alert("인증이 만료 되었습니다. 로그인화면으로 이동합니다.");
        navigate('/user/login.do');
      }
    }
  }, [user?.userId, refetch, dispatch, navigate, alertCheck]);

  useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]);

  return (
   
          <Box
            component="header" // ✅ 또는 생략 가능
            sx={{
              position: 'fixed',
              top: 0,               // ✅ 헤더니까 top
              left: 0,
              width: '100%',
              height: '45px',
              backgroundColor: '#B00020', // ✅ 올바른 색상 코드
              color: '#fff',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              
            }}
          >
          <Link to="/auc/auclist.do">
          <img
            src="/cdlogo.png"
            alt="로고"
            style={{
              height: 45,
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
