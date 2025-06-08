import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { FormField } from './types';

interface SurveyFormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  formData?: any;
  updateFormData?: (field: string, value: any) => void;
}

const SurveyFormBuilder: React.FC<SurveyFormBuilderProps> = ({ fields, onFieldsChange }) => {
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
  });

  const addField = () => {
    if (!newField.label) return;
    
    const field: FormField = {
      id: Date.now().toString(),
      type: newField.type as FormField['type'],
      label: newField.label,
      required: newField.required || false,
      options: newField.options || [],
      placeholder: newField.placeholder || '',
    };
    
    onFieldsChange([...fields, field]);
    setNewField({ type: 'text', label: '', required: false });
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onFieldsChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  return (
    <Card className="bg-galaxy-darkPurple border-galaxy-purple">
      <CardHeader>
        <CardTitle className="text-white">Construtor de Formulário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing fields */}
        {fields.map((field) => (
          <div key={field.id} className="p-4 border border-galaxy-purple rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-white font-medium">{field.label}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeField(field.id)}
                className="text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              Tipo: {field.type} | Obrigatório: {field.required ? 'Sim' : 'Não'}
            </div>
          </div>
        ))}

        {/* Add new field */}
        <div className="border-t border-galaxy-purple pt-4 space-y-4">
          <h4 className="text-white font-medium">Adicionar Campo</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Tipo do Campo</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as FormField['type'] })}
              >
                <SelectTrigger className="bg-galaxy-dark border-galaxy-purple text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="radio">Radio Button</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Label do Campo</Label>
              <Input
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="Digite o label do campo"
                className="bg-galaxy-dark border-galaxy-purple text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={newField.required}
              onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
            />
            <Label className="text-white">Campo obrigatório</Label>
          </div>

          <Button onClick={addField} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Campo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyFormBuilder;
