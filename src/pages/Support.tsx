
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone, FileQuestion, Clock } from "lucide-react";
import KnowledgeLayout from "@/components/client/knowledge/KnowledgeLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useSounds } from "@/hooks/use-sounds";

const Support = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { playSound } = useSounds();

  const supportOptions = [
    {
      id: "chat",
      title: "Chat ao vivo",
      description: "Converse em tempo real com um de nossos atendentes",
      icon: MessageSquare,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10"
    },
    {
      id: "email",
      title: "E-mail",
      description: "Envie sua dúvida por e-mail e responderemos em até 24h",
      icon: Mail,
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/10"
    },
    {
      id: "phone",
      title: "Telefone",
      description: "Ligue para nosso suporte telefônico",
      icon: Phone,
      color: "text-neon-lime",
      bgColor: "bg-neon-lime/10"
    },
    {
      id: "ticket",
      title: "Abrir chamado",
      description: "Crie um ticket detalhado para nossa equipe técnica",
      icon: FileQuestion,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    }
  ];

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    playSound("pop");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    playSound("chime");
    // Aqui seria implementada a lógica real de envio
  };

  const handleReset = () => {
    setSelectedOption(null);
    setMessage("");
    setSubmitted(false);
  };

  return (
    <KnowledgeLayout
      title="Suporte"
      subtitle="Estamos aqui para ajudar você"
    >
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="mx-auto w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-neon-cyan" />
          </div>
          <h3 className="text-xl font-medium mb-2">Solicitação enviada!</h3>
          <p className="text-gray-400 mb-6">
            Agradecemos seu contato. Nossa equipe responderá o mais breve possível.
          </p>
          <Button onClick={handleReset}>Nova solicitação</Button>
        </motion.div>
      ) : selectedOption ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setSelectedOption(null)} className="mr-4">
              Voltar
            </Button>
            <h3 className="text-xl font-medium">
              {supportOptions.find(opt => opt.id === selectedOption)?.title}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="mensagem">
                Descreva sua dúvida ou problema:
              </label>
              <Textarea
                id="mensagem"
                rows={6}
                placeholder="Forneça detalhes sobre sua questão..."
                className="w-full bg-galaxy-deepPurple/30 border-galaxy-purple/30"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={!message.trim()}>
                Enviar
              </Button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="border border-galaxy-purple/30 rounded-lg p-4 cursor-pointer hover:bg-galaxy-purple/10 transition-colors"
              onClick={() => handleSelectOption(option.id)}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${option.bgColor} mr-4`}>
                  <option.icon className={`h-6 w-6 ${option.color}`} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-galaxy-purple/30 pt-4">
        <h3 className="text-lg font-medium mb-4">Horário de atendimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-neon-cyan">Chat ao vivo e Telefone</h4>
            <p className="text-gray-400">Segunda a Sexta: 9h às 18h</p>
            <p className="text-gray-400">Sábado: 9h às 13h</p>
          </div>
          <div>
            <h4 className="font-medium text-neon-pink">E-mail e Tickets</h4>
            <p className="text-gray-400">Respondemos em até 24 horas úteis</p>
          </div>
        </div>
      </div>
    </KnowledgeLayout>
  );
};

export default Support;
