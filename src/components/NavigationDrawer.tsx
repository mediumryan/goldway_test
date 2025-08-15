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

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  onSignOut,
}) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography level="h4" sx={{ mb: 2 }}>
          Menu
        </Typography>
      </Box>
      <List>
        <ListItem>
          <ListItemButton component={Link} to="/" onClick={onClose}>
            <ListItemContent>Home</ListItemContent>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to="/calendar" onClick={onClose}>
            <ListItemContent>Calendar</ListItemContent>
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
            <ListItemContent>Sign out</ListItemContent>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavigationDrawer;
