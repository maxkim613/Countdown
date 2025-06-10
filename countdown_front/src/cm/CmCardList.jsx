import React from 'react';
import CmDataCard from './CmDataCard';

export default function CmCardList({ items }) {
  return (
    <div className="divide-y divide-gray-300 divide-solid">
      {items.map((item, idx) => (
        <CmDataCard
          key={item.loaddata || idx}//받아올 객체
          name={item.name} //아이템 이름
          price={item.price} // 아이템 가격
          endsIn={item.endsIn} // 끝나는 시간
          bidders={item.bidders} // 낙찰자
          thumbnailUrl={item.thumbnailUrl} //사진
        />
      ))}
    </div>
  );
}
