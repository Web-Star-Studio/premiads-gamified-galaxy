
import { memo } from "react";
import { 
  FileText, 
  Camera, 
  Video, 
  MapPin, 
  Share, 
  Tag, 
  BarChart3, 
  Star 
} from "lucide-react";
import { FormData, MissionType, missionTypeLabels, missionTypeDescriptions } from "./types";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

/**
 * Mission basic information form step
 * Collects title, description, mission type and target audience
 */
const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  // Map mission types to their corresponding icons
  const missionTypeIcons: Record<MissionType, React.ReactNode> = {
    form: <FileText className="w-4 h-4 mr-2" aria-hidden="true" />,
    photo: <Camera className="w-4 h-4 mr-2" aria-hidden="true" />,
    video: <Video className="w-4 h-4 mr-2" aria-hidden="true" />,
    checkin: <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />,
    social: <Share className="w-4 h-4 mr-2" aria-hidden="true" />,
    coupon: <Tag className="w-4 h-4 mr-2" aria-hidden="true" />,
    survey: <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />,
    review: <Star className="w-4 h-4 mr-2" aria-hidden="true" />
  };

  // Audience options
  const audienceOptions = [
    { id: "todos", label: "Todos" },
    { id: "novos", label: "Novos" },
    { id: "nivel3", label: "Nível 3+" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="mission-title" className="text-sm font-medium">Nome da Missão</label>
        <input
          id="mission-title"
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          placeholder="Ex: Desafio Verão 2025"
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
          maxLength={50}
          aria-required="true"
        />
        {formData.title && formData.title.length > 40 && (
          <p className="text-xs text-amber-400">
            Nome próximo do limite máximo ({formData.title.length}/50)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="mission-description" className="text-sm font-medium">Descrição da Missão</label>
        <Textarea
          id="mission-description"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Descreva o objetivo desta missão..."
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none resize-none min-h-[80px]"
          maxLength={200}
        />
        <p className="text-xs text-gray-400">
          {formData.description.length}/200 caracteres
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Tipo de Missão</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(missionTypeLabels).map(([type, label]) => (
            <div
              key={type}
              className={`flex flex-col p-3 border rounded-md cursor-pointer transition-all ${
                formData.type === type
                  ? "border-neon-cyan bg-neon-cyan/10 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => updateFormData("type", type)}
              role="radio"
              aria-checked={formData.type === type}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  updateFormData("type", type);
                }
              }}
            >
              <div className="flex items-center">
                {missionTypeIcons[type as MissionType]}
                <span className="font-medium">{label}</span>
              </div>
              {formData.type === type && (
                <p className="mt-2 text-xs text-gray-300">
                  {missionTypeDescriptions[type as MissionType]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Público Alvo</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {audienceOptions.map((audience) => (
            <div
              key={audience.id}
              className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-all ${
                formData.audience === audience.id
                  ? "border-neon-cyan bg-neon-cyan/10 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => updateFormData("audience", audience.id)}
              role="radio"
              aria-checked={formData.audience === audience.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  updateFormData("audience", audience.id);
                }
              }}
            >
              <span>{audience.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(BasicInfoStep);
