
import { motion } from "framer-motion";
import { Award, CheckCircle, LightbulbIcon, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const values = [
  {
    title: "Inovação",
    description: "Buscamos constantemente novas formas de conectar anunciantes e consumidores, mantendo nossa plataforma na vanguarda da tecnologia.",
    icon: LightbulbIcon,
    color: "text-neon-cyan",
    bgColor: "bg-neon-cyan/10"
  },
  {
    title: "Transparência",
    description: "Acreditamos em relações claras e honestas com todos os nossos parceiros, anunciantes e consumidores.",
    icon: Shield,
    color: "text-neon-lime",
    bgColor: "bg-neon-lime/10"
  },
  {
    title: "Gamificação",
    description: "Transformamos a publicidade em uma experiência divertida e recompensadora para todos os envolvidos.",
    icon: Award,
    color: "text-neon-pink",
    bgColor: "bg-neon-pink/10"
  },
  {
    title: "Qualidade",
    description: "Comprometemo-nos a oferecer uma plataforma de alta qualidade e resultados excepcionais para anunciantes e consumidores.",
    icon: CheckCircle,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  }
];

const ValuesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
          Nossos Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 bg-galaxy-deepPurple/30 hover:bg-galaxy-deepPurple/50 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className={cn("p-3 rounded-lg mr-4", value.bgColor)}>
                      <value.icon className={cn("h-6 w-6", value.color)} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                      <p className="text-gray-400">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
