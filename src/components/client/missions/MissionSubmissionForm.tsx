
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMissions } from '@/hooks/useMissions';
// Import Mission type from the correct location
import type { Mission } from '@/types/mission-unified';

interface MissionSubmissionFormProps {
  mission: Mission;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MissionSubmissionForm: React.FC<MissionSubmissionFormProps> = ({
  mission,
  onSubmit,
  onCancel
}) => {
  const [submissionData, setSubmissionData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(submissionData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enviar Submissão: {mission.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição da sua submissão</Label>
            <Textarea
              id="description"
              placeholder="Descreva como você completou a missão..."
              value={submissionData.description || ''}
              onChange={(e) => setSubmissionData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              required
            />
          </div>

          {mission.type === 'photo' && (
            <div>
              <Label htmlFor="photo">Upload da Foto</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setSubmissionData(prev => ({
                  ...prev,
                  photo: e.target.files?.[0]
                }))}
                required
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Enviar Submissão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MissionSubmissionForm;
