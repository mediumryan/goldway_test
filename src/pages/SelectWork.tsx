import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SelectWorkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 2rem;
`;

const WorkBox = styled.div`
  width: 300px;
  padding: 20px;
  h4 {
    margin-bottom: 10px;
    text-align: left;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    a {
      text-decoration: none;
      color: #007bff;
      border: 1px solid #007bff;
      padding: 10px;
      transition: background-color 0.3s, color 0.3s;
      &:hover {
        background-color: #007bff;
        color: white;
      }
    }
  }
`;

export default function SelectWork() {
  return (
    <SelectWorkWrapper>
      <WorkBox>
        <h4>業務</h4>
        <div>
          <Link to="/calendar">輸出 EXPORT</Link>
          <Link to="/calendar">輸入 IMPORT</Link>
        </div>
      </WorkBox>
    </SelectWorkWrapper>
  );
}
