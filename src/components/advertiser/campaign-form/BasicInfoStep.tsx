
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
import { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription
} from "@/components/ui/card";
import { 
  MissionType, 
  missionTypeLabels, 
  missionTypeDescriptions 
} from "@/hooks/useMissionsTypes";

interface BasicInfoStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

// Map to get the appropriate icon for each mission type
const getMissionTypeIcon = (type: MissionType) => {
  const icons = {
    form: <FileText className="h-5 w-5" />,
    photo: <Camera className="h-5 w-5" />,
    video: <Video className="h-5 w-5" />,
    checkin: <MapPin className="h-5 w-5" />,
    social: <Share className="h-5 w-5" />,
    coupon: <Tag className="h-5 w-5" />,
    survey: <BarChart3 className="h-5 w-5" />,
    review: <Star className="h-5 w-5" />
  };
  
  return icons[type] || <FileText className="h-5 w-5" />;
};

/**
 * Mission basic information form step
 * Collects title, description, mission type and target audience
 */
const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  // All available mission types
  const missionTypes: MissionType[] = [
    "form", "photo", "video", "checkin", "social", "coupon", "survey", "review"
  ];
  
  // All target audience options
  const targetAudiences = [
    { value: "todos", label: "Todos os usuários" },
    { value: "novos", label: "Novos usuários" },
    { value: "nivel3", label: "Usuários nível 3 ou superior" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="title" className="text-sm font-medium">Título da Missão</label>
        <Input
          id="title"
          placeholder="Ex: Compartilhe nossa marca nas redes sociais"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          className="bg-gray-800 border-gray-700 focus:border-neon-cyan w-full"
        />
      </div>
      
      <div className="space-y-3">
        <label htmlFor="description" className="text-sm font-medium">Descrição</label>
        <Textarea
          id="description"
          placeholder="Descreva o que os usuários precisam fazer para completar esta missão"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          className="bg-gray-800 border-gray-700 focus:border-neon-cyan min-h-[100px] w-full"
        />
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Tipo de Missão</label>
        
        {formData.type ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card 
              className="bg-galaxy-purple/10 border border-galaxy-purple/40 cursor-pointer"
              onClick={() => updateFormData("type", "")}
            >
              <CardContent className="flex items-center p-4">
                <div className="mr-3 w-10 h-10 rounded-full bg-galaxy-purple/20 flex items-center justify-center">
                  {getMissionTypeIcon(formData.type as MissionType)}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{missionTypeLabels[formData.type as MissionType]}</h4>
                  <CardDescription className="text-xs line-clamp-2">
                    {missionTypeDescriptions[formData.type as MissionType]}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            
            <button
              type="button"
              onClick={() => updateFormData("type", "")}
              className="text-sm text-galaxy-blue hover:text-neon-cyan transition-colors"
            >
              Mudar tipo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {missionTypes.map((type) => (
              <Card 
                key={type}
                className="bg-galaxy-darkPurple border border-galaxy-purple/20 hover:border-galaxy-purple/40 cursor-pointer"
                onClick={() => updateFormData("type", type)}
              >
                <CardContent className="flex items-center p-4">
                  <div className="mr-3 w-10 h-10 rounded-full bg-galaxy-purple/20 flex items-center justify-center">
                    {getMissionTypeIcon(type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{missionTypeLabels[type]}</h4>
                    <CardDescription className="text-xs line-clamp-2">
                      {missionTypeDescriptions[type]}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <label htmlFor="audience" className="text-sm font-medium">Público Alvo</label>
        <Select
          value={formData.audience}
          onValueChange={(value) => updateFormData("audience", value)}
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-neon-cyan w-full">
            <SelectValue placeholder="Selecione o público alvo" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {targetAudiences.map((audience) => (
              <SelectItem key={audience.value} value={audience.value}>
                {audience.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default memo(BasicInfoStep);
