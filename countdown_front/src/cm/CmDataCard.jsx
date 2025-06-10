import { useNavigate } from "react-router-dom";

export default function CmDataCard({
  name,
  price,
  endsIn,
  bidders,
  thumbnailUrl,
  auctionId,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (auctionId) {
      navigate(`/auc/aucview.do?id=${auctionId}`);
    }
  };
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
        cursor: 'pointer',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={thumbnailUrl}
        alt="썸네일"
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
        <div style={{ fontWeight: '600', fontSize: '14px' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#444' }}>
          {(price ?? 0).toLocaleString()}원
        </div>
        <div style={{ fontSize: '12px', color: '#444' }}>
          {endsIn}
        </div>
        <div style={{ fontSize: '12px', color: '#888' }}>
          {bidders}명 입찰중
        </div>
      </div>
    </div>
  );
}
