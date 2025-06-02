import { useEffect, useRef, useState } from "react"; // React 훅
import { useUserListQuery, useUserMMutation } from "../../features/user/userApi"; // 사용자 목록, 수정 API 훅
import { useNavigate } from "react-router-dom"; // 페이지 이동
import { TextField, Button, Box } from "@mui/material"; // MUI 컴포넌트
import { CmUtil } from '../../cm/CmUtil'; // 유틸 함수
import CmDataGrid from "../../cm/CmDataGrid"; // 커스텀 데이터 그리드
import { useCmDialog } from "../../cm/CmDialogUtil"; // 커스텀 다이얼로그 훅
import { useSelector } from "react-redux"; // Redux 상태 조회

const UserList = () => {
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보

  const startDateRef = useRef(null); // 시작일 입력창 참조
  const endDateRef = useRef(null); // 종료일 입력창 참조

  const [sort, setSort] = useState({ field: 'create_dt', order: 'desc' }); // 정렬 상태
  const navigate = useNavigate(); // 페이지 이동 훅
  const { showAlert } = useCmDialog(); // 알림창 함수

  const [search, setSearch] = useState({
    searchText: "",
    startDate: CmUtil.addDate(CmUtil.getToday(), { months: -3 }), // 기본 시작일: 3개월 전
    endDate: CmUtil.getToday(), // 기본 종료일: 오늘
  });

  // 사용자 목록 API 호출
  const { data, isLoading, error, isSuccess, refetch } = useUserListQuery({
    searchText: search.searchText,
    startDate: search.startDate,
    endDate: search.endDate,
    page: page,
    sortField: sort.field,
    sortOrder: sort.order,
  });

  useEffect(() => {
    refetch(); // page, sort 변경 시 목록 새로고침
  }, [page, sort, refetch]);

  // 컬럼 정의
  const columns = [
    { field: 'rn', headerName: '번호', width: 90, sortable: false },
    { field: 'userId', headerName: 'ID', width: 300, dbName: "USER_ID" },
    { field: 'username', headerName: '회원명', width: 150, dbName: "USERNAME" },
    { field: 'email', headerName: '이메일', width: 100, dbName: "EMAIL" },
    { field: 'createDt', headerName: '가입일', width: 180, dbName: "CREATE_DT" },
    {
      field: 'action1',
      headerName: '상세보기',
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/user/view.do?id=${params.row.userId}`)}>보기</Button>
      ),
      sortable: false
    },
    {
      field: 'action2',
      headerName: '탈퇴/복구',
      width: 100,
      renderCell: (params) => {
        return params?.row?.delYn === "Y"
          ? (<Button onClick={() => { handleUserM(params.row.userId, "N") }}>복구</Button>)
          : (<Button onClick={() => { handleUserM(params.row.userId, "Y") }}>탈퇴</Button>);
      },
      sortable: false
    },
  ];

  // DataGrid용 row 변환
  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.userId,
  }));

  // 정렬 핸들러
  const handleSortChange = (model) => {
    const { field, sort } = model[0];
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field;

    console.log('정렬 필드:', sortField, '| 정렬 방향:', sort);
    setSort({ field: sortField, order: sort });
  };

  // 검색 버튼 클릭 핸들러
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

  const [userM] = useUserMMutation(); // 탈퇴/복구 요청 훅

  // 사용자 탈퇴/복구 요청 처리
  const handleUserM = async (userId, delYn) => {
    const res = await userM({ userId, delYn }).unwrap();
    if (res.success) {
      showAlert("유저관리에 성공 했습니다.", () => refetch());
    } else {
      showAlert("유저관리에 실패 했습니다.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <h2>회원 목록</h2>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        {/* 검색 조건 입력 */}
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

      {/* 사용자 목록 출력 */}
      <CmDataGrid
        rows={rowsWithId || []}
        columns={columns}
        loading={isLoading}
        sortS={handleSortChange}
        pageCount={data?.data?.user?.totalPages || 1}
        page={page}
        onPageChange={(value) => setPage(value)}
      />
    </Box>
  );
};

export default UserList; // 컴포넌트 내보내기
