import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAuctionViewQuery,
  useAuctionBuynowMutation,
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

const AuctionBuynow = () => {
  const BASE_URL = "http://localhost:8081/";

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = useSelector((state) => state.user.user);
  const { data, isLoading, error, isSuccess } = useAuctionViewQuery({
    aucId: id,
  });
  const [auction, setAuction] = useState(null);
  const navigate = useNavigate();
  const [buyNow, { isLoading: isBuying, error: buyError }] =
    useAuctionBuynowMutation();

  useEffect(() => {
    if (isSuccess) {
      setAuction(data?.data);
      console.log("data:", data);
      console.log("썸네일 URL:", BASE_URL + data?.data?.thumbnailUrl);
    }
  }, [isSuccess, data]);

  const images =
    auction?.postFiles?.map((file) => BASE_URL + file.fileUrl) || [];

  console.log("썸네일 전체 이미지 리스트", images);

  const handleBuyNow = async () => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    if (!auction) return;

    try {
      await buyNow({
        aucId: auction.aucId,
        userId: user.userId,
        bidPrice: auction.aucBprice,
      }).unwrap();
      alert("즉시구매가 완료되었습니다.");
      // 구매 후 상세페이지 다시 로드하거나 이동 등 추가 작업 가능
      navigate("/auc/aucmylist.do"); // 예: 내 경매 목록으로 이동
    } catch (err) {
      console.error("즉시구매 실패:", err);
      alert("즉시구매에 실패했습니다.");
    }
  };

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
              <Button variant="contained" color="error">
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
                  backgroundColor: "#e0e0e0",
                  color: "#000",
                }}
                onClick={() => navigate(`/auc/aucbid.do?id=${auction.aucId}`)}
              >
                입찰하기
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} /> {/* 아래에 회색 줄 */}
          <Typography variant="h6" gutterBottom>
            즉시 구매가
          </Typography>
          <TextField
            variant="standard"
            type="number"
            fullWidth
            inputProps={{ style: { textAlign: "right" } }}
            InputProps={{
              endAdornment: <InputAdornment position="end">원</InputAdornment>,
            }}
          ></TextField>
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
                  onClick={handleBuyNow}
                  disabled={isBuying}
                >
                  {isBuying ? "구매 처리중..." : "즉시 구매 계속"}
                </Button>
              </CardActions>
            )}
        </Box>
      ) : null}
    </Box>
  );
};

export default AuctionBuynow;
