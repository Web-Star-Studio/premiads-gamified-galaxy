
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from './types';

interface DatesStepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

const DatesStep: React.FC<DatesStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-galaxy-darkPurple border-galaxy-purple">
        <CardHeader>
          <CardTitle className="text-white">Datas da Campanha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="startDate" className="text-white">Data de Início</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={formData.startDate.toISOString().slice(0, 16)}
              onChange={(e) => updateFormData('startDate', new Date(e.target.value))}
              className="bg-galaxy-dark border-galaxy-purple text-white"
            />
          </div>

          <div>
            <Label htmlFor="endDate" className="text-white">Data de Fim</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={formData.endDate.toISOString().slice(0, 16)}
              onChange={(e) => updateFormData('endDate', new Date(e.target.value))}
              className="bg-galaxy-dark border-galaxy-purple text-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatesStep;
