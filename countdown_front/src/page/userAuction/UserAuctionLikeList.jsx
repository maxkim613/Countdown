import React from "react";
import { useSelector } from "react-redux";
import { useAuctionmylikeListQuery } from "../../features/auction/auctionApi";
import { Box } from "@mui/material";
import CmCardList from "../../cm/CmCardList";

const UserAuctionLikeList = () => {
  const user = useSelector((state) => state.user.user);
  const { data: likedData, isLoading } = useAuctionmylikeListQuery(user?.userId);

  const BASE_URL = "http://192.168.0.41:8081/";



  const likeItems = (likedData || []).map((item) => ({  

     info1: `상품명 : ${item.aucTitle}`,
    writeinfo1: "",
    info2: `판매자 : ${item.createId}`,
    writeinfo2: "",
    info3: `좋아요숫자 : ${item.aucLikecnt ?? 0}`,
    writeinfo3: "",
    info4: ``,
    writeinfo4: "",
    info5: "",  // 필요 시 추가 정보
    writeinfo5: ""
  }));

    console.log("likedData", likedData);

  console.log("likeItems", likeItems);

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
