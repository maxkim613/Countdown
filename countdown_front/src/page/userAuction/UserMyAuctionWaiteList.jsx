import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import CmCardList from "../../cm/CmCardList";
import { useAuctionMyWaitingListQuery } from "../../features/auction/auctionApi";
import { useSelector } from "react-redux";
import { useCmDialog } from "../../cm/CmDialogUtil";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CmDropdown from "../../cm/CmDropdown";

const UserMyAuctionWaiteList = () => {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ field: "CREATE_DT", order: "DESC" }); // DB 컬럼명 기준
  const [selected, setSelected] = useState("");

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();

  const { data, isLoading, refetch } = useAuctionMyWaitingListQuery({
  userId: user?.userId, 
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
 
  const handleSearch = () => {
    refetch();
  };

  console.log("data",data);

  const auctionItems = (data || []).map((item) => ({
    info1: item.aucTitle,
    writeinfo1: "",
    info2: item.aucCprice,
    writeinfo2: "원",
    info3: item.aucDeadline,
    writeinfo3: "",
    info4: item.aucStatus === "경매대기",
    writeinfo4: "",
    info5: item.createId,
    writeinfo5: "",
    thumbnailUrl: item.fileId
  ? `${process.env.REACT_APP_API_BASE_URL}/auc/imgDown.do?fileId=${item.fileId}`
  : null,
    id: item.aucId,
  }));
  console.log("auctionItems",auctionItems);

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

export default UserMyAuctionWaiteList;
