
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import ImageUploader from "@/components/ui/ImageUploader";

interface MissionSubmissionFormProps {
  mission: {
    id: string;
    title: string;
    type: string;
    requirements?: string[];
  };
  onSubmit: (missionId: string, data: any, status: "in_progress" | "pending_approval") => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MissionSubmissionForm = ({ 
  mission, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: MissionSubmissionFormProps) => {
  const [formData, setFormData] = useState({
    photos: [] as string[],
    description: "",
    links: "",
    additionalInfo: ""
  });

  const { toast } = useToast();
  const { playSound } = useSounds();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Por favor, adicione uma descrição da sua submissão.",
        variant: "destructive"
      });
      return;
    }

    // For photo missions, require at least one photo
    if (mission.type === "photo" && formData.photos.length === 0) {
      toast({
        title: "Foto obrigatória",
        description: "Para missões de foto, é necessário enviar pelo menos uma imagem.",
        variant: "destructive"
      });
      return;
    }

    const success = await onSubmit(mission.id, formData, "pending_approval");
    
    if (success) {
      playSound("success");
      setFormData({
        photos: [],
        description: "",
        links: "",
        additionalInfo: ""
      });
    }
  };

  const handleCancel = () => {
    playSound("pop");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Submeter Missão: {mission.title}
        </h3>
        <p className="text-sm text-gray-400">
          Preencha os campos abaixo para enviar sua participação na missão.
        </p>
      </div>

      {/* Photo Upload for photo missions */}
      {mission.type === "photo" && (
        <div className="space-y-2">
          <Label htmlFor="photos" className="text-white">
            Fotos <span className="text-red-400">*</span>
          </Label>
          <ImageUploader
            onImagesChange={(images) => 
              setFormData(prev => ({ ...prev, photos: images }))
            }
            maxImages={5}
            accept="image/*"
          />
          <p className="text-xs text-gray-400">
            Envie até 5 fotos relacionadas à missão (PNG, JPG, JPEG)
          </p>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Descrição <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Descreva como você completou a missão..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="min-h-[100px] bg-galaxy-darkPurple border-galaxy-purple text-white"
          required
        />
      </div>

      {/* Links */}
      <div className="space-y-2">
        <Label htmlFor="links" className="text-white">
          Links (opcional)
        </Label>
        <Input
          id="links"
          type="url"
          placeholder="https://..."
          value={formData.links}
          onChange={(e) => setFormData(prev => ({ ...prev, links: e.target.value }))}
          className="bg-galaxy-darkPurple border-galaxy-purple text-white"
        />
        <p className="text-xs text-gray-400">
          Adicione links relevantes para comprovar a missão
        </p>
      </div>

      {/* Additional Info */}
      <div className="space-y-2">
        <Label htmlFor="additionalInfo" className="text-white">
          Informações Adicionais (opcional)
        </Label>
        <Textarea
          id="additionalInfo"
          placeholder="Informações extras que considera relevantes..."
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          className="min-h-[80px] bg-galaxy-darkPurple border-galaxy-purple text-white"
        />
      </div>

      {/* Requirements */}
      {mission.requirements && mission.requirements.length > 0 && (
        <div className="p-4 bg-galaxy-darkPurple/40 rounded-lg border border-galaxy-purple/20">
          <h4 className="text-sm font-medium text-white mb-2">Requisitos da Missão:</h4>
          <ul className="space-y-1">
            {mission.requirements.map((requirement, index) => (
              <li key={index} className="text-xs text-gray-300 flex items-start">
                <span className="text-neon-cyan mr-2">•</span>
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan/80 hover:to-neon-blue/80"
        >
          {isSubmitting ? "Enviando..." : "Enviar Submissão"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex-1 border-galaxy-purple text-white hover:bg-galaxy-purple/20"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default MissionSubmissionForm;
