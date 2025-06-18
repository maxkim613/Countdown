import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CmDataCard: 범용 데이터 카드 컴포넌트
 *
 * Props:
 * - id: 객체 식별자
 * - thumbnailUrl: 이미지 URL
 * - info1, info2, info3: 주요 정보 값
 * - writeinfo1~4: 각 정보 뒤에 붙일 텍스트 (예: '원', '명')
 * - path: 클릭 시 이동할 경로 (e.g. '/auc/aucview.do')
 * - onClick: id를 인자로 받는 커스텀 클릭 핸들러
 */
export default function CmDataCard({
  id,
  thumbnailUrl,
  info1,
  info2,
  info3,
  info4,
  info5,
  info6,
  writeinfo1 = '',
  writeinfo2 = '',
  writeinfo3 = '',
  writeinfo4 = '',
  writeinfo5 = '',
  writeinfo6 = '',
  path = '',
  onClick
}) {
  const navigate = useNavigate();
  const PLACEHOLDER = 'https://via.placeholder.com/85';

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    } else if (path && id !== undefined && id !== null) {
      navigate(`${path}?id=${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '12px',
        borderBottom: '1px solid #ddd',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        cursor: onClick || path ? 'pointer' : 'default',
        boxSizing: 'border-box'
      }}
    >
        <img
          src={thumbnailUrl || PLACEHOLDER}
          alt="썸네일"
          style={{
            width: '85px',
            height: '85px',
            objectFit: 'cover',
            borderRadius: '4px',
            backgroundColor: '#eee',
            flexShrink: 0
          }}
        />
      
      <div style={{ marginLeft: '20px', flex: 1 }}>
        {info1 != null && (
          <div style={{ fontSize: '14px', color: '#444' }}>
            {info1}{writeinfo1}
          </div>
        )}
        {info2 != null && (
          <div style={{ fontSize: '12px', color: '#444' }}>
            {info2}{writeinfo2}
          </div>
        )}
        {info3 != null && (
          <div style={{ fontSize: '12px', color: '#888' }}>
            {info3}{writeinfo3}
          </div>
        )}
        {info4 != null && (
          <div style={{ fontSize: '12px', color: '#888' }}>
            {info4}{writeinfo4}
          </div>
        )}
        {info5 != null && (
          <div style={{ fontSize: '12px', color: '#888' }}>
            {info5}{writeinfo5}
          </div>
        )}
        {info6 != null && (
          <div style={{ fontSize: '12px', color: '#888' }}>
            {info6}{writeinfo6}
          </div>
        )}
      </div>
    </div>
  );
}
