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
  const [mainImage, setMainImage] = useState(""); 
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const user = useSelector((state) => state.user.user);

  const { data, isLoading, error, isSuccess } = useAuctionViewQuery({
    aucId: Number(id),
  });
  const [auction, setAuction] = useState(null);
  const [approveAuction, { isLoading: isApproving }] = useApproveAuctionMutation(); // 상태 변경 API

  const navigate = useNavigate();

  const images =
    auction?.postFiles?.map(
      (file) =>
        `${process.env.REACT_APP_API_BASE_URL}/auc/imgDown.do?fileId=${file.fileId}`
    ) || [];



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
