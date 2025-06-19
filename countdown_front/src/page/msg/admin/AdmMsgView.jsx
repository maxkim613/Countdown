import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMsgViewQuery } from '../../../features/msg/msgApi';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Button, Divider } from '@mui/material';
import MsgSend from '../MsgSend'; // 공통 쪽지 작성 컴포넌트를 import

const AdminMsgView = () => {
    const { msgId } = useParams();
    const { data: response, error, isLoading } = useGetMsgViewQuery(msgId);
    const msg = response?.data;

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">오류 발생</Alert>;
    if (!msg) return <Typography>해당 쪽지를 찾을 수 없습니다.</Typography>;

    return (
        <Container sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
            {/* 문의 내용 표시 */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>문의 내용</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">{msg.title}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', my: 1 }}>
                    <Typography variant="body2">보낸 사람: {msg.senderNick}</Typography>
                    <Typography variant="body2">받은 날짜: {new Date(msg.createDt).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mt: 2, p: 2, minHeight: 150, whiteSpace: 'pre-wrap', bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body1">{msg.content}</Typography>
                </Box>
            </Paper>

            {/* 답변 작성 영역 */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>답변 작성</Typography>
                <Divider sx={{ my: 2 }} />
                {/* 공통 쪽지 작성 컴포넌트 재사용 */}
                <MsgSend
                    // 받는 사람은 문의 보낸 사람으로, 제목은 "Re:"로 자동 설정
                    recipientNick={msg.senderNick}
                    initialTitle={`Re: ${msg.title}`}
                />
            </Paper>
        </Container>
    );
};

export default AdminMsgView;