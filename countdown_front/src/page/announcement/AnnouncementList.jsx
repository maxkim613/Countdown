import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import CmDataGrid from "../../cm/CmDataGrid";
import { useBoardListQuery } from "../../features/board/boardApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";

const AuctionList = () => {
  const [sort, setSort] = useState({ field: "create_dt", order: "desc" });

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useBoardListQuery({
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


  const columns = [
   
  ];

  return (
    <Box sx={{ p: 3 }}>
      <h2>공지사항</h2>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        {user && (
          <Button variant="contained" onClick={() => navigate(`/auc/auccreate.do`)}>
            글쓰기
          </Button>
        )}
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
