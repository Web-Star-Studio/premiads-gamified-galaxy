
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export const ActivityLog = () => (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {/* Will be populated with actual system activity logs */}
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm">System startup successful</span>
          <span className="text-xs text-muted-foreground">2 minutes ago</span>
        </div>
      </div>
    </ScrollArea>
  );
