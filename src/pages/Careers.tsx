
import { motion } from "framer-motion";
import { Rocket, Target, Heart, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const Careers = () => {
  const positions = [
    {
      title: "Desenvolvedor Frontend React",
      department: "Tecnologia",
      location: "Remoto",
      type: "Tempo Integral"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Recife, PE",
      type: "Tempo Integral"
    },
    {
      title: "Customer Success Manager",
      department: "Sucesso do Cliente",
      location: "Híbrido",
      type: "Tempo Integral"
    }
  ];

  const benefits = [
    {
      icon: Rocket,
      title: "Crescimento Acelerado",
      description: "Oportunidades de desenvolvimento e promoção rápida"
    },
    {
      icon: Target,
      title: "Flexibilidade",
      description: "Trabalho remoto e horário flexível"
    },
    {
      icon: Heart,
      title: "Saúde e Bem-estar",
      description: "Plano de saúde e academia"
    },
    {
      icon: Trophy,
      title: "Reconhecimento",
      description: "Programa de bonificação por resultados"
    }
  ];

  return (
    <div className="min-h-screen bg-galaxy-dark">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Carreiras na PremiAds</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Junte-se a nós na missão de transformar a forma como marcas e pessoas se conectam.
          </p>
        </motion.div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border border-galaxy-purple/30 bg-galaxy-deepPurple/30 backdrop-blur-sm"
              >
                <benefit.icon className="h-8 w-8 text-neon-cyan mb-4" />
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8">Vagas Abertas</h2>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border border-galaxy-purple/30 bg-galaxy-deepPurple/30 backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                    <p className="text-gray-400">
                      {position.department} · {position.location} · {position.type}
                    </p>
                  </div>
                  <Button className="mt-4 md:mt-0">
                    Candidatar-se
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
