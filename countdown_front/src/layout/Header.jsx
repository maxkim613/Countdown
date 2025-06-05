import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useViewQuery } from '../features/user/userApi';
import { setAlertCheck } from '../features/user/userSlice';
import { AppBar, Toolbar } from '@mui/material';
import '../css/header.css';

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
    <AppBar position="sticky" sx={{ background: '#B00020', boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: 'center', padding: '0 !important', minHeight: '48px !important' }}>
        {/* 로고 이미지 */}
        <Link to="/auc/auclist.do">
          <img
            src="/cdlogo.png"
            alt="로고"
            style={{ height: 60, margin: 0, padding: 0, objectFit: 'contain', cursor: 'pointer' }}
          />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
