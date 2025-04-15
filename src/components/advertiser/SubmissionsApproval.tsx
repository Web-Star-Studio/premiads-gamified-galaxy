
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Image, FileText, PenTool, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

const SubmissionsApproval = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  // Mock submissions data
  const submissions = [
    {
      id: 1,
      user: "Carlos Mendes",
      mission: "Teste de Produto",
      type: "image",
      content: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      date: "14/04/2025",
      comment: "Testei o produto por 7 dias e notei resultados incríveis!",
    },
    {
      id: 2,
      user: "Amanda Silva",
      mission: "Desafio Criativo",
      type: "text",
      content: "Criei um guia detalhado de como usar o app para iniciantes, focando nas principais funcionalidades e incluindo dicas para maximizar a experiência do usuário. O feedback de 5 novos usuários foi extremamente positivo!",
      date: "13/04/2025",
      comment: "Este é o meu guia completo para novos usuários.",
    },
    {
      id: 3,
      user: "Ricardo Alves",
      mission: "Compartilhar nas Redes",
      type: "image",
      content: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      date: "14/04/2025",
      comment: "Post no Instagram com mais de 200 curtidas!",
    },
    {
      id: 4,
      user: "Mariana Costa",
      mission: "Pesquisa de Satisfação",
      type: "text",
      content: "Coletei feedback de 12 usuários diferentes sobre a nova funcionalidade. A maioria teve uma experiência positiva, mas notaram algumas dificuldades com a interface em dispositivos móveis. Sugerem melhorias na responsividade e mais clareza nos tooltips.",
      date: "12/04/2025",
      comment: "Resultados da pesquisa de satisfação.",
    },
  ];
  
  const currentSubmission = submissions[currentIndex];
  
  const handleApprove = () => {
    playSound("reward");
    toast({
      title: "Submissão aprovada",
      description: `Submissão de ${currentSubmission.user} foi aprovada com sucesso!`,
    });
    goToNext();
  };
  
  const handleReject = () => {
    playSound("error");
    toast({
      title: "Submissão rejeitada",
      description: `Submissão de ${currentSubmission.user} foi rejeitada.`,
      variant: "destructive",
    });
    goToNext();
  };
  
  const goToNext = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(submissions.length - 1);
    }
  };
  
  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-neon-cyan" />;
      case "text":
        return <FileText className="w-5 h-5 text-neon-pink" />;
      case "creative":
        return <PenTool className="w-5 h-5 text-purple-400" />;
      case "video":
        return <Play className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };
  
  return (
    <Card className="border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,231,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Aprovar Submissões</span>
          <div className="text-sm font-normal text-gray-400">
            {currentIndex + 1} de {submissions.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border border-gray-700 rounded-md bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                {currentSubmission.user.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{currentSubmission.user}</p>
                <p className="text-xs text-gray-400">
                  {currentSubmission.mission} • {currentSubmission.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getSubmissionIcon(currentSubmission.type)}
              <span className="text-xs text-gray-400 capitalize">{currentSubmission.type}</span>
            </div>
          </div>
          
          <div className="min-h-[250px] p-4 border border-gray-700 rounded-md bg-gray-800/20">
            {currentSubmission.type === "image" ? (
              <div className="flex items-center justify-center h-full">
                <motion.img
                  key={currentSubmission.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={currentSubmission.content}
                  alt={`Submission by ${currentSubmission.user}`}
                  className="max-h-[250px] rounded-md object-contain"
                />
              </div>
            ) : (
              <motion.div
                key={currentSubmission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto fancy-scrollbar p-1"
              >
                <p className="text-sm">{currentSubmission.content}</p>
              </motion.div>
            )}
          </div>
          
          <div className="p-3 border border-gray-700 rounded-md bg-gray-800/30">
            <p className="text-sm text-gray-300 mb-1">Comentário:</p>
            <p className="text-sm">{currentSubmission.comment}</p>
          </div>
          
          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={goToPrevious}
                className="h-10 w-10 rounded-full border border-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={goToNext}
                className="h-10 w-10 rounded-full border border-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="destructive"
                onClick={handleReject}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Rejeitar
              </Button>
              <Button 
                onClick={handleApprove}
                className="gap-2 bg-gradient-to-r from-green-600/60 to-teal-500/60 hover:from-green-600/80 hover:to-teal-500/80"
              >
                <Check className="w-4 h-4" />
                Aprovar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsApproval;
