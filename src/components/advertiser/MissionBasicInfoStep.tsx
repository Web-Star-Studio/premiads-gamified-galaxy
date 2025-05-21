
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface BasicInfoStepProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  points: number;
  onPointsChange: (value: number) => void;
  deadline: string | null;
  onDeadlineChange: (value: string | null) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  points,
  onPointsChange,
  deadline,
  onDeadlineChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título da Missão*</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Complete a pesquisa de satisfação"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição*</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva detalhadamente o que os usuários precisam fazer"
          className="mt-1 h-24"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Missão*</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger id="type" className="mt-1">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="form">Formulário</SelectItem>
              <SelectItem value="photo">Foto</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
              <SelectItem value="checkin">Check-in</SelectItem>
              <SelectItem value="review">Avaliação</SelectItem>
              <SelectItem value="survey">Pesquisa</SelectItem>
              <SelectItem value="social">Compartilhamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="points">Pontos*</Label>
          <Input
            id="points"
            type="number"
            value={points}
            onChange={(e) => onPointsChange(Number(e.target.value))}
            min={10}
            max={1000}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="deadline">Data Limite (Opcional)</Label>
        <div className="mt-1">
          <DatePicker
            date={deadline ? new Date(deadline) : undefined}
            onSelect={(date) => onDeadlineChange(date ? date.toISOString() : null)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
