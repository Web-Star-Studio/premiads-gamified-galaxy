
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Trash2, Download } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onExportUsers: () => void;
  onAddUser: () => void;
}

const BulkActions = ({ selectedCount, onBulkDelete, onExportUsers, onAddUser }: BulkActionsProps) => (
    <div className="flex gap-2">
      {selectedCount > 0 && (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportUsers}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </>
      )}
      <Button
        className="bg-neon-pink hover:bg-neon-pink/80 text-white"
        onClick={onAddUser}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        New User
      </Button>
    </div>
  );

export default BulkActions;
