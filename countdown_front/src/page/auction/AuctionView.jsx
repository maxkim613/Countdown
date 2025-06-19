import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAuctionDeleteMutation,
  useAuctionViewQuery,
  useLikeStatusQuery,
  useToggleLikeMutation,
} from "../../features/auction/auctionApi";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const AuctionView = () => {
  const [mainImage, setMainImage] = useState("");
  const BASE_URL = "http://localhost:8081/";
  const [bidList, setBidList] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = useSelector((state) => state.user.user);
  const [liked, setLiked] = useState(false);

  const { data: likeData, refetch: refetchLikeStatus } = useLikeStatusQuery({
    aucId: id,
    userId: user?.userId,
  });

  const [toggleLike] = useToggleLikeMutation();
  const { data, isLoading, error, isSuccess } = useAuctionViewQuery({
    aucId: id,
  });

  const [auction, setAuction] = useState(null);
  const navigate = useNavigate();
  const [deleteAuction] = useAuctionDeleteMutation();

  useEffect(() => {
    if (isSuccess && data?.data?.postFiles?.length > 0) {
      setMainImage(
        `${process.env.REACT_APP_API_BASE_URL}/auc/imgDown.do?fileId=${data.data.postFiles[0].fileId}`
      );
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      setAuction(data?.data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (auction) {
      setBidList(auction.bidList || []);
    }
  }, [auction]);

  useEffect(() => {
    if (likeData) {
      setLiked(likeData.data === "Y");
    }
  }, [likeData]);

  const handleLikeToggle = async () => {
    try {
      const result = await toggleLike({
        aucId: id,
        userId: user.userId,
      }).unwrap();

      if (result) {
        await refetchLikeStatus();
      }
    } catch (error) {
      console.error("toggleLike 오류:", error);
      alert("좋아요 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await deleteAuction({ aucId: id }).unwrap();
      if (res.success) {
        alert("삭제되었습니다.");
        navigate("/auc/auclist.do");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("에러가 발생했습니다.");
    }
  };

  const images =
    auction?.postFiles?.map(
      (file) =>
        `${process.env.REACT_APP_API_BASE_URL}/auc/imgDown.do?fileId=${file.fileId}`
    ) || [];

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
                height="120"
                image={mainImage}
                alt="대표 이미지"
                sx={{ width: 120, borderRadius: 1 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 1,
                  width: 120,
                }}
              >
                {images.map((img, idx) => (
                  <CardMedia
                    key={idx}
                    component="img"
                    sx={{
                      width: idx < 3 ? "30px" : "55px",
                      height: "30px",
                      borderRadius: 1,
                      cursor: "pointer",
                      border:
                        mainImage === img ? "2px solid red" : "1px solid #ccc",
                      flexBasis:
                        idx < 3 ? "calc(100% / 3 - 4px)" : "calc(50% - 4px)",
                    }}
                    image={img}
                    alt={`썸네일 ${idx}`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </Box>
            </Box>

            <Box flex={1}>
              <CardContent sx={{ p: 0 }}>
                <Box display="flex" flexDirection="column" gap={0.1}>
                  <Typography variant="body2" fontWeight="bold">
                    상품명: {auction.aucTitle}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    금액: {auction.aucCprice}원
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    등록일: {auction.createDt}
                  </Typography>
                  <Typography variant="caption">
                    판매자: {auction.createId}
                  </Typography>
                  <Typography variant="caption">
                    분류: {auction.aucCategory}
                  </Typography>
                  <Typography variant="caption">
                    위치: {auction.aucLocation || "위치 정보 없음"}
                  </Typography>
                  <Typography variant="caption">
                    현재 상태: {auction.aucStatus}
                    <IconButton onClick={handleLikeToggle}>
                      {liked ? (
                        <FavoriteIcon sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "lightgray" }} />
                      )}
                    </IconButton>
                  </Typography>
                </Box>
              </CardContent>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {auction.aucDescription || "상품 설명 없음"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            alignItems="center"
            mb={1}
            onClick={() => navigate("/auc/auclist.do")}
            sx={{ cursor: "pointer" }}
          >
            <Avatar sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body1">{auction.createId}</Typography>
              <Typography variant="body2" color="text.secondary">
                {auction.aucLocation}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            입찰 기록
          </Typography>

          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                  닉네임
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                  입찰가
                </th>
                <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                  입찰시간
                </th>
              </tr>
            </thead>
            <tbody>
              {bidList.length > 0 ? (
                bidList.map((bid, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      {bid.userName}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      {bid.bidPrice}원
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      {bid.bidTime}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    style={{ padding: "8px", textAlign: "center" }}
                  >
                    입찰 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </Box>

          {auction.aucStatus === "판매대기" &&
            user?.userId === auction.createId && (
              <CardActions sx={{ mt: 2, justifyContent: "space-between" }}>
                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      navigate(`/auc/aucupdate.do?id=${auction.aucId}`)
                    }
                  >
                    수정
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    상품삭제
                  </Button>
                </Box>
              </CardActions>
            )}

          {["경매중", "진행중"].includes(auction.aucStatus) &&
            user?.userId !== auction.createId && (
              <CardActions sx={{ mt: 2, justifyContent: "space-between" }}>
                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      navigate(`/auc/aucbid.do?id=${auction.aucId}`)
                    }
                  >
                    입찰하기
                  </Button>
                </Box>
              </CardActions>
            )}
        </Box>
      ) : null}
    </Box>
  );
};

export default AuctionView;
