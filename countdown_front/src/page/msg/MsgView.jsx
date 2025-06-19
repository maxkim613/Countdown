import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMsgDetailQuery } from '../../features/msg/msgApi';
import { Box, Typography, Paper, Button, CircularProgress, Divider, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

const MsgView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const msgId = new URLSearchParams(location.search).get('msgId');

    const { data: msg, error, isLoading } = useGetMsgDetailQuery(msgId, { skip: !msgId });
    
    // 현재 사용자가 보낸 메시지인지 확인 (답장 버튼 제어를 위함)
    const currentUserId = useSelector(state => state.user.user?.userId);
    const isMySentMsg = msg?.senderId === currentUserId;


    if (!msgId) return <Typography>잘못된 접근입니다.</Typography>;
    if (isLoading) return <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />;
    if (error) return <Typography color="error">오류가 발생했습니다.</Typography>;

    // 답장할 상대방 정보
    const opponent = {
        id: isMySentMsg ? msg.receiverId : msg.senderId,
        nickname: isMySentMsg ? msg.receiverNickname : msg.senderNickname,
    };

    return (
        <Paper elevation={0} sx={{ mt: 6, mb: 8, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>쪽지</Typography>
            </Box>
            
            <Divider />

            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ mr: 2 }}>{opponent.nickname?.[0]}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{opponent.nickname}</Typography>
                    <Typography variant="caption" color="text.secondary"></Typography>
                </Box>
                <IconButton component={Link} to={`/msg/create.do?receiverId=${opponent.id}&title=RE: ${msg.msgTitle}`}>
                    <SendIcon />
                </IconButton>
            </Box>

            <Divider />
            
            <Box sx={{ p: 2 }}>
                <Typography variant="overline" display="block" color="text.secondary">상품명</Typography>
                <Typography variant="body1">{msg.productName || '일반 쪽지'}</Typography>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>{msg.createDt}</Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2, my: 2, minHeight: 200 }}>
                <Typography variant="overline" display="block" color="text.secondary">내용</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.msgContent}</Typography>
            </Box>
        </Paper>
    );
};

export default MsgView;