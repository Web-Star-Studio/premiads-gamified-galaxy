import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from '@/hooks/admin/useUsers';
import { useUserOperations } from '@/hooks/admin/useUserOperations';
import { useUserSelection } from './users/hooks/useUserSelection';
import UserTable from './users/components/UserTable';
import UserToolbar from './users/components/UserToolbar';
import BulkActions from './users/components/BulkActions';
import UserActivityLogs from './users/UserActivityLogs';
import CreateUserDialog from './users/CreateUserDialog';
import EditUserDialog from './users/EditUserDialog';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, fetchUsers } = useUsers();
  const { 
    updateUserStatus, 
    deleteUser 
  } = useUserOperations();
  const { 
    selectedUsers, 
    handleSelectAll, 
    handleSelectUser, 
    setSelectedUsers 
  } = useUserSelection(users);

  // Dialogs for add/edit
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<null | typeof users[0]>(null);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newActiveState = currentStatus !== 'active';
    await updateUserStatus(userId, newActiveState);
    await fetchUsers(); // Refresh users after status update
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.size} selected users?`)) {
      for (const userId of selectedUsers) {
        await deleteUser(userId);
      }
      await fetchUsers(); // Refresh users after deletion
      setSelectedUsers(new Set());
    }
  };

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

  // Add 'onAddUser' handler
  const handleAddUser = () => setCreateOpen(true);
  
  const handleEditUser = (user: typeof users[0]) => {
    setEditUser(user);
  };

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
              onAddUser={handleAddUser}
            />
          </div>
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={deleteUser}
            onEditUser={handleEditUser}
          />
          <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={fetchUsers} />
          {editUser && (
            <EditUserDialog
              open={!!editUser}
              onOpenChange={() => setEditUser(null)}
              user={editUser}
              onUpdated={fetchUsers}
            />
          )}
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
