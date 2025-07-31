import { useState } from 'react';
import { auth } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import styled from 'styled-components';

// --- Types ---
interface HomeProps {
  onLoginSuccess: () => void;
}

// --- Styled Components ---
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;

  div {
    margin-bottom: 10px;
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
  }
  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
`;

export default function Home({ onLoginSuccess }: HomeProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Notify App.tsx that login was successful
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Also notify on registration success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <MainWrapper>
      <h1>GOLDWAY JAPAN 混載貨物 管理 WEB ページ</h1>
      <h2>株式会社　宇徳用</h2>

      <h3>使用者ログイン</h3>
      <StyledForm onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ログイン</button>
        <button
          type="button"
          onClick={handleRegister}
          style={{ marginTop: '10px', backgroundColor: '#28a745' }}
        >
          新規登録
        </button>
      </StyledForm>
    </MainWrapper>
  );
}
