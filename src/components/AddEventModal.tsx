import React, { useState } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Input,
  Button,
  Box,
  FormControl,
  Stack,
  FormLabel,
} from '@mui/joy';

// --- Component Props ---
export interface ShipData {
  title: string;
  date: string;
  carrierLine: string;
  voy: string;
  etd: string;
  eta: string;
}

interface AddEventModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: ShipData) => void;
}

// --- Component ---
const AddShipModal: React.FC<AddEventModalProps> = ({
  show,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [carrierLine, setCarrierLine] = useState('');
  const [voy, setVoy] = useState('');
  const [etd, setEtd] = useState('');
  const [eta, setEta] = useState('');
  const [error, setError] = useState('');

  const clearForm = () => {
    setTitle('');
    setDate('');
    setCarrierLine('');
    setVoy('');
    setEtd('');
    setEta('');
    setError('');
  };

  const handleSave = () => {
    if (title && date && carrierLine && voy && etd && eta) {
      onSave({ title, date, carrierLine, voy, etd, eta });
      clearForm();
      onClose();
    } else {
      setError('全ての項目を入力してください。');
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Modal open={show} onClose={handleClose}>
      <ModalDialog>
        <DialogTitle>船舶 追加</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl>
              <FormLabel>船舶名</FormLabel>
              <Input
                autoFocus
                placeholder="船舶名 (ex: GA1108)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>日付</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CARRIER LINE</FormLabel>
              <Input
                value={carrierLine}
                onChange={(e) => setCarrierLine(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>VSL/VOY NO</FormLabel>
              <Input
                value={voy}
                onChange={(e) => setVoy(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>ETD</FormLabel>
              <Input
                type="date"
                value={etd}
                onChange={(e) => setEtd(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>ETA</FormLabel>
              <Input
                type="date"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
              />
            </FormControl>
            {error && (
              <Box sx={{ color: 'danger.500', fontSize: 'sm', mt: 1 }}>
                {error}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
          <Button variant="plain" color="neutral" onClick={handleClose}>
            戻る
          </Button>
          <Button variant="solid" color="primary" onClick={handleSave}>
            追加
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddShipModal;