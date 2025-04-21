
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EmployeeDashboard = () => {
  const { profile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingMissions: 0,
    activeMissions: 0,
    activeRaffles: 0,
    totalUsers: 0
  });
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!isAuthenticated) return;
        
        setLoading(true);
        
        // Test connection to Supabase
        const { data: connTest, error: connError } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
        
        if (connError) {
          console.error('Supabase connection error:', connError);
          setConnectionStatus('error');
          throw connError;
        }
        
        setConnectionStatus('success');
        
        // Get pending mission submissions
        const { count: pendingCount, error: pendingError } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
          
        if (pendingError) throw pendingError;
        
        // Get active missions
        const { count: missionsCount, error: missionsError } = await supabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);
          
        if (missionsError) throw missionsError;
        
        // Get active raffles
        const { count: rafflesCount, error: rafflesError } = await supabase
          .from('raffles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
          
        if (rafflesError) throw rafflesError;
        
        // Get total users
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        setStats({
          pendingMissions: pendingCount || 0,
          activeMissions: missionsCount || 0,
          activeRaffles: rafflesCount || 0,
          totalUsers: usersCount || 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        toast({
          title: 'Error',
          description: 'Could not load dashboard statistics',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [isAuthenticated, toast]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'User'}
          </p>
        </div>
        
        {connectionStatus === 'error' && (
          <Alert variant="destructive" className="w-full md:w-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Could not connect to database. Check your network or contact support.
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'success' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Database connected</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.pendingMissions}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Missions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.activeMissions}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Raffles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.activeRaffles}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="missions" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="raffles">Raffles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="missions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Mission Submissions</CardTitle>
              <CardDescription>
                Review and approve the latest mission submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : stats.pendingMissions > 0 ? (
                <div className="space-y-4">
                  <p>You have {stats.pendingMissions} pending submissions to review</p>
                  <Button>Review Submissions</Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No pending mission submissions</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="raffles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Raffles</CardTitle>
              <CardDescription>
                Monitor and manage ongoing raffles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : stats.activeRaffles > 0 ? (
                <div className="space-y-4">
                  <p>There are {stats.activeRaffles} active raffles</p>
                  <Button>Manage Raffles</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">No active raffles</p>
                  <Button>Create New Raffle</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage platform users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Total of {stats.totalUsers} registered users</p>
                  <Button>Manage Users</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
