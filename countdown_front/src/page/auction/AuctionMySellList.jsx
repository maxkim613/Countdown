import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import { useAuctionMySellListQuery } from "../../features/auction/auctionApi";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CmDropdown from "../../cm/CmDropdown";

const AuctionMySellList = () => {


  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();

  const { data, isLoading, refetch } = useAuctionMySellListQuery({
    userId: user?.userId, // ← 로그인한 사용자 ID를 명시적으로 전달

  });


  console.log(data);

  const BASE_URL = "http://192.168.0.60:8081/"; // 실제 Spring 서버 주소

  const auctionItems = (data?.data?.list || []).map((item) => ({
    info1: item.aucTitle,
    writeinfo1: "",
    info2: item.aucCprice,
    writeinfo2: "원",
    info3: item.aucDeadline,
    writeinfo3: "",
    info4: item.aucStatus,
    writeinfo4: "",
    thumbnailUrl: item.thumbnailUrl
      ? `${BASE_URL}${
          item.thumbnailUrl.startsWith("/")
            ? item.thumbnailUrl.slice(1)
            : item.thumbnailUrl
        }`
      : null,
    id: item.aucId,
  }));

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mt: 2, mb: 1, display: "flex", gap: 2 }}>
        

      
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "nowrap",
          overflowX: "auto",
          mb: 2.5,
        }}
      ></Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmCardList
          items={auctionItems}
          path="/auc/aucview.do" // 클릭 시 /auc/aucview.do?id=<id> 로 이동
        />
      )}
    </Box>
  );
};

export default AuctionMySellList;
