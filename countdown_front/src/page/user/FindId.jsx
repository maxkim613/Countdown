import React, { useState } from 'react';
import { useSendCertiNumMutation, useVerifyCertiNumMutation } from '../../features/user/UserApi';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        {children}
        <button onClick={onConfirm} style={styles.confirmButton}>확인</button>
      </div>
    </div>
  );
};

const FindId = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [certiNum, setCertiNum] = useState('');
  const [isCertiSent, setIsCertiSent] = useState(false);
  const [certiResult, setCertiResult] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [foundUsername, setFoundUsername] = useState('');
  const [foundUserId, setFoundUserId] = useState('');

  const [sendCertiNum, { isLoading: sending }] = useSendCertiNumMutation();
  const [verifyCertiNum, { isLoading: verifying }] = useVerifyCertiNumMutation();

  const handleSendCerti = async () => {
    try {
      const res = await sendCertiNum({ username, email }).unwrap();
      alert(res.message);
      setIsCertiSent(true);
    } catch {
      alert('인증번호 전송에 실패했습니다.');
    }
  };

  const handleVerifyCerti = async () => {
    try {
      const res = await verifyCertiNum({ email, certiNum }).unwrap();
      setFoundUsername(res.data.username);
      setFoundUserId(res.data.userId);
      setModalOpen(true);
      setCertiResult(res.message);
    } catch {
      alert('인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    navigate('/user/login.do');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>아이디 찾기</h2>

      <label style={styles.label}>
        이름 입력 <span style={styles.required}>*</span>
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      {/* 이메일 입력 라벨 + 버튼 정렬 */}
      <div style={styles.labelRow}>
        <label style={styles.label}>
          이메일 입력 <span style={styles.required}>*</span>
        </label>
        <button onClick={handleSendCerti} style={styles.inlineButton} disabled={sending}>
          {sending ? '전송 중...' : '인증번호 받기'}
        </button>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      {/* 인증번호 입력 */}
      {isCertiSent && (
        <>
          <div style={styles.labelRow}>
            <label style={styles.label}>인증번호 입력</label>
            <button onClick={handleVerifyCerti} style={styles.inlineButton} disabled={verifying}>
              {verifying ? '확인 중...' : '인증번호 확인'}
            </button>
          </div>
          <input
            type="text"
            value={certiNum}
            onChange={(e) => setCertiNum(e.target.value)}
            style={styles.input}
          />
          {certiResult && (
            <p style={{ fontSize: '12px', color: '#B00020', marginTop: '4px' }}>{certiResult}</p>
          )}
        </>
      )}

      {/* 모달 */}
      <Modal isOpen={modalOpen} onConfirm={handleModalConfirm}>
        <p>
          <span style={{ color: '#B00020', fontWeight: 'bold' }}>{foundUsername}</span>님의 아이디는{' '}
          <span style={{ color: '#B00020', fontWeight: 'bold' }}>{foundUserId}</span>입니다.
        </p>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    width: '350px',
    height: '640px',
    margin: '0 auto',
    padding: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
   label: {
    display: 'block',          
    marginBottom: '1px',
  
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '115px',
    marginTop: '1rem',
  },
  required: {
    color: '#B00020',
    marginLeft: '4px',
  },
  input: {
    width: '93%',
    height: '38px',
    border: '1px solid #B00020',
    borderRadius: '4px',
    padding: '0.5rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    boxSizing: 'border-box',
  },
  inlineButton: {
    backgroundColor: '#B00020',
    color: '#fff',
    fontSize: '10px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    whiteSpace: 'nowrap',
  },
  backdrop: {
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
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #B00020',
    maxWidth: '280px',
  },
  confirmButton: {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#B00020',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default FindId;
