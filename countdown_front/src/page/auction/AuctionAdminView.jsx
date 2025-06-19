import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
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
//import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuctionViewQuery, useApproveAuctionMutation } from "../../features/auction/auctionApi";

const AuctionAdminView = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = useSelector((state) => state.user.user);

  const { data, isLoading, error, isSuccess } = useAuctionViewQuery({
    aucId: Number(id),
  });
  const [auction, setAuction] = useState(null);
  const [approveAuction, { isLoading: isApproving }] = useApproveAuctionMutation(); // 상태 변경 API

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setAuction(data?.data);
    }
  }, [isSuccess, data]);

  const handleApprove = async () => {
    // 상품 상태가 "판매대기"이고, 승인 여부가 "N"일 때만 승인 가능하도록 조건 추가
    // 백엔드에서도 최종 검증이 필요하지만, UI에서도 미리 보여주는 것이 좋습니다.
    if (auction?.aucStatus !== "경매대기" || auction?.aucPermitYn === "Y") {
      alert("이미 승인되었거나 승인 대기 상태가 아닌 상품입니다.");
      return;
    }

    if (!window.confirm("해당 상품을 승인하시겠습니까? (AUC_PERMIT_YN을 'Y'로 설정)")) {
      return;
    }

    try {
      // 새로운 approveAuction 뮤테이션 호출
      // 백엔드의 approveAuction 엔드포인트는 { aucId: id } 형태의 body를 받습니다.
      const res = await approveAuction({
        aucId: Number(id), // Number()로 형변환하여 전송 (RTK Query는 직렬화하지만 명시적 형변환 권장)
      }).unwrap(); // .unwrap()을 사용하여 성공/실패 응답을 직접 처리

      if (res.success) {
        alert("상품이 성공적으로 승인되었습니다.");
        // 승인 성공 후, 데이터를 다시 불러와서 UI를 갱신하거나,
        // 상태를 직접 업데이트하여 UI를 변경할 수 있습니다.
        // 여기서는 간단히 페이지를 이동합니다.
        navigate("/auc/admauclist.do"); // 관리자 경매 목록 페이지로 이동
      } else {
        alert("승인 실패: " + (res.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("승인 요청 중 에러 발생:", err);
      alert("에러 발생: " + (err.data?.message || err.message || "서버 오류"));
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 2, minHeight: "100vh" }}>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>
      ) : auction ? (
        <Box sx={{ p: 2 }}>
          <Box display="flex" gap={2}>
            <Box flexShrink={0}>
              <CardMedia
                component="img"
                height="60"
                image={auction.thumbnailUrl || "/default-img.png"}
                alt="상품 이미지"
                sx={{ width: 60, borderRadius: 1 }}
              />
              <Grid container spacing={1} mt={1}>
                {auction.images?.map((img, idx) => (
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
                <Typography variant="body2" fontWeight="bold">상품명: {auction.aucTitle}</Typography>
                <Typography variant="body2" fontWeight="bold">최소입찰가: {auction.aucSprice}원</Typography>
                <Typography variant="body2" fontWeight="bold">현재입찰가: {auction.aucCprice}원</Typography>
                <Typography variant="body2" fontWeight="bold">마감일: {auction.aucDeadline}</Typography>
                <Typography variant="body2" fontWeight="bold">상태: {auction.aucStatus}</Typography>
              </CardContent>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body1">{auction.createId}</Typography>
              <Typography variant="body2" color="text.secondary">천안시 서북구</Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line", mt: 1 }}>
            {auction.aucDescription || "상품 설명 없음"}
          </Typography>

          {/* 승인 버튼: aucStatus가 "판매대기"이고 aucPermitYn이 "N"일 때만 표시 */}
          <CardActions sx={{ mt: 3, justifyContent: "center" }}>
            <Button
            variant="contained"
            color="error"
            onClick={handleApprove}
            >
            {isApproving ? <CircularProgress size={24} /> : "승인"}
            </Button>
          </CardActions>
        </Box>
      ) : null}
    </Box>
  );
};

export default AuctionAdminView;
