
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CampaignDialogDetails from './CampaignDialogDetails';
import { CashbackCampaign } from '@/types/cashback';

interface RedemptionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isRedeeming: boolean;
  campaign: CashbackCampaign;
  userCashback: number;
  formatDate: (dateString: string) => string;
  onRedeem: () => Promise<void>;
}

const RedemptionDialog: React.FC<RedemptionDialogProps> = ({
  isOpen,
  setIsOpen,
  isRedeeming,
  campaign,
  userCashback,
  formatDate,
  onRedeem
}) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-panel border-neon-cyan/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirmar Resgate</DialogTitle>
          <DialogDescription>
            Confirme os detalhes do resgate de cashback
          </DialogDescription>
        </DialogHeader>

        <CampaignDialogDetails 
          campaign={campaign} 
          userCashback={userCashback} 
          formatDate={formatDate} 
        />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-neon-cyan to-neon-pink text-galaxy-dark font-medium"
            onClick={onRedeem}
            disabled={isRedeeming || userCashback === 0}
          >
            {isRedeeming ? 'Processando...' : 'Confirmar Resgate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

export default RedemptionDialog;
