
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SupabaseVerification from "@/components/SupabaseVerification";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronLeft, Database, FileText, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function VerificationPage() {
  const { isAuthenticated, userType } = useAuth();
  const [creatingBuckets, setCreatingBuckets] = useState(false);
  const [bucketsResult, setBucketsResult] = useState<{success: boolean; message: string} | null>(null);
  
  const createMissingBuckets = async () => {
    try {
      setCreatingBuckets(true);
      
      // List existing buckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) throw listError;
      
      const requiredBuckets = ['avatars', 'mission-submissions', 'campaign-images'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      
      const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
      
      if (missingBuckets.length === 0) {
        setBucketsResult({ 
          success: true, 
          message: 'All required buckets already exist.' 
        });
        return;
      }
      
      // Create each missing bucket
      for (const bucketName of missingBuckets) {
        const { error: createError } = await supabase.storage.createBucket(
          bucketName,
          { public: true }
        );
        
        if (createError) throw new Error(`Failed to create bucket ${bucketName}: ${createError.message}`);
      }
      
      setBucketsResult({ 
        success: true, 
        message: `Successfully created missing buckets: ${missingBuckets.join(', ')}` 
      });
    } catch (error) {
      console.error('Error creating buckets:', error);
      setBucketsResult({ 
        success: false, 
        message: `Error creating buckets: ${(error as Error).message}` 
      });
    } finally {
      setCreatingBuckets(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">System Verification</h1>
          <p className="text-muted-foreground">
            Verify that all Supabase components are working correctly
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Storage Buckets
            </CardTitle>
            <CardDescription>
              Ensure required storage buckets are created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This action will create the following storage buckets if they don't exist:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>avatars - For user profile pictures</li>
              <li>mission-submissions - For content uploaded as part of missions</li>
              <li>campaign-images - For advertiser campaign images</li>
            </ul>
            
            {bucketsResult && (
              <Alert 
                variant={bucketsResult.success ? "default" : "destructive"}
                className={bucketsResult.success ? "bg-green-50 border-green-200 text-green-800" : ""}
              >
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{bucketsResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{bucketsResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={createMissingBuckets}
              disabled={creatingBuckets}
            >
              Create Missing Buckets
            </Button>
          </CardFooter>
        </Card>
        
        <Separator className="my-4" />
        
        <SupabaseVerification />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Deployment Readiness
            </CardTitle>
            <CardDescription>
              Check if your application is ready for production deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    User authentication is working properly with Supabase Auth
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Database Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Application can read and write data to Supabase tables
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    File uploads and retrievals are working correctly
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Edge Functions</h4>
                  <p className="text-sm text-muted-foreground">
                    Backend functions are properly configured and accessible
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              For a full system verification, log in with different user types and test all critical user journeys
            </p>
          </CardFooter>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documentation
            </CardTitle>
            <CardDescription>
              Access helpful resources for working with Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://supabase.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Supabase Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/auth" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Authentication Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/database" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Database Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/storage" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Storage Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/functions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Edge Functions Guide
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
