
import { supabase } from "@/integrations/supabase/client";

interface HealthCheckResult {
  success: boolean;
  authStatus: 'authenticated' | 'unauthenticated' | 'unknown';
  connectionStatus: 'connected' | 'error';
  databaseAccess: 'ok' | 'error' | 'unknown';
  storageAccess: 'ok' | 'error' | 'unknown';
  functions: {
    [key: string]: 'ok' | 'error' | 'unknown';
  };
  errorMessage?: string;
}

export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    success: false,
    authStatus: 'unknown',
    connectionStatus: 'error',
    databaseAccess: 'unknown',
    storageAccess: 'unknown',
    functions: {
      'check-raffle-deadlines': 'unknown',
      'cleanup-database': 'unknown',
      'create-admin-user': 'unknown'
    }
  };
  
  try {
    // Check authentication status
    const { data: sessionData } = await supabase.auth.getSession();
    result.authStatus = sessionData.session ? 'authenticated' : 'unauthenticated';
    
    // Check database connection
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      result.connectionStatus = 'connected';
      result.databaseAccess = 'ok';
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      result.databaseAccess = 'error';
      result.errorMessage = (dbError as Error).message;
    }
    
    // Check storage access
    try {
      // Check if we can list buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      // Verify expected buckets exist
      const requiredBuckets = ['avatars', 'mission-submissions', 'campaign-images'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      
      const allBucketsExist = requiredBuckets.every(bucket => 
        existingBuckets.includes(bucket)
      );
      
      result.storageAccess = allBucketsExist ? 'ok' : 'error';
      
      if (!allBucketsExist) {
        const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
        result.errorMessage = `Missing storage buckets: ${missingBuckets.join(', ')}`;
      }
    } catch (storageError) {
      console.error('Storage access error:', storageError);
      result.storageAccess = 'error';
      result.errorMessage = (storageError as Error).message;
    }
    
    // Check Edge Functions (simple ping check)
    try {
      for (const func of Object.keys(result.functions)) {
        try {
          const { error } = await supabase.functions.invoke(func, {
            method: 'GET',
            body: { test: true }
          });
          
          result.functions[func] = error ? 'error' : 'ok';
        } catch (funcError) {
          console.error(`Function ${func} error:`, funcError);
          result.functions[func] = 'error';
        }
      }
    } catch (functionsError) {
      console.error('Functions general error:', functionsError);
      // Leave functions as unknown
    }
    
    // Overall success determination
    result.success = 
      result.connectionStatus === 'connected' && 
      result.databaseAccess === 'ok' && 
      result.storageAccess === 'ok';
      
    return result;
  } catch (error) {
    console.error('Health check failed:', error);
    result.errorMessage = (error as Error).message;
    return result;
  }
}

export function getSupabaseConnectionSummary(result: HealthCheckResult): string {
  const lines: string[] = [
    `Supabase Connection: ${result.connectionStatus === 'connected' ? '✅' : '❌'}`,
    `Authentication: ${result.authStatus === 'authenticated' ? '✅ Logged in' : '⚠️ Not logged in'}`,
    `Database Access: ${result.databaseAccess === 'ok' ? '✅' : '❌'}`,
    `Storage Access: ${result.storageAccess === 'ok' ? '✅' : '❌'}`
  ];
  
  const functionsStatus = Object.entries(result.functions)
    .map(([name, status]) => `${name}: ${status === 'ok' ? '✅' : status === 'error' ? '❌' : '⚠️'}`);
    
  lines.push(`Edge Functions: ${functionsStatus.join(', ')}`);
  
  if (result.errorMessage) {
    lines.push(`Error: ${result.errorMessage}`);
  }
  
  return lines.join('\n');
}
