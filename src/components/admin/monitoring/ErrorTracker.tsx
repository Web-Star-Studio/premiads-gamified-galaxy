
import React from 'react';
import { Badge } from "@/components/ui/badge";

export const ErrorTracker = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Total Errors (24h)</span>
        <Badge variant="destructive">3</Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        Last error: 404 Not Found - /api/users
        <span className="block text-xs">2 hours ago</span>
      </div>
    </div>
  );
};
