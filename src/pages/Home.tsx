import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-top: 20px;
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

export default function Home() {
  const router = useNavigate();

  return (
    <MainWrapper>
      <h1>GOLDWAY JAPAN 混載貨物 管理 WEB ページ</h1>

      <h2>株式会社　宇徳用</h2>

      <h3>使用者ログイン</h3>
      <LoginForm>
        <div>
          <label>ID</label>
          <input type="text" name="id" required />
        </div>
        <div>
          <label>PW</label>
          <input type="password" name="pw" required />
        </div>
        <button
          type="submit"
          onClick={() => {
            router('/select-work');
          }}
        >
          ログイン
        </button>
      </LoginForm>
    </MainWrapper>
  );
}
