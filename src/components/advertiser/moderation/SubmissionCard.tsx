import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Paperclip, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Submission } from '@/types/missions';
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
    await onApprove();
    setIsProcessing(false);
  };
  
  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(rejectReason);
    setRejectReason('');
    setIsRejectDialogOpen(false);
    setIsProcessing(false);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data desconhecida';
    try {
      return format(new Date(dateString), "d MMM yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const submissionContent = submission.submission_data?.content as string || 'Nenhuma resposta fornecida.';
  const submissionFiles = submission.submission_data?.files as { name: string, url: string }[] || [];

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg transition-all hover:border-purple-400/50 hover:shadow-purple-500/10">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={submission.id} className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center gap-4 w-full">
              <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-purple-400 transition-all">
                <AvatarImage src={submission.user_avatar || ''} alt={submission.user_name} />
                <AvatarFallback className="bg-purple-600 text-white font-bold">
                  {submission.user_name?.charAt(0).toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow text-left">
                <p className="font-semibold text-white">{submission.user_name || 'Participante'}</p>
                <p className="text-sm text-gray-400">{formatDate(submission.submitted_at)}</p>
              </div>
              <Badge variant="outline" className="text-xs font-mono bg-black/20 border-white/20 text-gray-300">
                {submission.mission_title}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Resposta do Participante</h4>
                <p className="text-gray-200 bg-black/20 p-3 rounded-md border border-white/10 whitespace-pre-wrap">{submissionContent}</p>
              </div>

              {submissionFiles.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2 flex items-center">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Anexos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {submissionFiles.map((file, index) => (
                      <a 
                        key={index} 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-black/20 p-3 rounded-md border border-white/10 hover:border-purple-400/80 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-purple-400" />
                          <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">{file.name}</p>
                          </div>
                          <Download className="h-5 w-5 text-gray-500 group-hover:text-white transition-all"/>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      { (submission.status === 'pending_approval') && (
        <div className="flex justify-end gap-3 p-4 border-t border-white/10">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={isProcessing}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <X className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          
          <Button 
            size="sm"
            onClick={handleApprove}
            disabled={isProcessing}
            className="bg-green-600/80 hover:bg-green-600 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </div>
      )}

      {/* Diálogo de rejeição */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-gray-950 border-purple-400/50 text-white">
          <DialogHeader>
            <DialogTitle>Rejeitar Submissão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Forneça um feedback claro para o participante.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder="Ex: A imagem enviada não corresponde ao comprovante solicitado."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-gray-900 border-white/20 focus:ring-purple-500"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)} disabled={isProcessing}>Cancelar</Button>
            <Button onClick={handleReject} disabled={isProcessing} className="bg-red-600 hover:bg-red-700">
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionCard;
