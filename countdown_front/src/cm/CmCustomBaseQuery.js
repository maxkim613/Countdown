// src/cm/CmCustomBaseQuery.js

// RTK Query의 fetchBaseQuery를 기반으로
// 인증 만료(401) 처리를 커스터마이징한 baseQuery입니다.

import { fetchBaseQuery } from "@reduxjs/toolkit/query"; // 기본 fetch 기능
import { navigateTo } from "./CmNavigateUtil"; // 페이지 이동 유틸
import { setAlertCheck } from "../features/user/userSlice"; // 인증 경고 여부 설정 액션

// 기본 baseQuery 설정: 공통 URL 및 쿠키 포함 옵션
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL, // .env에 정의된 API 기본 URL 사용
  credentials: "include", // 쿠키 자동 포함 (세션 인증용)
});

// 인증 체크 핸들러 포함된 baseQuery 래퍼
const baseQueryWithAuthHandler = async (args, api, extraOptions) => {
  // 실제 요청 수행
  const result = await baseQuery(args, api, extraOptions);

  const dispatch = api.dispatch; // dispatch 사용
  const alertCheck = api.getState().user.alertCheck; // 이미 인증 만료 알림을 띄웠는지 여부

  // 이미 alertCheck가 true이면 추가 인증 처리하지 않고 종료
  if (alertCheck) {
    return { error: { message: "인증 만료 처리 중" } }; // 요청 자체를 막음
  }

  // 로그인 요청은 인증 만료 처리 예외로 둠
  const isLoginRequest = args?.url.includes("/user/login.do");

  // 401 인증 오류 + 로그인 요청이 아닐 때만 알림 + 강제 이동 처리
  if (result?.error?.status === 401 && !isLoginRequest) {
    setTimeout(() => {
      const alertCheck = api.getState().user.alertCheck;
      if (!alertCheck) {
        dispatch(setAlertCheck(true)); // 중복 알림 방지용 플래그 설정
        alert("인증이 만료 되었습니다. 로그인화면으로 이동합니다.");
        navigateTo("/user/login.do"); // 로그인 페이지로 강제 이동
      }
    }, 1000); // 사용자에게 반응할 시간 유예
  }

  return result; // 정상 또는 실패 응답 반환
};

export default baseQueryWithAuthHandler; // createApi에서 baseQuery로 사용됨
