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
 * Manages start/end dates and mission duration options
 */
const DatesStep = ({ formData, updateFormData }: DatesStepProps) => {
  // Format today's date as YYYY-MM-DD for min attribute
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  // Convert dates to string format if they are Date objects
  const startDateStr = typeof formData.startDate === 'string' ? formData.startDate : 
    formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : '';
  
  const endDateStr = typeof formData.endDate === 'string' ? formData.endDate : 
    formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : '';
  
  // Check if end date is before start date
  const hasDateError = startDateStr && endDateStr && startDateStr > endDateStr;
  
  // Calculate campaign duration in days
  const durationInDays = useMemo(() => {
    if (!startDateStr || !endDateStr) return null;
    
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start date
  }, [startDateStr, endDateStr]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="start-date" className="text-sm font-medium">Data de Início</label>
        <Input
          id="start-date"
          type="date"
          min={today}
          value={startDateStr}
          onChange={(e) => {
            updateFormData("startDate", e.target.value);
            // If end date is before start date, update end date
            if (endDateStr && e.target.value > endDateStr) {
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
          min={startDateStr || today}
          value={endDateStr}
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



      <div className="bg-neon-cyan/10 border border-neon-cyan/30 p-4 rounded-md mt-4">
        <h4 className="text-sm font-medium mb-2">Resumo da Missão</h4>
        <ul className="text-xs space-y-2 text-gray-300">
          <li><span className="text-gray-400">Nome:</span> {formData.title || "Não definido"}</li>
          <li><span className="text-gray-400">Tipo:</span> {formData.type || "Não definido"}</li>
          <li><span className="text-gray-400">Requisitos:</span> {Array.isArray(formData.requirements) && formData.requirements.length > 0 ? 
            `${formData.requirements.length} requisito(s)` : "Nenhum definido"}</li>
          <li><span className="text-gray-400">Pontos:</span> {formData.pointsRange[0] === formData.pointsRange[1] ? 
            formData.pointsRange[0] : `${formData.pointsRange[0]}-${formData.pointsRange[1]}`}</li>
          <li><span className="text-gray-400">Duração:</span> {startDateStr && endDateStr ? 
            `${startDateStr} até ${endDateStr}` : "Não definida"}</li>

          
          {/* Display target audience filters if any are set */}
          {formData.targetFilter && (
            <li className="mt-1">
              <span className="text-gray-400">Filtros de público:</span>
              <ul className="ml-4 mt-1 space-y-1 list-disc">
                {formData.targetFilter.age?.length > 0 && (
                  <li>Faixa etária: {formData.targetFilter.age.join(', ')}</li>
                )}
                {formData.targetFilter.region?.length > 0 && (
                  <li>Regiões: {formData.targetFilter.region.join(', ')}</li>
                )}
                {formData.targetFilter.interests?.length > 0 && (
                  <li>Interesses: {formData.targetFilter.interests.join(', ')}</li>
                )}
                {formData.targetFilter.gender && formData.targetFilter.gender !== 'all' && (
                  <li>Gênero: {formData.targetFilter.gender === 'male' ? 'Masculino' : 'Feminino'}</li>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default memo(DatesStep);
