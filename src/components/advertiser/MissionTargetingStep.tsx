
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TargetingStepProps {
  businessType: string;
  onBusinessTypeChange: (value: string) => void;
  targetAudienceGender: string;
  onTargetAudienceGenderChange: (value: string) => void;
  targetAudienceAgeMin?: number;
  onTargetAudienceAgeMinChange: (value: number | undefined) => void;
  targetAudienceAgeMax?: number;
  onTargetAudienceAgeMaxChange: (value: number | undefined) => void;
  targetAudienceRegion: string;
  onTargetAudienceRegionChange: (value: string) => void;
}

export const TargetingStep: React.FC<TargetingStepProps> = ({
  businessType,
  onBusinessTypeChange,
  targetAudienceGender,
  onTargetAudienceGenderChange,
  targetAudienceAgeMin,
  onTargetAudienceAgeMinChange,
  targetAudienceAgeMax,
  onTargetAudienceAgeMaxChange,
  targetAudienceRegion,
  onTargetAudienceRegionChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Segmentação e Público-Alvo</h2>
        <p className="text-sm text-muted-foreground">
          Defina o tipo de negócio e o público-alvo para esta missão
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="business-type">Tipo de Negócio</Label>
          <Select value={businessType} onValueChange={onBusinessTypeChange}>
            <SelectTrigger id="business-type" className="mt-1">
              <SelectValue placeholder="Selecione o tipo de negócio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Varejo</SelectItem>
              <SelectItem value="restaurant">Restaurante/Alimentação</SelectItem>
              <SelectItem value="service">Serviços</SelectItem>
              <SelectItem value="technology">Tecnologia</SelectItem>
              <SelectItem value="health">Saúde/Beleza</SelectItem>
              <SelectItem value="education">Educação</SelectItem>
              <SelectItem value="entertainment">Entretenimento</SelectItem>
              <SelectItem value="travel">Viagens/Turismo</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Público-Alvo: Gênero</Label>
          <RadioGroup 
            value={targetAudienceGender} 
            onValueChange={onTargetAudienceGenderChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="gender-all" />
              <Label htmlFor="gender-all" className="cursor-pointer">Todos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="gender-male" />
              <Label htmlFor="gender-male" className="cursor-pointer">Masculino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="gender-female" />
              <Label htmlFor="gender-female" className="cursor-pointer">Feminino</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Público-Alvo: Faixa Etária</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age-min" className="text-sm text-muted-foreground">Idade Mínima</Label>
              <Input
                id="age-min"
                type="number"
                value={targetAudienceAgeMin || ""}
                onChange={(e) => onTargetAudienceAgeMinChange(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 18"
                min={0}
                max={100}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="age-max" className="text-sm text-muted-foreground">Idade Máxima</Label>
              <Input
                id="age-max"
                type="number"
                value={targetAudienceAgeMax || ""}
                onChange={(e) => onTargetAudienceAgeMaxChange(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 65"
                min={0}
                max={100}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="region">Público-Alvo: Região</Label>
          <Select value={targetAudienceRegion} onValueChange={onTargetAudienceRegionChange}>
            <SelectTrigger id="region" className="mt-1">
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              <SelectItem value="north">Norte</SelectItem>
              <SelectItem value="northeast">Nordeste</SelectItem>
              <SelectItem value="midwest">Centro-Oeste</SelectItem>
              <SelectItem value="southeast">Sudeste</SelectItem>
              <SelectItem value="south">Sul</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TargetingStep;
