
import { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DatesStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const DatesStep = ({ formData, updateFormData }: DatesStepProps) => {
  // Format today's date as YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">Data de Início</label>
        <Input
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
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Data de Término</label>
        <Input
          type="date"
          min={formData.startDate || today}
          value={formData.endDate}
          onChange={(e) => updateFormData("endDate", e.target.value)}
          className="bg-gray-800 border-gray-700 focus:border-neon-cyan w-full"
        />
      </div>

      <div className="flex items-center justify-between px-1 py-4 mt-4 border-t border-gray-700">
        <div className="space-y-1">
          <p className="text-sm font-medium">Bônus de Sequência</p>
          <p className="text-xs text-gray-400">
            Ofereça pontos adicionais para usuários que completarem a missão em dias consecutivos
          </p>
        </div>
        <Switch
          checked={formData.streakBonus}
          onCheckedChange={(checked) => updateFormData("streakBonus", checked)}
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

export default DatesStep;
