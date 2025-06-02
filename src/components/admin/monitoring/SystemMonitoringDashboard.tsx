
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLog } from "./ActivityLog";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { ErrorTracker } from "./ErrorTracker";

const SystemMonitoringDashboard = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceMetrics />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Error Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorTracker />
        </CardContent>
      </Card>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLog />
        </CardContent>
      </Card>
    </div>
  );

export default SystemMonitoringDashboard;
