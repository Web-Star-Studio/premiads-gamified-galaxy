
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
          name: "Ana Silva",
          location: "São Paulo, SP",
          quote: "Ganhei uma super caixa surpresa em minutos! Nunca imaginei que seria tão fácil ganhar prêmios apenas interagindo com as marcas que já gosto.",
          image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          name: "Bruno Costa",
          location: "Rio de Janeiro, RJ",
          quote: "Já resgatei 3 prêmios este mês! As missões são divertidas e me conectam com marcas que realmente combinam com meu estilo de vida.",
          image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          name: "Carla Mendes",
          location: "Belo Horizonte, MG",
          quote: "As streak missions são viciantes! Estou há 15 dias consecutivos completando desafios e os bônus estão cada vez melhores.",
          image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
      ]
    : [
        {
          name: "TechStore",
          position: "CEO, E-commerce",
          quote: "Vimos 45% mais engajamento em 1 semana! Nossa taxa de conversão aumentou significativamente após implementarmos as campanhas gamificadas.",
          image: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
          name: "Café Cultura",
          position: "Diretor de Marketing",
          quote: "Nossa base de clientes fiéis aumentou 30% em apenas 2 meses. A gamificação trouxe um novo público que antes não conhecia nossa marca.",
          image: "https://randomuser.me/api/portraits/women/63.jpg"
        },
        {
          name: "FitLife",
          position: "Gerente de Produto",
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
    <section id="depoimentos" className="py-24 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-purple-glow opacity-5 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full border border-galaxy-purple/50 bg-galaxy-deepPurple/50"
          >
            Histórias de sucesso
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            O Que Dizem Sobre Nós
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            {userType === "participante"
              ? "Veja o que outros participantes estão falando sobre nossas missões."
              : "Descubra como outras empresas estão aumentando o engajamento com suas marcas."}
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-neon-cyan/30">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3 text-center md:text-left">
                <div className="flex mb-3 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-neon-cyan" fill="currentColor" />
                  ))}
                </div>
                
                <blockquote className="text-xl italic mb-5 font-light">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                <div>
                  <div className="font-semibold text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {userType === "participante" 
                      ? testimonials[currentIndex].location 
                      : testimonials[currentIndex].position
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-neon-cyan w-6"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
