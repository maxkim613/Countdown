import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import CmDropdown from "../../cm/CmDropdown";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { CmUtil } from "../../cm/CmUtil";
import {
  useAuctionViewQuery,
  useAuctionUpdateMutation,
} from "../../features/auction/auctionApi";

const AuctionUpdate = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const editorRef = useRef();
  const titleRef = useRef();
  const aucspriceRef = useRef();
  const aucbpriceRef = useRef();
  const auclocationRef = useRef();
  const user = useSelector((state) => state.user.user);
  const { showAlert } = useCmDialog();

  const { data, isSuccess } = useAuctionViewQuery({ aucId: id });
  const [auctionUpdate] = useAuctionUpdateMutation();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [selected, setSelected] = useState("");
  const [aucdeadline, setAucdeadline] = useState("");
  const [aucstartdate, setAucstartdate] = useState("");
  const [auclocation, setAuclocation] = useState("");

  useEffect(() => {
    if (isSuccess) {
      const auc = data?.data;
      setEditorValue(auc.aucDescription);
      setSelected(auc.aucCategory);
      setAucdeadline(auc.aucDeadline);
      setAucstartdate(auc.aucStartdate);
      setAuclocation(auc.aucLocation);
    }
  }, [isSuccess, data]);

  const options = [
    { value: "전자기기", label: "전자기기" },
    { value: "의류", label: "의류" },
    { value: "도서", label: "도서" },
    { value: "기타", label: "기타" },
  ];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auctitle = e.target.auctitle.value.trim();
    const aucsprice = e.target.aucsprice.value.trim();
    const aucbprice = e.target.aucbprice.value.trim();
    const contentText = editorRef.current?.getContent({ format: "text" });
    const auclocation = e.target.auclocation.value.trim();

    if (CmUtil.isEmpty(auctitle)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => {
        editorRef?.current?.focus();
      });
      return;
    }

    const formData = new FormData();
    formData.append("aucId", id);
    formData.append("aucTitle", auctitle);
    formData.append("aucDescription", contentText);
    formData.append("aucCategory", selected);
    formData.append("aucSprice", aucsprice);
    formData.append("aucBprice", aucbprice);
    formData.append("aucDeadline", aucdeadline);
    formData.append("aucStartdate", aucstartdate);
    formData.append("aucLocation", auclocation);

    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const res = await auctionUpdate(formData).unwrap();
    if (res.success) {
      showAlert("게시글이 수정되었습니다.", () =>
        navigate(`/auc/aucview.do?id=${id}`)
      );
    } else {
      showAlert("수정에 실패했습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        <Box mb={3}>
          <TextField
            fullWidth
            id="auctitle"
            name="auctitle"
            label="제목"
            variant="outlined"
            defaultValue={data?.data?.aucTitle || ""}
            inputRef={titleRef}
          />
        </Box>

        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor
            value={editorValue}
            setValue={setEditorValue}
            ref={editorRef}
            max={2000}
          />
        </Box>

        <Box mb={3}>
          <Typography gutterBottom>카테고리 선택</Typography>
          <CmDropdown
            label="카테고리"
            value={selected}
            setValue={setSelected}
            options={options}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            id="aucsprice"
            name="aucsprice"
            label="시작가"
            variant="outlined"
            defaultValue={data?.data?.aucSprice || ""}
            inputRef={aucspriceRef}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            id="aucbprice"
            name="aucbprice"
            label="즉시구매가"
            variant="outlined"
            defaultValue={data?.data?.aucBprice || ""}
            inputRef={aucbpriceRef}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            id="auclocation"
            name="auclocation"
            label="위치"
            variant="outlined"
            defaultValue={data?.data?.aucLocation || ""}
            inputRef={auclocationRef}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label="시작일"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={aucstartdate}
            onChange={(e) => setAucstartdate(e.target.value)}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label="종료일"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={aucdeadline}
            onChange={(e) => setAucdeadline(e.target.value)}
          />
        </Box>

        <Box mb={3}>
          <Typography gutterBottom>파일 업로드</Typography>
          <Paper
            variant="outlined"
            sx={{ p: 3, textAlign: "center", borderStyle: "dashed" }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Typography variant="body2" color="textSecondary">
              파일을 드래그하거나 클릭하여 업로드하세요.
            </Typography>
          </Paper>

          {uploadedFiles.length > 0 && (
            <List>
              {uploadedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box display="flex" gap={1} mt={2}>
          <Button type="submit" variant="contained" color="primary">
            수정 완료
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/auc/aucview.do?id=${id}`)}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuctionUpdate;
