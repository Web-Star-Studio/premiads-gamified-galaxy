import React from "react";
import { Award, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Mission } from "@/hooks/useMissionsTypes";

interface MissionDetailsProps {
  mission: Mission;
  onClose: () => void;
  onSubmit: () => void;
}

const MissionDetails = ({ mission, onClose, onSubmit }: MissionDetailsProps) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{mission.title}</h2>
          <p className="text-gray-400">{mission.brand || "PremiAds"}</p>
        </div>
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1"
        >
          <Award className="w-4 h-4" />
          <span>{mission.tickets_reward} pts</span>
        </Badge>
      </div>

      <p>{mission.description}</p>

      <div>
        <h3 className="text-lg font-medium">Requisitos</h3>
        <ul>
          {Array.isArray(mission.requirements) ? (
            mission.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-400">{req}</li>
            ))
          ) : (
            <li className="text-sm text-gray-400">{mission.requirements}</li>
          )}
        </ul>
      </div>

      <DialogFooter className="justify-between">
        <Button variant="ghost" onClick={onClose}>
          Fechar
        </Button>
        <Button onClick={onSubmit}>
          Participar
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MissionDetails;
