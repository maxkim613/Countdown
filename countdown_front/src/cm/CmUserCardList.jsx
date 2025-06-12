import React from 'react';
import CmUserDataCard from './CmUserDataCard';

export default function CmUserCardList({ data = [], children }) {
  if (typeof children === 'function') {
    // props.children이 함수이면 커스텀 렌더링
    return (
      <div className="divide-y divide-gray-300 divide-solid">
        {data.map((row, idx) => (
          <div key={row.userId || idx} style={{ padding: '12px' }}>
            {children(row)}
          </div>
        ))}
      </div>
    );
  }

  // 기본 CmUserDataCard 렌더링
  return (
    <div className="divide-y divide-gray-300 divide-solid">
      {data.map((item, idx) => (
        <CmUserDataCard
          key={item.userId || idx}
          nickname={item.nickname}
          userId={item.userId}
          email={item.email}
          userTel={item.userTel}
          status={item.status}
          delYn={item.delYn}
          profileImg={item.profileImg}
        />
      ))}
    </div>
  );
}
