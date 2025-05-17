
import { Badge } from "@/components/ui/badge";
import { MissionSubmission } from "@/types/missions";

interface SubmissionStatusBadgeProps {
  submission: MissionSubmission;
}

const SubmissionStatusBadge = ({ submission }: SubmissionStatusBadgeProps) => {
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
    default:
      return null;
  }
};

export default SubmissionStatusBadge;
