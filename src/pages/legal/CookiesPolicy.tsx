
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";

const CookiesPolicy = () => (
    <div className="min-h-screen bg-galaxy-dark">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6">Política de Cookies</h1>
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
            <h2 className="text-2xl font-bold mb-4">1. O que são Cookies?</h2>
            <p className="text-gray-300">
              Cookies são pequenos arquivos de texto que são armazenados em seu computador ou dispositivo móvel 
              quando você visita um site. Eles permitem que o site lembre suas ações e preferências por um 
              período de tempo, para que você não precise reinserir determinadas informações toda vez que 
              visitar o site ou navegar de uma página para outra.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">2. Como Usamos os Cookies</h2>
            <p className="text-gray-300 mb-4">
              A PremiAds utiliza cookies para diversos propósitos:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site</li>
              <li><strong>Cookies de funcionalidade:</strong> Permitem lembrar suas escolhas e preferências</li>
              <li><strong>Cookies de desempenho:</strong> Coletam informações sobre como você usa nosso site</li>
              <li><strong>Cookies de publicidade:</strong> Utilizados para entregas de anúncios relevantes</li>
              <li><strong>Cookies de análise:</strong> Ajudam a entender como os visitantes interagem com o site</li>
            </ul>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">3. Tipos de Cookies que Utilizamos</h2>
            <p className="text-gray-300 mb-4">
              Nosso site utiliza diferentes categorias de cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Cookies de sessão:</strong> Temporários, excluídos quando você fecha o navegador</li>
              <li><strong>Cookies persistentes:</strong> Permanecem no dispositivo por um período específico</li>
              <li><strong>Cookies próprios:</strong> Definidos pelo nosso site</li>
              <li><strong>Cookies de terceiros:</strong> Definidos por outros domínios que não o nosso site</li>
            </ul>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">4. Gerenciamento de Cookies</h2>
            <p className="text-gray-300 mb-4">
              Você pode controlar e gerenciar cookies de várias maneiras:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Configurações do navegador: Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado</li>
              <li>Configurações de preferência: Nosso banner de cookies permite que você personalize suas preferências</li>
              <li>Ferramentas de terceiros: Existem plugins de navegador que ajudam a gerenciar cookies</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Note que bloquear certos cookies pode afetar sua experiência em nosso site e limitar alguns recursos.
            </p>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-galaxy-deepPurple/30 backdrop-blur-sm p-6 rounded-lg border border-galaxy-purple/30"
          >
            <h2 className="text-2xl font-bold mb-4">5. Alterações em nossa Política de Cookies</h2>
            <p className="text-gray-300">
              Podemos atualizar nossa Política de Cookies periodicamente. As alterações entrarão em vigor 
              imediatamente após sua publicação em nosso site. Recomendamos que você revise esta página 
              regularmente para se manter informado sobre quaisquer mudanças.
            </p>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );

export default CookiesPolicy;
