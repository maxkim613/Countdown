import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import { useAuctionListQuery } from "../../features/auction/auctionApi";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CmDropdown from "../../cm/CmDropdown";

const AuctionMyList = () => {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ field: "CREATE_DT", order: "DESC" }); // DB 컬럼명 기준
  const [selected, setSelected] = useState("");

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();

  const { data, isLoading, refetch } = useAuctionListQuery({
    searchText,
    sortField: sort.field,
    sortOrder: sort.order,
  });

  const options = [
    { value: "전체", label: "전체" },
    { value: "전자기기", label: "전자기기" },
    { value: "의류", label: "의류" },
    { value: "도서", label: "도서" },
    { value: "기타", label: "기타" },
  ];

  // const columns = [
  //   { field: "rn", headerName: "번호", width: 90, sortable: false },
  //   { field: "auctitle", headerName: "제목", width: 300, dbName: "AUC_TITLE" },
  //   { field: "createId", headerName: "작성자", width: 150, dbName: "CREATE_ID" },
  //   { field: "aucsprice", headerName: "시작가", width: 120, dbName: "AUC_CURRENT_PRICE" },
  //   { field: "aucdeadline", headerName: "마감일", width: 180, dbName: "AUC_DEADLINE" },
  // ];

  // const handleSortChange = (model) => {
  //   if (!model.length) return;
  //   const { field, sort } = model[0];
  //   const colDef = columns.find((col) => col.field === field);
  //   const sortField = colDef?.dbName || field;
  //   setSort({ field: sortField, order: sort?.toUpperCase() || "ASC" });
  // };

  const handleSearch = () => {
    refetch();
  };

  console.log(data);
  const auctionItems = (data?.data?.list || []).map((item, idx) => ({
    info1: item.aucTitle,
    writeinfo1: "",
    info2: item.aucCprice,
    writeinfo2: "원",
    info3: item.aucDeadline,
    writeinfo3: "",
    info4: item.aucStatus,
    writeinfo4: "",
    thumbnailUrl: item.thumbnailUrl,
    id: item.aucId,
  }));

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mt: 2, mb: 1, display: "flex", gap: 2 }}>
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
      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", overflowX: "auto" ,mb: 2.5}}>
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ borderRadius: '20px', whiteSpace: 'nowrap', maxWidth: '75px' }}
        >
          전체
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ borderRadius: '20px', whiteSpace: 'nowrap', maxWidth: '75px' }}
        >
          마감임박
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ borderRadius: '20px', whiteSpace: 'nowrap', maxWidth: '75px' }}
        >
          인기순
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ borderRadius: '20px', whiteSpace: 'nowrap', maxWidth: '75px' }}
        >
          낮은 가격순
        </Button>
      </Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmCardList
          items={auctionItems}
          path="/auc/aucview.do" // 클릭 시 /auc/aucview.do?id=<id> 로 이동
        />
      )}
    </Box>
  );
};

export default AuctionMyList;
