import React from "react";
import { useSelector } from "react-redux";
import { useAuctionmylikeListQuery } from "../../features/auction/auctionApi";
import { Box } from "@mui/material";
import CmCardList from "../../cm/CmCardList";

const UserAuctionLikeList = () => {
  const user = useSelector((state) => state.user.user);
  const { data: likedData, isLoading } = useAuctionmylikeListQuery(user?.userId);


  const likeItems = (likedData || []).map((item) => ({
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
console.log(likedData);
  if (isLoading) return <div>로딩 중...</div>;

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
    <div className="p-4">
     
      <CmCardList items={likeItems} path="/auc/aucview.do" />
    </div>
    </Box>
  );
};

export default UserAuctionLikeList;
