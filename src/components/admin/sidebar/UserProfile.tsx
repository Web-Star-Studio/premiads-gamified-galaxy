
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserProfile = () => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-galaxy-deepPurple/30 my-2">
      <Avatar className="h-10 w-10 border-2 border-neon-pink">
        <AvatarFallback className="bg-galaxy-purple text-white">
          AD
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium truncate">Administrador</span>
        <span className="text-xs text-muted-foreground">Acesso total</span>
      </div>
    </div>
  );

export default UserProfile;
