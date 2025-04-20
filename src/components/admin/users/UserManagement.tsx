
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  UserPlus, Search, Filter, Trash2, Edit, RefreshCw, Download 
} from 'lucide-react';
import { useUsers } from '@/hooks/admin/useUsers';
import UserRoleSelector from './UserRoleSelector';
import UserStatusBadge from './UserStatusBadge';
import UserActivityLogs from './UserActivityLogs';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { users, loading, fetchUsers, updateUserStatus, deleteUser } = useUsers();

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

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    // Convert string status to boolean for the updateUserStatus function
    const newActiveState = currentStatus !== 'active';
    await updateUserStatus(userId, newActiveState);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.size} selected users?`)) {
      for (const userId of selectedUsers) {
        await deleteUser(userId);
      }
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
            {/* Search and filters */}
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-10 bg-galaxy-dark/50 border-galaxy-purple/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Bulk actions */}
            <div className="flex gap-2">
              {selectedUsers.size > 0 && (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedUsers.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportUsers}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
              <Button
                className="bg-neon-pink hover:bg-neon-pink/80 text-white"
                onClick={() => fetchUsers()}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                New User
              </Button>
            </div>
          </div>

          <div className="rounded-md border border-galaxy-purple/30">
            <Table>
              <TableHeader className="bg-galaxy-dark">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.size === users.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <UserRoleSelector
                        currentRole={user.role}
                        onRoleChange={(role) => console.log('Role changed:', role)}
                      />
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>{user.lastLogin || 'Never'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs for selected user */}
      {selectedUsers.size === 1 && (
        <UserActivityLogs 
          user={users.find(u => u.id === Array.from(selectedUsers)[0])!} 
        />
      )}
    </motion.div>
  );
};

export default UserManagement;
