import React from 'react';
import { Modal, ModalDialog, Typography, Button } from '@mui/joy';
import { Check } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string | null | undefined;
}

export default function WelcomeDialog({ open, onClose }: WelcomeDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Check size={48} />
        <Typography sx={{ mt: 2, mb: 2, fontSize: '2rem' }}>
          Welcome!
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          OK
        </Button>
      </ModalDialog>
    </Modal>
  );
}
