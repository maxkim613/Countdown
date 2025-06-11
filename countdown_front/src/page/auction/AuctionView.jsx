import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Grid,
  Avatar,
  IconButton
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useAuctionViewQuery } from '../../features/auction/auctionApi';
import CmComment from '../../cm/CmComment';

export default function AuctionView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();

  const { data, isLoading, error, isSuccess, refetch  } = useAuctionViewQuery({ auctionId: id });
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setAuction(data.data);
    }
  }, [isSuccess, data]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>;
  if (!auction) return null;

  const mainImage = auction.postFiles?.[0]?.filePath
    ? `${process.env.REACT_APP_API_BASE_URL}/api/file/imgDown.do?fileId=${auction.postFiles[0].fileId}`
    : 'https://via.placeholder.com/300';
  const thumbUrls = auction.postFiles?.slice(1).map(f =>
    `${process.env.REACT_APP_API_BASE_URL}/api/file/imgDown.do?fileId=${f.fileId}`
  ) || [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      {/* 1. 메인 썸네일 + 상품 정보 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 1 }}>
            <img
              src={mainImage}
              alt="상품 메인"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Paper>
          {/* 썸네일 갤러리 */}
          <Box mt={1} sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
            {thumbUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`thumb-${i}`}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
                onClick={() => {/* 클릭 시 mainImage 교체 로직 */}}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            상품명 : {auction.auctitle}
          </Typography>
          <Typography variant="body1">
            최소입찰가 : {(auction.aucsprice ?? 0).toLocaleString()}원
          </Typography>
          <Typography variant="body1" color="error">
            최고입찰가 : {(auction.auccbprice ?? 0).toLocaleString()}원
          </Typography>
          <Typography variant="body1" color="error">
            마감시간 : {auction.aucdeadline} {/* 남은 시간 계산 로직 추가 가능 */}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            현재상태 : {auction.aucstatus}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            *1시간 이내로 무입찰 시 경매 종료
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>
              <FavoriteBorderIcon />
            </IconButton>
            <Typography>{auction.auclikecnt}</Typography>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {user?.userId === auction.createId && (
              <Button
                variant="contained"
                onClick={() => navigate(`/auc/aucupdate.do?id=${auction.auctionId}`)}
              >
                수정
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate('/auc/auclist.do')}>
              목록
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* 2. 판매자 정보 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ width: 56, height: 56 }}> {/* 실제 프로필 이미지 URL로 교체 가능 */}</Avatar>
        <Box>
          <Typography>{auction.createId}</Typography>
          <Typography variant="caption" color="text.secondary">
            {/* location 필드가 있다면 여기에 */}
            서울시 강남구
          </Typography>
        </Box>
      </Box>

      {/* 3. 상품 설명 */}
      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
        {/** 안전을 위해 dangerouslySetInnerHTML 대신 text 추출 */}
        {auction.aucdescription.replace(/<[^>]+>/g, '')}
      </Typography>

      {/* 4. 댓글/입찰 내역 */}
      <Box mt={4}>
        <Typography variant="h6">입찰 기록</Typography>
        <IconButton onClick={refetch}>🔄</IconButton>
        <CmComment
          comments={auction.comments || []}
          user={user}
          boardId={auction.auctionId}
          refetchComments={refetch}
        />
      </Box>
    </Box>
  );
}
