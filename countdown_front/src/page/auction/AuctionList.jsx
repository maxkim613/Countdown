import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import CmDataGrid from "../../cm/CmDataGrid";
import { useAuctionListQuery } from "../../features/auction/auctionApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const AuctionList = () => {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ field: "CREATE_DT", order: "DESC" }); // DB 컬럼명 기준

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useAuctionListQuery({
    searchText,
    sortField: sort.field,
    sortOrder: sort.order,
  });

  const columns = [
    { field: "rn", headerName: "번호", width: 90, sortable: false },
    { field: "auctitle", headerName: "제목", width: 300, dbName: "AUC_TITLE" },
    { field: "createId", headerName: "작성자", width: 150, dbName: "CREATE_ID" },
    { field: "aucsprice", headerName: "시작가", width: 120, dbName: "AUC_STARTING_PRICE" },
    { field: "aucdeadline", headerName: "마감일", width: 180, dbName: "AUC_DEADLINE" },
    {
      field: "action",
      headerName: "상세보기",
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/auction/view.do?id=${params.row.auctionId}`)}>
          보기
        </Button>
      ),
      sortable: false,
    },
  ];

  const rowsWithId = (data?.data?.list || []).map((row, idx) => ({
    ...row,
    id: row.auctionId ?? row.aucId ?? row.rn ?? `row-${idx}`, // 고유 ID fallback
  }));

  const handleSortChange = (model) => {
    if (!model.length) return;
    const { field, sort } = model[0];
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field;
    setSort({ field: sortField, order: sort?.toUpperCase() || "ASC" });
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <Box sx={{ p: 1 }}>
      <h2>경매 목록</h2>
      <Box sx={{ mb: 1, display: "flex", gap: 2 }}>
        <TextField
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="검색어"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "40px",
              height: 40,
            },
          }}
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
      </Box>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmDataGrid
          rows={rowsWithId}
          columns={columns}
          loading={isLoading}
          sortS={handleSortChange}
          getRowId={(row) => row.auctionId ?? row.aucId ?? row.rn}
        />
      )}
    </Box>
  );
};

export default AuctionList;
