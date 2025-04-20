
import { useUser } from "@/context/UserContext";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Footer = () => {
  const { userType } = useUser();
  
  const footerLinks = [
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", href: "/sobre", isRouterLink: true },
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
        { name: "Blog", href: "/blog", isRouterLink: true },
        { name: "Tutoriais", href: "/tutoriais", isRouterLink: true },
        { name: "FAQ", href: "/faq", isRouterLink: true },
        { name: "Suporte", href: "/suporte", isRouterLink: true }
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
    <footer className="pt-16 pb-8 relative bg-galaxy-deepPurple/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-white">Premi</span>
              <span className="text-neon-cyan">Ads</span>
            </h2>
            
            <p className="text-gray-400 mb-6">
              Transformando engajamento em experiências gamificadas que conectam marcas e pessoas.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-neon-cyan hover:bg-white/10 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((category, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-5">{category.title}</h3>
              <ul className="space-y-3">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.isRouterLink ? (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-neon-cyan transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-neon-cyan transition-colors"
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
            <h3 className="text-lg font-semibold mb-5">Inscreva-se</h3>
            <p className="text-gray-400 mb-4">
              Receba novidades sobre missões e promoções exclusivas.
            </p>
            
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu email"
                className="bg-white/5 border-white/10"
              />
              <Button size="icon" className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/90">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} PremiAds. Todos os direitos reservados.
            </p>
          </div>
          
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
