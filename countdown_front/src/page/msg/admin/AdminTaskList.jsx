import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetInquiryListQuery } from '../../../features/msg/msgApi';
import { useGetCodesQuery } from '../../../features/code/codeApi';
import { Box, Paper, Typography } from '@mui/material';
import CmDataGrid from '../../../cm/CmDataGrid';
import CmDropdown from '../../../cm/CmDropdown';

const AdminTaskList = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('ALL'); // 처리 상태 필터

    // 1. DB에서 관리자 처리 상태 코드 목록을 가져옵니다. (GROUP_ID: ADMIN_TASK_STATUS)
    const { data: statusOptions } = useGetCodesQuery('ADMIN_TASK_STATUS', {
        selectFromResult: ({ data }) => ({ data: [{ value: 'ALL', label: '전체' }, ...(data || [])] }),
    });

    // 2. 선택된 상태값을 API 호출에 포함시킵니다.
    const { data: tasks, isLoading } = useGetInquiryListQuery({ status });

    const handleRowClick = (params) => {
        navigate(`/admin/msg/inquiries/${params.id}`);
    };

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>문의 목록</Typography>
                {/* 3. 상태 필터링을 위한 드롭다운 UI */}
                {statusOptions && (
                    <CmDropdown
                        label="처리 상태"
                        value={status}
                        setValue={setStatus}
                        options={statusOptions}
                        width="200px"
                    />
                )}
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
                <CmDataGrid
                    rows={tasks || []}
                    loading={isLoading}
                    getRowId={(row) => row.msgId}
                    onRowClick={handleRowClick}
                />
            </Box>
        </Paper>
    );
};

export default AdminTaskList;