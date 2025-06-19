import React from 'react';
import CmDataCard from './CmDataCard';

export default function CmCardList({
  items,
  path,           // 클릭 시 이동할 기본 경로 (예: '/auc/aucview.do')
  onItemClick     // 클릭 시 커스텀 핸들러가 필요하면 전달
}) {
  console.log(items);
  return (
    <div className="divide-y divide-gray-300 divide-solid">
      {items.map((item, idx) => (
        <CmDataCard
          key={item.id ?? idx}
          id={item.id}
          thumbnailUrl={item.thumbnailUrl}
          info1={item.info1}
          writeinfo1={item.writeinfo1}
          info2={item.info2}
          writeinfo2={item.writeinfo2}
          info3={item.info3}
          writeinfo3={item.writeinfo3}
          info4={item.info4}
          writeinfo4={item.writeinfo4}
          info5={item.info5}
          writeinfo5={item.writeinfo5}
          info6={item.info6}
          writeinfo6={item.writeinfo6}
          path={path}             // onClick이 없으면 이 경로로 이동
          onClick={onItemClick}    // 있으면 이 함수 호출(id 전달)
        />
      ))}
    </div>
  );
}
