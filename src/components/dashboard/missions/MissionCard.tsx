
import { Mission } from "@/hooks/useMissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import MissionTypeIcon from "./MissionTypeIcon";
import { getMissionDifficulty, getEstimatedTime } from "@/hooks/useMissionsTypes";

interface MissionCardProps {
  mission: Mission;
  isAccepted: boolean;
  onAcceptMission: (missionId: string) => void;
  getMissionTypeLabel: (type: import("@/hooks/useMissionsTypes").MissionType) => string;
}

const MissionCard = ({ mission, isAccepted, onAcceptMission, getMissionTypeLabel }: MissionCardProps) => {
  return (
    <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MissionTypeIcon type={mission.type} />
            <span className="text-xs ml-2">{getMissionTypeLabel(mission.type)}</span>
          </div>
          <span className="text-xs px-2 py-0.5 bg-galaxy-deepPurple/50 rounded-full">
            {getMissionDifficulty(mission.points)}
          </span>
        </div>
        <CardTitle className="text-lg">{mission.title}</CardTitle>
        <CardDescription>{mission.description}</CardDescription>
        {mission.business_type && (
          <div className="text-xs text-gray-400 mt-1">
            {mission.business_type}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Recompensa</div>
          <div className="flex items-center">
            <span className="font-semibold text-neon-cyan">{mission.points}</span>
            <span className="ml-1 text-xs text-gray-400">pontos</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm text-gray-400">Duração estimada</div>
          <div className="text-sm flex items-center">
            <Clock className="w-3 h-3 mr-1 text-gray-400" />
            {getEstimatedTime(mission.type)}
          </div>
        </div>
        {mission.target_audience_gender && mission.target_audience_gender !== 'all' && (
          <div className="text-xs text-gray-400 mt-2">
            Público: {mission.target_audience_gender === 'male' ? 'Masculino' : 
                    mission.target_audience_gender === 'female' ? 'Feminino' : 'Todos'}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full neon-button"
          onClick={() => onAcceptMission(mission.id)}
          disabled={isAccepted}
        >
          {isAccepted ? "Aceita" : "Aceitar Missão"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MissionCard;
