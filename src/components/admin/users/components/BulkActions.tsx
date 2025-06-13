import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, FileDown } from 'lucide-react';
import CreateUserDialog from '../CreateUserDialog';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onExportUsers: () => void;
  onAddUser: () => void;
}

const BulkActions = ({ selectedCount, onBulkDelete, onExportUsers, onAddUser }: BulkActionsProps) => {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  const handleUserCreated = () => {
    // Refresh user list after successful creation
    onAddUser();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        onClick={() => setIsCreateUserOpen(true)}
        className="bg-neon-pink text-white hover:bg-neon-pink/80"
        size="sm"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        New User
      </Button>

      {selectedCount > 0 && (
        <>
          <Button
            onClick={onExportUsers}
            variant="outline"
            size="sm"
            className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export ({selectedCount})
          </Button>

          <Button
            onClick={onBulkDelete}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-400 hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedCount})
          </Button>
        </>
      )}

      <CreateUserDialog 
        open={isCreateUserOpen} 
        onOpenChange={setIsCreateUserOpen} 
        onCreated={handleUserCreated}
      />
    </div>
  );
};

export default BulkActions;
