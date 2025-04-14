
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const { userType } = useUser();
  
  const footerLinks = [
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "#" },
        { name: "Nosso Time", href: "#" },
        { name: "Carreiras", href: "#" },
        { name: "Contato", href: "#" }
      ]
    },
    {
      title: userType === "participante" ? "Para Participantes" : "Para Anunciantes",
      links: userType === "participante" 
        ? [
            { name: "Como Participar", href: "#" },
            { name: "Catálogo de Prêmios", href: "#" },
            { name: "Missões Disponíveis", href: "#" },
            { name: "Programa de Indicação", href: "#" }
          ]
        : [
            { name: "Soluções", href: "#" },
            { name: "Estudos de Caso", href: "#" },
            { name: "Preços", href: "#" },
            { name: "API & Integrações", href: "#" }
          ]
    },
    {
      title: "Recursos",
      links: [
        { name: "Blog", href: "#" },
        { name: "Tutoriais", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Suporte", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#" },
    { icon: <Twitter size={18} />, href: "#" },
    { icon: <Instagram size={18} />, href: "#" },
    { icon: <Linkedin size={18} />, href: "#" }
  ];

  return (
    <footer className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-galaxy-dark/90"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h2 className="text-2xl font-bold font-orbitron mb-6">
              <span className="text-white">Premi</span>
              <span className="neon-text-cyan">Ads</span>
            </h2>
            
            <p className="text-gray-400 mb-6">
              Transformando engajamento em experiências gamificadas que conectam marcas e pessoas.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="w-10 h-10 rounded-full bg-galaxy-deepPurple/50 flex items-center justify-center text-gray-300 hover:text-neon-cyan hover:bg-galaxy-deepPurple/80 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((category, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-6">{category.title}</h3>
              <ul className="space-y-4">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h3 className="text-lg font-bold mb-6">Inscreva-se</h3>
            <p className="text-gray-400 mb-4">
              Receba novidades sobre missões e promoções exclusivas.
            </p>
            
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu email"
                className="bg-galaxy-deepPurple/50 border-gray-700"
              />
              <Button size="icon" className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PremiAds. Todos os direitos reservados.
          </p>
          
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-neon-cyan transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
