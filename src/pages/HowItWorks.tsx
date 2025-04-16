
import { motion } from "framer-motion";
import KnowledgeLayout from "@/components/client/knowledge/KnowledgeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCircle, 
  Landmark, 
  Megaphone, 
  Gift, 
  Coins, 
  Award, 
  Ticket, 
  BarChart,
  PlayCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksPage = () => {
  const features = [
    {
      id: "participants",
      label: "Para Participantes",
      icon: UserCircle,
      steps: [
        {
          title: "Cadastre-se na plataforma",
          description: "Crie sua conta usando email ou redes sociais e complete seu perfil com informações básicas"
        },
        {
          title: "Explore missões disponíveis",
          description: "Navegue pelo catálogo de missões e escolha as que mais combinam com seus interesses"
        },
        {
          title: "Complete missões e ganhe pontos",
          description: "Participe das campanhas realizando ações como postagens em redes sociais, avaliações, pesquisas e muito mais"
        },
        {
          title: "Resgate recompensas",
          description: "Utilize seus pontos para resgatar prêmios, cashback, participar de sorteios exclusivos ou obter descontos"
        }
      ]
    },
    {
      id: "advertisers",
      label: "Para Anunciantes",
      icon: Megaphone,
      steps: [
        {
          title: "Crie sua conta de anunciante",
          description: "Cadastre-se como anunciante e forneça informações sobre sua empresa"
        },
        {
          title: "Adquira créditos",
          description: "Compre créditos para criar e lançar suas campanhas na plataforma"
        },
        {
          title: "Desenvolva campanhas engajantes",
          description: "Crie missões personalizadas que conectem usuários à sua marca de forma interativa"
        },
        {
          title: "Analise resultados em tempo real",
          description: "Acompanhe métricas detalhadas de engajamento, conversão e ROI de suas campanhas"
        }
      ]
    }
  ];
  
  const rewardTypes = [
    {
      title: "Pontos",
      description: "Acumule pontos ao completar missões e use-os para resgatar diversas recompensas",
      icon: Coins,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10"
    },
    {
      title: "Badges",
      description: "Coleções exclusivas que desbloqueamos quando você atinge diferentes conquistas",
      icon: Award,
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/10"
    },
    {
      title: "Sorteios",
      description: "Use seus pontos para participar de sorteios exclusivos com prêmios incríveis",
      icon: Ticket,
      color: "text-neon-lime",
      bgColor: "bg-neon-lime/10"
    },
    {
      title: "Cashback",
      description: "Receba dinheiro de volta em compras feitas nas lojas parceiras",
      icon: Landmark,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      title: "Prêmios",
      description: "Troque seus pontos por produtos físicos, digitais ou experiências exclusivas",
      icon: Gift,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10"
    }
  ];

  return (
    <KnowledgeLayout
      title="Como Funciona"
      subtitle="Descubra como a PremiAds conecta marcas e usuários"
    >
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="mb-6 bg-galaxy-deepPurple/40 p-1 w-full flex">
          {features.map(feature => (
            <TabsTrigger 
              key={feature.id} 
              value={feature.id} 
              className="flex-1 data-[state=active]:bg-galaxy-purple/40"
            >
              <feature.icon className="mr-2 h-4 w-4" />
              {feature.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {features.map(feature => (
          <TabsContent key={feature.id} value={feature.id}>
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-medium mb-6 text-neon-cyan">Como Participar</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {feature.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-galaxy-purple text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-1">{step.title}</h4>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
              
              {feature.id === "participants" && (
                <section>
                  <h3 className="text-xl font-medium mb-6 text-neon-pink">Tipos de Recompensas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rewardTypes.map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-galaxy-deepPurple/30 rounded-lg p-4 border border-galaxy-purple/20"
                      >
                        <div className={`p-3 rounded-full ${reward.bgColor} inline-block mb-3`}>
                          <reward.icon className={`h-5 w-5 ${reward.color}`} />
                        </div>
                        <h4 className="text-lg font-medium mb-1">{reward.title}</h4>
                        <p className="text-sm text-gray-400">{reward.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
              
              {feature.id === "advertisers" && (
                <section>
                  <h3 className="text-xl font-medium mb-6 text-neon-pink">Benefícios para Anunciantes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="glass">
                      <CardContent className="p-6">
                        <BarChart className="h-8 w-8 text-neon-cyan mb-4" />
                        <h4 className="text-lg font-medium mb-2">Insights detalhados</h4>
                        <p className="text-gray-400">
                          Acesse métricas detalhadas sobre o desempenho de suas campanhas, dados demográficos e comportamentais dos participantes.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card variant="glass">
                      <CardContent className="p-6">
                        <Megaphone className="h-8 w-8 text-neon-pink mb-4" />
                        <h4 className="text-lg font-medium mb-2">Engajamento autêntico</h4>
                        <p className="text-gray-400">
                          Interaja com seu público-alvo de forma genuína e crie conexões mais profundas com sua marca.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}
              
              <section className="mt-8 border-t border-galaxy-purple/30 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <PlayCircle className="text-neon-cyan h-6 w-6" />
                  <h3 className="text-xl font-medium">Vídeo Demonstrativo</h3>
                </div>
                <div className="aspect-video bg-galaxy-deepPurple/50 rounded-lg flex items-center justify-center border border-galaxy-purple/20">
                  <div className="text-center p-8">
                    <PlayCircle className="h-16 w-16 text-neon-cyan mx-auto mb-4 opacity-70" />
                    <p className="text-gray-400">Assista ao vídeo demonstrativo para ver a plataforma em ação</p>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </KnowledgeLayout>
  );
};

export default HowItWorksPage;
