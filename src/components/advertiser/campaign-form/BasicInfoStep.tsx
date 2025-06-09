
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormData } from './types';
import SurveyFormBuilder from './SurveyFormBuilder';

interface BasicInfoStepProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, updateFormData }) => {
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);

  const campaignTypes = [
    { value: 'enquete', label: 'Enquete' },
    { value: 'formulario', label: 'Formulário' },
    { value: 'foto', label: 'Foto' },
    { value: 'video', label: 'Vídeo' },
    { value: 'avaliacao', label: 'Avaliação' },
    { value: 'compartilhamento', label: 'Compartilhamento' },
    { value: 'cupom', label: 'Cupom' },
    { value: 'checkin', label: 'Check-in' },
    { value: 'outro', label: 'Outro' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">
            Título da Campanha *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Digite o título da sua campanha"
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-white">
            Descrição *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Descreva o que os participantes devem fazer"
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 min-h-[100px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-white">
            Tipo de Campanha *
          </Label>
          <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
            <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
              <SelectValue placeholder="Selecione o tipo de campanha" />
            </SelectTrigger>
            <SelectContent>
              {campaignTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="audience" className="text-white">
            Público-alvo
          </Label>
          <Select value={formData.audience} onValueChange={(value) => updateFormData('audience', value)}>
            <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
              <SelectValue placeholder="Selecione o público-alvo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              <SelectItem value="18-25">18-25 anos</SelectItem>
              <SelectItem value="26-35">26-35 anos</SelectItem>
              <SelectItem value="36-45">36-45 anos</SelectItem>
              <SelectItem value="46+">46+ anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(formData.type === 'formulario' || formData.type === 'enquete') && (
          <div>
            <Label className="text-white mb-2 block">
              Formulário Personalizado
            </Label>
            <Dialog open={isFormBuilderOpen} onOpenChange={setIsFormBuilderOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                >
                  {formData.formSchema.length > 0 
                    ? `${formData.formSchema.length} campos configurados` 
                    : 'Configurar Formulário'
                  }
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-galaxy-darkPurple border-galaxy-purple/50">
                <DialogHeader>
                  <DialogTitle className="text-white">Construtor de Formulário</DialogTitle>
                </DialogHeader>
                <SurveyFormBuilder
                  fields={formData.formSchema}
                  onChange={(fields) => updateFormData('formSchema', fields)}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;
