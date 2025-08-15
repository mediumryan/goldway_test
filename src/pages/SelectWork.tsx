import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/joy';

export default function SelectWork() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontWeight: 'bold',
        mt: 24,
      }}
    >
      <Box sx={{ width: 300, p: 2.5 }}>
        <Typography level="h4" sx={{ mb: 1.5, textAlign: 'left' }}>
          業務
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Link
            component={RouterLink}
            to="/calendar"
            variant="outlined"
            sx={{ p: 1.5, textAlign: 'center' }}
          >
            輸出 EXPORT
          </Link>
          <Link
            disabled={true}
            component={RouterLink}
            to="/calendar"
            variant="outlined"
            sx={{ p: 1.5, textAlign: 'center' }}
          >
            輸入 IMPORT
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
