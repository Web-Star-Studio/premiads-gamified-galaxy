import { memo, useState, useEffect } from "react";
import { Plus, X, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormData } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { missionTypeLabels } from "@/hooks/useMissionsTypes";

interface RequirementsStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

/**
 * Mission requirements configuration step
 * Manages requirements needed for mission completion
 */
const RequirementsStep = ({ formData, updateFormData }: RequirementsStepProps) => {
  const [newRequirement, setNewRequirement] = useState("");
  
  // Always ensure requirements is an array
  const requirementsArray = Array.isArray(formData.requirements) 
    ? formData.requirements 
    : formData.requirements ? [formData.requirements] : [];

  const handleAddRequirement = () => {
    if (newRequirement.trim() === "") return;
    
    const updatedRequirements = [...requirementsArray, newRequirement.trim()];
    updateFormData("requirements", updatedRequirements);
    setNewRequirement("");
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = requirementsArray.filter((_, i) => i !== index);
    updateFormData("requirements", updatedRequirements);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  // Get mission type specific placeholder text and tips
  const getTypePlaceholder = () => {
    if (!formData.type) return "Ex: Enviar foto com o produto";
    
    const placeholders: Record<string, string> = {
      photo: "Ex: Enviar foto usando o produto",
      video: "Ex: Gravar um vídeo de unboxing do produto",
      form: "Ex: Preencher formulário de cadastro",
      checkin: "Ex: Fazer check-in na loja física",
      social: "Ex: Postar no Instagram com a hashtag #marca",
      coupon: "Ex: Usar cupom de desconto GALAXY10",
      survey: "Ex: Responder pesquisa de satisfação",
      review: "Ex: Avaliar produto na loja online"
    };
    
    return placeholders[formData.type] || "Ex: Enviar foto com o produto";
  };

  // Type-specific requirement tips
  const getTypeTips = () => {
    if (!formData.type) return [];
    
    const tips: Record<string, string[]> = {
      photo: [
        "Especifique a qualidade mínima da foto (resolução)",
        "Indique se precisa mostrar o rosto do usuário ou não",
        "Liste elementos que devem aparecer na imagem"
      ],
      video: [
        "Defina a duração máxima do vídeo",
        "Especifique se é necessário áudio",
        "Indique quaisquer elementos obrigatórios no vídeo"
      ],
      form: [
        "Liste os campos principais que devem ser preenchidos",
        "Adicione o link para o formulário",
        "Indique se é necessário enviar comprovante"
      ],
      checkin: [
        "Especifique o endereço exato do check-in",
        "Defina o raio de proximidade necessário",
        "Indique horário de funcionamento do local"
      ],
      social: [
        "Especifique as redes sociais permitidas",
        "Liste hashtags obrigatórias",
        "Defina se precisa marcar perfis específicos"
      ],
      coupon: [
        "Forneça o código do cupom",
        "Especifique valor mínimo de compra (se houver)",
        "Indique período de validade do cupom"
      ],
      survey: [
        "Forneça o link para a pesquisa",
        "Estime o tempo para preenchimento",
        "Especifique se todas as perguntas são obrigatórias"
      ],
      review: [
        "Indique as plataformas onde a avaliação deve ser feita",
        "Especifique a extensão mínima da avaliação",
        "Defina se é necessário incluir fotos/vídeos na avaliação"
      ]
    };
    
    return tips[formData.type] || [];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="requirement" className="text-sm font-medium">Requisitos da Missão</label>
        <p className="text-xs text-gray-400">
          Adicione os requisitos que o usuário precisa cumprir para completar essa missão.
        </p>
        
        <div className="flex space-x-2">
          <Input
            id="requirement"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getTypePlaceholder()}
            className="bg-gray-800 border-gray-700 focus:border-neon-cyan flex-1"
          />
          <Button 
            onClick={handleAddRequirement}
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            disabled={newRequirement.trim() === ""}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {requirementsArray.length > 0 ? (
        <div className="space-y-4">
          <label className="text-sm font-medium">Requisitos Adicionados</label>
          
          <div className="flex flex-wrap gap-2">
            {requirementsArray.map((requirement, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-galaxy-purple/10 border-galaxy-purple/30 text-white py-1.5 pl-3 pr-2"
              >
                {requirement}
                <button
                  onClick={() => handleRemoveRequirement(index)}
                  className="ml-2 p-0.5 rounded-full bg-gray-700/50 hover:bg-red-500/30 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-md p-4 text-center">
          <p className="text-sm text-gray-400">
            Nenhum requisito adicionado. Adicione pelo menos um requisito para esta missão.
          </p>
        </div>
      )}
      
      {formData.type && (
        <Card className="bg-blue-900/30 border border-blue-600/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Dicas para missões de {missionTypeLabels[formData.type]}:
                </h4>
                <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                  {getTypeTips().map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                  <li>Seja claro sobre o que os usuários precisam fazer</li>
                  <li>Especifique quaisquer condições especiais (ex: horário, local)</li>
                  <li>Defina os critérios de aceitação para aprovação da missão</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(RequirementsStep);
