
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";

interface RewardsStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const RewardsStep = ({ formData, updateFormData }: RewardsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Pontos</label>
          <div className="text-sm">
            <span className="mr-3 text-neon-cyan">{formData.pointsRange[0]} - {formData.pointsRange[1]}</span>
          </div>
        </div>
        <Slider
          defaultValue={formData.pointsRange}
          min={10}
          max={200}
          step={5}
          onValueChange={(value) => updateFormData("pointsRange", value)}
          className="py-4"
        />
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Pontuação Aleatória</p>
          <p className="text-xs text-gray-400">Os usuários receberão pontos aleatórios dentro do intervalo</p>
        </div>
        <Switch
          checked={formData.randomPoints}
          onCheckedChange={(checked) => updateFormData("randomPoints", checked)}
        />
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Badge Exclusivo</p>
          <p className="text-xs text-gray-400">Crie um badge para os usuários que completarem esta missão</p>
        </div>
        <Switch
          checked={formData.hasBadges}
          onCheckedChange={(checked) => updateFormData("hasBadges", checked)}
        />
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Loot Box</p>
          <p className="text-xs text-gray-400">Inclui uma chance de prêmio surpresa</p>
        </div>
        <Switch
          checked={formData.hasLootBox}
          onCheckedChange={(checked) => updateFormData("hasLootBox", checked)}
        />
      </div>
    </div>
  );
};

export default RewardsStep;
