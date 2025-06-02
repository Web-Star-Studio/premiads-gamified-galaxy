
import { Badge } from "@/components/ui/badge";
import { User } from "@/hooks/admin/useUsers";

const statusColors = {
  active: "bg-neon-lime text-galaxy-dark",
  inactive: "bg-red-500 text-white",
  pending: "bg-yellow-500 text-galaxy-dark",
} as const;

const UserStatusBadge = ({ status }: { status: User['status'] }) => (
    <Badge className={statusColors[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

export default UserStatusBadge;
