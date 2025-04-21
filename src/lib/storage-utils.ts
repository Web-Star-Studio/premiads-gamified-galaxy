
import { supabase } from "@/integrations/supabase/client";

export const storageUtils = {
  async uploadFile(
    bucket: 'avatars' | 'mission-submissions' | 'campaign-images', 
    file: File, 
    customPath?: string
  ) {
    try {
      // Generate a unique filename if not provided
      const fileName = customPath || `${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;
      
      return {
        path: data?.path,
        fullUrl: supabase.storage.from(bucket).getPublicUrl(data?.path).data.publicUrl
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  async getPublicUrl(
    bucket: 'avatars' | 'mission-submissions' | 'campaign-images', 
    path: string
  ) {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },

  async listFiles(
    bucket: 'avatars' | 'mission-submissions' | 'campaign-images'
  ) {
    const { data, error } = await supabase.storage.from(bucket).list();
    
    if (error) {
      console.error('List files error:', error);
      throw error;
    }
    
    return data;
  },

  async deleteFile(
    bucket: 'avatars' | 'mission-submissions' | 'campaign-images', 
    path: string
  ) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }
};
