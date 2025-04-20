
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
  const [formData, setFormData] = useState({
    content: "",
    files: [] as File[],
    saveAsDraft: false
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Handle dialog close
  const handleClose = () => {
    if (submitting) return;
    setIsOpen(false);
    setFormData({ content: "", files: [], saveAsDraft: false });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...selectedFiles]
      }));
    }
  };
  
  // Remove a file from the selection
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
    
    // Prepare submission data
    const submissionData = {
      content: formData.content,
      files: formData.files.map(file => file.name) // In a real app, we'd upload the files
    };
    
    // Submit as draft or for approval
    const status = asDraft ? "in_progress" : "pending_approval";
    
    try {
      const success = await onSubmitMission(submissionData, status);
      
      if (success) {
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!selectedMission) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-galaxy-darkPurple border-galaxy-purple max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            {selectedMission.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {selectedMission.description}
            </p>
            
            {selectedMission.requirements && selectedMission.requirements.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Requisitos:</h3>
                <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                  {selectedMission.requirements.map((req, index) => (
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
            disabled={submitting}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {submitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar como rascunho
          </Button>
          
          <Button
            onClick={() => handleSubmit(false)}
            disabled={!formData.content || submitting}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {submitting ? (
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
