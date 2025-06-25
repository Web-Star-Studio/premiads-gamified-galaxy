
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { toastInfo } from "@/utils/toast";

// Import icons
import { 
  BookOpen, Server, Shield, Users, Settings,
  Database, BarChart4, Bell, Ticket, FileText, HelpCircle
} from "lucide-react";

interface DocNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export interface DocSectionItem {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

// Define documentation sections with IDs for navigation
export const docSections: DocSectionItem[] = [
  { id: "overview", title: "Visão Geral", icon: BookOpen, description: "Informações gerais sobre o sistema" },
  { id: "dashboard", title: "Painel Principal", icon: BarChart4, description: "Dashboard com métricas da plataforma" },
  { id: "users", title: "Gestão de Usuários", icon: Users, description: "Gerenciamento de contas de usuários" },
  { id: "rules", title: "Configuração de Regras", icon: FileText, description: "Regras de negócio configuráveis" },


  { id: "raffles", title: "Gestão de Sorteios", icon: Ticket, description: "Configuração de sorteios e premiações" },
  { id: "notifications", title: "Notificações", icon: Bell, description: "Sistema de mensagens e notificações" },
  { id: "settings", title: "Configurações", icon: Settings, description: "Configurações da plataforma" },
  { id: "database", title: "Banco de Dados", icon: Database, description: "Documentação da base de dados" },
  { id: "faq", title: "FAQ Técnico", icon: HelpCircle, description: "Perguntas frequentes técnicas" }
];

const DocNavigation: React.FC<DocNavigationProps> = ({ activeSection, setActiveSection }) => {
  useEffect(() => {
    console.log("DocNavigation rendered with activeSection:", activeSection);
    // Ensure there's always an active section
    if (!activeSection && docSections.length > 0) {
      console.log("Setting default section to:", docSections[0].id);
      setActiveSection(docSections[0].id);
    }
  }, [activeSection, setActiveSection]);

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      <div className="p-4 space-y-1">
        {docSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant="ghost"
              className={`w-full justify-start ${
                isActive 
                  ? "bg-galaxy-deepPurple/40 hover:bg-galaxy-deepPurple/50 text-white" 
                  : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
              onClick={() => {
                console.log("Navigation button clicked for section:", section.id);
                setActiveSection(section.id);
                toastInfo(`Seção "${section.title}" carregada`);
              }}
            >
              <Icon className="mr-2 h-4 w-4" />
              {section.title}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default DocNavigation;
