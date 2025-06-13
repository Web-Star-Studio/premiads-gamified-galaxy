import { Badge } from "@/components/ui/badge";
import { User } from "@/hooks/admin/useUsers";

const statusColors = {
  active: "bg-neon-lime/80 text-galaxy-dark font-medium",
  inactive: "bg-red-500/80 text-white font-medium",
  pending: "bg-yellow-500/80 text-galaxy-dark font-medium",
} as const;

const UserStatusBadge = ({ status }: { status: User['status'] }) => (
    <Badge className={statusColors[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

export default UserStatusBadge;
