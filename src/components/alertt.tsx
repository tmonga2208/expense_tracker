import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface ProfileAlertProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileAlert({ open, onClose }: ProfileAlertProps) {
  const navigate = useNavigate();

  const handleOk = () => {
    onClose();
    navigate('/account');
  };

  const handleLater = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Your profile is incomplete. Would you like to complete it now?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleOk}>OK</Button>
          <Button variant="outline" onClick={handleLater}>
            Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}