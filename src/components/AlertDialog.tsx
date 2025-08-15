import React from 'react';
import { Modal, ModalDialog, DialogTitle, DialogContent, Button, Box } from '@mui/joy';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onClose, title, content }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent id="alert-dialog-description">
          {content}
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
          <Button onClick={onClose}>OK</Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AlertDialog;
