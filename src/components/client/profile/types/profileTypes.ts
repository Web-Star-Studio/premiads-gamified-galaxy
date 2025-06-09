import { z } from "zod";

// Define form schema with required fields to properly track completion
export const profileFormSchema = z.object({
  ageRange: z.string({
    required_error: "Selecione sua faixa etária",
  }),
  location: z.string({
    required_error: "Informe sua localização",
  }).min(2, "Informe uma localização válida"),
  profession: z.string({
    required_error: "Informe sua profissão ou área de atuação",
  }).min(2, "Informe uma profissão válida"),
  maritalStatus: z.string({
    required_error: "Selecione seu estado civil",
  }),
  gender: z.string({
    required_error: "Selecione seu gênero",
  }),
  interests: z.array(z.string()).min(1, "Selecione pelo menos um interesse"),
  serviceUsageFrequency: z.string({
    required_error: "Selecione com que frequência você usa o serviço",
  }),
  transportationType: z.string({
    required_error: "Selecione seu meio de transporte principal",
  }),
  digitalPlatforms: z.array(z.string()).min(1, "Selecione pelo menos uma plataforma digital"),
  householdSize: z.string({
    required_error: "Selecione o tamanho da sua família",
  }),
  educationLevel: z.string({
    required_error: "Selecione seu nível de educação",
  }),
  sustainabilityInterest: z.string({
    required_error: "Selecione seu nível de interesse em sustentabilidade",
  }),
  // Social media URLs remain optional
  instagramUrl: z.string().url().optional().or(z.literal('').optional()),
  tiktokUrl: z.string().url().optional().or(z.literal('').optional()),
  youtubeUrl: z.string().url().optional().or(z.literal('').optional()),
  twitterUrl: z.string().url().optional().or(z.literal('').optional()),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
