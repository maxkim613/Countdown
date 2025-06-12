import React, { useRef, useState } from "react"; // React 훅 import
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor"; // 커스텀 TinyMCE 에디터 컴포넌트
import { useBoardCreateMutation } from "../../features/board/boardApi"; // 게시글 생성 API 호출 훅
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import { useDropzone } from "react-dropzone"; // 파일 드래그&드롭 업로드 기능
import { useSelector } from "react-redux"; // Redux 상태 조회를 위한 훅
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
} from "@mui/material"; // MUI UI 컴포넌트
import DeleteIcon from "@mui/icons-material/Delete"; // 파일 삭제 아이콘
import { CmUtil } from "../../cm/CmUtil"; // 유틸리티 함수 모음
import { useCmDialog } from "../../cm/CmDialogUtil"; // 커스텀 다이얼로그 훅

const AuctionCreate = () => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const editorRef = useRef(); // 에디터 ref
  const titleRef = useRef(); // 제목 입력창 ref
  const user = useSelector((state) => state.user.user); // 로그인 사용자 정보 가져오기
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 상태
  const [boardCreate] = useBoardCreateMutation(); // 게시글 생성 API 훅 호출
  const { showAlert } = useCmDialog(); // 알림창 함수 가져오기
  const [editorValue, setEditorValue] = useState(""); // 에디터 입력 값 상태

  const { getRootProps, getInputProps } = useDropzone({
    // 파일 업로드 드롭존 설정
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB 제한
  });

  const handleSubmit = async (e) => {
    // 폼 제출 시 실행되는 함수
    e.preventDefault();
    const title = e.target.title.value.trim();
    const contentText = editorRef.current?.getContent({ format: "text" });
    const contentHtml = editorRef.current?.getContent();

    if (CmUtil.isEmpty(title)) {
      // 제목 비어있는지 체크
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }

    if (!CmUtil.maxLength(title, 100)) {
      // 제목 길이 제한 체크
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(contentText)) {
      // 내용 비어있는지 체크
      showAlert("내용을 입력해주세요.", () => {
        editorRef?.current?.focus();
      });
      return;
    }

    if (!CmUtil.maxLength(contentText, 2000)) {
      // 내용 길이 제한 체크
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.", () => {
        editorRef?.current?.focus();
      });
      return;
    }

    const formData = new FormData(); // FormData 객체 생성
    formData.append("title", title);
    formData.append("content", contentHtml);
    formData.append("viewCount", 0);

    uploadedFiles.forEach((file) => {
      // 파일들 추가
      formData.append("files", file);
    });

    const res = await boardCreate(formData).unwrap(); // 게시글 생성 API 호출
    if (res.success) {
      showAlert("게시글 생성 성공! 게시판 목록으로 이동합니다.", () =>
        navigate("/board/list.do")
      );
    } else {
      showAlert("게시글 생성 실패 했습니다.");
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    // 파일 삭제 함수
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
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
        {/* 제목 입력 */}
        <Box mb={3}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="제목"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            inputRef={titleRef}
          />
        </Box>

        {/* 에디터 */}
        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor
            value={editorValue}
            setValue={setEditorValue}
            ef={editorRef}
            max={2000}
          />
        </Box>

        {/* 파일 업로드 드롭존 */}
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

          {/* 업로드된 파일 리스트 */}
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

        {/* 버튼 영역 */}
        <Box display="flex" gap={1} mt={2}>
          {user && ( // 로그인한 사용자만 등록 가능
            <Button type="submit" variant="contained" color="primary">
              등록
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/board/list.do")}
          >
            목록으로
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuctionCreate; // 컴포넌트 내보내기
