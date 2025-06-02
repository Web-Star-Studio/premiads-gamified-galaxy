
import { useMemo } from 'react';
import { User } from './useUsers';

export const useUserFilters = (users: User[], searchQuery: string, selectedRole: string, selectedStatus: string) => {
  const filteredUsers = useMemo(() => users.filter(user => {
      const matchesSearch = searchQuery.trim() === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    }), [users, searchQuery, selectedRole, selectedStatus]);

  return { filteredUsers };
};
