import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAuctionDeleteMutation,
  useAuctionViewQuery,
} from "../../features/auction/auctionApi";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AuctionView = () => {
  const BASE_URL = "http://localhost:8081/";

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = useSelector((state) => state.user.user);
  const { data, isLoading, error, isSuccess } = useAuctionViewQuery({
    aucId: id,
  });
  const [auction, setAuction] = useState(null);
  const navigate = useNavigate();
  const [deleteAuction] = useAuctionDeleteMutation();

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
              <Grid container spacing={1} mt={1}>
                {images.map((img, idx) => (
                  <Grid item xs={3} key={idx}>
                    <CardMedia
                      component="img"
                      height="60"
                      image={img}
                      alt={`썸네일 ${idx}`}
                    />
                  </Grid>
                ))}
              </Grid>
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
                    위치: {auction.location || "위치 정보 없음"}
                  </Typography>
                  <Typography variant="caption">
                    현재 상태: {auction.aucStatus}
                    <IconButton color="primary">
                      <FavoriteIcon />
                    </IconButton>
                  </Typography>
                </Box>
              </CardContent>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} /> {/* 아래에 회색 줄 */}
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {auction.aucDescription || "상품 설명 없음"}
          </Typography>
          <Divider sx={{ my: 2 }} /> {/* 아래에 회색 줄 */}
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body1">{auction.createId}</Typography>
              <Typography variant="body2" color="text.secondary">
                천안시 서북구
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} /> {/* 아래에 회색 줄 */}
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
              <tr>
                <td style={{ padding: "8px", textAlign: "center" }}>미니df</td>
                <td style={{ padding: "8px", textAlign: "center" }}>10000원</td>
                <td style={{ padding: "8px", textAlign: "center" }}>20분 전</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "center" }}>미니df</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  500000원
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>16분 전</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", textAlign: "center" }}>미니df</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  100000원
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>5분 전</td>
              </tr>
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
            {auction.aucStatus === "경매중" &&
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
