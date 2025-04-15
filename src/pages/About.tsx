import { motion } from "framer-motion";
import { Award, CheckCircle, LightbulbIcon, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadeInVariants } from "@/utils/animation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
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

  return (
    <div className="min-h-screen bg-galaxy-dark flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-galaxy-gradient z-0"></div>
          <div className="absolute inset-0 bg-purple-glow opacity-30 z-0"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Sobre a <span className="text-white">Premi</span>
                <span className="text-neon-cyan">Ads</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Transformando a publicidade em uma experiência gamificada e recompensadora.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-galaxy-deepPurple/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Nossa Missão
              </h2>
              <div className="glass-panel p-8 rounded-lg">
                <p className="text-gray-300 text-lg leading-relaxed">
                  A PremiAds nasceu com a missão de revolucionar o marketing digital, criando uma plataforma onde anunciantes, parceiros e consumidores podem interagir de forma gamificada e mutuamente benéfica.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
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

        {/* Vision Section */}
        <section className="py-16 bg-galaxy-deepPurple/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Nossa Visão
              </h2>
              <div className="glass-panel p-8 rounded-lg">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Acreditamos em um futuro onde a publicidade seja uma experiência prazerosa e recompensadora para todas as partes envolvidas. Nossa plataforma conecta anunciantes a consumidores realmente interessados em seus produtos, permitindo interações genuínas e valiosas.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* For Advertisers & Consumers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-lg"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-neon-cyan">
                  Para Anunciantes
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Oferecemos uma forma inovadora de engajar consumidores através de missões interativas, gerando leads qualificados e fornecendo métricas detalhadas sobre suas campanhas.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-lg"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-neon-pink">
                  Para Consumidores
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Criamos um ambiente divertido onde os usuários podem completar missões, ganhar pontos e concorrer a prêmios enquanto interagem com marcas de seu interesse.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-galaxy-deepPurple/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Nossa Tecnologia
              </h2>
              <div className="glass-panel p-8 rounded-lg">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Utilizamos tecnologia de ponta para criar uma plataforma segura, intuitiva e eficiente, garantindo a melhor experiência para todos os nossos usuários.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
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
      </main>

      <Footer />
    </div>
  );
};

export default About;
