
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const Faq = () => {
  const { userType } = useUser();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = userType === "participante"
    ? [
        {
          question: "Como converto meus tickets em sorteios?",
          answer: "Para converter tickets em entradas de sorteio, vá até a seção 'Sorteios' no seu painel, escolha o sorteio desejado e clique em 'Usar Pontos'. Cada sorteio exige uma quantidade específica de tickets por entrada, e você pode participar múltiplas vezes para aumentar suas chances!"
        },
        {
          question: "Como desbloquear badges exclusivos?",
          answer: "Os badges exclusivos são desbloqueados ao completar desafios específicos ou atingir metas. Verifique a seção 'Missões Especiais' para descobrir quais badges estão disponíveis e o que precisa fazer para conquistá-los."
        },
        {
          question: "Existe validade para os tickets acumulados?",
          answer: "Sim, os tickets acumulados têm validade de 6 meses a partir da data em que foram conquistados. Fique atento ao seu saldo e datas de expiração no painel 'Meus Pontos'."
        },
        {
          question: "Posso transferir tickets para outros usuários?",
          answer: "Atualmente não permitimos a transferência de tickets entre participantes, mas estamos desenvolvendo essa funcionalidade para implementação futura."
        }
      ]
    : [
        {
          question: "Como crio minha primeira campanha?",
          answer: "Para criar sua primeira campanha, acesse o painel 'Anunciante', selecione 'Nova Campanha' e siga o assistente de criação. Você poderá personalizar missões, definir recompensas e configurar o orçamento em poucos passos."
        },
        {
          question: "Posso personalizar as recompensas?",
          answer: "Sim! Você pode personalizar completamente as recompensas oferecidas, desde tickets e badges até produtos físicos e descontos. Nossa plataforma permite integração com seu e-commerce para resgates automáticos."
        },
        {
          question: "Quais formas de pagamento para créditos?",
          answer: "Aceitamos cartões de crédito, transferências bancárias, PIX e boleto bancário. Para empresas, oferecemos também faturamento com 28 dias para pagamento mediante análise de crédito."
        },
        {
          question: "É possível obter relatórios detalhados de engajamento?",
          answer: "Sim, oferecemos relatórios detalhados com métricas de engajamento, alcance, conversão e ROI. Você pode personalizar dashboards e configurar alertas para acompanhar o desempenho das campanhas em tempo real."
        }
      ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold inline-block neon-text-cyan mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {userType === "participante"
              ? "Tire suas dúvidas sobre como participar e ganhar prêmios."
              : "Esclareça suas dúvidas sobre como criar e gerenciar campanhas."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel mb-4 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-galaxy-purple/10 transition-colors"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <span>
                  {openIndex === index ? 
                    <Minus className="text-neon-pink" /> : 
                    <Plus className="text-neon-cyan" />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-gray-300 pt-2 border-t border-gray-700">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
