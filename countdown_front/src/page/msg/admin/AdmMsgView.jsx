import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetMsgDetailQuery } from '../../../features/msg/msgApi';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Button, Divider } from '@mui/material';

const AdminMsgView = () => {
    const { msgId } = useParams();
    const navigate = useNavigate();
    const { data: msg, error, isLoading } = useGetMsgDetailQuery(msgId, { skip: !msgId });


    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">오류가 발생했습니다: {error.data?.message || '데이터 로딩 실패'}</Alert>;
    if (!msg) return <Typography>해당 쪽지를 찾을 수 없습니다.</Typography>;

    return (
        <Container sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>문의 내용</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">{msg.msgTitle}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', my: 1 }}>
                    <Typography variant="body2">보낸 사람: {msg.senderNickname} ({msg.senderId})</Typography>
                    <Typography variant="body2">받은 날짜: {msg.createDt}</Typography>
                </Box>
                <Box sx={{ mt: 2, p: 2, minHeight: 150, whiteSpace: 'pre-wrap', bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body1">{msg.msgContent}</Typography>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>목록으로</Button>
                    <Button 
                        variant="contained" 
                        component={Link} 
                        to={`/msg/create.do?receiverNickname=${msg.senderNickname}&title=RE: ${msg.msgTitle}`}
                    >
                        답변하기
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminMsgView;