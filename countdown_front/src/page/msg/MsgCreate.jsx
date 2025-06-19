import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSendMsgMutation } from '../../features/msg/msgApi';
import { TextField, Button, Paper, Typography, Box, IconButton } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MsgCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showAlert } = useCmDialog();

    const [receiverNickname, setReceiverNickname] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aucId, setAucId] = useState(null);
    const [productName, setProductName] = useState('');

    const [sendMsg, { isLoading }] = useSendMsgMutation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setReceiverNickname(params.get('receiverNickname') || '');
        setTitle(params.get('title') || '');
        setAucId(params.get('aucId'));
        setProductName(params.get('productName') || '');
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (CmUtil.isEmpty(receiverNickname) || CmUtil.isEmpty(title)) {
            showAlert('받는 사람과 제목은 필수입니다.');
            return;
        }
        const messagePayload = { receiverNickname, msgTitle: title, msgContent: content, msgType: aucId ? 'A' : 'N', aucId, productName };
        try {
            await sendMsg(messagePayload).unwrap();
            showAlert('쪽지가 성공적으로 발송되었습니다.', () => navigate(-1));
        } catch (err) {
            showAlert('쪽지 발송에 실패했습니다.');
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 2, mt: 6, mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>쪽지 보내기</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="받는 사람 *" value={receiverNickname} onChange={(e) => setReceiverNickname(e.target.value)} />
                {productName && (
                    <TextField
                        label="상품명"
                        value={productName}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        sx={{ backgroundColor: '#f5f5f5' }}
                    />
                )}
                <TextField label="제목 *" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField label="내용 *" value={content} onChange={(e) => setContent(e.target.value)} multiline rows={8} />
                
                {/* 버튼 영역 수정: 취소 버튼 추가 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button type="submit" variant="contained" fullWidth size="large" sx={{ backgroundColor: '#B00020' }} disabled={isLoading}>
                        {isLoading ? '보내는 중...' : '보내기'}
                    </Button>
                    <Button variant="outlined" fullWidth size="large" onClick={() => navigate(-1)}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default MsgCreate;