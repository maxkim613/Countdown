import React, { useState } from 'react';
import { Button, Typography, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import AuctionIcon from '../../css/icons/경매.png';
import NoticeIcon from '../../css/icons/공지.png';
import UserIcon from '../../css/icons/유저.png';
import MessageIcon from '../../css/icons/쪽지.png';


export default function AdminDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    startDate: dayjs().subtract(3, 'month'),
    endDate: dayjs(),
  });

  const handleSearch = () => {
    if (search.startDate.isAfter(search.endDate)) {
      alert('시작일은 종료일보다 빠를 수 없습니다.');
      return;
    }
    console.log('검색 시작:', search.startDate.format('YYYY-MM-DD'), '~', search.endDate.format('YYYY-MM-DD'));
  };

  const handleNavigate = (path) => {
    if (path) navigate(path);
  };

  return (
    <div
      className="p-4 mx-auto"
      style={{
        width: '350px',
        height: '640px',
        overflowY: 'auto',
        textAlign: 'center',
      }}
    >
      {/* 헤더 */}
      <div className="mb-4">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#B00020', marginTop: '40px' }}>
          관리자 대시보드
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>
          오늘도 좋은 하루입니다.
        </p>
      </div>

      {/* 2x2 버튼 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
          marginLeft: '20px',
          marginTop: '40px',
        }}
      >
        {[
          { title: '경매관리', icon: AuctionIcon, path: '/auc/admauclist.do' },
          { title: '유저관리', icon: UserIcon, path: '/manager/alist' },
          { title: '쪽지함', icon: MessageIcon, path: '/msg/admin/tasks.do' },
          { title: '공지사항', icon: NoticeIcon, path: '/ann/annlist.do' },
        ].map((item) => (
          <Button key={item.title} variant="contained" style={buttonStyle} onClick={() => handleNavigate(item.path)}>
            <img src={item.icon} alt={item.title} style={iconStyle} />
            <span>{item.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

// 스타일 정의
const buttonStyle = {
  backgroundColor: '#B00020',
  color: '#fff',
  flexDirection: 'row',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '45px',
  width: '130px',
  gap: '1px',
  fontSize: '0.9rem',
};

const iconStyle = {
  width: 20,
  height: 20,
  display: 'block',
  marginRight: '6px',
};

const infoBoxStyle = {
  textAlign: 'center',
  border: '1px solid #B00020',
  borderRadius: 4,
  paddingTop: 16,
  paddingBottom: 8,
};

// npm install dayjs
// yarn add dayjs