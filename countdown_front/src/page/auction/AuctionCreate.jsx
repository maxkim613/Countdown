import React, { useRef, useState } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import { useAuctionCreateMutation } from "../../features/auction/auctionApi";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import CmDropdown from "../../cm/CmDropdown";
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
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";

const AuctionCreate = () => {
  const navigate = useNavigate();
  const editorRef = useRef();
  const titleRef = useRef();
  const aucspriceRef = useRef();
  const aucbpriceRef = useRef(); 
  const auclocationRef = useRef(); 
  const user = useSelector((state) => state.user.user);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [auctionCreate] = useAuctionCreateMutation();
  const { showAlert } = useCmDialog();
  const [editorValue, setEditorValue] = useState("");
  const [selected, setSelected] = useState("");
  const [aucdeadline, setAucdeadline] = useState("");
  const [aucstartdate, setAucstartdate] = useState(""); 

  const options = [
    { value: "전자기기", label: "전자기기" },
    { value: "의류", label: "의류" },
    { value: "도서", label: "도서" },
    { value: "기타", label: "기타" },
  ];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  console.log("user: "+user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auctitle = e.target.auctitle.value.trim();
    const contentText = editorRef.current?.getContent({ format: "text" });
    const aucsprice = e.target.aucsprice.value.trim();
    const aucbprice = e.target.aucbprice.value.trim();
    const auclocation = e.target.auclocation.value.trim();

    if (CmUtil.isEmpty(auctitle)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }

    if (!CmUtil.maxLength(auctitle, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => {
        editorRef?.current?.focus();
      });
      return;
    }

    if (!CmUtil.maxLength(contentText, 500)) {
      showAlert("내용은 최대 500자까지 입력할 수 있습니다.", () => {
        editorRef?.current?.focus();
      });
      return;
    }

    const formData = new FormData();
    formData.append("aucTitle", auctitle);
    formData.append("aucDescription", contentText);
    formData.append("aucCategory", selected);
    formData.append("aucSprice", aucsprice);
    formData.append("aucBprice", aucbprice);
    formData.append("aucDeadline", aucdeadline);
    formData.append("aucStartdate", aucstartdate);
    formData.append("aucLocation", auclocation);
    formData.append("mainImageIndex", mainImageIndex);

    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const res = await auctionCreate(formData).unwrap();
    if (res.success) {
      showAlert("게시글 생성 성공! 게시판 목록으로 이동합니다.", () =>
        navigate("/auc/auclist.do")
      );
    } else {
      showAlert("게시글 생성 실패 했습니다.");
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);
      if (mainImageIndex === indexToRemove) {
        return newFiles;
      } else if (mainImageIndex > indexToRemove) {
        setMainImageIndex((prev) => prev - 1);
      }
      return newFiles;
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        게시글 작성
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
            inputProps={{ maxLength: 100 }}
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
            inputProps={{ maxLength: 10 }}
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
            inputProps={{ maxLength: 10 }}
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
            inputProps={{ maxLength: 10 }}
            inputRef={aucbpriceRef}
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
                    <>
                      <Button
                        size="small"
                        variant={index === mainImageIndex ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setMainImageIndex(index)}
                      >
                        대표
                      </Button>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={file.name}
                    secondary={index === mainImageIndex ? "대표 이미지" : ""}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box display="flex" gap={1} mt={2}>
          {user && (
            <Button type="submit" variant="contained" color="error">
              등록
            </Button>
          )}

          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/auc/auclist.do")}
          >
            목록으로
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuctionCreate;
