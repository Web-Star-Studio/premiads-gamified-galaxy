
import React from 'react';
import { Progress } from "@/components/ui/progress";

export const PerformanceMetrics = () => (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">CPU Usage</span>
          <span className="text-sm text-muted-foreground">45%</span>
        </div>
        <Progress value={45} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Memory Usage</span>
          <span className="text-sm text-muted-foreground">60%</span>
        </div>
        <Progress value={60} className="h-2" />
      </div>
    </div>
  );
