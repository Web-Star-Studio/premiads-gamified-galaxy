
import { Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";

interface DatesStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const DatesStep = ({ formData, updateFormData }: DatesStepProps) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Início</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData("startDate", e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data de Término</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData("endDate", e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Bônus de Streak</p>
          <p className="text-xs text-gray-400">Recompensas extras por dias consecutivos</p>
        </div>
        <Switch
          checked={formData.streakBonus}
          onCheckedChange={(checked) => updateFormData("streakBonus", checked)}
        />
      </div>

      {formData.streakBonus && (
        <div className="p-4 border border-neon-pink/30 rounded-md bg-neon-pink/5">
          <p className="text-sm">Configurar bônus de streak</p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="p-2 text-center border border-gray-700 rounded-md bg-gray-800/50">
              <p className="text-xs text-gray-400">3 dias</p>
              <p className="font-medium">+10%</p>
            </div>
            <div className="p-2 text-center border border-gray-700 rounded-md bg-gray-800/50">
              <p className="text-xs text-gray-400">5 dias</p>
              <p className="font-medium">+25%</p>
            </div>
            <div className="p-2 text-center border border-gray-700 rounded-md bg-gray-800/50">
              <p className="text-xs text-gray-400">7 dias</p>
              <p className="font-medium">+50%</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border border-gray-700 rounded-md bg-gray-800/50 mt-4">
        <p className="text-sm font-medium mb-2">Resumo da Campanha</p>
        <div className="space-y-1 text-sm">
          <p>Tipo: <span className="text-neon-cyan">{formData.type || "Não selecionado"}</span></p>
          <p>Público: <span className="text-neon-cyan">{formData.audience || "Não selecionado"}</span></p>
          <p>Pontos: <span className="text-neon-cyan">{formData.pointsRange[0]} - {formData.pointsRange[1]}</span></p>
          <p>Extras: 
            <span className="text-neon-cyan">
              {[
                formData.randomPoints ? "Pontos aleatórios" : "",
                formData.hasBadges ? "Badge exclusivo" : "",
                formData.hasLootBox ? "Loot box" : "",
                formData.streakBonus ? "Bônus de streak" : ""
              ].filter(Boolean).join(", ") || "Nenhum"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatesStep;
