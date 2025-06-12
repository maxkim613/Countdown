import React, { useRef, useState } from "react"; // React 훅 import
import { useAnnouncementCreateMutation } from "../../features/announcement/announcementApi"; // 게시글 생성 API 호출 훅
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Typography, TextField, Box, Button
} from "@mui/material";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from '../../cm/CmDialogUtil';  

const AnnouncementCreate = () => {
  const navigate = useNavigate();
  const titleRef = useRef();
  const contentRef = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
  const [announcementCreate] = useAnnouncementCreateMutation();
  const { showAlert } = useCmDialog();
  const today = CmUtil.getToday(); // 예: "2025.06.05"

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const contentText = content.trim();

    if (CmUtil.isEmpty(trimmedTitle)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }

    if (!CmUtil.maxLength(trimmedTitle, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => {
        contentRef.current?.focus();
      });
      return;
    }

    if (!CmUtil.maxLength(contentText, 2000)) {
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.", () => {
        contentRef.current?.focus();
      });
      return;
    }

    const createId = user?.userId || 'anonymous';

    if (!user || !user.userId) { // 실제 사용자 ID 속성으로 변경해주세요.
      showAlert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login"); // 로그인 페이지로 이동시키거나 다른 처리
      return;
    }

    const payload = {
      annTitle: trimmedTitle,
      annContent: contentText,
      createId: createId,
    };

    try {
      const res = await announcementCreate(payload).unwrap();
      console.log(payload);
      console.log("등록 성공", res);
      console.log(">>> navigate('/ann/annlist.do') 호출 직전!");
      navigate("/ann/annlist.do");
    } catch (err) {
      console.log(payload);
      console.error("등록 실패", err);
      showAlert("공지사항 등록에 실패했습니다.");
    }
    
  };
  
  const handleCancel = () => {
    navigate('/ann/annlist.do');
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* 본문 입력 영역 */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>제목</Typography>
        <TextField
          fullWidth
          id="annTitle"
          name="annTitle"
          label="제목"
          variant="outlined"
          inputProps={{ maxLength: 100 }} 
          inputRef={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ backgroundColor: "#f5f5f5", mb: 1 }}
        />
        <Typography variant="body2" sx={{ mb: 2 }}>등록일 : {today}</Typography>

        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <Box mb={3}>
            <TextField
              fullWidth
              id="content"
              name="content"
              label="내용"
              variant="outlined"
              multiline
              rows={7}
              inputProps={{ maxLength: 2000 }} 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              inputRef={contentRef} 
            />
          </Box>
        </Box>

        {/* 등록 버튼 */}
        {user && (
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{
            mt: 1,
            backgroundColor: '#B00020',
            '&:hover': { backgroundColor: '#9A001C' },
            fontWeight: 'bold',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          등록
        </Button>
        )}
        <Button
          type="button"
          variant="outlined"
          onClick={handleCancel}
          fullWidth
          sx={{
            mt: 1,
            color: '#B00020',
            borderColor: '#B00020',
            fontWeight: 'bold',
            borderRadius: 1,
            boxShadow: 1,
            '&:hover': {
              backgroundColor: '#FFF0F1',
              borderColor: '#9A001C',
            }
          }}
        >
          취소
        </Button>
      </Box>
    </Box>
  );
};

export default AnnouncementCreate;