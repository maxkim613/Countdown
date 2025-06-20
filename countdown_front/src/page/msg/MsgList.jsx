import React, { useState, useMemo } from 'react';
import { useGetMsgListQuery } from '../../features/msg/msgApi';
import { useGetCodesQuery } from '../../features/code/codeApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Paper, 
    Tabs, 
    Tab, 
    TextField, 
    InputAdornment, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Fab,
    ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import CmDropdown from '../../cm/CmDropdown';

const MsgList = () => {
    const navigate = useNavigate();
    
    // 1. STATE MANAGEMENT
    const [activeTab, setActiveTab] = useState('ALL'); // 기본 탭을 '전체'로 변경
    const [sortOrder, setSortOrder] = useState('DESC'); // 기본 정렬을 '최신순(DESC)'으로 설정
    const [searchKeyword, setSearchKeyword] = useState('');
    const userId = useSelector((state) => state.user.user?.userId);

    // 2. DATA FETCHING
    const { data: tabOptionsFromApi } = useGetCodesQuery('USER_MSG_FILTER');
    const { data: sortOptions } = useGetCodesQuery('MSG_SORT');

    // 3. 요구사항 반영: 탭 순서 강제 정렬
    const sortedTabOptions = useMemo(() => {
        if (!tabOptionsFromApi) return [];
        const order = ['ALL', 'RECEIVED', 'SENT', 'AUCTION', 'INQUIRIES']; // 원하는 순서 정의
        return [...tabOptionsFromApi]
            .filter(opt => order.includes(opt.value)) // 정의된 순서에 있는 것만 필터링
            .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
    }, [tabOptionsFromApi]);

    // 4. API PARAMETER LOGIC
    const queryParams = useMemo(() => {
        // 기본 파라미터 설정
        const params = {
            userId,
            searchKeyword,
            sortOrder,
            msgBox: 'all',
        };

        switch (activeTab) {
            case 'ALL':
                params.msgBox = 'all';
                break;
            case 'RECEIVED':
                params.msgBox = 'received';
                break;
            case 'SENT':
                params.msgBox = 'sent';
                break;
            case 'AUCTION':
                params.msgBox = 'auction';
                break;
            case 'INQUIRIES':
                params.msgBox = 'inquiries';
                break;
            default:
                params.msgBox = 'all';
                break;
        }
        return params;
    }, [userId, activeTab, searchKeyword, sortOrder]);

    const { data: messages, error, isLoading, isFetching } = useGetMsgListQuery(queryParams, {
        skip: !userId, 
    });

    // 5. UI RENDERING
    return (
        <Paper elevation={0} sx={{ mt: 7, mb: 8, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>쪽지함</Typography>
            
            {/* 필터 영역 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField 
                    fullWidth 
                    placeholder="검색..." 
                    size="small" 
                    value={searchKeyword} 
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
                />
                {sortOptions && sortOptions.length > 0 && (
                    <CmDropdown label="정렬" value={sortOrder} setValue={setSortOrder} options={sortOptions} width="150px" />
                )}
            </Box>
            
            {/* 메인 분류 탭: 정렬된 데이터로 렌더링 */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} variant="fullWidth">
                    {sortedTabOptions.map(opt => <Tab key={opt.value} label={opt.label} value={opt.value} />)}
                </Tabs>
            </Box>
            
            {/* 쪽지 목록 */}
            <Box>
                {(isLoading || isFetching) ? (
                    <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />
                ) : error ? (
                     <Typography sx={{ textAlign: 'center', p: 5, color: 'text.secondary' }}>오류가 발생했습니다.</Typography>
                ) : messages?.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {messages.map((msg) => (
                            <React.Fragment key={msg.msgId}>
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        onClick={() => {
                                            // 보낸이가 'system'이고, 경매 관련 쪽지일 경우 상품 상세 페이지로 이동
                                            if (msg.senderId === 'system' && msg.msgType === 'A' && msg.aucId) {
                                                navigate(`/auc/aucview.do?id=${msg.aucId}`);
                                            } else {
                                                // 그 외에는 일반 쪽지 상세 보기로 이동
                                                navigate(`/msg/view/${msg.msgId}`);
                                            }
                                        }}
                                        sx={{ py: 1.5, alignItems: 'flex-start' }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" component="span" noWrap sx={{ display: 'block', mb: 0.5 }} fontWeight={msg.readYn === 'N' && msg.receiverId === userId ? 'bold' : 'normal'}>
                                                    {msg.msgTitle}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box component="span" sx={{ display: 'block' }}>
                                                    <Typography component="span" variant="body2" color="text.secondary">
                                                        {msg.senderId === userId ? `받는 사람: ${msg.receiverNickname}` : `보낸 사람: ${msg.senderNickname}`}
                                                    </Typography>
                                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        {msg.createDt}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <Divider component="li" variant="inset" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ textAlign: 'center', p: 5, color: 'text.secondary' }}>쪽지가 없습니다.</Typography>
                )}
            </Box>

            {/* 쪽지 보내기 버튼 */}
            <Fab color="error" sx={{ position: 'fixed', bottom: 70, right: 16, backgroundColor: '#B00020' }} component={Link} to="/msg/create.do">
                <CreateIcon />
            </Fab>
        </Paper>
    );
};

export default MsgList;