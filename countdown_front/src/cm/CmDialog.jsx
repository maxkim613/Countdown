import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  DialogContent,
  IconButton,
} from "@mui/material"; // MUI 다이얼로그 관련 컴포넌트
import CloseIcon from "@mui/icons-material/Close"; // 닫기 버튼용 아이콘
import React, { useEffect } from "react";

// 📦 props 설명
// - title: 팝업 제목 (기본값: '알림')
// - isOpen: 팝업 열림 여부
// - setIsOpen: 열림/닫힘 상태를 바꾸는 함수
// - message: 본문 메시지
// - yesCallBack: 확인 클릭 시 실행할 함수
// - noCallBack: 취소 클릭 시 실행할 함수
// - type: 'alert' 또는 'confirm'
// - children: message 아래에 렌더링할 추가 내용

const CmDialog = ({
  title = "알림",
  isOpen,
  setIsOpen,
  message,
  yesCallBack,
  noCallBack,
  type = "alert",
  children,
}) => {
  // ⛔ 공통 닫기 동작 (X 버튼 또는 alert 모드 확인 클릭 시)
  const handleClose = () => {
    setIsOpen(false); // 팝업 닫기
    if (type === "alert" && yesCallBack) {
      setTimeout(() => yesCallBack(), 500); // alert는 yes만 실행
    }
    if (type !== "alert" && noCallBack) {
      setTimeout(() => noCallBack(), 500); // confirm에서는 X버튼이 취소로 취급
    }
  };

  // ✅ 확인 버튼 클릭 (confirm일 때)
  const handleConfirm = () => {
    setIsOpen(false);
    if (yesCallBack) {
      setTimeout(() => yesCallBack(), 500); // setTimeout(함수, 시간)지정한 시간뒤에 특정 함수를 한 번 실행
    }
  };

  // ❌ 취소 버튼 클릭
  const handleCancel = () => {
    setIsOpen(false);
    if (noCallBack) {
      setTimeout(() => noCallBack(), 500);
    }
  };

  useEffect(() => {
    // 콜백 함수 변경 감지용 (사실 없어도 무방한 경우가 많음)
  }, [yesCallBack, noCallBack]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      {/* 상단 제목 영역 */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "1.25rem",
          borderBottom: "1px solid #e0e0e0",
          pb: 1,
        }}
      >
        {title}
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* 본문 메시지 영역 */}
      <DialogContent sx={{ padding: "20px 24px" }}>
        <Typography variant="body1" sx={{ fontSize: "1rem", color: "#333" }}>
          {message}
          {children}
        </Typography>
      </DialogContent>

      {/* 하단 버튼 영역 */}
      <DialogActions
        sx={{
          justifyContent: type === "alert" ? "center" : "flex-end",
          px: 3,
          pb: 2,
        }}
      >
        {type === "alert" ? (
          <Button onClick={handleClose} variant="contained" color="primary">
            확인
          </Button>
        ) : (
          <>
            <Button onClick={handleCancel} variant="outlined" color="secondary">
              취소
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="primary">
              확인
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CmDialog;
