import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useViewQuery } from '../../features/user/userApi';


const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data, isSuccess } = useViewQuery({ userId: id });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setUserInfo(data?.data);
    }
  }, [isSuccess, data]);

  if (!userInfo) return null;

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        <img
          src={userInfo.profileUrl || '/default-profile.png'}
          alt="프로필"
          style={styles.profileImage}
        />
        <div style={styles.userInfo}>
          <div style={styles.name}>사용자 이름 : {userInfo.username}</div>
          <div style={styles.nickname}>닉네임 : {userInfo.nickname}</div>
        </div>
        <button style={styles.editBtn} onClick={() => navigate('/user/update.do')}>
          프로필 수정
        </button>
      </div>

      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        내 거래 내역
      </div>

      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        관심 상품
      </div>

      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        내 경매 승인 현황
      </div>

      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        참여 중인 경매
      </div>

      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        경매 종료된 상품
      </div>

      
      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        경매 진행중인 나의 상품
      </div>

      
      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        경매 종료된 내 상품
      </div>

      
      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        문의 하기
      </div>

      
      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        공지 사항
      </div>

      
      <div
        style={{
          ...styles.menuItem,
          boxShadow: hover
            ? '0 6px 12px rgba(0, 0, 0, 0.15)'
            : styles.menuItem.boxShadow,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          // 클릭 시 동작
        }}
      >
        로그 아웃
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '350px',
    height: '640px',
    margin: '0 auto 0 0',
    padding: '1rem',
    fontFamily: 'sans-serif',
    marginTop: '40px'
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    position: 'relative',
  },
  profileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginRight: '1rem',
    backgroundColor: '#ccc',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  },
  editBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  menuWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-start',
  },
  menuItem: {
  backgroundColor: '#fff',
  padding: '10px 20px',          // 높이 늘리기
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '14px',              // 글씨 크기 줄이기
  width: '78%',                 // 전체 너비 사용
  maxWidth: '350px',             // 원하는 최대 너비 (조정 가능)
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  border: '1px solid #eee',
  transition: 'box-shadow 0.2s ease-in-out',
  marginBottom: '10px',
}
};

export default UserProfile;
