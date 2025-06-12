import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useUserUpdateMutation,
  useUserDeleteMutation,
  useViewQuery,
  useCheckNicknameMutation,
  useCheckEmailMutation,
} from '../../features/user/userApi';
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
    if (CmUtil.isEmpty(nickname)) {
      showAlert('닉네임을 입력해주세요.');
      nicknameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(email)) {
      showAlert('이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }
    if (!CmUtil.isEmail(email)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      emailRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(userTel)) {
      showAlert('전화번호를 입력해주세요.');
      userTelRef.current?.focus();
      return;
    }

    const formData = new FormData();
    const userData = { nickname, email, userTel, addr, addrD, postCode };
    formData.append("user", new Blob([JSON.stringify(userData)], { type: "application/json" }));
    if (profileImageFile) {
      formData.append("file", profileImageFile);
    }

    try {
      const response = await userUpdate(formData).unwrap();
      if (response.success) {
        showAlert('회원정보 수정에 성공하였습니다. 홈화면으로 이동합니다.', () => navigate('/'));
      } else {
        showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await userDelete({ userId }).unwrap();
      if (response.success) {
        showAlert('회원탈퇴에 성공하였습니다. 로그인화면으로 이동합니다.', () => navigate('/user/login.do'));
      } else {
        showAlert('회원탈퇴에 실패했습니다.');
      }
    } catch {
      showAlert('회원탈퇴에 실패했습니다.');
    }
  };

  return (
    <Box
      sx={{
        width: '350px',
        height: '640px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'sans-serif',
        mt: '50px',
        boxSizing: 'border-box',
      }}
    >

    {/* 프로필 박스 */}
<Box
  sx={{
     mt: '50px',
    p: 2,
    mb: 3,
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // 그림자
  }}
>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <img
      src={profileImage || '/default-profile.png'}
      alt="프로필"
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ccc',
      }}
    />
    <Button
      variant="contained"
      onClick={triggerFileInput}
      sx={{
        backgroundColor: '#B00020',
        fontSize: '12px',
        borderRadius: '20px',
        height: '40px',
        ml: 2,
      }}
    >
      사진 변경
    </Button>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      hidden
      onChange={handleProfileImageChange}
    />
  </Box>
</Box>

    {/* 닉네임 */}
<Box display="flex" alignItems="center" gap={1} mb={2}>
  <FormControl size="small" sx={{ mb: 1 }}>
    <InputLabel>닉네임</InputLabel>
    <OutlinedInput
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      inputRef={nicknameRef}
      label="닉네임"
      sx={{
        width: '240px',
        height: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#B00020',
          borderRadius: '12px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
      }}
    />
  </FormControl>
  <Button
    variant="outlined"
    size="small"
    onClick={handleCheckNickname}
    sx={{
      backgroundColor: '#B00020',
      borderColor: '#B00020',
      height: '40px',
      whiteSpace: 'nowrap',
      borderRadius: '20px',
      color : 'white'      
    }}
  >
    중복 확인
  </Button>
</Box>

{/* 이메일 */}
<Box display="flex" alignItems="center" gap={1} mb={2}>
  <FormControl size="small" sx={{ mb: 1 }}>
    <InputLabel>이메일</InputLabel>
    <OutlinedInput
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      inputRef={emailRef}
      label="이메일"
      sx={{
        width: '240px',
        height: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#B00020',
          borderRadius: '12px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
      }}
    />
  </FormControl>
  <Button
    variant="outlined"
    size="small"
    onClick={handleCheckEmail}
     sx={{
      backgroundColor: '#B00020',
      borderColor: '#B00020',
      height: '40px',
      whiteSpace: 'nowrap',
      borderRadius: '20px',
      color : 'white'      
    }}
  >
    중복 확인
  </Button>
</Box>

{/* 우편번호 + 주소 검색 버튼 */}
<Box display="flex" alignItems="center" gap={1} mb={2}>
  <FormControl size="small">
    <InputLabel shrink>우편번호</InputLabel>
    <OutlinedInput
      value={postCode}
      readOnly
      label="우편번호"
      sx={{
        width: '240px',
        height: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#B00020',
          borderRadius: '12px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#8C001A',
        },
      }}
    />
  </FormControl>

  <Button
    onClick={() => setModalOpen(true)}
    variant="outlined"
   sx={{
      backgroundColor: '#B00020',
      borderColor: '#B00020',
      height: '40px',
      width: '70px',
      whiteSpace: 'nowrap',
      borderRadius: '20px',
      color : 'white'      
    }}
  >
    주소 검색
  </Button>
</Box>

{/* 기본주소 */}
<FormControl size="small" sx={{ mb: 2 }}>
  <InputLabel shrink>기본주소</InputLabel>
  <OutlinedInput
    value={addr}
    readOnly
    label="기본주소"
    sx={{
      width: '315px',
      height: '40px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#B00020',
        borderRadius: '12px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
    }}
  />
</FormControl>

{/* 상세주소 */}
<FormControl size="small">
  <InputLabel>상세주소</InputLabel>
  <OutlinedInput
    value={addrD}
    onChange={(e) => setAddrD(e.target.value)}
    label="상세주소"
    sx={{
      width: '315px',
      height: '40px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#B00020',
        borderRadius: '12px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8C001A',
      },
    }}
  />
</FormControl>



      {/* 주소 모달 */}
      {modalOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}
        >
          <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: '8px', maxWidth: '300px' }}>
            <CmPostCode
              addr={addr}
              setAddr={setAddr}
              addrD={addrD}
              setAddrD={setAddrD}
              postCode={postCode}
              setPostCode={setPostCode}
              onConfirm={() => setModalOpen(false)}
            />
            <Button onClick={() => setModalOpen(false)} fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#B00020' }}>확인</Button>
          </Box>
        </Box>
      )}

      {/* 버튼들 */}
      <Button variant="contained" fullWidth onClick={handleUpdateClick} sx={{ mt: 2, backgroundColor: '#B00020' }}>
        회원정보 수정
      </Button>
      <Button variant="outlined" fullWidth onClick={handleDeleteClick} sx={{ mt: 1, color: '#B00020', borderColor: '#B00020' }}>
        회원 탈퇴
      </Button>
    </Box>
  );
};

export default UserUpdate;
