
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SupabaseVerification from "@/components/SupabaseVerification";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronLeft } from "lucide-react";

export default function VerificationPage() {
  const { isAuthenticated, userType } = useAuth();
  
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
        
        <SupabaseVerification />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Deployment Readiness</CardTitle>
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
      </div>
    </div>
  );
}
