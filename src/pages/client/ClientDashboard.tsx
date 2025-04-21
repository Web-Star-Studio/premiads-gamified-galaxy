
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ClientDashboard = () => {
  const { profile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    points: 0,
    credits: 0,
    missions_completed: 0,
    raffles_participated: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        if (!isAuthenticated) return;
        
        setLoading(true);
        
        // Get user's mission completions
        const { count: missionsCount, error: missionsError } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile?.id)
          .eq('status', 'approved');
          
        if (missionsError) throw missionsError;
        
        // Get user's raffle participations
        const { count: rafflesCount, error: rafflesError } = await supabase
          .from('raffle_numbers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile?.id);
          
        if (rafflesError) throw rafflesError;
        
        setStats({
          points: profile?.points || 0,
          credits: profile?.credits || 0,
          missions_completed: missionsCount || 0,
          raffles_participated: rafflesCount || 0
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
        toast({
          title: 'Error',
          description: 'Could not load your statistics',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserStats();
  }, [isAuthenticated, profile, toast]);

  // Test Supabase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count()', { count: 'exact', head: true });
        if (error) {
          console.error('Supabase connection test failed:', error);
          toast({
            title: 'Connection Error',
            description: 'Could not connect to database',
            variant: 'destructive'
          });
        } else {
          console.log('Supabase connection successful');
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    };
    
    testConnection();
  }, [toast]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {profile?.full_name || 'User'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Your Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.points}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Your Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.credits}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Missions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.missions_completed}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Raffles Participated
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">{stats.raffles_participated}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Missions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">No active missions available</p>
                <Button className="w-full">Find Missions</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
