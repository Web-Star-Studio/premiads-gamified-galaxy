
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../types/profileTypes";
import { 
  serviceUsageOptions,
  transportationOptions,
  digitalPlatformOptions,
  householdSizeOptions,
  educationLevelOptions,
  sustainabilityOptions,
} from "../constants/formOptions";
import { Label } from "@/components/ui/label";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AdditionalInfoSection = ({ form }: AdditionalInfoSectionProps) => {
  return (
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
  );
};
