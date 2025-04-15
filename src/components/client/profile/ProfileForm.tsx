import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSounds } from "@/hooks/use-sounds";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define form schema
const profileFormSchema = z.object({
  ageRange: z.string().optional(),
  location: z.string().optional(),
  profession: z.string().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  interests: z.array(z.string()).optional(),
  serviceUsageFrequency: z.string().optional(),
  transportationType: z.string().optional(),
  digitalPlatforms: z.array(z.string()).optional(),
  householdSize: z.string().optional(),
  educationLevel: z.string().optional(),
  sustainabilityInterest: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ageRangeOptions = [
  { value: "18-24", label: "18-24 anos" },
  { value: "25-34", label: "25-34 anos" },
  { value: "35-44", label: "35-44 anos" },
  { value: "45-54", label: "45-54 anos" },
  { value: "55-64", label: "55-64 anos" },
  { value: "65+", label: "65 anos ou mais" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const maritalStatusOptions = [
  { value: "single", label: "Solteiro(a)" },
  { value: "married", label: "Casado(a)" },
  { value: "relationship", label: "Em um relacionamento" },
  { value: "divorced", label: "Divorciado(a)" },
  { value: "widowed", label: "Viúvo(a)" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const genderOptions = [
  { value: "female", label: "Feminino" },
  { value: "male", label: "Masculino" },
  { value: "non_binary", label: "Não-binário" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const interestOptions = [
  { value: "sports", label: "Esportes" },
  { value: "restaurants", label: "Restaurantes" },
  { value: "food", label: "Comida" },
  { value: "events", label: "Eventos" },
  { value: "leisure", label: "Lazer" },
  { value: "tourism", label: "Turismo" },
  { value: "fashion", label: "Moda" },
  { value: "technology", label: "Tecnologia" },
  { value: "beauty", label: "Beleza" },
  { value: "health", label: "Saúde" },
  { value: "education", label: "Educação" },
  { value: "finance", label: "Finanças" },
  { value: "gaming", label: "Jogos" },
  { value: "art", label: "Arte e Cultura" },
];

const serviceUsageOptions = [
  { value: "daily", label: "Diariamente" },
  { value: "weekly", label: "Semanalmente" },
  { value: "monthly", label: "Mensalmente" },
  { value: "rarely", label: "Raramente" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const transportationOptions = [
  { value: "car", label: "Carro próprio" },
  { value: "public_transport", label: "Transporte público" },
  { value: "bike", label: "Bicicleta" },
  { value: "rideshare", label: "Aplicativos de carona" },
  { value: "walking", label: "A pé" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const digitalPlatformOptions = [
  { value: "social_media", label: "Redes sociais" },
  { value: "video_streaming", label: "Streaming de vídeo" },
  { value: "gaming", label: "Jogos" },
  { value: "online_shopping", label: "Compras online" },
  { value: "news", label: "Sites de notícias" },
  { value: "music", label: "Streaming de música" },
  { value: "productivity", label: "Ferramentas de produtividade" },
];

const householdSizeOptions = [
  { value: "1", label: "1 pessoa" },
  { value: "2-3", label: "2-3 pessoas" },
  { value: "4+", label: "4 ou mais pessoas" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const educationLevelOptions = [
  { value: "elementary", label: "Ensino Fundamental" },
  { value: "high_school", label: "Ensino Médio" },
  { value: "technical", label: "Ensino Técnico" },
  { value: "undergraduate", label: "Graduação" },
  { value: "graduate", label: "Pós-graduação" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const sustainabilityOptions = [
  { value: "very", label: "Muito interessado" },
  { value: "moderately", label: "Moderadamente interessado" },
  { value: "little", label: "Pouco interessado" },
  { value: "not_interested", label: "Não me interesso" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const POINTS_PER_PROFILE_COMPLETION = 10;

const ProfileForm = () => {
  const { userName } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  
  // Create form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ageRange: undefined,
      location: "",
      profession: "",
      maritalStatus: undefined,
      gender: undefined,
      interests: [],
      serviceUsageFrequency: undefined,
      transportationType: undefined,
      digitalPlatforms: [],
      householdSize: undefined,
      educationLevel: undefined,
      sustainabilityInterest: undefined,
    },
  });

  // Fetch existing profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userId = session.user.id;
          
          // Fetch profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('profile_data, profile_completed')
            .eq('id', userId)
            .single();
          
          if (error) throw error;
          
          if (profileData) {
            // If user has profile data, populate the form
            if (profileData.profile_data) {
              form.reset(profileData.profile_data);
            }
            
            // Check if user has already completed the profile before
            setHasCompletedBefore(profileData.profile_completed || false);
          }
        } else {
          // Handle test mode - simulate profile data
          console.log("No authenticated session - using test mode");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const userId = session.user.id;
        
        // Update profile data
        const { error } = await supabase
          .from('profiles')
          .update({
            profile_data: data,
            profile_completed: true,
          })
          .eq('id', userId);
        
        if (error) throw error;
        
        // Award points if user hasn't completed the profile before
        if (!hasCompletedBefore) {
          const { error: pointsError } = await supabase
            .from('profiles')
            .update({
              points: supabase.sql`points + ${POINTS_PER_PROFILE_COMPLETION}`
            })
            .eq('id', userId);
          
          if (pointsError) throw pointsError;
          
          setPointsAwarded(true);
          playSound("chime");
        }
        
        toast({
          title: "Perfil atualizado",
          description: !hasCompletedBefore 
            ? `Seu perfil foi atualizado e você ganhou ${POINTS_PER_PROFILE_COMPLETION} pontos!` 
            : "Seu perfil foi atualizado com sucesso!",
        });
        
        // Update state to reflect that profile has been completed
        setHasCompletedBefore(true);
      } else {
        // Handle test mode
        console.log("Form submitted in test mode:", data);
        toast({
          title: "Perfil atualizado (modo de teste)",
          description: "Seu perfil foi atualizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar os dados do seu perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 sm:p-8 rounded-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-heading mb-2">Complete seu Perfil</h2>
        <p className="text-gray-400">
          Estas informações nos ajudam a encontrar as melhores missões para você. 
          {!hasCompletedBefore && "Ganhe 10 pontos ao completar seu perfil pela primeira vez!"}
        </p>
        
        {pointsAwarded && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md flex items-center gap-2">
            <CheckCircle className="text-green-500 h-5 w-5" />
            <span>Parabéns! Você ganhou {POINTS_PER_PROFILE_COMPLETION} pontos por completar seu perfil!</span>
          </div>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Faixa Etária */}
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faixa Etária</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                        <SelectValue placeholder="Selecione sua faixa etária" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ageRangeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Nos ajuda a encontrar missões adequadas para você.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Localização */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização (Cidade/Estado)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Recife - PE"
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Para encontrar missões na sua região.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Profissão */}
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão ou Área de Atuação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Educação, Tecnologia, Saúde"
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ajuda a direcionar missões específicas para sua área.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Estado Civil */}
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Civil</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                        <SelectValue placeholder="Selecione seu estado civil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {maritalStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Para campanhas relacionadas à sua situação.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Gênero */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Para direcionar campanhas específicas de gênero.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Interesses */}
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Interesses</FormLabel>
                    <FormDescription>
                      Selecione seus interesses para missões personalizadas.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((item) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`interest-${item.value}`}
                          value={item.value}
                          onChange={(e) => {
                            const currentValues = form.getValues("interests") || [];
                            if (e.target.checked) {
                              form.setValue("interests", [...currentValues, item.value]);
                            } else {
                              form.setValue(
                                "interests",
                                currentValues.filter((value) => value !== item.value)
                              );
                            }
                          }}
                          className="rounded-sm"
                        />
                        <Label htmlFor={`interest-${item.value}`}>{item.label}</Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="border-t border-galaxy-purple/20 pt-6">
            <h3 className="text-lg font-bold mb-4">Informações Adicionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frequência de Uso de Serviços */}
              <FormField
                control={form.control}
                name="serviceUsageFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência de Uso de Serviços</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                          <SelectValue placeholder="Com que frequência você usa serviços?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceUsageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Restaurantes, academias, compras online, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tipo de Transporte */}
              <FormField
                control={form.control}
                name="transportationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Transporte Utilizado</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                          <SelectValue placeholder="Qual transporte você usa com mais frequência?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transportationOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Para campanhas relacionadas à mobilidade.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Hábitos de Consumo Digital */}
              <FormField
                control={form.control}
                name="digitalPlatforms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Plataformas Digitais Preferidas</FormLabel>
                      <FormDescription>
                        Selecione as plataformas que você mais utiliza.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {digitalPlatformOptions.map((item) => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`platform-${item.value}`}
                            value={item.value}
                            onChange={(e) => {
                              const currentValues = form.getValues("digitalPlatforms") || [];
                              if (e.target.checked) {
                                form.setValue("digitalPlatforms", [...currentValues, item.value]);
                              } else {
                                form.setValue(
                                  "digitalPlatforms",
                                  currentValues.filter((value) => value !== item.value)
                                );
                              }
                            }}
                            className="rounded-sm"
                          />
                          <Label htmlFor={`platform-${item.value}`}>{item.label}</Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tamanho da Família */}
              <FormField
                control={form.control}
                name="householdSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho da Família</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                          <SelectValue placeholder="Quantas pessoas moram na sua residência?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {householdSizeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Para missões relacionadas a famílias.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Nível de Escolaridade */}
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Escolaridade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                          <SelectValue placeholder="Qual seu nível de escolaridade?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationLevelOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Para campanhas educacionais específicas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Interesse em Sustentabilidade */}
              <FormField
                control={form.control}
                name="sustainabilityInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interesse em Sustentabilidade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                          <SelectValue placeholder="Qual seu interesse em produtos sustentáveis?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sustainabilityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Para direcionar campanhas de marcas eco-friendly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              className="neon-button" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="mr-2">Salvando...</span>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">Salvar Perfil</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-400 mt-6 border-t border-galaxy-purple/20 pt-4">
            <p className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Estas informações são utilizadas apenas para personalizar sua experiência e 
                direcionar missões mais relevantes para você. Seus dados são protegidos de acordo 
                com nossa política de privacidade e com a LGPD (Lei Geral de Proteção de Dados).
              </span>
            </p>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ProfileForm;
