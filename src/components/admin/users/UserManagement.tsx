import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from '@/hooks/admin/useUsers';
import { useUserOperations } from '@/hooks/admin/useUserOperations';
import { useUserSelection } from './hooks/useUserSelection';
import UserTable from './components/UserTable';
import UserToolbar from './components/UserToolbar';
import BulkActions from './components/BulkActions';
import UserActivityLogs from './UserActivityLogs';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, fetchUsers } = useUsers();
  const { updateUserStatus, deleteUser } = useUserOperations();
  const { selectedUsers, handleSelectAll, handleSelectUser, setSelectedUsers } = useUserSelection(users);

  const handleToggleStatus = useCallback(async (userId: string, currentStatus: string) => {
    const newActiveState = currentStatus !== 'active';
    const success = await updateUserStatus(userId, newActiveState);
    if (success) {
      // Refresh users list after successful status update
      fetchUsers();
    }
  }, [updateUserStatus, fetchUsers]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      // Clear selection if the deleted user was selected
      setSelectedUsers(prev => {
        const newSelection = new Set(prev);
        newSelection.delete(userId);
        return newSelection;
      });
      // Refresh users list after successful deletion
      fetchUsers();
    }
    return success;
  }, [deleteUser, setSelectedUsers, fetchUsers]);

  const handleBulkDelete = useCallback(async () => {
    if (window.confirm(`Delete ${selectedUsers.size} selected users?`)) {
      let allSuccess = true;
      
      for (const userId of selectedUsers) {
        const success = await deleteUser(userId);
        if (!success) {
          allSuccess = false;
        }
      }
      
      if (allSuccess) {
        setSelectedUsers(new Set());
        // Refresh users list after bulk deletion
        fetchUsers();
      }
    }
  }, [selectedUsers, deleteUser, setSelectedUsers, fetchUsers]);

  const handleExportUsers = () => {
    const csvContent = users
      .filter(user => selectedUsers.has(user.id))
      .map(user => `${user.name},${user.email},${user.role},${user.status}`)
      .join('\n');
    
    const blob = new Blob([`Name,Email,Role,Status\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-heading text-white">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <UserToolbar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <BulkActions
              selectedCount={selectedUsers.size}
              onBulkDelete={handleBulkDelete}
              onExportUsers={handleExportUsers}
              onAddUser={fetchUsers}
            />
          </div>

          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={handleDeleteUser}
          />
        </CardContent>
      </Card>

      {selectedUsers.size === 1 && (
        <UserActivityLogs 
          user={users.find(u => u.id === Array.from(selectedUsers)[0])!} 
        />
      )}
    </motion.div>
  );
};

export default UserManagement;
