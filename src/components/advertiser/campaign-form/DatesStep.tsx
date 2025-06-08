
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FormData } from './types';

interface DatesStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const DatesStep: React.FC<DatesStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-white">Data de Início</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => updateFormData('startDate', new Date(e.target.value))}
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-white">Data de Término</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate.toISOString().split('T')[0]}
            onChange={(e) => updateFormData('endDate', new Date(e.target.value))}
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="maxParticipants" className="text-white">Máximo de Participantes</Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => updateFormData('maxParticipants', parseInt(e.target.value))}
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rifas" className="text-white">Rifas por Participação</Label>
          <Input
            id="rifas"
            type="number"
            value={formData.rifas}
            onChange={(e) => updateFormData('rifas', parseInt(e.target.value))}
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cashbackReward" className="text-white">Recompensa Cashback (%)</Label>
          <Input
            id="cashbackReward"
            type="number"
            step="0.01"
            value={formData.cashbackReward}
            onChange={(e) => updateFormData('cashbackReward', parseFloat(e.target.value))}
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPurchase" className="text-white">Compra Mínima (R$)</Label>
          <Input
            id="minPurchase"
            type="number"
            step="0.01"
            value={formData.minPurchase}
            onChange={(e) => updateFormData('minPurchase', parseFloat(e.target.value))}
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="streakBonus"
            checked={formData.streakBonus}
            onCheckedChange={(checked) => updateFormData('streakBonus', checked)}
          />
          <Label htmlFor="streakBonus" className="text-white">Ativar Bônus por Sequência</Label>
        </div>

        {formData.streakBonus && (
          <div className="space-y-2">
            <Label htmlFor="streakMultiplier" className="text-white">Multiplicador de Sequência</Label>
            <Input
              id="streakMultiplier"
              type="number"
              step="0.1"
              value={formData.streakMultiplier}
              onChange={(e) => updateFormData('streakMultiplier', parseFloat(e.target.value))}
              className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasBadges"
            checked={formData.hasBadges}
            onCheckedChange={(checked) => updateFormData('hasBadges', checked)}
          />
          <Label htmlFor="hasBadges" className="text-white">Incluir Badges</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hasLootBox"
            checked={formData.hasLootBox}
            onCheckedChange={(checked) => updateFormData('hasLootBox', checked)}
          />
          <Label htmlFor="hasLootBox" className="text-white">Incluir Loot Box</Label>
        </div>
      </div>
    </div>
  );
};

export default DatesStep;
