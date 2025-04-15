
import { useState, useCallback, memo } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { FormData, MissionType, missionTypeLabels } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RequirementsStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

/**
 * Helper function to get mission-specific requirement placeholder text
 */
const getRequirementPlaceholder = (type: MissionType | ""): string => {
  switch (type) {
    case "form":
      return "URL do formulário a ser preenchido";
    case "photo":
      return "Descrição da foto necessária (ex: 'Selfie com o produto')";
    case "video":
      return "Descrição do vídeo necessário (ex: 'Review em vídeo de 30s')";
    case "checkin":
      return "Nome ou endereço do local para check-in";
    case "social":
      return "Hashtag ou menção necessária (ex: #MarcaIncrivel)";
    case "coupon":
      return "Código do cupom ou nome da promoção";
    case "survey":
      return "URL ou descrição da pesquisa";
    case "review":
      return "Plataforma para avaliação (ex: Google, TripAdvisor)";
    default:
      return "Adicione um requisito para a missão";
  }
};

/**
 * Mission requirements configuration step
 * Manages the list of requirements based on mission type
 */
const RequirementsStep = ({ formData, updateFormData }: RequirementsStepProps) => {
  const [newRequirement, setNewRequirement] = useState("");
  const [inputError, setInputError] = useState("");
  const maxRequirements = 5;
  const minRequirementLength = 5;
  const maxRequirementLength = 100;

  /**
   * Add a new requirement to the list if valid
   */
  const handleAddRequirement = useCallback(() => {
    // Validate input
    if (!newRequirement.trim()) {
      setInputError("O requisito não pode estar vazio");
      return;
    }
    
    if (newRequirement.trim().length < minRequirementLength) {
      setInputError(`O requisito deve ter pelo menos ${minRequirementLength} caracteres`);
      return;
    }
    
    if (formData.requirements.length >= maxRequirements) {
      setInputError(`Máximo de ${maxRequirements} requisitos atingido`);
      return;
    }
    
    if (formData.requirements.includes(newRequirement.trim())) {
      setInputError("Este requisito já foi adicionado");
      return;
    }
    
    // Clear error and add requirement
    setInputError("");
    const updatedRequirements = [...formData.requirements, newRequirement.trim()];
    updateFormData("requirements", updatedRequirements);
    setNewRequirement("");
  }, [newRequirement, formData.requirements, updateFormData]);

  /**
   * Remove a requirement from the list
   */
  const handleRemoveRequirement = useCallback((index: number) => {
    const updatedRequirements = formData.requirements.filter((_, i) => i !== index);
    updateFormData("requirements", updatedRequirements);
  }, [formData.requirements, updateFormData]);

  /**
   * Handle keyboard events on the input field
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRequirement();
    }
  }, [handleAddRequirement]);

  /**
   * Handle input changes and clear errors when typing
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRequirement(e.target.value);
    if (inputError) setInputError("");
  }, [inputError]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          Requisitos da Missão: {formData.type ? missionTypeLabels[formData.type as MissionType] || "" : ""}
        </h3>
        <p className="text-sm text-gray-400">
          Defina os requisitos específicos que os usuários devem cumprir para completar esta missão.
          {maxRequirements && (
            <span className="ml-1">
              (Máximo: {maxRequirements} requisitos)
            </span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            id="new-requirement"
            value={newRequirement}
            onChange={handleInputChange}
            placeholder={formData.type ? getRequirementPlaceholder(formData.type) : "Adicione um requisito"}
            className="flex-1 bg-gray-800 border-gray-700 focus:border-neon-cyan"
            onKeyDown={handleKeyDown}
            maxLength={maxRequirementLength}
            aria-invalid={!!inputError}
            aria-describedby={inputError ? "requirement-error" : undefined}
          />
          <Button 
            onClick={handleAddRequirement}
            disabled={!newRequirement.trim() || formData.requirements.length >= maxRequirements}
            size="icon"
            className="bg-neon-cyan/80 hover:bg-neon-cyan"
            aria-label="Adicionar requisito"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {inputError && (
          <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-200 py-2 px-3">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription id="requirement-error">
              {inputError}
            </AlertDescription>
          </Alert>
        )}
        
        {!inputError && newRequirement.length > 0 && (
          <p className="text-xs text-gray-400">
            {newRequirement.length}/{maxRequirementLength} caracteres
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Requisitos Atuais</h4>
        
        {formData.requirements.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              Nenhum requisito adicionado. Adicione pelo menos um requisito acima.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Lista de requisitos">
            {formData.requirements.map((requirement, index) => (
              <li 
                key={index} 
                className="flex items-center justify-between bg-gray-800 p-3 rounded-md border border-gray-700"
              >
                <span className="text-sm">{requirement}</span>
                <Button
                  onClick={() => handleRemoveRequirement(index)}
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700"
                  aria-label={`Remover requisito: ${requirement}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {formData.type === "social" && (
        <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-md">
          <h4 className="text-sm font-medium mb-2">Dicas para Missões de Redes Sociais:</h4>
          <ul className="text-xs space-y-1 text-gray-300 list-disc pl-4">
            <li>Adicione hashtags específicas para rastrear as menções</li>
            <li>Especifique a plataforma (Instagram, Facebook, Twitter, etc.)</li>
            <li>Seja claro sobre o tipo de conteúdo esperado (foto, vídeo, texto)</li>
          </ul>
        </div>
      )}

      {formData.type === "checkin" && (
        <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-md">
          <h4 className="text-sm font-medium mb-2">Dicas para Missões de Check-in:</h4>
          <ul className="text-xs space-y-1 text-gray-300 list-disc pl-4">
            <li>Forneça o endereço completo do local</li>
            <li>Especifique o horário de funcionamento, se relevante</li>
            <li>Adicione detalhes sobre como comprovar a visita</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(RequirementsStep);
