import { memo } from "react";
import { 
  FileText, 
  Camera, 
  Video, 
  MapPin, 
  Share, 
  Tag, 
  BarChart3, 
  Star,
  Users
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  // Enhanced audience targeting options
  const ageRanges = [
    { value: "18-24", label: "18-24 anos" },
    { value: "25-34", label: "25-34 anos" },
    { value: "35-44", label: "35-44 anos" },
    { value: "45+", label: "45+ anos" }
  ];

  const regions = [
    { value: "norte", label: "Norte" },
    { value: "nordeste", label: "Nordeste" },
    { value: "centro-oeste", label: "Centro-Oeste" },
    { value: "sudeste", label: "Sudeste" },
    { value: "sul", label: "Sul" }
  ];

  const interests = [
    { value: "tecnologia", label: "Tecnologia" },
    { value: "moda", label: "Moda" },
    { value: "esportes", label: "Esportes" },
    { value: "gastronomia", label: "Gastronomia" },
    { value: "viagem", label: "Viagem" }
  ];

  // Handle audience filter changes
  const handleAudienceFilterChange = (filterType: string, value: string | string[]) => {
    const currentFilter = formData.targetFilter || {};
    updateFormData("targetFilter", {
      ...currentFilter,
      [filterType]: value
    });
  };
  
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

      <Card className="bg-galaxy-darkPurple/50 border-galaxy-purple/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-neon-cyan" />
            <h4 className="text-sm font-medium">Filtros Avançados de Público</h4>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="age" className="border-galaxy-purple/20">
              <AccordionTrigger className="text-sm py-2">Faixa Etária</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {ageRanges.map((age) => (
                    <div key={age.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`age-${age.value}`} 
                        checked={(formData.targetFilter?.age as string[])?.includes(age.value)}
                        onCheckedChange={(checked) => {
                          const currentAges = (formData.targetFilter?.age as string[]) || [];
                          const newAges = checked 
                            ? [...currentAges, age.value]
                            : currentAges.filter(a => a !== age.value);
                          handleAudienceFilterChange('age', newAges);
                        }}
                      />
                      <Label htmlFor={`age-${age.value}`} className="text-sm">
                        {age.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="region" className="border-galaxy-purple/20">
              <AccordionTrigger className="text-sm py-2">Região</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {regions.map((region) => (
                    <div key={region.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`region-${region.value}`} 
                        checked={(formData.targetFilter?.region as string[])?.includes(region.value)}
                        onCheckedChange={(checked) => {
                          const currentRegions = (formData.targetFilter?.region as string[]) || [];
                          const newRegions = checked 
                            ? [...currentRegions, region.value]
                            : currentRegions.filter(r => r !== region.value);
                          handleAudienceFilterChange('region', newRegions);
                        }}
                      />
                      <Label htmlFor={`region-${region.value}`} className="text-sm">
                        {region.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="interests" className="border-galaxy-purple/20">
              <AccordionTrigger className="text-sm py-2">Interesses</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <div key={interest.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`interest-${interest.value}`} 
                        checked={(formData.targetFilter?.interests as string[])?.includes(interest.value)}
                        onCheckedChange={(checked) => {
                          const currentInterests = (formData.targetFilter?.interests as string[]) || [];
                          const newInterests = checked 
                            ? [...currentInterests, interest.value]
                            : currentInterests.filter(i => i !== interest.value);
                          handleAudienceFilterChange('interests', newInterests);
                        }}
                      />
                      <Label htmlFor={`interest-${interest.value}`} className="text-sm">
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="gender" className="border-galaxy-purple/20">
              <AccordionTrigger className="text-sm py-2">Gênero</AccordionTrigger>
              <AccordionContent>
                <RadioGroup 
                  value={formData.targetFilter?.gender as string || "all"}
                  onValueChange={(value) => handleAudienceFilterChange('gender', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="gender-all" />
                    <Label htmlFor="gender-all" className="text-sm">Todos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male" className="text-sm">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female" className="text-sm">Feminino</Label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(BasicInfoStep);
