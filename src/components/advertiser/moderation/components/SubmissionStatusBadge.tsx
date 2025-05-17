
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import { Submission } from "../ModerationContent";

interface SubmissionStatusBadgeProps {
  submission: Submission;
}

const SubmissionStatusBadge = ({ submission }: SubmissionStatusBadgeProps) => {
  // Handle second instance special cases
  if (submission.second_instance) {
    return (
      <div className="flex items-center">
        <Badge variant="warning" className="text-xs flex items-center gap-1">
          <RotateCcw className="h-3 w-3" />
          Segunda Instância
        </Badge>
      </div>
    );
  }
  
  // Handle returned to advertiser status
  if (submission.status === 'returned_to_advertiser') {
    return (
      <Badge variant="outline" className="text-xs bg-amber-950/30 text-amber-300 border-amber-500/30">
        Retornado para Revisão
      </Badge>
    );
  }
  
  // Handle regular statuses
  switch (submission.status) {
    case "pending":
      return (
        <Badge variant="glow" className="text-xs">Pendente</Badge>
      );
    case "approved":
      return (
        <Badge variant="success" className="text-xs">Aprovado</Badge>
      );
    case "rejected":
      return (
        <Badge variant="warning" className="text-xs">Rejeitado</Badge>
      );
    case "second_instance_pending":
      return (
        <Badge variant="warning" className="text-xs flex items-center gap-1">
          <RotateCcw className="h-3 w-3" />
          Segunda Instância
        </Badge>
      );
    default:
      return null;
  }
};

export default SubmissionStatusBadge;
