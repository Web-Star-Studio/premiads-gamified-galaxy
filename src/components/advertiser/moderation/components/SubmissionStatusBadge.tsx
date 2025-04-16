
import { Badge } from "@/components/ui/badge";
import { MissionSubmission } from "@/types/missions";

interface SubmissionStatusBadgeProps {
  submission: MissionSubmission;
}

const SubmissionStatusBadge = ({ submission }: SubmissionStatusBadgeProps) => {
  switch (submission.status) {
    case 'approved':
      return <Badge variant="success">Aprovado</Badge>;
    case 'rejected':
      return <Badge variant="warning">Rejeitado</Badge>;
    case 'pending':
    default:
      return <Badge variant="glow">Pendente</Badge>;
  }
};

export default SubmissionStatusBadge;
