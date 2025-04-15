
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const team = [
  {
    name: "Felipe Antunes",
    role: "CEO/CTO",
    description: "Visionário tecnológico com experiência em marketing digital e desenvolvimento de plataformas.",
    image: "/placeholder.svg"
  },
  {
    name: "Guilherme Brennand",
    role: "CMO/COO",
    description: "Estrategista de marketing com foco em crescimento e operações eficientes.",
    image: "/placeholder.svg"
  }
];

const TeamSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2">
          <Users className="h-6 w-6 text-neon-cyan" />
          Nossa Equipe
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel rounded-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-galaxy-deepPurple/50">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-48"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-neon-cyan mb-3">{member.role}</p>
                <p className="text-gray-400">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
