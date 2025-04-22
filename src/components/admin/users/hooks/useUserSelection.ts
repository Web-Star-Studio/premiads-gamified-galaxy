
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

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
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
