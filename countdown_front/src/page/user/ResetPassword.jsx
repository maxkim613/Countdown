import React, { useState } from 'react';
import { useSendCertiNumMutation, useVerifyCertiNumMutation, useResetPasswordMutation } from '../../features/user/userApi';
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [certiNum, setCertiNum] = useState('');
  const [isCertiSent, setIsCertiSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [sendCertiNum] = useSendCertiNumMutation();
  const [verifyCertiNum] = useVerifyCertiNumMutation();
  const [resetPassword] = useResetPasswordMutation();

  const handleSendCerti = async () => {
    setSending(true);
    try {
      await sendCertiNum({ username, userId, email }).unwrap();
      alert('인증번호가 전송되었습니다.');
      setIsCertiSent(true);
    } catch {
      alert('인증번호 전송 실패');
    }
    setSending(false);
  };

  const handleVerifyCerti = async () => {
    setVerifying(true);
    try {
      await verifyCertiNum({ email, certiNum }).unwrap();
      setModalOpen(true);
    } catch {
      alert('인증 실패');
    }
    setVerifying(false);
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    setIsVerified(true);
  };

  const handleResetPassword = async () => {
  if (password !== confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  console.log({ userId, password });  // 여기서 userId, password 값 확인
  try {
    await resetPassword({ userId, password }).unwrap();
    alert('비밀번호가 변경되었습니다.');
    navigate('/user/login.do');
  } catch {
    alert('비밀번호 변경 실패');
  }
};
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>비밀번호 재설정</h2>

      <label style={styles.label}>
        이름 입력 <span style={styles.required}>*</span>
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>
        아이디 입력 <span style={styles.required}>*</span>
      </label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={styles.input}
      />

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

      {isCertiSent && !isVerified && (
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
        </>
      )}

      {isVerified && (
        <>
          <label style={styles.label}>새 비밀번호 입력</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleResetPassword}
              style={{
                ...styles.inlineButton,
                width: '100px',
                height: '38px',
                marginTop: '1rem',
                fontSize: '16px', // 글씨 크기 키우기
              }}
            >
              확인
            </button>
</div>
        </>
      )}

      <Modal isOpen={modalOpen} onConfirm={handleModalConfirm}>
        <p>인증이 완료되었습니다.</p>
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
    cursor: 'pointer',
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
    cursor: 'pointer',
  },
};

export default ResetPassword;
