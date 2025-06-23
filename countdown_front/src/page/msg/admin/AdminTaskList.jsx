import React, { useState, useMemo } from 'react';
import { useGetInquiryListQuery } from '../../../features/msg/msgApi';
import { useGetCodesQuery } from '../../../features/code/codeApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CmDropdown from '../../../cm/CmDropdown';

const AdminTaskList = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState('ALL'); // 처리 상태 필터
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortOrder, setSortOrder] = useState('DESC');
    const userId = useSelector((state) => state.user.user?.userId);

    // 1. DB에서 관리자 처리 상태 코드 목록을 가져옵니다. (GROUP_ID: ADMIN_TASK_STATUS)
    const { data: statusOptions } = useGetCodesQuery('ADMIN_TASK_STATUS', {
        selectFromResult: ({ data }) => ({ data: [{ value: 'ALL', label: '전체' }, ...(data || [])] }),
    });
    const { data: sortOptions } = useGetCodesQuery('MSG_SORT');

    const queryParams = useMemo(() => {
        // 기본 파라미터 설정
        const params = {
            userId,
            searchKeyword,
            sortOrder,
            status: status,
        };
        return params;
    }, [userId, status, searchKeyword, sortOrder]);

    const { data: tasks, error, isLoading, isFetching } = useGetInquiryListQuery(queryParams, {
        skip: !userId,
        refetchOnMountOrArgChange: true,
    });

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
                <Tabs value={status} onChange={(e, val) => setStatus(val)} variant="fullWidth">
                    {statusOptions.map(opt => <Tab key={opt.value} label={opt.label} value={opt.value} />)}
                </Tabs>
            </Box>

            {/* 쪽지 목록 */}
            <Box>
                {(isLoading || isFetching) ? (
                    <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />
                ) : error ? (
                        <Typography sx={{ textAlign: 'center', p: 5, color: 'text.secondary' }}>오류가 발생했습니다.</Typography>
                ) : tasks?.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {tasks.map((msg) => (
                            <React.Fragment key={msg.msgId}>
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        onClick={() => {
                                            // 보낸이가 경매 관련 쪽지일 경우 상품 상세 페이지로 이동
                                            if (msg.msgType === 'A' && msg.aucId) {
                                                navigate(`/auc/admaucview.do?id=${msg.aucId}`);
                                            } else {
                                                // 그 외에는 일반 쪽지 상세 보기로 이동
                                                navigate(`/admin/msg/inquiries.do?msgId=${msg.msgId}`);
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

            {/* <Box sx={{ height: 600, width: '100%' }}>
                <CmDataGrid
                    rows={tasks || []}
                    loading={isLoading}
                    getRowId={(row) => row.msgId}
                    onRowClick={handleRowClick}
                />
            </Box> */}
        </Paper>
    );
};

export default AdminTaskList;