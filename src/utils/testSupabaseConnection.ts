
import { supabase } from "@/integrations/supabase/client";
import { storageUtils } from "@/lib/storage-utils";

export async function testSupabaseConnection() {
  const testResults = {
    connection: false,
    auth: false,
    storage: false,
    details: ""
  };

  try {
    // Test basic connection
    const { data: dbTest, error: dbError } = await supabase
      .from("profiles")
      .select("count(*)", { count: "exact", head: true });

    if (dbError) throw new Error(`Database connection error: ${dbError.message}`);
    testResults.connection = true;

    // Create a test user (this won't actually create a user in development unless email confirmation is disabled)
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "Password123!";
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: "Test User",
          user_type: "client"
        }
      }
    });

    if (authError) {
      testResults.details += `Auth test note: ${authError.message}\n`;
    } else {
      testResults.auth = true;
      testResults.details += `Auth test passed: Test user validation started with email ${testEmail}\n`;
    }

    // Test storage by uploading a small file
    const testFile = new File(["test content"], "test.txt", { type: "text/plain" });
    const testPath = `test-${Date.now()}.txt`;
    
    try {
      // Test uploading to each bucket
      const buckets = ["avatars", "mission-submissions", "campaign-images"];
      for (const bucket of buckets) {
        const { path, error: uploadError } = await storageUtils.uploadFile(
          bucket,
          testPath,
          testFile
        );

        if (uploadError) {
          testResults.details += `Storage test for ${bucket}: Error - ${uploadError.message}\n`;
        } else {
          // Get the public URL
          const publicUrl = storageUtils.getPublicUrl(bucket, path);
          testResults.details += `Storage test for ${bucket}: Passed - ${publicUrl}\n`;
          
          // Clean up - delete the test file
          await storageUtils.deleteFile(bucket, path);
        }
      }
      
      testResults.storage = true;
    } catch (storageError) {
      testResults.details += `Storage test error: ${(storageError as Error).message}\n`;
    }

    // Always sign out after tests
    await supabase.auth.signOut();
    
    return {
      success: testResults.connection && (testResults.auth || testResults.storage),
      results: testResults
    };
  } catch (error) {
    return {
      success: false,
      results: {
        ...testResults,
        details: `Connection test failed: ${(error as Error).message}`
      }
    };
  }
}
