
import { supabase } from "@/integrations/supabase/client";
import React from "react";

export const storageUtils = {
  /**
   * Upload a file to a Supabase storage bucket
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ path: string; error: Error | null }> {
    try {
      // Create options object without onUploadProgress which isn't in the type
      const options = {
        cacheControl: '3600',
        upsert: true
      };
      
      // Manually handle progress if needed
      let lastProgress = 0;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options);

      // Call progress callback with 100% when complete
      if (onProgress) {
        onProgress(100);
      }

      if (error) throw error;

      const filePath = data?.path || '';
      return { path: filePath, error: null };
    } catch (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error);
      return { path: '', error: error as Error };
    }
  },

  /**
   * Get the public URL of a file in a Supabase storage bucket
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Delete a file from a Supabase storage bucket
   */
  async deleteFile(
    bucket: string,
    path: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error(`Error deleting file ${bucket}/${path}:`, error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * Create a folder in a Supabase storage bucket
   */
  async createFolder(
    bucket: string,
    folderPath: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Create an empty file with a .keep suffix to mimic a folder
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`${folderPath}/.keep`, new Blob([''], { type: 'text/plain' }), {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error(`Error creating folder ${bucket}/${folderPath}:`, error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * Check if a file exists in a Supabase storage bucket
   */
  async fileExists(
    bucket: string,
    path: string
  ): Promise<{ exists: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path.substring(0, path.lastIndexOf('/')), {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      const fileName = path.split('/').pop();
      const exists = data.some((item) => item.name === fileName);

      return { exists, error: null };
    } catch (error) {
      console.error(`Error checking if file exists ${bucket}/${path}:`, error);
      return { exists: false, error: error as Error };
    }
  },
};

// Create a React hook for file uploads
export function useFileUpload() {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<Error | null>(null);
  
  const uploadFile = React.useCallback(
    async (bucket: string, path: string, file: File): Promise<string> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);
      
      try {
        const { path: filePath, error } = await storageUtils.uploadFile(
          bucket,
          path,
          file,
          (progress) => setProgress(progress)
        );
        
        if (error) throw error;
        
        return storageUtils.getPublicUrl(bucket, filePath);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );
  
  return {
    uploadFile,
    isUploading,
    progress,
    error,
  };
}
