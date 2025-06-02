
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const TermsOfUse = () => (
    <div className="min-h-screen bg-galaxy-dark">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6">Termos de Uso</h1>
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
            <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-300">
              Ao acessar e utilizar a plataforma PremiAds, você concorda com estes Termos de Uso e com nossa Política de Privacidade. 
              Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nosso serviço.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">2. Uso do Serviço</h2>
            <p className="text-gray-300 mb-4">
              A PremiAds oferece uma plataforma de engajamento e gamificação que conecta marcas e consumidores. Ao utilizar nosso serviço, você concorda em:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Fornecer informações precisas e atualizadas durante o registro</li>
              <li>Manter a segurança e confidencialidade de sua conta</li>
              <li>Não utilizar o serviço para atividades ilegais ou não autorizadas</li>
              <li>Não tentar acessar áreas restritas do sistema ou burlar nossos mecanismos de segurança</li>
            </ul>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">3. Contas e Responsabilidades</h2>
            <p className="text-gray-300 mb-4">
              Você é responsável por manter a confidencialidade de sua senha e informações de conta. 
              Todas as atividades que ocorrerem sob sua conta são de sua responsabilidade.
            </p>
            <p className="text-gray-300">
              A PremiAds reserva-se o direito de encerrar contas ou recusar o serviço a qualquer momento, 
              por qualquer motivo, sem aviso prévio.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">4. Propriedade Intelectual</h2>
            <p className="text-gray-300">
              Todo o conteúdo disponibilizado na plataforma PremiAds, incluindo, mas não limitado a textos, 
              gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, 
              é propriedade da PremiAds ou de seus fornecedores de conteúdo e está protegido por leis de 
              propriedade intelectual.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">5. Modificações dos Termos</h2>
            <p className="text-gray-300">
              A PremiAds reserva-se o direito de modificar estes termos a qualquer momento. 
              Alterações entrarão em vigor após a publicação dos termos atualizados. 
              O uso continuado do serviço após tais alterações constitui aceitação dos novos termos.
            </p>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );

export default TermsOfUse;
