
import { useState } from 'react';
import { storageUtils } from '@/lib/storage-utils';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    bucket: 'avatars' | 'mission-submissions' | 'campaign-images', 
    file: File, 
    customPath?: string
  ) => {
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please choose a file to upload.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await storageUtils.uploadFile(bucket, file, customPath);

      toast({
        title: 'Upload Successful',
        description: `File uploaded to ${bucket} bucket.`,
        variant: 'default'
      });

      return result;
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { uploadFile, isUploading, uploadProgress };
};
