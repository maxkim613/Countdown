import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useViewQuery } from '../features/user/UserApi';
import { setAlertCheck, clearUser } from '../features/user/userSlice';

export default function Header() {
  const user = useSelector((state) => state.user.user);
  const alertCheck = useSelector((state) => state.user.alertCheck);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { refetch } = useViewQuery({});

  // 인증 만료 시 로그인 페이지로 이동
  const checkAuth = useCallback(async () => {
    if (user?.userId && !alertCheck) {
      const result = await refetch();
      if (result?.error?.status === 401) {
        dispatch(setAlertCheck(true));
        alert("인증이 만료되었습니다. 로그인 화면으로 이동합니다.");
        dispatch(clearUser());
        navigate('/user/login.do');
      }
    }
  }, [user?.userId, refetch, dispatch, navigate, alertCheck]);

  useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]);

  return null; // 화면에 아무것도 렌더링하지 않음
}
