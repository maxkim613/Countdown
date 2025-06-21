import React, { useState, useRef, useEffect } from "react";
import { useLoginMutation } from "../../features/user/UserApi";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, OutlinedInput } from "@mui/material";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { CmUtil } from "../../cm/CmUtil";
import { persistor } from "../../app/store";
import { useSelector } from "react-redux";
import logoImage from "../../css/icons/logo.png";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const userIdRef = useRef();
  const passwordRef = useRef();
  const { showAlert } = useCmDialog();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    persistor.purge();
    dispatch(clearUser());
  }, [dispatch]);

  const handleLoginClick = async () => {
    if (CmUtil.isEmpty(userId)) {
      showAlert("ID를 입력해주세요.");
      userIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(password)) {
      showAlert("비밀번호를 입력해주세요.");
      passwordRef.current?.focus();
      return;
    }

    try {
      const response = await login({ userId, password }).unwrap();

      if (response.success) {
        showAlert("로그인 성공 홈으로 이동합니다.", () => {
          dispatch(setUser(response.data));
          if (window.Android?.receiveMessage) {
            window.Android.receiveMessage(
              JSON.stringify({
                type: "LOGIN",
                userId: response?.data?.userId,
              })
            );
          }
          navigate(response.data.adminYn === "Y" ? "/manager/admin" : "/auc/auclist.do");
        });
      } else {
        showAlert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch {
      showAlert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <Box
      sx={{
        width: "350px",
        height: "640px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(to bottom, #5F1111, #A83A3A)",
        color: "#fff",
        pt: 8,
      }}
    >
      <img
        src={logoImage}
        alt="logo"
        style={{ width: "200px", marginBottom: "40px" }}
      />

      <Typography sx={{ fontSize: "36px", fontWeight: "bold", mb: 4 }}>
        로그인
      </Typography>

      {/* 아이디 입력 */}
      <OutlinedInput
        placeholder="아이디"
        inputRef={userIdRef}
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        sx={{
          width: "240px",
          height: "40px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          mb: 3,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B00020",
            borderRadius: "12px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8C001A",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8C001A",
          },
        }}
      />

      {/* 비밀번호 입력 */}

      <OutlinedInput
        placeholder="비밀번호"
        type="password"
        inputRef={passwordRef}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          width: "240px",
          height: "40px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          mb: 3,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B00020",
            borderRadius: "12px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8C001A",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8C001A",
          },
        }}
      />

      <Button
        onClick={handleLoginClick}
        sx={{
          width: "110px",
          height: "38px",
          backgroundColor: "#B00020",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          borderRadius: "6px",
          "&:hover": {
            backgroundColor: "#8C001A",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.35)",
          },
        }}
      >
        로그인
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "240px",
          mt: 3,
        }}
      >
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", textDecoration: "underline", color: "#fff" }}
          onClick={() => navigate("/user/findId.do")}
        >
          아이디 찾기
        </Typography>
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", textDecoration: "underline", color: "#fff" }}
          onClick={() => navigate("/user/rpassword.do")}
        >
          비밀번호 찾기
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
