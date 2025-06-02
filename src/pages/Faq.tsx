
import { useState } from "react";
import KnowledgeLayout from "@/components/client/knowledge/KnowledgeLayout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Dados de exemplo para o FAQ
interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "conta" | "missoes" | "pagamentos" | "tecnicos";
}

const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Como posso alterar minha senha?",
    answer: "Para alterar sua senha, acesse seu perfil clicando no ícone de usuário no canto superior direito, selecione 'Configurações' e depois 'Alterar Senha'. Você precisará confirmar sua senha atual antes de definir uma nova.",
    category: "conta"
  },
  {
    id: "faq-2",
    question: "O que acontece se eu perder minha streak diária?",
    answer: "Se você perder sua streak diária, o contador será reiniciado para zero. No entanto, os pontos que você já acumulou não serão perdidos. Para manter sua streak, certifique-se de completar pelo menos uma missão a cada 24 horas.",
    category: "missoes"
  },
  {
    id: "faq-3",
    question: "Como faço para sacar meus prêmios?",
    answer: "Os prêmios podem ser resgatados na seção 'Recompensas' do seu painel. Dependendo do tipo de prêmio, você pode escolher entre transferência bancária, vouchers digitais ou produtos físicos que serão enviados para o endereço cadastrado.",
    category: "pagamentos"
  },
  {
    id: "faq-4",
    question: "Meu vídeo de missão não está enviando, o que fazer?",
    answer: "Se você está tendo problemas para enviar um vídeo, verifique se o arquivo está em um dos formatos suportados (MP4, MOV, AVI) e se não excede 100MB. Caso o problema persista, tente reduzir a resolução do vídeo ou entre em contato com nosso suporte técnico.",
    category: "tecnicos"
  },
  {
    id: "faq-5",
    question: "Posso participar de várias missões ao mesmo tempo?",
    answer: "Sim, você pode participar de quantas missões quiser simultaneamente. Não há limite para a quantidade de missões ativas, mas lembre-se de que cada missão tem seu próprio prazo de conclusão.",
    category: "missoes"
  },
  {
    id: "faq-6",
    question: "Como funciona o sistema de níveis?",
    answer: "O sistema de níveis é baseado na quantidade de pontos acumulados e missões concluídas. Cada nível desbloqueado oferece benefícios adicionais, como acesso a missões exclusivas, multiplicadores de pontos e chances maiores em sorteios.",
    category: "conta"
  },
  {
    id: "faq-7",
    question: "Os pontos expiram?",
    answer: "Sim, os pontos têm validade de 6 meses a partir da data em que foram conquistados. Você pode verificar o prazo de expiração de seus pontos na seção 'Meus Pontos' do seu painel.",
    category: "pagamentos"
  }
];

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const filterItems = () => faqItems.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "todos" || item.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  
  const categories = [
    { id: "todos", label: "Todos" },
    { id: "conta", label: "Conta e Perfil" },
    { id: "missoes", label: "Missões" },
    { id: "pagamentos", label: "Pagamentos e Prêmios" },
    { id: "tecnicos", label: "Problemas Técnicos" }
  ];

  const filteredItems = filterItems();
  
  return (
    <KnowledgeLayout 
      title="Perguntas Frequentes" 
      subtitle="Respostas para as dúvidas mais comuns"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 bg-galaxy-deepPurple/30 border-galaxy-purple/30"
              placeholder="Buscar por palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeCategory === category.id 
                  ? "bg-galaxy-purple text-white" 
                  : "bg-galaxy-deepPurple/30 text-gray-300 hover:bg-galaxy-purple/20"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma pergunta encontrada para esta busca. Tente outros termos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Collapsible
                key={item.id}
                open={openItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
                className="border border-galaxy-purple/30 rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-galaxy-purple/10 transition-colors text-left">
                  <span className="font-medium">{item.question}</span>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 pt-0 border-t border-galaxy-purple/30 text-gray-300"
                  >
                    {item.answer}
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </KnowledgeLayout>
  );
};

export default Faq;
