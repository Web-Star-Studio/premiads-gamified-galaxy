import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from './types';
import { Trash2, Plus } from 'lucide-react';

interface SurveyFormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const SurveyFormBuilder: React.FC<SurveyFormBuilderProps> = ({ fields, onChange }) => {
  const [newField, setNewField] = useState<Partial<FormField>>({
    label: '',
    type: 'text',
    required: false
  });

  const addField = () => {
    if (newField.label) {
      const field: FormField = {
        id: Date.now().toString(),
        label: newField.label,
        type: newField.type || 'text',
        required: newField.required || false,
        options: newField.options
      };
      onChange([...fields, field]);
      setNewField({ label: '', type: 'text', required: false });
    }
  };

  const removeField = (id: string) => {
    onChange(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Formulário Personalizado</h3>
      
      {/* Display existing fields */}
      {fields.map((field) => (
        <div key={field.id} className="p-4 border border-galaxy-purple/30 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <Input
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 mb-2"
                placeholder="Label do campo"
              />
              <Select
                value={field.type}
                onValueChange={(value) => updateField(field.id, { type: value as FormField['type'] })}
              >
                <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="textarea">Texto Longo</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                  <SelectItem value="radio">Múltipla Escolha</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeField(field.id)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Add new field */}
      <div className="p-4 border border-galaxy-purple/30 rounded-lg bg-galaxy-deepPurple/20">
        <Label className="text-white mb-2 block">Adicionar Novo Campo</Label>
        <div className="space-y-2">
          <Input
            value={newField.label || ''}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            placeholder="Label do campo"
            className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
          />
          <Select
            value={newField.type || 'text'}
            onValueChange={(value) => setNewField({ ...newField, type: value as FormField['type'] })}
          >
            <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="textarea">Texto Longo</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="select">Seleção</SelectItem>
              <SelectItem value="radio">Múltipla Escolha</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={addField}
            disabled={!newField.label}
            className="w-full bg-neon-cyan hover:bg-neon-cyan/80"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Campo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyFormBuilder;
