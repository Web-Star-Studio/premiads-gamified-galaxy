import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Save, Upload, X } from "lucide-react";
import { Mission } from "@/hooks/missions/types";
import { useSubmissionFileUpload } from "@/hooks/useSubmissionFileUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ensureString, safeRenderArray } from "@/utils/react-safe-render";

interface MissionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedMission: Mission | null;
  loading: boolean;
  onSubmitMission: (submissionData: any, status?: "in_progress" | "pending_approval") => Promise<boolean>;
}

const MissionDialog = ({
  isOpen,
  setIsOpen,
  selectedMission,
  loading,
  onSubmitMission
}: MissionDialogProps) => {
  const { toast } = useToast();
  const { uploadFiles } = useSubmissionFileUpload();
  
  const [formData, setFormData] = useState({
    content: "",
    files: [] as File[]
  });
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ content: "", files: [] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (asDraft: boolean = false) => {
    if (!selectedMission) return;
    
    setSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      let uploadedFiles: any[] = [];
      
      // Upload files if any
      if (formData.files.length > 0) {
        try {
          uploadedFiles = await uploadFiles(formData.files, user.id, selectedMission.id);
        } catch (uploadError) {
          console.error('Erro no upload dos arquivos:', uploadError);
          toast({
            title: 'Erro no upload',
            description: 'Não foi possível fazer upload dos arquivos. Tente novamente.',
            variant: 'destructive'
          });
          return;
        }
      }

      // Prepare submission data
      const submissionData = {
        content: formData.content,
        files: uploadedFiles
      };
      
      // Submit as draft or for approval
      const status = asDraft ? "in_progress" : "pending_approval";
      
      const success = await onSubmitMission(submissionData, status);
      
      if (success) {
        handleClose();
        toast({
          title: 'Submissão enviada',
          description: asDraft 
            ? 'Sua submissão foi salva como rascunho.' 
            : 'Sua submissão foi enviada para aprovação.',
        });
      }
    } catch (error: any) {
      console.error('Erro na submissão:', error);
      toast({
        title: 'Erro na submissão',
        description: error.message || 'Ocorreu um erro ao enviar sua submissão.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!selectedMission) return null;
  
  // Safe rendering using utility functions
  const titleValue = ensureString(selectedMission.title, "Missão sem título");
  const descriptionValue = ensureString(selectedMission.description, "Descrição não disponível");
  const requirements = safeRenderArray(selectedMission.requirements);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="bg-galaxy-darkPurple border-galaxy-purple max-w-lg"
        aria-describedby="mission-submission-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            {titleValue}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <p id="mission-submission-description" className="text-sm text-muted-foreground">
              {descriptionValue}
            </p>
            
            {requirements.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Requisitos:</h3>
                <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="text-gray-300">{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="submission-text" className="text-sm font-medium">
              Sua resposta:
            </label>
            <Textarea
              id="submission-text"
              placeholder="Descreva como você completou a missão..."
              value={formData.content}
              onChange={handleInputChange}
              className="min-h-[120px] bg-galaxy-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Anexos (opcional):
            </label>
            
            <div className="flex items-center">
              <label 
                htmlFor="file-upload" 
                className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md bg-galaxy-dark hover:bg-gray-800 transition-colors border border-dashed border-gray-600"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Selecionar arquivos</span>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
              {isUploading && (
                <div className="ml-2 flex items-center gap-2 text-sm text-gray-400">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Enviando...
                </div>
              )}
            </div>
            
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium">Arquivos selecionados:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 bg-galaxy-dark px-3 py-1.5 rounded-md text-xs"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button 
                        onClick={() => handleRemoveFile(index)}
                        className="p-0.5 rounded-full hover:bg-red-900/30 text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={submitting || isUploading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {submitting || isUploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar como rascunho
          </Button>
          
          <Button
            onClick={() => handleSubmit(false)}
            disabled={!formData.content || submitting || isUploading}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {submitting || isUploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Enviar para aprovação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDialog;
