
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { checkSupabaseHealth, getSupabaseConnectionSummary } from "@/utils/supabaseHealthCheck";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { storageUtils } from "@/lib/storage-utils";
import { UserType } from "@/types/auth";

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message?: string;
}

export function SupabaseVerification() {
  const { isAuthenticated, userType } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overallStatus, setOverallStatus] = useState<'success' | 'error' | 'warning' | 'pending'>('pending');
  
  const runTests = async () => {
    setLoading(true);
    setProgress(0);
    setResults([]);
    
    // Test 1: Basic Connection
    setResults(prev => [...prev, { name: 'Basic Connection', status: 'pending' }]);
    try {
      // Use a table we know exists in our schema
      const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setResults(prev => [
        ...prev.slice(0, -1), 
        { name: 'Basic Connection', status: 'success', message: 'Successfully connected to Supabase' }
      ]);
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, -1), 
        { 
          name: 'Basic Connection', 
          status: 'error', 
          message: `Connection failed: ${(error as Error).message}` 
        }
      ]);
    }
    
    setProgress(20);
    
    // Test 2: Authentication
    setResults(prev => [...prev, { name: 'Authentication', status: 'pending' }]);
    
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setResults(prev => [
          ...prev.slice(0, -1), 
          { 
            name: 'Authentication', 
            status: 'success', 
            message: `Authenticated as ${data.session.user.email}` 
          }
        ]);
      } else {
        setResults(prev => [
          ...prev.slice(0, -1), 
          { 
            name: 'Authentication', 
            status: 'warning', 
            message: 'Not authenticated - some tests may fail' 
          }
        ]);
      }
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, -1), 
        { 
          name: 'Authentication', 
          status: 'error', 
          message: `Auth check failed: ${(error as Error).message}` 
        }
      ]);
    }
    
    setProgress(40);
    
    // Test 3: Database Tables
    setResults(prev => [...prev, { name: 'Database Tables', status: 'pending' }]);
    
    try {
      // Check essential tables from our schema
      const tables = ['profiles', 'missions', 'submissions', 'raffles', 'raffle_numbers'];
      const results = await Promise.all(
        tables.map(table => 
          supabase.from(table).select('count(*)', { count: 'exact', head: true })
        )
      );
      
      const errors = results.filter(result => result.error).map(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`Some tables not accessible: ${errors.map(e => e?.message).join(', ')}`);
      }
      
      const tableCounts = results.map((r, i) => `${tables[i]}: ${r.count || 0}`);
      
      setResults(prev => [
        ...prev.slice(0, -1), 
        { 
          name: 'Database Tables', 
          status: 'success', 
          message: `All required tables accessible. Row counts: ${tableCounts.join(', ')}` 
        }
      ]);
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, -1), 
        { 
          name: 'Database Tables', 
          status: 'error', 
          message: `Database tables check failed: ${(error as Error).message}` 
        }
      ]);
    }
    
    setProgress(60);
    
    // Test 4: Storage Buckets
    setResults(prev => [...prev, { name: 'Storage Buckets', status: 'pending' }]);
    
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      const requiredBuckets = ['avatars', 'mission-submissions', 'campaign-images'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      
      const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
      
      if (missingBuckets.length > 0) {
        setResults(prev => [
          ...prev.slice(0, -1), 
          { 
            name: 'Storage Buckets', 
            status: 'error',
            message: `Missing buckets: ${missingBuckets.join(', ')}` 
          }
        ]);
      } else {
        setResults(prev => [
          ...prev.slice(0, -1), 
          { 
            name: 'Storage Buckets', 
            status: 'success',
            message: `All required buckets exist: ${requiredBuckets.join(', ')}` 
          }
        ]);
      }
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, -1), 
        { 
          name: 'Storage Buckets', 
          status: 'error', 
          message: `Storage check failed: ${(error as Error).message}` 
        }
      ]);
    }
    
    setProgress(80);
    
    // Test 5: Edge Functions
    setResults(prev => [...prev, { name: 'Edge Functions', status: 'pending' }]);
    
    try {
      const functions = ['check-raffle-deadlines', 'cleanup-database', 'create-admin-user'];
      const functionCalls = await Promise.allSettled(
        functions.map(func => 
          supabase.functions.invoke(func, {
            method: 'GET',
            body: { test: true }
          })
        )
      );
      
      const failedFunctions = functionCalls
        .map((result, index) => 
          result.status === 'rejected' || (result.status === 'fulfilled' && result.value.error) 
            ? functions[index] 
            : null
        )
        .filter(Boolean);
      
      if (failedFunctions.length > 0) {
        setResults(prev => [
          ...prev.slice(0, -1), 
          { 
            name: 'Edge Functions', 
            status: 'warning',
            message: `Some functions may have issues: ${failedFunctions.join(', ')}` 
          }
        ]);
      } else {
        setResults(prev => [
          ...prev.slice(0, -1), 
          { 
            name: 'Edge Functions', 
            status: 'success',
            message: `All edge functions responded` 
          }
        ]);
      }
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, -1), 
        { 
          name: 'Edge Functions', 
          status: 'warning', 
          message: `Edge functions check failed: ${(error as Error).message}` 
        }
      ]);
    }
    
    setProgress(100);
    setLoading(false);
    
    // Determine overall status
    const hasErrors = results.some(r => r.status === 'error');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    if (hasErrors) {
      setOverallStatus('error');
    } else if (hasWarnings) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('success');
    }
    
    // Run full health check
    try {
      const healthCheck = await checkSupabaseHealth();
      console.log('Full Supabase health check:', healthCheck);
      console.log(getSupabaseConnectionSummary(healthCheck));
    } catch (error) {
      console.error('Health check error:', error);
    }
  };
  
  // Run tests on component mount
  useEffect(() => {
    runTests();
  }, []);
  
  // Status icon component
  const StatusIcon = ({ status }: { status: TestResult['status'] }) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'pending':
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Supabase Verification</CardTitle>
            <CardDescription>
              Verify that all Supabase components are properly configured and connected
            </CardDescription>
          </div>
          <Badge 
            variant={
              overallStatus === 'success' ? 'default' : 
              overallStatus === 'error' ? 'destructive' : 
              'outline'
            }
            className="ml-2"
          >
            {overallStatus === 'success' ? 'All Systems Operational' : 
             overallStatus === 'error' ? 'Issues Detected' :
             overallStatus === 'warning' ? 'Warnings' : 'Checking...'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading && (
          <Progress value={progress} className="w-full" />
        )}
        
        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-md bg-muted/50">
              <StatusIcon status={result.status} />
              <div>
                <h4 className="font-medium">{result.name}</h4>
                {result.message && (
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                )}
              </div>
            </div>
          ))}
          
          {results.length === 0 && loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Running verification tests...</span>
            </div>
          )}
        </div>
        
        {overallStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Issues Detected</AlertTitle>
            <AlertDescription>
              Some required Supabase components are not properly configured. Please check the error messages above.
            </AlertDescription>
          </Alert>
        )}
        
        {overallStatus === 'warning' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warnings Detected</AlertTitle>
            <AlertDescription>
              There are some non-critical issues with your Supabase configuration.
            </AlertDescription>
          </Alert>
        )}
        
        {overallStatus === 'success' && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>All Systems Operational</AlertTitle>
            <AlertDescription>
              Your Supabase integration is properly configured and ready for production.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={runTests} 
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Rerun Tests
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {!loading && (
            <span>
              {overallStatus === 'success' 
                ? 'Your application is ready for deployment' 
                : 'Fix the issues above before deploying'}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default SupabaseVerification;
