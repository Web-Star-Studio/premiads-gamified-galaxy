
import { memo, useMemo } from "react";
import { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DatesStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

/**
 * Campaign dates configuration step
 * Manages start/end dates and streak bonus options
 */
const DatesStep = ({ formData, updateFormData }: DatesStepProps) => {
  // Format today's date as YYYY-MM-DD for min attribute
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  // Check if end date is before start date
  const hasDateError = formData.startDate && formData.endDate && formData.startDate > formData.endDate;
  
  // Calculate campaign duration in days
  const durationInDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return null;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start date
  }, [formData.startDate, formData.endDate]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="start-date" className="text-sm font-medium">Data de Início</label>
        <Input
          id="start-date"
          type="date"
          min={today}
          value={formData.startDate}
          onChange={(e) => {
            updateFormData("startDate", e.target.value);
            // If end date is before start date, update end date
            if (formData.endDate && e.target.value > formData.endDate) {
              updateFormData("endDate", e.target.value);
            }
          }}
          className="bg-gray-800 border-gray-700 focus:border-neon-cyan w-full"
          aria-required="true"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="end-date" className="text-sm font-medium">Data de Término</label>
        <Input
          id="end-date"
          type="date"
          min={formData.startDate || today}
          value={formData.endDate}
          onChange={(e) => updateFormData("endDate", e.target.value)}
          className="bg-gray-800 border-gray-700 focus:border-neon-cyan w-full"
          aria-required="true"
        />
      </div>

      {hasDateError && (
        <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-200">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            A data de término não pode ser anterior à data de início.
          </AlertDescription>
        </Alert>
      )}
      
      {!hasDateError && durationInDays && (
        <p className="text-sm text-gray-300">
          Duração da campanha: <span className="text-neon-cyan">{durationInDays}</span> {durationInDays === 1 ? 'dia' : 'dias'}
        </p>
      )}

      <div className="flex items-center justify-between px-1 py-4 mt-4 border-t border-gray-700">
        <div className="space-y-1">
          <p className="text-sm font-medium" id="streak-label">Bônus de Sequência</p>
          <p className="text-xs text-gray-400">
            Ofereça pontos adicionais para usuários que completarem a missão em dias consecutivos
          </p>
        </div>
        <Switch
          id="streak"
          checked={formData.streakBonus}
          onCheckedChange={(checked) => updateFormData("streakBonus", checked)}
          aria-labelledby="streak-label"
        />
      </div>

      <div className="bg-neon-cyan/10 border border-neon-cyan/30 p-4 rounded-md mt-4">
        <h4 className="text-sm font-medium mb-2">Resumo da Missão</h4>
        <ul className="text-xs space-y-2 text-gray-300">
          <li><span className="text-gray-400">Nome:</span> {formData.title || "Não definido"}</li>
          <li><span className="text-gray-400">Tipo:</span> {formData.type || "Não definido"}</li>
          <li><span className="text-gray-400">Requisitos:</span> {formData.requirements.length > 0 ? 
            `${formData.requirements.length} requisito(s)` : "Nenhum definido"}</li>
          <li><span className="text-gray-400">Pontos:</span> {formData.pointsRange[0] === formData.pointsRange[1] ? 
            formData.pointsRange[0] : `${formData.pointsRange[0]}-${formData.pointsRange[1]}`}</li>
          <li><span className="text-gray-400">Duração:</span> {formData.startDate && formData.endDate ? 
            `${formData.startDate} até ${formData.endDate}` : "Não definida"}</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(DatesStep);
