import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAuctionViewQuery,
  useAuctionBidMutation,
} from "../../features/auction/auctionApi";
import InputAdornment from "@mui/material/InputAdornment";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar,
  IconButton,
  Grid,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AuctionBid = () => {
  const BASE_URL = "http://localhost:8081/";

  const [auctionBid, { isLoading: isBidding, error: bidError }] =
    useAuctionBidMutation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = useSelector((state) => state.user.user);
  const { data, isLoading, error, isSuccess } = useAuctionViewQuery({
    aucId: id,
  });
  const [auction, setAuction] = useState(null);
  const navigate = useNavigate();
  const [bidPrice, setBidPrice] = useState("");

  useEffect(() => {
    console.log("로그인 사용자 상태:", user);
  }, [user]);
  const handleBid = async () => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    if (!bidPrice || Number(bidPrice) <= Number(auction.aucCprice)) {
      alert("입찰 가격은 현재 입찰가보다 높아야 합니다.");
      return;
    }
    if (Number(bidPrice) >= Number(auction.aucBprice)) {
      alert("입찰 가격은 즉시구매가보다 낮아야 합니다.");
      return;
    }
    try {
      await auctionBid({
        aucId: auction.aucId,
        userId: user.userId,
        bidPrice: Number(bidPrice),
      }).unwrap();
      alert("입찰 성공");
      navigate("/auc/aucmylist.do");
    } catch (err) {
      console.error("입찰 실패:", err);
      alert("입찰에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setAuction(data?.data);
      console.log("data:", data);
      console.log("썸네일 URL:", BASE_URL + data?.data?.thumbnailUrl);
    }
  }, [isSuccess, data]);

  const images =
    auction?.postFiles?.map((file) => BASE_URL + file.fileUrl) || [];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>
      ) : auction ? (
        <Box elevation={3} sx={{ p: 2 }}>
          <Box display="flex" gap={2}>
            <Box flexShrink={0}>
              <CardMedia
                component="img"
                height="60"
                image={
                  auction.thumbnailUrl
                    ? BASE_URL + auction.thumbnailUrl
                    : "/default-img.png"
                }
                alt="상품 이미지"
                sx={{ width: 60, borderRadius: 1 }}
              />
            </Box>

            <Box flex={1}>
              <CardContent sx={{ p: 0 }}>
                <Box display="flex" flexDirection="column" gap={0.1}>
                  <Typography variant="body2" fontWeight="bold">
                    상품명: {auction.aucTitle}
                  </Typography>
                  <Typography variant="caption">
                    최소입찰가: {auction.aucCprice}원
                  </Typography>
                  <Typography variant="caption" color="error">
                    현재입찰가: {auction.aucCprice}
                  </Typography>
                  <Typography variant="caption" color="error">
                    마감시간: {auction.createDt}
                  </Typography>
                  <Typography variant="caption" color="error">
                    남은시간: {auction.createDt}
                  </Typography>
                </Box>
              </CardContent>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} /> {/* 아래에 회색 줄 */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={4}
            my={2}
          >
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                즉시구매가
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {auction.aucBprice}원
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#e0e0e0",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#d5d5d5",
                  },
                }}
                onClick={() =>
                  navigate(`/auc/aucbuynow.do?id=${auction.aucId}`)
                }
              >
                즉시구매
              </Button>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                최고 입찰가
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {auction.aucCprice}원
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#d32f2f",
                  color: "#ffffff",
                }}
                onClick={handleBid} // 버튼 클릭 시 입찰 처리 함수 호출
                disabled={isBidding}
              >
                {isBidding ? "입찰 처리중..." : "입찰하기"}
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} /> {/* 아래에 회색 줄 */}
          <Typography variant="h6" gutterBottom>
            입찰가
          </Typography>
          <TextField
            variant="standard"
            type="number"
            fullWidth
            value={bidPrice} // 상태값 바인딩
            onChange={(e) => setBidPrice(e.target.value)} // 입력 변경 시 상태 업데이트
            inputProps={{ style: { textAlign: "right" } }}
            InputProps={{
              endAdornment: <InputAdornment position="end">원</InputAdornment>,
            }}
          />
          {auction.aucStatus === "경매중" &&
            user?.userId !== auction.createId && (
              <CardActions
                sx={{
                  mt: 2,
                  justifyContent: "space-between",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleBid}
                  disabled={isBidding}
                >
                  {isBidding ? "입찰 처리중..." : "구매 입찰 계속"}
                </Button>
              </CardActions>
            )}
        </Box>
      ) : null}
    </Box>
  );
};

export default AuctionBid;
