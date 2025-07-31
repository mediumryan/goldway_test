import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './utils/firebase';
import styled from 'styled-components';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import SelectWork from './pages/SelectWork';
import DetailPage from './pages/Detail';
import WelcomeDialog from './components/WelcomeDialog';

// --- Types ---
export interface AppUser extends User {
  name?: string;
  role?: string;
}

// --- Styled Components ---
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoutButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background-color: #c82333;
  }
`;

// --- Components ---
interface ProtectedRouteProps {
  children: React.ReactNode;
  user: AppUser | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate('/');
    }
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};

function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        let appUser: AppUser = currentUser;

        if (userDoc.exists()) {
          const userData = userDoc.data();
          appUser = {
            ...currentUser,
            name: userData.name,
            role: userData.role,
          };
        } else {
          appUser = currentUser;
        }
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setShowWelcomeDialog(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainWrapper>
      {user && <LogoutButton onClick={handleLogout}>Sign out</LogoutButton>}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/select-work" />
            ) : (
              <Home onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="select-work"
          element={
            <ProtectedRoute user={user}>
              <SelectWork />
            </ProtectedRoute>
          }
        />
        <Route
          path="calendar"
          element={
            <ProtectedRoute user={user}>
              <Calendar user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:date/:shipId"
          element={
            <ProtectedRoute user={user}>
              <DetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <WelcomeDialog
        open={showWelcomeDialog}
        onClose={() => setShowWelcomeDialog(false)}
        userName={user?.name}
      />
    </MainWrapper>
  );
}

export default App;
