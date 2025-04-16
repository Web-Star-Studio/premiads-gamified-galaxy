
import { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface KnowledgeLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const KnowledgeLayout: FC<KnowledgeLayoutProps> = ({ title, subtitle, children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: "/tutoriais", label: "Tutoriais", icon: BookOpen },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
    { path: "/suporte", label: "Suporte", icon: Headphones },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-galaxy-dark">
      <header className="border-b border-galaxy-purple/30 sticky top-0 z-10 bg-galaxy-dark/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold font-heading neon-text-cyan">
            <span className="text-white">Premi</span>Ads
          </Link>
          
          <div className="flex gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size={isMobile ? "icon" : "sm"}
                  className={isActive ? "bg-galaxy-purple" : ""}
                  asChild
                >
                  <Link to={item.path} className="flex items-center">
                    <item.icon className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                    {!isMobile && <span>{item.label}</span>}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400 mb-8">{subtitle}</p>
          
          <div className="glass-panel p-6 rounded-lg">
            {children}
          </div>
        </motion.div>
      </div>
      
      <footer className="border-t border-galaxy-purple/30 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Precisa de mais ajuda? Entre em contato com nosso suporte.
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeLayout;
