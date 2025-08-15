import { useState } from 'react';
import { auth } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from '@mui/joy';

// --- Types ---
interface HomeProps {
  onLoginSuccess: () => void;
}

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'calc(100vh - 72px)',
      }}
    >
      <Typography level="h1" sx={{ mt: 10 }}>
        GOLDWAY JAPAN 混載貨物管理 WEBページ
      </Typography>
      <Typography level="h2">株式会社　OO様用</Typography>

      <Typography level="h3" sx={{ mt: 5 }}>
        使用者ログイン
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 300,
          mt: 2,
          border: '1px solid #ddd',
          p: 2.5,
          borderRadius: 'md',
        }}
      >
        <FormControl sx={{ mb: 1.5 }}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl sx={{ mb: 1.5 }}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        {error && (
          <Typography color="danger" level="body-sm" sx={{ mb: 1.5 }}>
            {error}
          </Typography>
        )}
        <Button type="submit">ログイン</Button>
        <Button
          type="button"
          onClick={handleRegister}
          color="success"
          sx={{ mt: 1.5 }}
        >
          新規登録
        </Button>
      </Box>
    </Box>
  );
}
