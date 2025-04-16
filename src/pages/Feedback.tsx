
import { useState } from "react";
import { motion } from "framer-motion";
import KnowledgeLayout from "@/components/client/knowledge/KnowledgeLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Image, Smile, AlertTriangle, Bug, LightbulbIcon, CheckCircle, Upload } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const feedbackFormSchema = z.object({
  type: z.enum(["bug", "suggestion", "question", "praise", "other"], {
    required_error: "Selecione um tipo de feedback",
  }),
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  email: z.string().email({
    message: "Digite um email válido",
  }).optional(),
});

type FeedbackForm = z.infer<typeof feedbackFormSchema>;

const Feedback = () => {
  const { playSound } = useSounds();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: "suggestion",
      title: "",
      description: "",
      email: "",
    },
  });
  
  const onSubmit = (data: FeedbackForm) => {
    console.log(data);
    playSound("chime");
    setSubmitted(true);
    // Here you would normally send the data to your backend
  };
  
  const feedbackTypes = [
    {
      value: "bug",
      label: "Reportar um problema",
      icon: Bug,
      color: "text-red-400",
    },
    {
      value: "suggestion",
      label: "Sugestão de melhoria",
      icon: LightbulbIcon,
      color: "text-neon-cyan",
    },
    {
      value: "question",
      label: "Dúvida",
      icon: AlertTriangle,
      color: "text-yellow-400",
    },
    {
      value: "praise",
      label: "Elogio",
      icon: Smile,
      color: "text-neon-lime",
    },
    {
      value: "other",
      label: "Outro",
      icon: Image,
      color: "text-neon-pink",
    },
  ];

  const handleReset = () => {
    setSubmitted(false);
    form.reset();
  };

  return (
    <KnowledgeLayout
      title="Enviar Feedback"
      subtitle="Compartilhe sua opinião ou reporte problemas para melhorarmos a plataforma"
    >
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-16 h-16 bg-neon-lime/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-neon-lime" />
          </div>
          <h3 className="text-2xl font-medium mb-2">Feedback enviado!</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Agradecemos por compartilhar sua opinião. Seu feedback é muito importante para continuarmos melhorando.
          </p>
          <Button onClick={handleReset}>Enviar outro feedback</Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="glass" className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de feedback</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                        >
                          {feedbackTypes.map((type) => (
                            <Label
                              key={type.value}
                              htmlFor={type.value}
                              className={`flex items-center space-x-3 p-4 border border-galaxy-purple/30 rounded-lg cursor-pointer hover:bg-galaxy-purple/10 transition-colors ${
                                field.value === type.value ? "bg-galaxy-purple/20 border-neon-cyan" : ""
                              }`}
                            >
                              <RadioGroupItem
                                value={type.value}
                                id={type.value}
                                className="sr-only"
                              />
                              <type.icon className={`h-5 w-5 ${type.color}`} />
                              <span>{type.label}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Resumo do seu feedback"
                          className="bg-galaxy-deepPurple/30 border-galaxy-purple/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva em detalhes o seu feedback"
                          className="min-h-[120px] bg-galaxy-deepPurple/30 border-galaxy-purple/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border border-dashed border-galaxy-purple/30 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400 mb-2">
                    Arraste e solte imagens ou clique para anexar
                  </p>
                  <p className="text-xs text-gray-500">
                    Formatos aceitos: JPG, PNG, GIF (máx 5MB)
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email para contato (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="bg-galaxy-deepPurple/30 border-galaxy-purple/30"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Se quiser receber uma resposta, deixe seu email
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">
                    Enviar feedback
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </motion.div>
      )}
    </KnowledgeLayout>
  );
};

export default Feedback;
