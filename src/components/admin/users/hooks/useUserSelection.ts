
import { useState } from 'react';
import { User } from '@/hooks/admin/useUsers';

export const useUserSelection = (users: User[]) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  return {
    selectedUsers,
    setSelectedUsers,
    handleSelectAll,
    handleSelectUser,
  };
};
