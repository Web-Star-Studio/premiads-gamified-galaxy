
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../types/profileTypes";
import { 
  ageRangeOptions, 
  genderOptions, 
  maritalStatusOptions,
  interestOptions
} from "../constants/formOptions";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => (
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
  );
