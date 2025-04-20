
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/hooks/admin/useUsers";

interface ActivityLog {
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

const UserActivityLogs = ({ user }: { user: User }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  useEffect(() => {
    // In a future implementation, this will fetch from the activity_logs table
    const mockLogs: ActivityLog[] = [
      {
        userId: user.id,
        action: "Login",
        timestamp: new Date().toISOString(),
        details: "User logged in successfully"
      }
    ];
    setLogs(mockLogs);
  }, [user.id]);

  return (
    <Card className="bg-galaxy-deepPurple/20 border-galaxy-purple/30">
      <CardHeader>
        <CardTitle className="text-lg">Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border border-galaxy-purple/20 p-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="mb-4 border-b border-galaxy-purple/10 pb-2 last:border-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{log.action}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{log.details}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserActivityLogs;
