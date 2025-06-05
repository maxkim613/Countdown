import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import CmDataGrid from "../../cm/CmDataGrid";
import { useBoardListQuery } from "../../features/board/boardApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const AuctionList = () => {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ field: "create_dt", order: "desc" });

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useBoardListQuery({
    searchText,
    sortField: sort.field,
    sortOrder: sort.order,
  });

  const rowsWithId = (data?.data?.list || []).map((row) => ({
    ...row,
    id: row.boardId,
  }));

  const handleSortChange = (model) => {
    const { field, sort } = model[0];
    const colDef = columns.find((col) => col.field === field);
    const sortField = colDef?.dbName || field;
    setSort({ field: sortField, order: sort });
  };

  const handleSearch = () => {
    refetch();
  };

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
      field: "action",
      headerName: "상세보기",
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => navigate(`/board/view.do?id=${params.row.boardId}`)}>
          보기
        </Button>
      ),
      sortable: false,
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <h2>경매</h2>
      <Box sx={{ mb: 1, display: "flex", gap: 2 }}>
        <TextField
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="검색어"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '40px',
              height: 40,
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmDataGrid
          rows={rowsWithId || []}
          columns={columns}
          loading={isLoading}
          sortS={handleSortChange}
        />
      )}
    </Box>
  );
};

export default AuctionList;
