
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface UserToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const UserToolbar = ({ searchQuery, onSearchChange }: UserToolbarProps) => {
  return (
    <div className="relative w-full md:w-auto flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search users..."
        className="pl-10 bg-galaxy-dark/50 border-galaxy-purple/30"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default UserToolbar;
