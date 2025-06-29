import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Paperclip, FileText, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Submission } from '@/types/missions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSubmissionFileUpload } from '@/hooks/useSubmissionFileUpload';
import AttachmentViewerModal from './AttachmentViewerModal';

interface SubmissionCardProps {
  submission: Submission;
  onApprove: () => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
}

const SubmissionCard = ({ submission, onApprove, onReject }: SubmissionCardProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { downloadFile, getFileUrl } = useSubmissionFileUpload();
  
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

  const handleDownloadFile = async (file: { name: string, url: string, path?: string }, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      if (file.path) {
        await downloadFile(file.path, file.name);
      } else {
        // Fallback for files without path - direct download
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro no download:', error);
    }
  };

  const handleViewAttachments = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsViewerOpen(true);
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
  const submissionFiles = submission.submission_data?.files as { name: string, url: string, path?: string }[] || [];

  // Convert legacy file data to proper format
  const normalizedFiles = submissionFiles.map(file => {
    // If file is just a string (legacy data), convert to proper format
    if (typeof file === 'string') {
      return {
        name: file,
        url: '', // Legacy files don't have URLs
        path: undefined,
        type: undefined
      };
    }
    return file;
  });

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
              {/* Mostrar motivo da rejeição inicial se for submissão retornada */}
              {submission.status === 'returned_to_advertiser' && submission.submission_data?.rejection_reason && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-md p-3">
                  <h4 className="font-semibold text-amber-300 mb-2 flex items-center">
                    <X className="h-4 w-4 mr-2" />
                    Motivo da Rejeição Inicial
                  </h4>
                  <p className="text-amber-200 text-sm">{submission.submission_data.rejection_reason}</p>
                  <p className="text-amber-200/60 text-xs mt-1">
                    O administrador aprovou esta submissão em segunda instância. Sua decisão aqui será final.
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Resposta do Participante</h4>
                <p className="text-gray-200 bg-black/20 p-3 rounded-md border border-white/10 whitespace-pre-wrap">{submissionContent}</p>
              </div>

              {submissionFiles.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2 flex items-center">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Anexos
                    <Button
                      onClick={handleViewAttachments}
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar todos
                    </Button>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {submissionFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="bg-black/20 p-3 rounded-md border border-white/10 hover:border-purple-400/80 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-purple-400" />
                          <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">{typeof file === 'string' ? file : file.name}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={handleViewAttachments}
                              className="p-1 rounded hover:bg-purple-400/20 text-purple-400 hover:text-purple-300 transition-all"
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDownloadFile(file, e)}
                              className="p-1 rounded hover:bg-purple-400/20 text-gray-500 hover:text-white transition-all"
                              title="Baixar"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Botões para submissões pendentes (primeira instância) */}
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

      {/* Botões para submissões retornadas pelo admin (decisão final do anunciante) */}
      { (submission.status === 'returned_to_advertiser') && (
        <div className="flex justify-end gap-3 p-4 border-t border-amber-500/20 bg-amber-950/20">
          <div className="flex-grow">
            <p className="text-xs text-amber-300 mb-1">
              <strong>Decisão Final:</strong> O administrador aprovou esta submissão em segunda instância.
            </p>
            <p className="text-xs text-amber-200/70">
              Sua decisão aqui será definitiva e determinará se o participante recebe as recompensas.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsRejectDialogOpen(true)}
              disabled={isProcessing}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Rejeitar Definitivamente
            </Button>
            
            <Button 
              size="sm"
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-green-600/80 hover:bg-green-600 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Aprovar e Conceder Recompensas
            </Button>
          </div>
        </div>
      )}

      {/* Diálogo de rejeição */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-gray-950 border-purple-400/50 text-white">
          <DialogHeader>
            <DialogTitle>
              {submission.status === 'returned_to_advertiser' 
                ? 'Rejeitar Submissão Definitivamente' 
                : 'Rejeitar Submissão'
              }
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {submission.status === 'returned_to_advertiser' 
                ? 'Esta ação rejeitará definitivamente a submissão. O participante não receberá as recompensas. Forneça um feedback claro sobre o motivo da rejeição final.'
                : 'Forneça um feedback claro para o participante.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder={
                submission.status === 'returned_to_advertiser'
                  ? "Ex: Após análise administrativa, a submissão ainda não atende aos critérios da missão."
                  : "Ex: A imagem enviada não corresponde ao comprovante solicitado."
              }
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-gray-900 border-white/20 focus:ring-purple-500"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button onClick={handleReject} disabled={isProcessing} className="bg-red-600 hover:bg-red-700">
              {submission.status === 'returned_to_advertiser' 
                ? 'Confirmar Rejeição Definitiva' 
                : 'Confirmar Rejeição'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de visualização de anexos */}
      <AttachmentViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        files={normalizedFiles}
        onApprove={handleApprove}
        onReject={async (reason) => {
          if (reason) setRejectReason(reason);
          setIsRejectDialogOpen(true);
          setIsViewerOpen(false);
        }}
        userName={submission.user_name}
        missionTitle={submission.mission_title}
      />
    </div>
  );
};

export default SubmissionCard;
