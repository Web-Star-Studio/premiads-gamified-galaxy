import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface UploadedFile {
  name: string
  url: string
  path: string
  type: string
  size: number
}

interface UseSubmissionFileUploadReturn {
  uploadFiles: (files: File[], userId: string, missionId: string) => Promise<UploadedFile[]>
  isUploading: boolean
  getFileUrl: (path: string) => Promise<string>
  downloadFile: (path: string, filename: string) => Promise<void>
}

export function useSubmissionFileUpload(): UseSubmissionFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadFiles = async (
    files: File[], 
    userId: string, 
    missionId: string
  ): Promise<UploadedFile[]> => {
    if (files.length === 0) return []

    setIsUploading(true)
    const uploadedFiles: UploadedFile[] = []

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `submissions/${missionId}/${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('mission-attachments')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Erro ao fazer upload do arquivo:', error)
          throw new Error(`Erro ao fazer upload de ${file.name}: ${error.message}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('mission-attachments')
          .getPublicUrl(data.path)

        uploadedFiles.push({
          name: file.name,
          url: urlData.publicUrl,
          path: data.path,
          type: file.type,
          size: file.size
        })
      }

      return uploadedFiles
    } catch (error: any) {
      console.error('Erro no upload de arquivos:', error)
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const getFileUrl = async (path: string): Promise<string> => {
    try {
      // Try to get a signed URL for private access
      const { data, error } = await supabase.storage
        .from('mission-attachments')
        .createSignedUrl(path, 3600) // 1 hour expiration

      if (error) {
        // Fallback to public URL
        const { data: publicData } = supabase.storage
          .from('mission-attachments')
          .getPublicUrl(path)
        
        return publicData.publicUrl
      }

      return data.signedUrl
    } catch (error) {
      console.error('Erro ao obter URL do arquivo:', error)
      throw error
    }
  }

  const downloadFile = async (path: string, filename: string): Promise<void> => {
    try {
      const { data, error } = await supabase.storage
        .from('mission-attachments')
        .download(path)

      if (error) throw error

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: 'Download concluído',
        description: `Arquivo ${filename} baixado com sucesso`
      })
    } catch (error: any) {
      console.error('Erro no download:', error)
      toast({
        title: 'Erro no download',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    uploadFiles,
    isUploading,
    getFileUrl,
    downloadFile
  }
} 