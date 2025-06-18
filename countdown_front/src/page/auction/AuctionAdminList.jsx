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

const AuctionAdminList = () => {
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ field: "CREATE_DT", order: "DESC" });
  const [selected, setSelected] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("판매대기"); // 상태 필터 추가

  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();

  const { data, isLoading, refetch } = useAuctionListQuery({
    searchText,
    sortField: sort.field,
    sortOrder: sort.order,
    isAdmin: true,
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

  const rawItems = data?.data?.list || [];

  // 관리자: 판매대기 상태만 필터링
  const filteredItems = rawItems.filter((item) => item.aucStatus === "판매대기");

  const auctionItems = filteredItems.map((item) => ({
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

      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", overflowX: "auto", mb: 2.5 }}>
        <Button variant="contained" color="error" size="small" sx={{ borderRadius: '20px' }}>
          전체
        </Button>
        <Button variant="contained" color="error" size="small" sx={{ borderRadius: '20px' }}>
          마감임박
        </Button>
        <Button variant="contained" color="error" size="small" sx={{ borderRadius: '20px' }}>
          인기순
        </Button>
        <Button variant="contained" color="error" size="small" sx={{ borderRadius: '20px' }}>
          낮은 가격순
        </Button>
      </Box>

      {/* 상태 필터 버튼 */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", overflowX: "auto", mb: 2.5 }}>
        {["전체", "판매대기", "경매중"].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "contained" : "outlined"}
            color="error"
            size="small"
            onClick={() => setSelectedStatus(status)}
            sx={{ borderRadius: '20px', whiteSpace: 'nowrap', maxWidth: '90px' }}
          >
            {status}
          </Button>
        ))}
      </Box>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CmCardList
          items={auctionItems}
          path="/auc/admaucview.do" // 관리자용 상세보기
        />
      )}
    </Box>
  );
};

export default AuctionAdminList;
