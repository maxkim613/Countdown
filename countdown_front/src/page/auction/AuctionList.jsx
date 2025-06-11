import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import { useAuctionListQuery } from "../../features/auction/auctionApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import  CmDropdown  from '../../cm/CmDropdown';

const AuctionList = () => {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ field: "CREATE_DT", order: "DESC" }); // DB 컬럼명 기준
  const [selected, setSelected] = useState('');

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();
  
  const { data, isLoading, refetch } = useAuctionListQuery({
    searchText,
    sortField: sort.field,
    sortOrder: sort.order,
  });


  const options = [
          { value: '전체', label: '전체' },
          { value: '전자기기', label: '전자기기' },
          { value: '의류', label: '의류' },
          { value: '도서', label: '도서' },
          { value: '기타', label: '기타' },
        ];


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
        <Button onClick={() => navigate(`/auc/view.do?id=${params.row.auctionId}`)}>
          보기
        </Button>
      ),
      sortable: false,
    },
  ];

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

  const auctionItems = (data?.data?.list || []).map((item, idx) => ({
                        name: item.auctitle,
                        price: item.aucsprice,
                        endsIn: item.aucdeadline,
                        bidders: item.bidcount ?? 0,
                        thumbnailUrl: item.thumbnailUrl,
                        auctionId: item.aucId, 
                        loaddata: item.aucId ?? item.rn ?? `row-${idx}`,
                        }));

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mt: 2,mb: 1, display: "flex", gap: 2 }}>
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
        <CmDropdown
              label="카테고리"
              value={selected}
              setValue={setSelected}
              options={options}
        />
      </Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmCardList items={auctionItems} />

      )}
    </Box>
  );
};

export default AuctionList;
