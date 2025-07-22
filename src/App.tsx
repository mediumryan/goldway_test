import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import SelectWork from './pages/SelectWork';
import Detail from './pages/Detail';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    <MainWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="select-work" element={<SelectWork />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="detail/:title" element={<Detail />} />
      </Routes>
    </MainWrapper>
  );
}

export default App;
