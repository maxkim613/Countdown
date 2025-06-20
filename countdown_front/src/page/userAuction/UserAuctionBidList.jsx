import React, { useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import { useAuctionMyBidListQuery } from "../../features/auction/auctionApi";
import { useSelector } from "react-redux";

const UserAuctionList = () => {
  const user = useSelector((state) => state.user.user);
  const [filter, setFilter] = useState("all"); // 전체(all), buy, sell

  const { data: bidDate, isLoading: sellLoading } = useAuctionMyBidListQuery({
    userId: user?.userId,
  });

  // 판매완료 데이터

  const bidlItems = (bidDate || []).map((item) => ({
    info1: item.aucTitle,
    writeinfo1: "",
    info2: item.aucCprice,
    writeinfo2: "원",
    info3: item.aucDeadline,
    writeinfo3: "",
    info4: item.aucStatus,
    writeinfo4: "",
    thumbnailUrl: item.fileId
      ? `${process.env.REACT_APP_API_BASE_URL}/auc/imgDown.do?fileId=${item.fileId}`
      : null,
    id: item.aucId,
  }));

  return (
    <Box
      sx={{
        width: "350px",
        height: "640px",
        margin: "40px auto 0",
        padding: "1rem",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ p: 1 }}>
        {filter === "all" && (
          <>
            <CmCardList items={bidlItems} path="/auc/aucview.do" />
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserAuctionList;
