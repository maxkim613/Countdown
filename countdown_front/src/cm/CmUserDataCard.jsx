import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CmUserDataCard({
  nickname,
  userId,
  email,
  userTel,
  status,
  delYn,
  profileImg,
}) {
  const navigate = useNavigate();
  const defaultProfileImg = 'https://i.stack.imgur.com/l60Hf.png';

  const handleImageError = (e) => {
    e.target.src = defaultProfileImg;
  };

  const handleClick = () => {
    navigate(`/manager/user/${userId}`);
  };

  
  const getStatusInfo = () => {
    if (delYn === 'Y') return { text: '탈퇴', color: 'gray' };
    if (status === '정지') return { text: '정지', color: 'red' };
    return { text: '활성', color: 'green' };
  };

  
  const { text: userStatus, color: statusColor } = getStatusInfo();

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderBottom: '1px solid #ddd',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      <img
        src={profileImg || defaultProfileImg}
        onError={handleImageError}
        alt="프로필 이미지"
        style={{
          width: '85px',
          height: '85px',
          objectFit: 'cover',
          borderRadius: '4px',
          backgroundColor: '#eee',
          flexShrink: 0,
        }}
      />
      <div style={{ marginLeft: '12px', flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>{nickname}</div>
        <div style={{ fontSize: '12px', color: '#444' }}>아이디: {userId}</div>
        <div style={{ fontSize: '12px', color: '#444' }}>이메일: {email}</div>
        <div style={{ fontSize: '12px', color: '#444' }}>전화번호: {userTel}</div>
        {/* ✅ 여기서 사용 */}
        <div style={{ fontSize: '12px', color: statusColor }}>상태: {userStatus}</div>
      </div>
    </div>
  );
}
