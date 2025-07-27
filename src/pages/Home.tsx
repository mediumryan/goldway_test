import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

export default function Home() {
  const router = useNavigate();

  return (
    <MainWrapper>
      <h1>GOLDWAY JAPAN 混載貨物 管理 WEB ページ</h1>
      <h2>株式会社　宇徳用</h2>

      <h3>使用者ログイン</h3>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          router('/select-work');
        }}
      >
        <div>
          <label>ID</label>
          <input type="text" name="id" />
        </div>
        <div>
          <label>PW</label>
          <input type="password" name="pw" />
        </div>
        <p>로그인 버튼을 클릭시, 다음 화면으로 이동합니다.</p>
        <button type="submit">ログイン</button>
      </StyledForm>
    </MainWrapper>
  );
}
