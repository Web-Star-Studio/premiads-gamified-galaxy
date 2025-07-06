import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useAdminAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadAvatar = async (file: File, adminId: string): Promise<string | null> => {
    try {
      setIsUploading(true)

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'Arquivo muito grande. Tamanho máximo: 2MB',
          variant: 'destructive'
        })
        return null
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erro',
          description: 'Apenas arquivos de imagem são permitidos',
          variant: 'destructive'
        })
        return null
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `admin-avatars/${adminId}/${Date.now()}.${fileExt}`

      // Try to upload to raffle-images bucket (since it exists)
      const { error: uploadError } = await supabase.storage
        .from('raffle-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast({
          title: 'Erro',
          description: 'Falha ao fazer upload da imagem',
          variant: 'destructive'
        })
        return null
      }

      const { data: publicUrlData } = supabase.storage
        .from('raffle-images')
        .getPublicUrl(fileName)

      const avatarUrl = publicUrlData.publicUrl

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', adminId)

      if (updateError) {
        console.error('Profile update error:', updateError)
        toast({
          title: 'Erro',
          description: 'Falha ao atualizar perfil',
          variant: 'destructive'
        })
        return null
      }

      toast({
        title: 'Sucesso',
        description: 'Avatar atualizado com sucesso'
      })

      return avatarUrl

    } catch (error) {
      console.error('Avatar upload error:', error)
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao fazer upload',
        variant: 'destructive'
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const removeAvatar = async (adminId: string): Promise<boolean> => {
    try {
      setIsUploading(true)

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', adminId)

      if (error) {
        console.error('Avatar removal error:', error)
        toast({
          title: 'Erro',
          description: 'Falha ao remover avatar',
          variant: 'destructive'
        })
        return false
      }

      toast({
        title: 'Sucesso',
        description: 'Avatar removido com sucesso'
      })

      return true

    } catch (error) {
      console.error('Avatar removal error:', error)
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao remover avatar',
        variant: 'destructive'
      })
      return false
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadAvatar,
    removeAvatar,
    isUploading
  }
} 