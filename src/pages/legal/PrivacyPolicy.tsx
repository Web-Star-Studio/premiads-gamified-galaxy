
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-galaxy-dark">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6">Política de Privacidade</h1>
          <p className="text-gray-400 mb-4">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </motion.div>
        
        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-300 mb-4">
              A PremiAds coleta diversos tipos de informações para fornecer e melhorar nossa plataforma:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Informações de cadastro (nome, e-mail, telefone)</li>
              <li>Informações de perfil e preferências</li>
              <li>Dados de uso e interação com a plataforma</li>
              <li>Informações do dispositivo e navegador</li>
              <li>Localização geográfica (com seu consentimento)</li>
            </ul>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-gray-300 mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Personalizar sua experiência</li>
              <li>Processar transações e recompensas</li>
              <li>Comunicar sobre atualizações, promoções e notícias</li>
              <li>Analisar como nossa plataforma é utilizada</li>
              <li>Prevenir atividades fraudulentas e aumentar a segurança</li>
            </ul>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-gray-300 mb-4">
              Podemos compartilhar suas informações com:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Parceiros e anunciantes (de forma agregada e anônima)</li>
              <li>Provedores de serviços que nos auxiliam</li>
              <li>Autoridades legais, quando exigido por lei</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Não vendemos suas informações pessoais a terceiros.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">4. Seus Direitos e Escolhas</h2>
            <p className="text-gray-300 mb-4">
              Você tem o direito de:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Acessar, corrigir ou excluir seus dados pessoais</li>
              <li>Retirar seu consentimento a qualquer momento</li>
              <li>Optar por não receber comunicações de marketing</li>
              <li>Solicitar restrição do processamento de seus dados</li>
            </ul>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">5. Segurança</h2>
            <p className="text-gray-300">
              Empregamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais. 
              No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro, 
              e não podemos garantir segurança absoluta.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">6. Alterações na Política de Privacidade</h2>
            <p className="text-gray-300">
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre alterações 
              significativas por meio de uma notificação visível em nossa plataforma ou por e-mail.
            </p>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
