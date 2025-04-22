
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Footer = () => {
  const { userType } = useUser();
  const navigate = useNavigate();
  
  const openWhatsApp = () => {
    const phoneNumber = "5581985595912";
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre o PremiAds!");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (email) {
      toast.success("Inscrição realizada com sucesso!");
      form.reset();
    } else {
      toast.error("Por favor, insira um email válido");
    }
  };
  
  const handleNavigation = (route) => {
    navigate(route);
    window.scrollTo(0, 0);
  };
  
  const footerLinks = [
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "/sobre", isRouterLink: true },
        { name: "Nosso Time", href: "/nosso-time", isRouterLink: true },
        { name: "Carreiras", href: "/carreiras", isRouterLink: true },
        { name: "Contato", href: "#", action: openWhatsApp }
      ]
    },
    {
      title: userType === "participante" ? "Para Participantes" : "Para Anunciantes",
      links: userType === "participante" 
        ? [
            { name: "Como Participar", href: "/como-funciona", isRouterLink: true },
            { name: "Catálogo de Prêmios", href: "/cliente/cashback", isRouterLink: true },
            { name: "Missões Disponíveis", href: "/cliente/missoes", isRouterLink: true },
            { name: "Programa de Indicação", href: "/cliente/indicacoes", isRouterLink: true }
          ]
        : [
            { name: "Soluções", href: "/como-funciona", isRouterLink: true },
            { name: "Estudos de Caso", href: "/blog", isRouterLink: true },
            { name: "Preços", href: "/tour", isRouterLink: true },
            { name: "API & Integrações", href: "/admin/documentacao", isRouterLink: true }
          ]
    },
    {
      title: "Recursos",
      links: [
        { name: "Blog", href: "/blog", isRouterLink: true },
        { name: "Tutoriais", href: "/tutoriais", isRouterLink: true },
        { name: "FAQ", href: "/faq", isRouterLink: true },
        { name: "Suporte", href: "/suporte", isRouterLink: true }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "https://facebook.com", newTab: true },
    { icon: <Twitter size={18} />, href: "https://twitter.com", newTab: true },
    { icon: <Instagram size={18} />, href: "https://instagram.com", newTab: true },
    { icon: <Linkedin size={18} />, href: "https://linkedin.com", newTab: true }
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
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
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
                    {link.isRouterLink ? (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-neon-cyan transition-colors"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={link.action}
                        className="text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer"
                      >
                        {link.name}
                      </a>
                    )}
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
            
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu email"
                className="bg-galaxy-deepPurple/50 border-gray-700"
              />
              <Button type="submit" size="icon" className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-500 text-sm mb-2">
              &copy; {new Date().getFullYear()} PremiAds. Todos os direitos reservados. 
              Desenvolvido por <a href="https://www.webstar.studio" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">Web Star Studio</a>
            </p>
            <p className="text-gray-500 text-sm">
              PremiAds - Recife - PE - CEP: 51.160-330
            </p>
            <p className="text-gray-500 text-sm">
              <a href="mailto:info@premiads.com" className="hover:text-neon-cyan transition-colors">info@premiads.com</a> | 
              <a onClick={openWhatsApp} className="ml-2 hover:text-neon-cyan transition-colors cursor-pointer">+55 81 9 8559 5912</a>
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="/termos-de-uso" className="hover:text-neon-cyan transition-colors">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="hover:text-neon-cyan transition-colors">Política de Privacidade</Link>
            <Link to="/cookies" className="hover:text-neon-cyan transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
