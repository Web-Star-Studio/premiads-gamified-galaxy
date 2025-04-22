
import { motion } from "framer-motion";
import { Users, Heart, Award } from "lucide-react";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const Team = () => {
  const team = [
    {
      name: "Ana Silva",
      role: "CEO & Fundadora",
      description: "Visionária em gamificação e engajamento digital",
      icon: Users
    },
    {
      name: "Pedro Santos",
      role: "CTO",
      description: "Especialista em tecnologias web e blockchain",
      icon: Award
    },
    {
      name: "Maria Costa",
      role: "Head de Customer Success",
      description: "Dedicada a criar experiências excepcionais",
      icon: Heart
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
          <h1 className="text-4xl font-bold mb-4">Nossa Equipe</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça as pessoas apaixonadas que fazem a PremiAds acontecer todos os dias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-lg border border-galaxy-purple/30 bg-galaxy-deepPurple/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-neon-cyan/10">
                  <member.icon className="h-8 w-8 text-neon-cyan" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-neon-pink mb-2">{member.role}</p>
              <p className="text-gray-400">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Team;
