import React, { useEffect, useState, useRef } from 'react';
import CmDataGrid from '../../cm/CmDataGrid';
import { useListQuery, useUserMMutation } from '../../features/user/userApi';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate} from 'react-router-dom';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';  


const UserList = () => { 

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState({
        searchText: '',
        startDate: CmUtil.addDate(CmUtil.getToday(),{months:-3}),
        endDate: CmUtil.getToday() ,
    });

    const [sort, setSort] = useState({ field: 'CREATE_DT', order: 'DESC' });
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const navigate = useNavigate();

    const { data, isLoading, refetch } = useListQuery({
        searchText:search.searchText,
        startDate:search.startDate,
        endDate:search.endDate,
        page:page,
        sortField: sort.field,
        sortOrder: sort.order,
    });   

    const { showAlert } = useCmDialog();
    useEffect(() => {
            refetch();
            
    }, [refetch, page, search]); 
    
    const columns = [
    { field: 'rn', headerName: '번호', width: 90, sortable: false },
    { field: 'userId', headerName: '아이디', width: 150, dbName:"USER_ID" },
    { field: 'username', headerName: '유저명', width: 200,dbName:"USERNAME" },
    { field: 'email', headerName: '이메일', width: 250, dbName:"EMAIL" },
    { field: 'createDt', headerName: '가입일', width: 180,dbName:"CREATE_DT" },
    {
    field: 'action1',
    headerName: '상세보기',
    width: 120,
    renderCell: (params) => (
        <Button onClick={(e) => navigate(`/user/view.do?id=${params.row.userId}`)}>보기</Button>
    ),
    sortable: false 
    },
    {
    field: 'action2',
    headerName: '탈퇴/복구',
    width: 120,
    renderCell: (params) => {
      return params.row.delYn ==="Y" ?
    (<Button onClick={(e) => {handleUserM(params.row.userId,"N")}}>복구</Button>):
    (<Button onClick={(e) => {handleUserM(params.row.userId,"Y")}}>탈퇴</Button>);
    },
    sortable: false 
    },
];
    const [userM] = useUserMMutation();

    const handleUserM = async (userId, delYn) => {
        const res = await userM({userId, delYn}).unwrap();
    if (res.success) {
      showAlert("유저관리 성공 했습니다.", () => refetch());      
    } else {
      showAlert("유저관리 실패 했습니다.");
    }

}

    const rowsWithId = (data?.data?.list || []).map((row) => ({
        ...row,
        id: row.userId,
    }));

    const handleSortChange = (model) => {
    const { field, sort } = model[0];
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field;
  
    console.log('정렬 필드:', sortField, '| 정렬 방향:', sort);
  
    setSort({ field: sortField, order: sort });
  };

   const handleSearch = () => {
      const { startDate, endDate } = search;
  
      if (startDate && !CmUtil.isValidDate(startDate)) {
        showAlert("시작일 형식이 잘못되었습니다 (YYYY-MM-DD).");
        startDateRef.current?.focus();
        return;
      }
    
      if (endDate && !CmUtil.isValidDate(endDate)) {
        showAlert("종료일 형식이 잘못되었습니다 (YYYY-MM-DD).");
        endDateRef.current?.focus();
        return;
      }
    
      if (!CmUtil.isDateRangeValid(startDate, endDate)) {
        showAlert("시작일은 종료일보다 빠르거나 같아야 합니다.");
        startDateRef.current?.focus();
        return;
      }
  
      setPage(1);
      refetch();
    };

    useEffect(() => {
        refetch();
    }, [search, page, sort]);



  return (
    <Box sx={{ p: 3 }}>
      <h2>회원정보 목록</h2>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="유저명"
          value={search.searchText}
          onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
        />
        <TextField
          label="시작일"
          type="date"
          value={search.startDate}
          inputRef={startDateRef}
          onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
        />
        <TextField
          label="종료일"
          type="date"
          value={search.endDate}
          inputRef={endDateRef}
          onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
        />
        <Button variant="contained" onClick={handleSearch}>검색</Button>
      
      </Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmDataGrid
          rows={rowsWithId || []}
          columns={columns}
          loading={isLoading}
          sortS={handleSortChange}
          pageCount={data?.data?.user?.totalPages || 1}
          page={page}
          onPageChange={(value) => setPage(value)} 
        >
      
        </CmDataGrid>
      )}
    </Box>
  );
};

export default UserList;
