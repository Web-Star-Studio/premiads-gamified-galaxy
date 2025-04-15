
import { z } from "zod";

// Define form schema
export const profileFormSchema = z.object({
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

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
