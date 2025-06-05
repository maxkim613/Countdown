import { DataGrid } from "@mui/x-data-grid"; // 테이블 UI 제공 컴포넌트
import { Pagination } from "@mui/material"; // 페이지네이션 UI 컴포넌트

// CmDataGrid: 재사용 가능한 테이블 + 페이지네이션 컴포넌트
const CmDataGrid = ({
  rows, // 테이블에 출력할 데이터 배열
  columns, // 컬럼 정의 배열
  loading, // 로딩 상태 여부
  sortS, // 정렬 처리 함수
  pageCount, // 총 페이지 수
  page, // 현재 페이지
  onPageChange, // 페이지 변경 시 실행할 함수
  children, // 필요 시 테이블 아래에 추가 렌더링할 요소들
}) => {
  return (
    <>
      {/* 데이터 테이블 영역 */}
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows} // 데이터
          columns={columns} // 컬럼 구조
          disableColumnFilter // 필터 비활성화
          disableColumnMenu // 컬럼 메뉴 비활성화
          hideFooter // 하단 정보 숨김 (페이지는 따로 렌더링)
          loading={loading} // 로딩 상태 UI
          sortingMode="server" // 정렬을 클라이언트가 아니라 서버에 맡김
          sortingOrder={["desc", "asc"]} // 정렬 순서 설정
          onSortModelChange={sortS} // 정렬 이벤트 발생 시 처리 함수
        />
      </div>

    </>
  );
};

export default CmDataGrid;
