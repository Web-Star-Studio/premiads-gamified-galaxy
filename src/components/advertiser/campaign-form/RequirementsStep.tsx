import { memo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormData } from "./types";

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
            placeholder="Ex: Enviar foto com o produto"
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
      
      <div className="bg-blue-900/30 border border-blue-600/30 rounded-md p-4">
        <h4 className="text-sm font-medium mb-2">Dicas:</h4>
        <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
          <li>Seja claro sobre o que os usuários precisam fazer</li>
          <li>Especifique quaisquer condições especiais (ex: horário, local)</li>
          <li>Defina os critérios de aceitação para aprovação da missão</li>
          <li>Considere adicionar requisitos específicos para o tipo de missão selecionado</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(RequirementsStep);
