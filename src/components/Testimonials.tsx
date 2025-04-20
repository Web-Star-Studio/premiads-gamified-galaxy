
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const Testimonials = () => {
  const { userType } = useUser();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = userType === "participante"
    ? [
        {
          name: "Ana",
          location: "São Paulo, SP",
          quote: "Ganhei uma super caixa surpresa em minutos! Nunca imaginei que seria tão fácil ganhar prêmios apenas interagindo com as marcas que já gosto.",
          image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          name: "Bruno",
          location: "Rio de Janeiro, RJ",
          quote: "Já resgatei 3 prêmios este mês! As missões são divertidas e me conectam com marcas que realmente combinam com meu estilo de vida.",
          image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          name: "Carla",
          location: "Belo Horizonte, MG",
          quote: "As streak missions são viciantes! Estou há 15 dias consecutivos completando desafios e os bônus estão cada vez melhores.",
          image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
      ]
    : [
        {
          name: "TechStore",
          location: "São Paulo, SP",
          quote: "Vimos 45% mais engajamento em 1 semana! Nossa taxa de conversão aumentou significativamente após implementarmos as campanhas gamificadas.",
          image: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
          name: "Café Cultura",
          location: "Curitiba, PR",
          quote: "Nossa base de clientes fiéis aumentou 30% em apenas 2 meses. A gamificação trouxe um novo público que antes não conhecia nossa marca.",
          image: "https://randomuser.me/api/portraits/women/63.jpg"
        },
        {
          name: "FitLife",
          location: "Brasília, DF",
          quote: "Os relatórios em tempo real nos permitem ajustar as campanhas rapidamente. Nosso ROI aumentou mais de 200% com as missões gamificadas.",
          image: "https://randomuser.me/api/portraits/men/54.jpg"
        }
      ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="depoimentos" className="py-20 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-purple-glow opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold inline-block neon-text-lime mb-4">
            Depoimentos
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {userType === "participante"
              ? "Veja o que outros participantes estão falando sobre nossas missões."
              : "Descubra como outras empresas estão aumentando o engajamento com suas marcas."}
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full glass-panel neon-border border-neon-cyan hover:scale-110 transition-transform"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-neon-cyan"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full glass-panel neon-border border-neon-cyan hover:scale-110 transition-transform"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="mb-4 md:mb-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neon-lime/50">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center text-neon-lime mb-2">
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                </div>
                
                <blockquote className="text-xl italic mb-4">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                <div>
                  <div className="font-bold font-orbitron">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-400">
                    {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
