import { useAnnouncementDeleteMutation, useAnnouncementUpdateMutation, useAnnouncementViewQuery } from "../../features/announcement/announcementApi";
import { useCmDialog } from "../../cm/CmDialogUtil";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CmUtil } from "../../cm/CmUtil";
import { Box, TextField, Typography, Button, Paper, Stack, AppBar, Toolbar, IconButton } from "@mui/material";
import SubjectIcon from "@mui/icons-material/Subject";
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import GavelIcon from '@mui/icons-material/Gavel';
import cdlogo from '../../cdlogo.png';

const AnnouncementUpdate = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const navigate = useNavigate();
    const titleRef = useRef();
    const contentRef = useRef();
    const { showAlert } = useCmDialog();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { data, isLoading, error } = useAnnouncementViewQuery({ annId: id });
    const [announcementUpdate] = useAnnouncementUpdateMutation();
    const [announcementDelete] = useAnnouncementDeleteMutation();

    const [announcement, setAnnouncement] = useState(null);

    useEffect(() => {
        if (data?.success) {
            console.log("AnnouncementUpdate - 불러온 데이터:", data.data);
            setAnnouncement(data.data);
            setTitle(data.data.annTitle || data.data.title || "");
            setContent(data.data.annContent || data.data.content || "");
        } else if (error) { // 데이터 로딩 실패 시 처리
            console.error("공지사항 불러오기 실패:", error);
            showAlert("공지사항을 불러오는 데 실패했습니다.", () => navigate("/ann/annlist.do"));
        }
    }, [data, error, showAlert, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const contentText = content.trim();

        // 제목이 비어있는지 체크
        if (CmUtil.isEmpty(trimmedTitle)) {
            showAlert("제목을 입력해주세요.");
            titleRef.current?.focus();
            return;
        }

        // 제목 길이 체크
        if (!CmUtil.maxLength(trimmedTitle, 100)) {
            showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
            titleRef.current?.focus();
            return;
        }

        // 내용이 비어있는지 체크
        if (CmUtil.isEmpty(contentText)) {
            showAlert("내용을 입력해주세요.", () => {contentRef?.current?.focus();});
            return;
        }

        // 내용 길이 체크
        if (!CmUtil.maxLength(contentText, 2000)) {
            showAlert("내용은 최대 2000자까지 입력할 수 있습니다.",() => {contentRef?.current?.focus();});
            return;
        }

        const payload = {
            annId: Number(id),
            annTitle: title,
            annContent: content,
        };

        console.log("전송될 데이터:", payload);

        const res = await announcementUpdate(payload).unwrap();
        if (res.success) {
            showAlert("공지사항 수정 성공");
            navigate("/ann/annlist.do");
        } else {
            showAlert("공지사항 수정 실패" + (res.message || "알 수 없는 오류"));
        }
    };

    const handleDelete = async () => {
        const isOk = window.confirm("정말 삭제하시겠습니까?");
        if (!isOk) return;

        const res = await announcementDelete({ annId: Number(id) }).unwrap();
        console.log("삭제 응답 결과:", res);
        navigate("/ann/annlist.do");
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>공지사항을 불러오는 중...</Typography>
            </Box>
        );
    }

    if (!announcement) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
                <Typography variant="h6">공지사항을 찾을 수 없거나 불러오기 실패했습니다.</Typography>
                <Button variant="contained" onClick={() => navigate('/ann/annlist.do')}>목록으로</Button>
            </Box>
        );
    }

    return (
      <Box sx={{ px: 2, py: 4 }}>
        {/* 제목 */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            제목
        </Typography>
        <Paper
            sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#eee",
            }}
        >
            <TextField
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            inputRef={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            />
        </Paper>

        {/* 등록일 */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            등록일: {new Date(announcement.createDt).toISOString().split("T")[0]}
        </Typography>

        {/* 내용 */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <SubjectIcon fontSize="small" />
            <Typography variant="subtitle1">내용</Typography>
        </Stack>
        <Paper
            sx={{
            p: 2,
            backgroundColor: "#eee",
            minHeight: 150,
            }}
        >
            <TextField
            fullWidth
            multiline
            rows={6}
            inputRef={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            />
        </Paper>

        {/* 버튼 영역 */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
                backgroundColor: "#B00020",
                color: "#fff",
                "&:hover": { backgroundColor: "#9A001C" },
                width: 100,
            }}
            >
            수정
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{ width: 100 }}
            >
                삭제
            </Button>
        </Stack>
      </Box>
    );
};

export default AnnouncementUpdate;
