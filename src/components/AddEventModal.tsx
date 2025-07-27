import React, { useState } from 'react';
import styled from 'styled-components';

// --- Styled Components ---
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure modal is on top */
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 9999;
  h2 {
    margin: 0;
  }

  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;

// --- Component Props ---
interface AddEventModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (title: string, date: string) => void;
}

// --- Component ---
const AddShipModal: React.FC<AddEventModalProps> = ({
  show,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  if (!show) {
    return null;
  }

  const handleSave = () => {
    if (title && date) {
      onSave(title, date);
      setTitle('');
      setDate('');
    } else {
      alert('제목과 날짜를 모두 입력해주세요.');
    }
  };

  return (
    <ModalBackground>
      <ModalContent>
        <h2>선박 추가</h2>
        <input
          type="text"
          placeholder="GA1108"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="buttons">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </ModalContent>
    </ModalBackground>
  );
};

export default AddShipModal;
