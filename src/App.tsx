import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './utils/firebase';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import SelectWork from './pages/SelectWork';
import DetailPage from './pages/Detail';
import WelcomeDialog from './components/WelcomeDialog';
import { Box, Button } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NavigationDrawer from './components/NavigationDrawer';

// --- Types ---
export interface AppUser extends User {
  name?: string;
  role?: string;
  company?: string;
}

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            company: userData.company,
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {user && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            zIndex: 1000,
          }}
        >
          <IconButton
            variant="outlined"
            color="neutral"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Button color="danger" onClick={handleLogout}>
            Sign out
          </Button>
        </Box>
      )}

      {user && <Box sx={{ height: '48px' }} />}

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
              <DetailPage user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <WelcomeDialog
        open={showWelcomeDialog}
        onClose={() => setShowWelcomeDialog(false)}
        userName={user?.name}
      />
      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSignOut={handleLogout}
      />
    </Box>
  );
}

export default App;
