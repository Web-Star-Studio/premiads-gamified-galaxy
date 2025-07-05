import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toastSuccess, toastError } from '@/utils/toast'

interface UseDocumentationDownloadReturn {
  isDownloading: boolean
  downloadDocumentation: () => Promise<void>
}

/**
 * Custom hook para gerenciar o download da documentação em PDF
 * Utiliza Supabase Storage para buscar e baixar o arquivo
 * Abordagem simplificada com URL pública do bucket
 */
export function useDocumentationDownload(): UseDocumentationDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadDocumentation = async (): Promise<void> => {
    if (isDownloading) return

    setIsDownloading(true)
    
    try {
      // Verificar se o usuário está autenticado e é admin
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toastError('Você precisa estar logado para baixar a documentação.')
        return
      }

      // Verificar se é admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        toastError('Você não tem permissão para acessar este arquivo.')
        return
      }

      // Obter URL pública do arquivo
      const { data } = supabase.storage
        .from('documentation')
        .getPublicUrl('premiads-documentation.pdf')

      if (!data?.publicUrl) {
        toastError('Não foi possível gerar o link de download.')
        return
      }

      // Criar download via fetch
      const response = await fetch(data.publicUrl)
      
      if (!response.ok) {
        toastError('Arquivo de documentação não encontrado. Contate o suporte.')
        return
      }

      const blob = await response.blob()
      
      // Criar URL para download
      const url = window.URL.createObjectURL(blob)
      
      // Criar elemento de download temporário
      const link = document.createElement('a')
      link.href = url
      link.download = 'PremiAds-Documentacao-Completa.pdf'
      link.style.display = 'none'
      
      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Limpar URL criada
      window.URL.revokeObjectURL(url)
      
      toastSuccess('Documentação baixada com sucesso!')
      
    } catch (error) {
      console.error('Erro inesperado ao baixar documentação:', error)
      toastError('Erro inesperado ao baixar a documentação.')
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    isDownloading,
    downloadDocumentation
  }
} 