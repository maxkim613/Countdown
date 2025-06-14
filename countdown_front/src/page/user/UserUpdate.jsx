import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useUserUpdateMutation, useUserDeleteMutation, useViewQuery, useCheckNicknameMutation, useCheckEmailMutation } from '../../features/user/UserApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import CmPostCode from '../../cm/CmPostCode';

const UserUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { showAlert } = useCmDialog();

  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [userTel, setUserTel] = useState('');
  const [addr, setAddr] = useState('');
  const [addrD, setAddrD] = useState('');
  const [postCode, setPostCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const nicknameRef = useRef();
  const emailRef = useRef();
  const userTelRef = useRef();
  const fileInputRef = useRef();

  const [userUpdate] = useUserUpdateMutation();
  const [userDelete] = useUserDeleteMutation();
  const [checkNickname] = useCheckNicknameMutation();
  const [checkEmail] = useCheckEmailMutation();
  const { data, isSuccess } = useViewQuery({ userId: user?.userId });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      setUserId(info.userId);
      setNickname(info.nickname);
      setEmail(info.email);
      setUserTel(info.userTel || '');
      setAddr(info.addr || '');
      setAddrD(info.addrD || '');
      setPostCode(info.postCode || '');
      setProfileImage(info.profileImage || null);
    }
  }, [isSuccess, data]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleCheckNickname = async () => {
    if (CmUtil.isEmpty(nickname)) {
      showAlert('닉네임을 입력해주세요.');
      nicknameRef.current?.focus();
      return;
    }
    try {
      const res = await checkNickname({ nickname }).unwrap();
      showAlert(res.data ? '이미 사용중인 닉네임입니다.' : '사용 가능한 닉네임입니다.');
    } catch {
      showAlert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleCheckEmail = async () => {
    if (CmUtil.isEmpty(email)) {
      showAlert('이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }
    try {
      const res = await checkEmail({ email }).unwrap();
      showAlert(res.data ? '이미 사용중인 이메일입니다.' : '사용 가능한 이메일입니다.');
    } catch {
      showAlert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateClick = async () => {
    if (CmUtil.isEmpty(nickname)) return showAlert('닉네임을 입력해주세요.');
    if (CmUtil.isEmpty(email)) return showAlert('이메일을 입력해주세요.');
    if (!CmUtil.isEmail(email)) return showAlert('유효한 이메일 형식이 아닙니다.');
    if (CmUtil.isEmpty(userTel)) return showAlert('전화번호를 입력해주세요.');

    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify({ nickname, email, userTel, addr, addrD, postCode })], { type: "application/json" }));
    if (profileImageFile) formData.append("file", profileImageFile);

    try {
      const res = await userUpdate(formData).unwrap();
      if (res.success) showAlert('회원정보 수정에 성공했습니다.', () => navigate('/'));
      else showAlert('회원정보 수정에 실패했습니다.');
    } catch {
      showAlert('회원정보 수정에 실패했습니다.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await userDelete({ userId }).unwrap();
      if (res.success) showAlert('회원탈퇴에 성공했습니다.', () => navigate('/user/login.do'));
      else showAlert('회원탈퇴에 실패했습니다.');
    } catch {
      showAlert('회원탈퇴에 실패했습니다.');
    }
  };

  return (
    <Box
      sx={{
        width: 350,
        height: 640,
        m: '0 auto',
        p: 3,
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', marginTop: '40px' }}
      >
        회원정보 수정
      </Typography>

      {/* 프로필 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box
          component="img"
          src={profileImage || '/default-profile.png'}
          alt="프로필"
          sx={{ width: 100, height: 100, borderRadius: '50%', border: '2px solid #ccc', objectFit: 'cover' }}
        />
        <Button variant="contained" onClick={triggerFileInput} sx={{ borderRadius: '20px', ml: 2, bgcolor: '#B00020' }}>
          사진 변경
        </Button>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleProfileImageChange} />
      </Box>

      {/* 닉네임 */}

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel htmlFor="nickname">
          닉네임
          <Box component="span" sx={{ color: '#B00020', ml: 0.3 }}>*</Box>
        </InputLabel>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '7px' }}>
          <OutlinedInput
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            label="닉네임"
            sx={{ height: 40, flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckNickname}
            sx={{
              backgroundColor: '#B00020',
              borderColor: '#B00020',
              color: 'white',
              height: 40,
              px: 2,
              whiteSpace: 'nowrap',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#8a001a',
                borderColor: '#8a001a',
              },
            }}
          >
            중복 확인
          </Button>
        </Box>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>
          이메일
          <Box component="span" sx={{ color: '#B00020', ml: 0.3 }}>*</Box>
        </InputLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '7px' }}>
          <OutlinedInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="이메일"
            sx={{ height: 40, flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckEmail}
            sx={{
              backgroundColor: '#B00020',
              borderColor: '#B00020',
              color: 'white',
              height: 40,
              px: 2,
              whiteSpace: 'nowrap',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#8a001a',
                borderColor: '#8a001a',
              },
            }}
          >
            중복 확인
          </Button>
        </Box>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>
          전화번호
          <Box component="span" sx={{ color: '#B00020', ml: 0.3 }}>*</Box>
        </InputLabel>
        <OutlinedInput
          value={userTel}
          onChange={(e) => setUserTel(e.target.value)}
          label="전화번호"
          sx={{ height: 40, mt: '7px' }}
        />
      </FormControl>

      {/* 주소 검색 버튼 */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '7px' }}>
            <OutlinedInput value={postCode} readOnly placeholder="우편번호" sx={{ height: 40 }} />
            <Button
              onClick={() => setModalOpen(true)}
              variant="outlined"
              sx={{
                backgroundColor: '#B00020',
                borderColor: '#B00020',
                color: 'white',
                height: 40,
                px: 2,
                whiteSpace: 'nowrap',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#8a001a',
                  borderColor: '#8a001a',
                },
              }}
            >
              주소 검색
            </Button>
          </Box>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <OutlinedInput value={addr} readOnly placeholder="기본주소" sx={{ height: 40 }} />
        </FormControl>
        <FormControl fullWidth >
          <OutlinedInput
            value={addrD}
            onChange={(e) => setAddrD(e.target.value)}
            placeholder="상세주소"
            sx={{ height: 40 }}
          />
        </FormControl>
      </Box>

      {/* 주소 모달 */}
      {modalOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              border: '2px solid #B00020',
              width: 300,
            }}
          >
            <CmPostCode
              addr={addr}
              setAddr={setAddr}
              addrD={addrD}
              setAddrD={setAddrD}
              postCode={postCode}
              setPostCode={setPostCode}
              onConfirm={() => setModalOpen(false)}
            />
            <Button
              onClick={() => setModalOpen(false)}
              sx={{ mt: 2, bgcolor: '#B00020', color: 'white' }}
            >
              확인
            </Button>
          </Box>
        </Box>
      )}

      {/* 버튼 */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleUpdateClick}
        sx={{
          mt: 2,
          bgcolor: '#B00020',
          color: 'white',
          height: 45,
          borderRadius: 2,
          fontWeight: 'bold',
          '&:hover': { bgcolor: '#8a001a' },
        }}
      >
        회원정보 수정
      </Button>
      <Button
        fullWidth
        variant="contained"
        onClick={handleDeleteClick}
        sx={{
          mt: 1,
          bgcolor: '#B00020',
          color: 'white',
          height: 45,
          borderRadius: 2,
          fontWeight: 'bold',
          '&:hover': { bgcolor: '#8a001a' },
        }}
      >
        회원 탈퇴
      </Button>
    </Box>
  );
};

export default UserUpdate;
