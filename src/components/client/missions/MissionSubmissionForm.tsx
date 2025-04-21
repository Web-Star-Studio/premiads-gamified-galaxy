
import React, { useState } from "react";
import { Camera, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mission } from "@/hooks/useMissions";
import { useToast } from "@/hooks/use-toast";
import { MissionType } from "@/hooks/useMissionsTypes";
import { uploadFile } from "@/integrations/supabase/client";

interface MissionSubmissionFormProps {
  mission: Mission | null;
  loading: boolean;
  onSubmit: (submissionData: any) => void;
}

const MissionSubmissionForm = ({ mission, loading, onSubmit }: MissionSubmissionFormProps) => {
  const [missionAnswer, setMissionAnswer] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  if (!mission) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeInBytes = mission.type === "photo" ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
    if (file.size > maxSizeInBytes) {
      const maxSizeMB = maxSizeInBytes / (1024 * 1024);
      toast({
        title: "Arquivo muito grande",
        description: `O tamanho máximo permitido é ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    
    const validTypes = mission.type === "photo" ? validImageTypes : validVideoTypes;
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: mission.type === "photo" 
          ? "Por favor, envie uma imagem nos formatos JPG, PNG ou GIF." 
          : "Por favor, envie um vídeo nos formatos MP4, MOV ou WEBM.",
        variant: "destructive",
      });
      return;
    }

    // Set file for later upload
    setSelectedFile(file);

    // Create and set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    setIsUploading(false);
    setUploadProgress(0);
    
    try {
      // Prepare submission data based on mission type
      let submissionData: any = {};
      
      if (mission.type === "form" || mission.type === "survey") {
        if (!missionAnswer.trim()) {
          toast({
            title: "Resposta necessária",
            description: "Por favor, forneça uma resposta para esta missão.",
            variant: "destructive",
          });
          return;
        }
        submissionData = { answer: missionAnswer };
      } 
      else if (mission.type === "photo" || mission.type === "video") {
        if (!selectedFile) {
          toast({
            title: "Arquivo necessário",
            description: "Por favor, envie uma imagem ou vídeo para concluir esta missão.",
            variant: "destructive",
          });
          return;
        }
        
        setIsUploading(true);
        
        // Generate a unique file path
        const timestamp = Date.now();
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${mission.type}_${timestamp}.${fileExt}`;
        const filePath = `mission_submissions/${mission.id}/${fileName}`;
        
        // Upload to Supabase Storage
        const { path, error } = await uploadFile('mission-media', filePath, selectedFile);
        
        if (error) {
          throw error;
        }
        
        setIsUploading(false);
        setUploadProgress(100);
        
        submissionData = { mediaUrl: path, fileName: selectedFile.name, fileType: selectedFile.type };
      } 
      else if (mission.type === "social" || mission.type === "social_share") {
        if (!missionAnswer.trim()) {
          toast({
            title: "Link necessário",
            description: "Por favor, insira o link da sua postagem nas redes sociais.",
            variant: "destructive",
          });
          return;
        }
        
        // Validate URL format
        try {
          new URL(missionAnswer);
        } catch (err) {
          toast({
            title: "Link inválido",
            description: "Por favor, insira um link válido de uma postagem nas redes sociais.",
            variant: "destructive",
          });
          return;
        }
        
        submissionData = { shareLink: missionAnswer };
      }
      
      onSubmit(submissionData);
    } catch (error) {
      console.error("Error submitting mission:", error);
      setIsUploading(false);
      
      toast({
        title: "Erro ao enviar missão",
        description: "Ocorreu um erro ao enviar sua missão. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 my-4">
      {(mission.type === "form" || mission.type === "survey") && (
        <div className="space-y-2">
          <Label htmlFor="answer">Sua resposta</Label>
          <Textarea 
            id="answer"
            placeholder="Digite sua resposta aqui..."
            className="min-h-[150px]"
            value={missionAnswer}
            onChange={(e) => setMissionAnswer(e.target.value)}
          />
        </div>
      )}
      
      {(mission.type === "photo" || mission.type === "video") && (
        <div className="space-y-2">
          <Label>Enviar {mission.type === "photo" ? "foto" : "vídeo"}</Label>
          {imagePreview ? (
            <div className="relative">
              {mission.type === "photo" ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-[200px] w-full object-cover rounded-md" 
                />
              ) : (
                <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-center text-sm">
                    Vídeo selecionado: {selectedFile?.name}
                  </p>
                </div>
              )}
              <Button 
                variant="destructive" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={handleClearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center">
              <Camera className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer text-neon-cyan hover:underline">
                  Clique para enviar
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={mission.type === "photo" ? "image/*" : "video/*"}
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {mission.type === "photo" 
                  ? "PNG, JPG ou GIF até 5MB" 
                  : "MP4 ou MOV até 50MB"}
              </p>
            </div>
          )}
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-neon-cyan h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-gray-400 mt-1">Enviando arquivo...</p>
            </div>
          )}
          
          {mission.type === "photo" && (
            <p className="text-sm text-gray-400">
              Dica: Certifique-se de que a foto esteja bem iluminada e claramente mostrando o produto.
            </p>
          )}
        </div>
      )}
      
      {(mission.type === "social" || mission.type === "social_share") && (
        <div className="space-y-2">
          <Label htmlFor="share-link">Link da postagem</Label>
          <Input
            id="share-link"
            placeholder="Cole o link da sua postagem aqui..."
            value={missionAnswer}
            onChange={(e) => setMissionAnswer(e.target.value)}
          />
          <p className="text-sm text-gray-400">
            Cole o link da sua postagem nas redes sociais contendo a hashtag solicitada.
          </p>
        </div>
      )}
      
      {(mission.type === "checkin" || mission.type === "visit") && (
        <div className="space-y-2">
          <Label>Check-in na loja</Label>
          <div className="bg-galaxy-deepPurple/80 rounded-md p-4">
            <p className="text-center">
              Pressione o botão abaixo para realizar check-in usando sua localização atual
            </p>
            <Button className="w-full mt-4">
              <MapPin className="w-4 h-4 mr-2" />
              Fazer Check-in
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-2 pt-4">
        <Checkbox 
          id="terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Declaro que li e concordo com os termos de submissão
          </Label>
          <p className="text-sm text-gray-400">
            Autorizo o uso do conteúdo enviado para fins promocionais.
          </p>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => onSubmit(null)}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={
            (!(mission.type === "checkin" || mission.type === "visit") && 
             !missionAnswer && !imagePreview) || 
            !agreedToTerms || 
            loading ||
            isUploading
          }
        >
          {loading || isUploading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
};

export default MissionSubmissionForm;
