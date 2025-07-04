import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Trophy, 
  Smartphone, 
  Zap, 
  Gift, 
  Star, 
  Users, 
  ArrowRight,
  Play,
  ChevronDown,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  Target,
  Sparkles
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import CookieConsent from "@/components/CookieConsent"
import PremiAdsLogo from "@/components/PremiAdsLogo"

const PremiAdsLanding = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 1000], [0, -200])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSignUp = () => {
    navigate("/auth")
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] via-[#1A1F30] to-[#0A0B14] text-white overflow-x-hidden">
      {/* Header fixo */}
      <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PremiAdsLogo className="h-10" />
          </div>
          <Button 
            onClick={handleSignUp}
            className="bg-gradient-to-r from-[#4400b9] to-[#fe690d] hover:shadow-lg hover:shadow-[#fe690d]/25 transition-all duration-300"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
        style={{ y: yBg }}
      >
        {/* Particles Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#4400b9] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#fe690d] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#4400b9]/10 to-[#fe690d]/10 rounded-full filter blur-3xl animate-pulse" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/4 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
          <div className="w-8 h-8 bg-[#fe690d] rounded-full opacity-60" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}>
          <div className="w-6 h-6 bg-[#4400b9] rounded-full opacity-60" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Ganhe Recompensas por{" "}
              <span className="bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent animate-pulse">
                Curtir, Avaliar
              </span>{" "}
              e{" "}
              <span className="bg-gradient-to-r from-[#fe690d] to-[#4400b9] bg-clip-text text-transparent animate-pulse">
                Postar
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Missões diárias. Cashback instantâneo. Rifas com prêmios absurdos. 
              <span className="text-[#fe690d] font-semibold"> Tudo de graça.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mb-12"
            >
              <Button 
                onClick={handleSignUp}
                className="bg-gradient-to-r from-[#4400b9] to-[#fe690d] hover:shadow-2xl hover:shadow-[#fe690d]/30 text-xl px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300 group"
              >
                QUERO COMEÇAR AGORA 
                <Zap className="ml-2 h-5 w-5 group-hover:animate-bounce" />
              </Button>
            </motion.div>

            {/* Floating Icons */}
            <div className="relative">
              <motion.div 
                className="absolute -left-20 top-0"
                animate={{ y: [-10, 10], rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="h-12 w-12 text-[#fe690d] opacity-80" />
              </motion.div>
              <motion.div 
                className="absolute -right-20 top-0"
                animate={{ y: [10, -10], rotate: [360, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gift className="h-12 w-12 text-[#4400b9] opacity-80" />
              </motion.div>
              
              {/* Moedas Girando */}
              <motion.div 
                className="absolute -top-10 left-10"
                animate={{ rotate: 360, y: [-5, 5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xs font-bold">
                  $
                </div>
              </motion.div>
              <motion.div 
                className="absolute -top-16 right-16"
                animate={{ rotate: -360, y: [5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xs font-bold">
                  $
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => scrollToSection('como-funciona')}
          >
            <ChevronDown className="h-8 w-8 text-white/60" />
          </motion.div>
        </div>
      </motion.section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#4400b9]/10 rounded-full animate-pulse" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#fe690d]/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              Como funciona?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Escolha uma Missão",
                description: "Avalie, indique, poste ou responda algo simples.",
                color: "from-[#4400b9] to-purple-600"
              },
              {
                icon: Award,
                title: "Ganhe Recompensas", 
                description: "Receba até R$5 de cashback + Rifas por cada missão.",
                color: "from-[#fe690d] to-orange-600"
              },
              {
                icon: Trophy,
                title: "Participe de Sorteios",
                description: "Concorrendo a iPhones, cruzeiros, camarotes e mais.",
                color: "from-purple-600 to-[#4400b9]"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center group"
              >
                <Card className="p-8 bg-black/40 border-white/10 hover:border-[#fe690d]/50 transition-all duration-300 backdrop-blur-sm group-hover:scale-105">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300 text-lg">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prêmios em Destaque */}
      <section className="py-20 bg-gradient-to-r from-black/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              O que você pode ganhar?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12">
            {[
              { name: "iPhone 16 Pro", icon: Smartphone, gradient: "from-[#4400b9] to-purple-600" },
              { name: "PlayStation 5", icon: Trophy, gradient: "from-[#fe690d] to-red-600" },
              { name: "Cruzeiro All Inclusive", icon: Star, gradient: "from-blue-600 to-[#4400b9]" },
              { name: "Camarote VIP", icon: Users, gradient: "from-[#fe690d] to-yellow-600" },
              { name: "Passagens de Avião", icon: Zap, gradient: "from-green-600 to-[#4400b9]" },
              { name: "Carro 0km", icon: Gift, gradient: "from-[#4400b9] to-[#fe690d]" }
            ].map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card className="p-6 bg-black/60 border-white/20 hover:border-[#fe690d]/60 transition-all duration-300 backdrop-blur-sm h-full">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${prize.gradient} flex items-center justify-center mb-4 group-hover:animate-spin transition-all duration-300`}>
                    <prize.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#fe690d] transition-colors">
                    {prize.name}
                  </h3>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xl text-gray-300 mb-6">
              📲 Quanto mais você interage, mais chances você tem.
            </p>
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-[#4400b9] to-[#fe690d] hover:shadow-xl hover:shadow-[#fe690d]/25 text-lg px-6 py-3"
            >
              Começar Agora
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              Gente como você. Ganhando de verdade.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Carla",
                city: "Recife/PE",
                testimonial: "Avaliei uma loja no Google e ganhei R$10 em cashback!",
                avatar: "🙋‍♀️"
              },
              {
                name: "Bruno", 
                city: "São Paulo/SP",
                testimonial: "Postei um story e entrei no sorteio de um PlayStation!",
                avatar: "🧑‍💻"
              },
              {
                name: "Felipe",
                city: "Rio de Janeiro/RJ", 
                testimonial: "Fiz 3 missões e já juntei 9 rifas. Bora pro iPhone!",
                avatar: "🎯"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="p-6 bg-black/40 border-white/10 hover:border-[#fe690d]/50 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#4400b9] to-[#fe690d] rounded-full flex items-center justify-center text-2xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.city}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.testimonial}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vídeo de Apresentação */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              Veja a mágica acontecendo
            </h2>
            <p className="text-gray-300 text-lg">1 minuto pra entender por que todo mundo tá usando a PremiAds.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative aspect-video bg-black/60 rounded-xl overflow-hidden border border-white/20 group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4400b9]/20 to-[#fe690d]/20">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2">Demo da Plataforma PremiAds</h3>
                <p className="text-gray-300">Veja como é simples ganhar recompensas reais</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marcas Participantes */}
      <section className="py-20 bg-gradient-to-r from-transparent to-black/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              Essas marcas já anunciaram com a gente
            </h2>
            <p className="text-gray-300 text-lg">Toda missão é uma ação real de marketing que vale pra você.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center justify-center h-20 bg-white/10 rounded-lg border border-white/20"
              >
                <span className="text-2xl font-bold text-white/60">MARCA</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              Tem dúvidas? A gente responde.
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "A PremiAds é confiável?",
                answer: "Totalmente. Usamos tecnologia real, sorteios autorizados e você não gasta nada."
              },
              {
                question: "Preciso pagar para usar?",
                answer: "Nunca. Você só ganha: rifas, cashback e prêmios."
              },
              {
                question: "O que as marcas ganham com isso?",
                answer: "Clientes reais, visibilidade e engajamento. Todo mundo sai ganhando."
              },
              {
                question: "Como recebo meu cashback?",
                answer: "Via Pix, cupom ou crédito. Tudo 100% rastreável."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 bg-black/40 border-white/10 hover:border-[#fe690d]/50 transition-all duration-300 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#4400b9]/20 to-[#fe690d]/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#4400b9] to-[#fe690d] bg-clip-text text-transparent">
              Pronto para começar?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão ganhando dinheiro e prêmios incríveis todos os dias.
            </p>
            <Button 
              onClick={handleSignUp}
              className="bg-gradient-to-r from-[#4400b9] to-[#fe690d] hover:shadow-2xl hover:shadow-[#fe690d]/30 text-2xl px-12 py-6 rounded-xl transform hover:scale-105 transition-all duration-300 group"
            >
              CRIAR CONTA GRÁTIS
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PremiAdsLogo className="h-10" />
              </div>
              <p className="text-gray-400">
                PremiAds® — Publicidade interativa com propósito. Desenvolvido no Brasil.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/sobre" className="hover:text-[#fe690d] transition-colors">Sobre</a></li>
                <li><a href="/termos-de-uso" className="hover:text-[#fe690d] transition-colors">Termos de Uso</a></li>
                <li><a href="/politica-de-privacidade" className="hover:text-[#fe690d] transition-colors">Política de Privacidade</a></li>
                <li><a href="/suporte" className="hover:text-[#fe690d] transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#fe690d] transition-colors">
                  <Users className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#fe690d] transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#fe690d] transition-colors">
                  <Share2 className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Receba novidades sobre prêmios e missões.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#fe690d]"
                />
                <Button className="bg-gradient-to-r from-[#4400b9] to-[#fe690d] rounded-l-none">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PremiAds. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* CTA Fixo */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-8 md:w-auto">
        <Button 
          onClick={handleSignUp}
          className="w-full md:w-auto bg-gradient-to-r from-[#4400b9] to-[#fe690d] hover:shadow-2xl hover:shadow-[#fe690d]/30 text-lg px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 group shadow-lg"
        >
          QUERO COMEÇAR AGORA 
          <Zap className="ml-2 h-5 w-5 group-hover:animate-bounce" />
        </Button>
      </div>

      <CookieConsent />
    </div>
  )
}

export default PremiAdsLanding
