
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import NewLotteryForm from './NewLotteryForm';
import { Gift } from 'lucide-react';
import { Lottery } from './LotteryList';

interface NewLotteryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLotteryCreated: (lottery: Lottery) => void;
}

const NewLotteryDialog: React.FC<NewLotteryDialogProps> = ({
  open,
  onOpenChange,
  onLotteryCreated
}) => {
  const handleSuccess = (newLottery: Lottery) => {
    onLotteryCreated(newLottery);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-galaxy-deepPurple border-galaxy-purple/30">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Gift className="h-5 w-5 mr-2 text-neon-pink" />
            Novo Sorteio
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes do novo sorteio. Você poderá adicionar prêmios após a criação.
          </DialogDescription>
        </DialogHeader>
        <NewLotteryForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewLotteryDialog;
