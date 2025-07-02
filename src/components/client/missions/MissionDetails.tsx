import React from "react";
import { Award, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Mission } from "@/hooks/useMissionsTypes";
import { ensureString, ensureNumber, safeRenderArray } from "@/utils/react-safe-render";

interface MissionDetailsProps {
  mission: Mission | null;
  onClose?: () => void;
  onSubmit?: () => void;
  onStartMission?: () => void;
}

const MissionDetails = ({ mission, onClose, onSubmit, onStartMission }: MissionDetailsProps) => {
  // Handle case when no mission is selected
  if (!mission) {
    return (
      <div className="p-6 space-y-6 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-galaxy-purple/20 flex items-center justify-center">
            <Award className="w-8 h-8 text-galaxy-purple" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-300">Selecione uma missão</h3>
            <p className="text-sm text-gray-500">Escolha uma missão da lista para ver os detalhes</p>
          </div>
        </div>
      </div>
    );
  }

  // Safely render requirements with defensive checks using utility functions
  const renderRequirements = () => {
    const requirements = safeRenderArray(mission.requirements);
    
    if (requirements.length === 0) {
      return <li className="text-sm text-gray-400">Nenhum requisito especificado</li>;
    }
    
    return requirements.map((req, index) => (
      <li key={index} className="text-sm text-gray-400">{req}</li>
    ));
  };

  // Safely get values using utility functions
  const titleValue = ensureString(mission.title, "Missão sem título");
  const brandValue = ensureString(mission.brand, "PremiAds");
  const descriptionValue = ensureString(mission.description, "Descrição não disponível");
  const rifasValue = ensureNumber(mission.rifas) || ensureNumber(mission.tickets_reward);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{titleValue}</h2>
          <p className="text-gray-400">{brandValue}</p>
          {mission.hasUserSubmission && (
            <Badge variant="outline" className="mt-2 bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
              Já submetida
            </Badge>
          )}
        </div>
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1"
        >
          <Award className="w-4 h-4" />
          <span>{rifasValue} rifas</span>
        </Badge>
      </div>

      <p>{descriptionValue}</p>

      <div>
        <h3 className="text-lg font-medium">Requisitos</h3>
        <ul>
          {renderRequirements()}
        </ul>
      </div>

      <div className="flex gap-2 pt-4">
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        )}
        {onSubmit && (
          <Button onClick={onSubmit}>
            Participar
          </Button>
        )}
        {onStartMission && (
          <Button 
            onClick={onStartMission} 
            className="flex-1"
            disabled={mission.hasUserSubmission}
          >
            {mission.hasUserSubmission ? "Já Submetida" : "Iniciar Missão"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionDetails;
