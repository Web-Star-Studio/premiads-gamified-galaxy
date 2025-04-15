
import { memo } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";

interface RewardsStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

/**
 * Mission rewards configuration step
 * Manages points, badges, and other reward options
 */
const RewardsStep = ({ formData, updateFormData }: RewardsStepProps) => {
  const minPoints = 10;
  const maxPoints = 200;
  const pointsStep = 5;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="points-slider" className="text-sm font-medium">Pontos</label>
          <div className="text-sm">
            <span className="mr-3 text-neon-cyan" aria-live="polite">
              {formData.pointsRange[0]} - {formData.pointsRange[1]}
            </span>
          </div>
        </div>
        <Slider
          id="points-slider"
          defaultValue={formData.pointsRange}
          min={minPoints}
          max={maxPoints}
          step={pointsStep}
          onValueChange={(value) => updateFormData("pointsRange", value)}
          className="py-4"
          aria-valuemin={minPoints}
          aria-valuemax={maxPoints}
          aria-valuenow={formData.pointsRange[1]}
          aria-valuetext={`${formData.pointsRange[0]} a ${formData.pointsRange[1]} pontos`}
        />
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium" id="random-points-label">Pontuação Aleatória</p>
          <p className="text-xs text-gray-400">Os usuários receberão pontos aleatórios dentro do intervalo</p>
        </div>
        <Switch
          id="random-points"
          checked={formData.randomPoints}
          onCheckedChange={(checked) => updateFormData("randomPoints", checked)}
          aria-labelledby="random-points-label"
        />
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium" id="badges-label">Badge Exclusivo</p>
          <p className="text-xs text-gray-400">Crie um badge para os usuários que completarem esta missão</p>
        </div>
        <Switch
          id="badges"
          checked={formData.hasBadges}
          onCheckedChange={(checked) => updateFormData("hasBadges", checked)}
          aria-labelledby="badges-label"
        />
      </div>

      <div className="flex items-center justify-between px-1 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium" id="lootbox-label">Loot Box</p>
          <p className="text-xs text-gray-400">Inclui uma chance de prêmio surpresa</p>
        </div>
        <Switch
          id="lootbox"
          checked={formData.hasLootBox}
          onCheckedChange={(checked) => updateFormData("hasLootBox", checked)}
          aria-labelledby="lootbox-label"
        />
      </div>
    </div>
  );
};

export default memo(RewardsStep);
