
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
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const missionTypeIcons: Record<MissionType, React.ReactNode> = {
    form: <FileText className="w-4 h-4 mr-2" />,
    photo: <Camera className="w-4 h-4 mr-2" />,
    video: <Video className="w-4 h-4 mr-2" />,
    checkin: <MapPin className="w-4 h-4 mr-2" />,
    social: <Share className="w-4 h-4 mr-2" />,
    coupon: <Tag className="w-4 h-4 mr-2" />,
    survey: <BarChart3 className="w-4 h-4 mr-2" />,
    review: <Star className="w-4 h-4 mr-2" />
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome da Missão</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          placeholder="Ex: Desafio Verão 2025"
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição da Missão</label>
        <Textarea
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Descreva o objetivo desta missão..."
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none resize-none min-h-[80px]"
        />
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
          {[
            { id: "todos", label: "Todos" },
            { id: "novos", label: "Novos" },
            { id: "nivel3", label: "Nível 3+" },
          ].map((audience) => (
            <div
              key={audience.id}
              className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-all ${
                formData.audience === audience.id
                  ? "border-neon-cyan bg-neon-cyan/10 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500"
              }`}
              onClick={() => updateFormData("audience", audience.id)}
            >
              <span>{audience.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
