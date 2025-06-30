
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Headphones, 
  Gamepad2, 
  Tablet, 
  BookOpen, 
  Speaker,
  Star,
  Check,
  Trophy,
  Zap,
  Target,
  Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const LandingPage2 = () => {
  const navigate = useNavigate();

  const prizes = [
    { icon: Smartphone, name: 'iPhone', description: 'O smartphone dos sonhos, agora ao seu alcance' },
    { icon: Headphones, name: 'Fones Bluetooth', description: 'Qualidade de som sem fios' },
    { icon: Gamepad2, name: 'PlayStation & Nintendo Switch', description: 'Diversão para todos os momentos' },
    { icon: Tablet, name: 'Tablets & Smartwatches', description: 'Conectividade para o seu dia a dia' },
    { icon: BookOpen, name: 'Kindle', description: 'Leitura sem fim, onde você estiver' },
    { icon: Speaker, name: 'Caixas de Som', description: 'Potência para sua música' }
  ];

  const testimonials = [
    {
      name: 'Lucas Moreira',
      text: 'Ganhei cashback só por ir até a loja e tirar uma foto. Nunca imaginei que seria tão fácil!'
    },
    {
      name: 'Jéssica Rocha', 
      text: 'Troquei meus pontos por rifas e ganhei um smartwatch. Já estou em busca do próximo prêmio!'
    },
    {
      name: 'André Lima',
      text: 'É divertido, recompensador e me faz sentir parte das marcas que eu gosto. Virei fã!'
    }
  ];

  const advantages = [
    'Missões rápidas e acessíveis',
    'Pontos acumulativos e rankings mensais', 
    'Cashback de verdade',
    'Zero custo para participar',
    'Experiência gamificada e fácil de usar'
  ];

  const handleSignUp = () => navigate('/auth');
  const handleViewMissions = () => navigate('/cliente');
  const handleViewRanking = () => navigate('/cliente/sorteios');

  return (
    <div className="min-h-screen bg-galaxy-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-24 pb-16 px-4"
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-cyan via-neon-pink to-galaxy-purple bg-clip-text text-transparent"
          >
            A NOVA ERA DA PUBLICIDADE INTERATIVA COMEÇA COM VOCÊ
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Transforme sua rotina digital em recompensas reais.
            Com a PremiAds, cada foto, visita ou avaliação vale pontos, cashback e até prêmios como iPhones, PlayStations e experiências únicas.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-neon-cyan to-neon-pink hover:from-neon-pink hover:to-neon-cyan transition-all duration-300 text-lg px-8 py-3 h-auto"
            >
              <Gift className="mr-2 h-5 w-5" />
              Começar Agora - É Grátis!
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* What is PremiAds */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-galaxy-deepPurple/20"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Zap className="text-neon-cyan mr-3 h-8 w-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">O QUE É A PREMIADS?</h2>
          </div>
          
          <p className="text-lg md:text-xl text-center text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A PremiAds é uma plataforma revolucionária de publicidade interativa por missões. 
            Marcas propõem desafios, você participa e é recompensado de verdade. 
            Sem enrolação, sem promessas vazias.
          </p>
        </div>
      </motion.section>

      {/* How it Works */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Target className="text-neon-pink mr-3 h-8 w-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">COMO FUNCIONA?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Escolha Missões Que Combinam Com Você',
                description: 'Poste uma foto com um produto, visite uma loja, indique amigos, responda uma pesquisa e muito mais.'
              },
              {
                step: '2', 
                title: 'Ganhe Cashback e Pontos',
                description: 'Cada missão concluída gera pontos e dinheiro de volta direto na sua conta da PremiAds.'
              },
              {
                step: '3',
                title: 'Participe de Sorteios Incríveis', 
                description: 'Troque seus pontos por rifas digitais e concorra a prêmios de alto valor, como gadgets, games, experiências e muito mais.'
              },
              {
                step: '4',
                title: 'Suba de Nível e Desbloqueie Recompensas',
                description: 'Quanto mais missões você realiza, mais você ganha. Suba no ranking, desbloqueie novos benefícios e receba ofertas exclusivas.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-galaxy-deepPurple/40 border-galaxy-purple/30 h-full hover:border-neon-cyan/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-neon-cyan">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Prizes Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-galaxy-deepPurple/20"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Trophy className="text-neon-lime mr-3 h-8 w-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">PRÊMIOS QUE VOCÊ PODE GANHAR</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prizes.map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-galaxy-deepPurple/40 border-galaxy-purple/30 hover:border-neon-lime/50 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <prize.icon className="h-12 w-12 text-neon-lime mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold mb-2 text-neon-lime">{prize.name}</h3>
                    <p className="text-gray-300">{prize.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Results Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Star className="text-neon-pink mr-3 h-8 w-8" />
            <h2 className="text-3xl md:text-4xl font-bold">RESULTADOS REAIS</h2>
          </div>
          
          <p className="text-xl mb-8 text-gray-300">Com a PremiAds, o engajamento não é só curtida. Ele vira:</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              'Dinheiro de volta no seu bolso',
              'Prêmios tangíveis e desejados', 
              'Reconhecimento no ranking dos mais engajados',
              'Parcerias com marcas que você ama'
            ].map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 p-4 rounded-lg border border-neon-cyan/30"
              >
                <Check className="text-neon-lime mb-2 mx-auto h-6 w-6" />
                <p className="text-gray-200">{result}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-galaxy-deepPurple/20"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ❤️ POR QUE OS USUÁRIOS AMAM A PREMIADS?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-galaxy-deepPurple/40 border-galaxy-purple/30 h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                    <p className="text-neon-cyan font-semibold">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Advantages */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            🔥 VANTAGENS EXCLUSIVAS PARA VOCÊ
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2 bg-gradient-to-r from-neon-lime/20 to-neon-cyan/20 p-3 rounded-lg border border-neon-lime/30"
              >
                <Check className="text-neon-lime h-5 w-5 flex-shrink-0" />
                <span className="text-sm text-gray-200">{advantage}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-gradient-to-r from-galaxy-deepPurple to-galaxy-dark"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-lime bg-clip-text text-transparent">
            🚀 ENTRE NA PREMIADS AGORA
          </h2>
          
          <p className="text-xl mb-4 text-gray-300">Comece sua jornada e descubra o lado divertido de interagir com marcas.</p>
          
          <div className="space-y-2 mb-8 text-lg">
            <p className="text-neon-cyan">🎁 Ganhe seus primeiros pontos ainda hoje.</p>
            <p className="text-neon-pink">🎉 Missões ativas te esperando.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-neon-cyan to-neon-pink hover:from-neon-pink hover:to-neon-cyan transition-all duration-300 text-lg px-8 py-3 h-auto"
            >
              Criar Conta na PremiAds
            </Button>
            
            <Button 
              onClick={handleViewMissions}
              variant="outline" 
              className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-galaxy-dark text-lg px-8 py-3 h-auto"
            >
              Acessar Minhas Missões
            </Button>
            
            <Button 
              onClick={handleViewRanking}
              variant="outline"
              className="border-neon-lime text-neon-lime hover:bg-neon-lime hover:text-galaxy-dark text-lg px-8 py-3 h-auto"
            >
              Ver Ranking de Prêmios
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage2;
