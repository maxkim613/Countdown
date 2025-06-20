import React, { useState } from "react";
import { Box} from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import {  useAuctionMyWaitingListQuery} from "../../features/auction/auctionApi";
import { useSelector } from "react-redux";

const UserMyAuctionWaiteList = () => {
  const user = useSelector((state) => state.user.user);
  const [filter, setFilter] = useState("all"); // 전체(all), buy, sell

  const { data, isLoading } =  useAuctionMyWaitingListQuery({
    userId: user?.userId,
  });

  const BASE_URL = "http://192.168.0.41:8081/";

  // 판매완료 데이터
  const waiteItems = (data || []).map((item) => ({
    info1: `${item.aucTitle}`,
    writeinfo1: "",
    info2: `판매자 : ${item.createId}`,
    writeinfo2: "",
    info3: item.aucDeadline,
    writeinfo3: "",
    info4: item.aucStatus === "경매종료" ? "판매완료" : item.aucStatus,
    writeinfo4: "",
    thumbnailUrl: item.thumbnailUrl
      ? `${BASE_URL}${item.thumbnailUrl.startsWith("/") ? item.thumbnailUrl.slice(1) : item.thumbnailUrl}`
      : null,
    id: item.aucId,
  }));


  return (
      <Box
          sx={{
            width: '350px',
            height: '640px',
            margin: '40px auto 0',
            padding: '1rem',
            fontFamily: 'sans-serif',
            boxSizing: 'border-box',
          }}
        >
    <Box sx={{ p: 1 }}>
      

      {filter === "all" && (
        <>
          
          <CmCardList items={waiteItems} path="/auc/aucview.do" />

        </>
      )}

     
    </Box>
    </Box>
  );
};

export default UserMyAuctionWaiteList;
