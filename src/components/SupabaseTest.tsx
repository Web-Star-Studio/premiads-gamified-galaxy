
import React, { useState } from "react";
import { testSupabaseConnection } from "@/utils/testSupabaseConnection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SupabaseTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    results: {
      connection: boolean;
      auth: boolean;
      storage: boolean;
      details: string;
    };
  } | null>(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResults = await testSupabaseConnection();
      setResults(testResults);
    } catch (error) {
      console.error("Test failed:", error);
      setResults({
        success: false,
        results: {
          connection: false,
          auth: false,
          storage: false,
          details: `Test failed with error: ${(error as Error).message}`
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Test your Supabase connection by creating a test user and uploading a file
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Running connection tests...</span>
          </div>
        ) : results ? (
          <div className="space-y-4">
            <Alert
              variant={results.success ? "default" : "destructive"}
              className={results.success ? "bg-green-50 border-green-200 text-green-800" : ""}
            >
              {results.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{results.success ? "Connection Successful" : "Connection Issues"}</AlertTitle>
              <AlertDescription>
                {results.success
                  ? "Your Supabase connection is working properly"
                  : "There are issues with your Supabase connection"}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center">
                <span className="mr-2">Database Connection:</span>
                {results.results.connection ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center">
                <span className="mr-2">Authentication:</span>
                {results.results.auth ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center">
                <span className="mr-2">Storage:</span>
                {results.results.storage ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
              {results.results.details}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Click the button below to test your Supabase connection
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runTest} 
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Testing Connection..." : "Test Supabase Connection"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SupabaseTest;
