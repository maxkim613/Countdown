import React, { useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import {
  useAuctionMySellCompleteListQuery,
  useAuctionMyBuyListQuery,
} from "../../features/auction/auctionApi";
import { useAuctionListQuery } from "../../features/auction/auctionApi";
import { useSelector } from "react-redux";

const UserAuctionList = () => {
  const user = useSelector((state) => state.user.user);
  const [filter, setFilter] = useState("all"); // 전체(all), buy, sell

  const { data: allAuctionData, isLoading: allAuctionLoading } = useAuctionListQuery({
  searchText: "",
  sortField: "CREATE_DT",
  sortOrder: "DESC",
});
  const { data: sellData, isLoading: sellLoading } =
    useAuctionMySellCompleteListQuery({
      userId: user?.userId,
    });

  const { data: buyData, isLoading: buyLoading } = useAuctionMyBuyListQuery({
    userId: user?.userId,
  });
 

  console.log(sellData)
  // 판매완료 데이터
  const sellItems = (allAuctionData?.data?.list || [])
  .filter((item) => item.createId === user?.userId && item.aucStatus === "경매종료")
  .map((item) => ({
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

  console.log("alksjdfkjaskldfjkolasjdfa",allAuctionData);
  const buyItems = (allAuctionData?.data?.list || [])
  .filter((item) => item.aucBuyerId === user?.userId && item.aucStatus === "경매종료")
  .map((item) => ({
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
  console.log(buyItems);
  // 구매완료 데이터
  // const buyItems = (buyData?.data?.list || []).map((item) => ({
  //   info1: item.aucTitle,
  //   writeinfo1: "",
  //   info2: item.aucCprice,
  //   writeinfo2: "원",
  //   info3: item.aucDeadline,
  //   writeinfo3: "",
  //   info4: item.aucStatus,
  //   writeinfo4: "",
  //   thumbnailUrl: item.fileId
  //     ? `${process.env.REACT_APP_API_BASE_URL}/auc/imgDown.do?fileId=${item.fileId}`
  //     : null,
  //   id: item.aucId,
  // }));
  

  // 필터에 따른 표시할 데이터 결정
  let displayItems = [];
  if (filter === "all") {
    displayItems = [...sellItems, ...buyItems];
  } else if (filter === "sell") {
    displayItems = sellItems;
  } else if (filter === "buy") {
    displayItems = buyItems;
  }

  if (sellLoading || buyLoading) {
    return <p>Loading...</p>;
  }

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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="auction-filter-label">구분</InputLabel>
          <Select
            labelId="auction-filter-label"
            value={filter}
            label="구분"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="buy">구매완료</MenuItem>
            <MenuItem value="sell">판매완료</MenuItem>
          </Select>
        </FormControl>

        {filter === "all" && (
          <>
            <h3>판매완료 목록</h3>
            <CmCardList items={sellItems} path="/auc/aucview.do" />

            <h3 style={{ marginTop: "2rem" }}>구매완료 목록</h3>
            <CmCardList items={buyItems} path="/auc/aucview.do" />
          </>
        )}

        {(filter === "sell" || filter === "buy") && (
          <>
            <h3>{filter === "sell" ? "판매완료 목록" : "구매완료 목록"}</h3>
            <CmCardList items={displayItems} path="/auc/aucview.do" />
          </>
        )}
      </Box>
    </Box>
  );
}; //auc_starting_price |auc_current_price |auc_buy_now_price

export default UserAuctionList;
