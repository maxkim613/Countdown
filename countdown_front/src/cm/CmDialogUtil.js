// src/cm/useCmDialog.js

import React, { createContext, useContext, useState } from 'react';
import CmDialog from './CmDialog'; // 재사용 가능한 커스텀 다이얼로그 컴포넌트

// 다이얼로그 전역 상태를 위한 Context 생성
const DialogContext = createContext();

// 전역 다이얼로그 Provider 컴포넌트
export const DialogProvider = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);  // 다이얼로그 열림 여부 상태
  const [message, setMessage] = useState('');  // 메시지 내용
  const [type, setType] = useState('alert');  // 다이얼로그 타입 ('alert' or 'confirm')
  const [title, setTitle] = useState('알림');  // 다이얼로그 제목
  const [yesCallBack, setYesCallBack] = useState(null);  // 확인 콜백 함수
  const [noCallBack, setNoCallBack] = useState(null);  // 취소 콜백 함수

  // alert 타입 다이얼로그를 여는 함수
  const showAlert = (msg, cb, dialogTitle = '알림') => {
    setTitle(dialogTitle);
    setMessage(msg);
    setType('alert');
    setYesCallBack(() => cb); // 콜백 함수를 저장
    setIsOpen(true); // 다이얼로그 열기
  };

  // confirm 타입 다이얼로그를 여는 함수
  const showConfirm = (msg, yCb, nCb, dialogTitle = '확인') => {
    setTitle(dialogTitle);
    setMessage(msg);
    setType('confirm');
    setYesCallBack(() => yCb);
    setNoCallBack(() => nCb);
    setIsOpen(true);
  };

  // 실제로 렌더링할 다이얼로그 컴포넌트 구성
  const DialogComponent = (
    <CmDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      message={message}
      title={title}
      type={type}
      yesCallBack={yesCallBack}
      noCallBack={noCallBack}
    />
  );

  // Context로 하위 컴포넌트에 alert/confirm 사용 API와 렌더링할 다이얼로그 전달
  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, DialogComponent }}>
      {children}
    </DialogContext.Provider>
  );
};

// 다이얼로그 사용을 위한 커스텀 훅
export const useCmDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useCmDialog must be used within DialogProvider');
  return ctx;
};