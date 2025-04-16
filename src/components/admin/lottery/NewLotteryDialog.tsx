
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
import { Lottery } from './types';
import { motion } from 'framer-motion';

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
      <DialogContent className="sm:max-w-[700px] bg-galaxy-deepPurple border-galaxy-purple/30">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 0.5, repeat: 1, repeatType: "reverse" }}
            >
              <Gift className="h-5 w-5 mr-2 text-neon-pink" />
            </motion.div>
            Novo Sorteio
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes do novo sorteio. Preencha todas as informações obrigatórias.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto pr-2 fancy-scrollbar">
          <NewLotteryForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewLotteryDialog;
