
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface BasicInfoStepProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  ticketsReward: number;
  onTicketsRewardChange: (value: number) => void;
  cashbackReward: number;
  onCashbackRewardChange: (value: number) => void;
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
  ticketsReward,
  onTicketsRewardChange,
  cashbackReward,
  onCashbackRewardChange,
  deadline,
  onDeadlineChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Título da Missão *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Digite o título da missão"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva detalhadamente a missão"
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="type">Tipo da Missão *</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o tipo da missão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="review">Avaliação/Review</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="survey">Pesquisa</SelectItem>
            <SelectItem value="photo">Foto</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="form">Formulário</SelectItem>
            <SelectItem value="checkin">Check-in</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tickets">Tickets por Participação</Label>
          <Input
            id="tickets"
            type="number"
            value={ticketsReward}
            onChange={(e) => onTicketsRewardChange(Number(e.target.value))}
            placeholder="0"
            className="mt-1"
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="cashback">Cashback por Participação (R$)</Label>
          <Input
            id="cashback"
            type="number"
            step="0.01"
            value={cashbackReward}
            onChange={(e) => onCashbackRewardChange(Number(e.target.value))}
            placeholder="0.00"
            className="mt-1"
            min="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="deadline">Data Limite (Opcional)</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline || ''}
          onChange={(e) => onDeadlineChange(e.target.value || null)}
          className="mt-1"
        />
      </div>
    </div>
  );
};
