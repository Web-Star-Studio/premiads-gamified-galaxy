
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mission } from '@/hooks/missions/types';
import { Upload, X } from 'lucide-react';

interface MissionSubmissionFormProps {
  mission: Mission;
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

const MissionSubmissionForm: React.FC<MissionSubmissionFormProps> = ({
  mission,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    text: '',
    image: null as File | null,
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      mission_id: mission.id,
      mission_type: mission.type
    };

    const success = await onSubmit(submissionData);
    if (success) {
      setFormData({ text: '', image: null, comment: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Submissão - {mission.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="text">Descrição da Missão</Label>
            <Textarea
              id="text"
              placeholder="Descreva como você completou a missão..."
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              required
            />
          </div>

          {mission.type === 'photo' && (
            <div>
              <Label htmlFor="image">Upload de Imagem</Label>
              <div className="mt-2">
                {formData.image ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formData.image.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Clique para fazer upload da imagem
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="comment">Comentários Adicionais</Label>
            <Textarea
              id="comment"
              placeholder="Comentários opcionais..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Submissão'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MissionSubmissionForm;
