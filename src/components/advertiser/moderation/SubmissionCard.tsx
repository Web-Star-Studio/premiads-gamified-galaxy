import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, X, Image, FileText, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Submission } from './ModerationContent';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SubmissionCardProps {
  submission: Submission;
  onApprove: () => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
}

const SubmissionCard = ({ submission, onApprove, onReject }: SubmissionCardProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove();
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(rejectReason);
      setRejectReason('');
      setIsRejectDialogOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const renderProof = () => {
    if (submission.proof_url && submission.proof_url.length > 0) {
      return (
        <div className="mt-4 rounded-lg overflow-hidden bg-galaxy-darker border border-galaxy-purple/50">
          <img 
            src={submission.proof_url[0]} 
            alt="Prova de submissão" 
            className="w-full h-auto object-cover max-h-80"
          />
        </div>
      );
    }
    
    if (submission.proof_text) {
      return (
        <div className="mt-4 p-4 rounded-lg bg-galaxy-darker border border-galaxy-purple/50">
          <FileText className="h-5 w-5 text-muted-foreground mb-2" />
          <p className="text-sm text-gray-300">{submission.proof_text}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="p-4 rounded-lg border border-galaxy-purple/50 bg-gradient-to-tr from-galaxy-dark/20 to-galaxy-darkPurple/30">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={submission.user?.avatar_url} alt={submission.user?.name} />
          <AvatarFallback className="bg-galaxy-purple text-white">
            {submission.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{submission.user?.name || 'Usuário'}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(submission.created_at)}
              </p>
            </div>
            
            <Badge variant="outline" className="bg-galaxy-darker">
              {submission.missions?.title || 'Missão'}
            </Badge>
          </div>
          
          {renderProof()}
          
          {submission.status === 'pendente' && (
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsRejectDialogOpen(true)}
                disabled={isProcessing}
              >
                <X className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
              
              <Button 
                size="sm" 
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <Check className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Diálogo de rejeição */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-galaxy-darkPurple border-galaxy-purple">
          <DialogHeader>
            <DialogTitle>Rejeitar Submissão</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição. Isso ajudará o usuário a entender por que sua submissão não foi aprovada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <Input
              placeholder="Motivo da rejeição"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-galaxy-darker border-galaxy-purple"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleReject}
              disabled={isProcessing}
            >
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionCard;
