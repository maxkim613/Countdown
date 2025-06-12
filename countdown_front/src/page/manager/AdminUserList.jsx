import React, { useEffect, useState } from 'react';
import {  Box,  TextField,  InputAdornment,  IconButton,  MenuItem,  Typography,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useListQuery } from '../../features/user/userApi';
import { CmUtil } from '../../cm/CmUtil';
import CmUserCardList from '../../cm/CmUserCardList';
import { useNavigate } from 'react-router-dom';

const AdminUserList = () => {

  const navigate = useNavigate();

  const [search, setSearch] = useState({
    searchText: '',
    status: '',
    startDate: CmUtil.addDate(CmUtil.getToday(), { months: -3 }),
    endDate: CmUtil.getToday(),
  });

  const { data, isLoading, refetch } = useListQuery({
    searchText: search.searchText || '',
    status: search.status || '',
    adminYn: 'N',
    size: 100,
    sortField: 'CREATE_DT',
    sortOrder: 'DESC',
  });

 const rowsWithId = (data?.data?.list || [])
  .filter(row => row.adminYn === 'N') // adminYn이 'N'인 것만 필터링
  .map(row => ({
    ...row,
    id: row.userId,
  }));

  const handleSearch = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [search.status, refetch]);

  return (
    <Box
      sx={{        
        width: '350px',
        height: '640px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '0 auto',
        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
          paddingTop: '50px', // 내부 위쪽에 공간
      }}
    >
      {/* 검색 영역 */}
      <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="닉네임 검색"
          value={search.searchText}
          onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
          size="small"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ height: 40, marginTop:'7px' }}          
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="상태"
          value={search.status}
          onChange={(e) => setSearch({ ...search, status: e.target.value })}
          size="small"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="활성">활성</MenuItem>
          <MenuItem value="정지">정지</MenuItem>
          <MenuItem value="탈퇴">탈퇴</MenuItem>
        </TextField>
      </Box>

      {/* 유저 리스트 영역 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        {isLoading ? (
          <Typography>로딩 중...</Typography>
        ) : (
          <CmUserCardList data={rowsWithId}>
            {(row) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 8px', // 최소 여백
                  borderBottom: '1px solid #ddd',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onClick={() => navigate(`/manager/user/${row.userId}`)}
              >
                <img
                  src={row.profileImg || 'https://i.stack.imgur.com/l60Hf.png'}
                  alt="프로필 이미지"
                
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    backgroundColor: '#eee',
                    flexShrink: 0,
                  }}
                />
                <div style={{ marginLeft: '15px', flex: 1 }}>
                  <Typography variant="body2">
                    닉네임: {row.nickname}
                  </Typography>
                  <Typography variant="body2">
                    아이디: {row.userId}
                  </Typography>
                 
                  <Typography variant="body2">
                    전화번호: {row.userTel}
                  </Typography>
                  <Typography variant="body2">
                    상태:{' '}
                    {row.delYn === 'Y'
                      ? '탈퇴'
                      : row.status === '정지'
                      ? '정지'
                      : '활성'}
                  </Typography>
                </div>
              </div>
            )}
          </CmUserCardList>
        )}
      </Box>
    </Box>
  );
};

export default AdminUserList;
