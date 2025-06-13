import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, UserCog } from "lucide-react";
import { User } from "@/hooks/admin/useUsers";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUserOperations } from "@/hooks/admin/useUserOperations";

interface UserTableProps {
  users: User[];
  selectedUsers: Set<string>;
  onSelectUser: (userId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onToggleStatus: (userId: string, currentStatus: string) => void;
  onDeleteUser: (userId: string) => Promise<boolean>;
  onEditUser?: (user: User) => void;
}

const UserTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onToggleStatus,
  onDeleteUser,
  onEditUser,
}: UserTableProps) => {
  const { updateUserRole } = useUserOperations();
  const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await onDeleteUser(userId);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!newRole) return;
    
    setChangingRoleFor(userId);
    try {
      await updateUserRole(userId, newRole);
      // Role change is handled via the realtime subscription in useUsers
    } catch (error) {
      console.error("Error changing user role:", error);
    } finally {
      setChangingRoleFor(null);
    }
  };

  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'anunciante', label: 'Anunciante' },
    { value: 'participante', label: 'Participante' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
              <Checkbox 
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all users"
              />
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Name</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-galaxy-deepPurple/30">
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <Checkbox 
                  checked={selectedUsers.has(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                  aria-label={`Select ${user.name}`}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">{user.name}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">{user.email}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        user.role === 'admin' 
                          ? 'bg-neon-pink text-white' 
                          : user.role === 'moderator'
                            ? 'bg-neon-cyan text-galaxy-dark'
                            : user.role === 'anunciante'
                              ? 'bg-neon-lime/80 text-galaxy-dark'
                              : ''
                      }`}
                    >
                      {changingRoleFor === user.id ? '...' : user.role || 'participante'}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {roleOptions.map(option => (
                      <DropdownMenuItem 
                        key={option.value} 
                        onClick={() => handleRoleChange(user.id, option.value)}
                        disabled={changingRoleFor === user.id}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <Badge 
                  variant={user.status === 'active' ? 'default' : 'outline'}
                  className={user.status === 'active' ? 'bg-green-500' : 'text-red-400'}
                >
                  {user.status}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm flex items-center space-x-2">
                <button
                  className="p-1 text-neon-cyan hover:text-neon-pink"
                  onClick={() => onEditUser && onEditUser(user)}
                  title="Editar"
                  type="button"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(user.id, user.status)}
                  className="text-xs"
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
