import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
  Box,
} from '@mui/joy';
import { Link } from 'react-router-dom';
import { AppUser } from '../App'; // Import AppUser type

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
  user: AppUser | null; // Add user prop
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  onSignOut,
  user, // Destructure user prop
}) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography level="h4" sx={{ mb: 2 }}>
          {user?.name || user?.email || 'Menu'}
        </Typography>
      </Box>
      <List>
        <ListItem>
          <ListItemButton component={Link} to="/" onClick={onClose}>
            <ListItemContent>ホーム</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/calendar" onClick={onClose}>
            <ListItemContent>スケジュール</ListItemContent>
          </ListItemButton>
        </ListItem>
        {/* Add other navigation links here */}
        <ListItem>
          <ListItemButton
            onClick={() => {
              onSignOut();
              onClose();
            }}
          >
            <ListItemContent sx={{ color: 'red' }}>Sign out</ListItemContent>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavigationDrawer;
