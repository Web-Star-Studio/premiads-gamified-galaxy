
import React, { useEffect } from 'react';
import { FileText } from "lucide-react";
import { 
  OverviewContent,
  DashboardContent, 
  UsersContent, 
  RulesContent, 

  ReportsContent, 
  RafflesContent,
  NotificationsContent,
  SettingsContent,
  DatabaseContent,
  FaqContent
} from './content';

export interface DocSectionContentProps {
  sectionId: string;
}

const DocSectionContent: React.FC<DocSectionContentProps> = ({ sectionId }) => {
  useEffect(() => {
    console.log("DocSectionContent rendered for section:", sectionId);
  }, [sectionId]);

  const renderSectionContent = () => {
    if (!sectionId) {
      console.warn("No section ID provided");
      return renderEmptyState("Selecione uma seção da documentação para visualizar o conteúdo");
    }

    switch (sectionId) {
      case "overview":
        return <OverviewContent />;
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "rules":
        return <RulesContent />;

      case "reports":
        return <ReportsContent />;
      case "raffles":
        return <RafflesContent />;
      case "notifications":
        return <NotificationsContent />;
      case "settings":
        return <SettingsContent />;
      case "database":
        return <DatabaseContent />;
      case "faq":
        return <FaqContent />;
      default:
        console.warn(`No content found for section: ${sectionId}`);
        return renderEmptyState(`Nenhum conteúdo encontrado para a seção "${sectionId}"`);
    }
  };

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center h-64">
      <FileText className="h-12 w-12 text-zinc-700 mb-4" />
      <p className="text-zinc-500 text-center">{message}</p>
    </div>
  );
  
  return renderSectionContent();
};

export default DocSectionContent;
