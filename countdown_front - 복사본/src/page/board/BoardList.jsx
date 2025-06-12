import React, { useEffect, useRef, useState } from "react"; // React 훅들 import
import { TextField, Button, Box } from "@mui/material"; // MUI 컴포넌트
import CmDataGrid from "../../cm/CmDataGrid"; // 커스텀 데이터 그리드 컴포넌트
import { useBoardListQuery } from "../../features/board/boardApi"; // 게시글 목록 불러오는 RTK Query 훅
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅
import { CmUtil } from "../../cm/CmUtil"; // 날짜 등 유틸 함수
import { useSelector } from "react-redux"; // Redux 상태 조회
import { useCmDialog } from "../../cm/CmDialogUtil"; // 커스텀 다이얼로그 훅

const BoardList = () => {
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [search, setSearch] = useState({
    // 검색 조건 상태
    searchText: "",
    startDate: CmUtil.addDate(CmUtil.getToday(), { months: -3 }), // 기본 시작일: 오늘로부터 3개월 전
    endDate: CmUtil.getToday(), // 기본 종료일: 오늘
  });
  const [sort, setSort] = useState({ field: "create_dt", order: "desc" }); // 정렬 조건 상태
  const startDateRef = useRef(null); // 시작일 입력창 참조
  const endDateRef = useRef(null); // 종료일 입력창 참조
  const user = useSelector((state) => state.user.user); // 로그인 사용자 정보 가져오기

  // 게시글 목록 데이터 호출
  const { data, isLoading, refetch } = useBoardListQuery({
    ...search,
    page,
    sortField: sort.field,
    sortOrder: sort.order,
  });

  // 그리드에 id 필드 추가 (DataGrid 필수)
  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.boardId,
  }));

  const { showAlert } = useCmDialog(); // 알림창 함수 가져오기

  useEffect(() => {
    refetch(); // page나 search 변경 시 목록 재조회
  }, [refetch, page, search]);

  // 정렬 변경 처리 함수
  const handleSortChange = (model) => {
    const { field, sort } = model[0];
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field; // 실제 정렬 대상 DB 필드명 추출

    console.log("정렬 필드:", sortField, "| 정렬 방향:", sort);

    setSort({ field: sortField, order: sort }); // 정렬 상태 변경
  };

  // 검색 버튼 클릭 시 실행
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

    setPage(1); // 검색 시 페이지 초기화
    refetch(); // 목록 다시 불러오기
  };

  const navigate = useNavigate(); // 페이지 이동 함수

  // 그리드 컬럼 정의
  const columns = [
    { field: "rn", headerName: "번호", width: 90, sortable: false },
    { field: "title", headerName: "제목", width: 300, dbName: "title" },
    {
      field: "createId",
      headerName: "작성자",
      width: 150,
      dbName: "create_id",
    },
    {
      field: "viewCount",
      headerName: "조회수",
      width: 100,
      dbName: "view_count",
    },
    {
      field: "createDt",
      headerName: "작성일",
      width: 180,
      dbName: "create_dt",
    },
    {
      field: "action", // 상세보기 버튼
      headerName: "상세보기",
      width: 100,
      renderCell: (params) => (
        <Button
          onClick={(e) => navigate(`/board/view.do?id=${params.row.boardId}`)}
        >
          보기
        </Button>
      ),
      sortable: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <h2>게시판 목록</h2>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        {/* 검색어 입력 */}
        <TextField
          label="검색어"
          value={search.searchText}
          onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
        />

        {/* 시작일 입력 */}
        <TextField
          label="시작일"
          type="date"
          value={search.startDate}
          inputRef={startDateRef}
          onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
        />

        {/* 종료일 입력 */}
        <TextField
          label="종료일"
          type="date"
          value={search.endDate}
          inputRef={endDateRef}
          onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
        />

        {/* 검색 버튼 */}
        <Button variant="contained" onClick={handleSearch}>
          검색
        </Button>

        {/* 로그인 시 글쓰기 버튼 노출 */}
        {user && (
          <Button
            variant="contained"
            onClick={() => navigate(`/board/create.do`)}
          >
            글쓰기
          </Button>
        )}
      </Box>

      {/* 게시판 목록 출력 */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmDataGrid
          rows={rowsWithId || []} // 행 데이터
          columns={columns} // 컬럼 정의
          loading={isLoading} // 로딩 상태
          sortS={handleSortChange} // 정렬 이벤트 핸들러
          pageCount={data?.data?.board?.totalPages || 1} // 총 페이지 수
          page={page} // 현재 페이지
          onPageChange={(value) => setPage(value)} // 페이지 변경 이벤트
        />
      )}
    </Box>
  );
};

export default BoardList; // 컴포넌트 내보내기
