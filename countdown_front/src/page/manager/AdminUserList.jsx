import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useListQuery } from '../../features/user/UserApi';
import { CmUtil } from '../../cm/CmUtil';
import CmUserCardList from '../../cm/CmUserCardList';

import CmUserDataCard from '../../cm/CmUserDataCard';

const AdminUserList = () => {
  

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
    .filter((row) => row.adminYn === 'N')
    .filter((row) => {
      if (!search.status) return true; // 전체
      if (search.status === '활성') return row.delYn !== 'Y' && row.accYn !== 'Y';
      if (search.status === '정지') return row.accYn === 'Y';
      if (search.status === '탈퇴') return row.delYn === 'Y';
      return true;
    })
    .map((row) => ({
      ...row,
      id: row.userId,
    }));

  const handleSearch = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Box
      Box
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
        paddingTop: '40px',
      }}
    >
      {/* 검색창 + 상태 선택박스 한 줄 배치 */}
      <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
        <TextField
          placeholder="닉네임 검색"
          value={search.searchText}
          onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
          size="small"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flexGrow: 1,
                height: 40,
                marginTop: '7px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: '#B00020', // 테두리 색상
                  },
                  '&:hover fieldset': {
                    borderColor: '#B00020',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#B00020',
                  },
                },
              }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon sx={{ color: '#B00020' }}/>
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
          sx={{ minWidth: 100,   
              
                marginTop: '7px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: '#B00020', // 테두리 색상
                  },
                  '&:hover fieldset': {
                    borderColor: '#B00020',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#B00020',
                  },
                },             
            }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="활성">활성</MenuItem>
          <MenuItem value="정지">정지</MenuItem>
          <MenuItem value="탈퇴">탈퇴</MenuItem>
        </TextField>
      </Box>

      {/* 유저 리스트 */}
       <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        {isLoading ? (
          <Typography>로딩 중...</Typography>
        ) : (
          <CmUserCardList data={rowsWithId}>
            {(row) => (
              <CmUserDataCard
                key={row.id}
                nickname={row.nickname}
                userId={row.userId}
                email={row.email}
                userTel={row.userTel}
                delYn={row.delYn}
                accYn={row.accYn}
                profileImg={row.profileImg}
              />
            )}
          </CmUserCardList>
        )}
      </Box>
    
    </Box>
  );
};

export default AdminUserList;
