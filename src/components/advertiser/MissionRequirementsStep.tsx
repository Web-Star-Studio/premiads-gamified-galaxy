
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface RequirementsStepProps {
  requirements: string[];
  onRequirementsChange: (requirements: string[]) => void;
}

export const RequirementsStep: React.FC<RequirementsStepProps> = ({
  requirements,
  onRequirementsChange
}) => {
  const addRequirement = () => {
    onRequirementsChange([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements.splice(index, 1);
    onRequirementsChange(updatedRequirements);
  };

  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    onRequirementsChange(updatedRequirements);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Requisitos da Missão*</Label>
        <p className="text-sm text-muted-foreground">
          Enumere os requisitos específicos que o usuário precisa cumprir para completar esta missão
        </p>
      </div>

      <div className="space-y-4">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={requirement}
              onChange={(e) => updateRequirement(index, e.target.value)}
              placeholder={`Requisito ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeRequirement(index)}
              disabled={requirements.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addRequirement}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Requisito
        </Button>
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Dicas para bons requisitos:</h4>
        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
          <li>Seja específico e claro sobre o que é esperado</li>
          <li>Inclua qualquer restrição ou formato exigido</li>
          <li>Mencione os detalhes que serão avaliados</li>
          <li>Se necessário, inclua dicas ou exemplos</li>
        </ul>
      </div>
    </div>
  );
};

export default RequirementsStep;
