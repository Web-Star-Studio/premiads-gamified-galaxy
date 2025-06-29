import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSubmissionFileUpload } from '@/hooks/useSubmissionFileUpload'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

function AttachmentTestButton() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFilePath, setUploadedFilePath] = useState<string>('')
  const { uploadFiles, downloadFile, isUploading } = useSubmissionFileUpload()
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleTestUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Selecione um arquivo para testar o upload.',
        variant: 'destructive'
      })
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: 'Usuário não autenticado',
          description: 'Faça login para testar o upload.',
          variant: 'destructive'
        })
        return
      }

      const testMissionId = 'test-mission-id'
      const uploadedFiles = await uploadFiles([selectedFile], user.id, testMissionId)
      
      if (uploadedFiles.length > 0) {
        setUploadedFilePath(uploadedFiles[0].path)
        toast({
          title: 'Upload concluído',
          description: `Arquivo ${selectedFile.name} enviado com sucesso!`
        })
      }
    } catch (error: any) {
      console.error('Erro no teste de upload:', error)
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleTestDownload = async () => {
    if (!uploadedFilePath) {
      toast({
        title: 'Nenhum arquivo para baixar',
        description: 'Faça upload de um arquivo primeiro.',
        variant: 'destructive'
      })
      return
    }

    try {
      await downloadFile(uploadedFilePath, selectedFile?.name || 'test-file')
    } catch (error: any) {
      console.error('Erro no teste de download:', error)
      toast({
        title: 'Erro no download',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="p-4 bg-black/20 rounded-lg border border-purple-400/30">
      <h3 className="text-lg font-semibold text-white mb-4">Teste de Anexos</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Selecionar arquivo para teste:
          </label>
          <Input
            type="file"
            onChange={handleFileSelect}
            className="bg-gray-900 border-white/20"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-400">
            Arquivo selecionado: {selectedFile.name}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleTestUpload}
            disabled={!selectedFile || isUploading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isUploading ? 'Enviando...' : 'Testar Upload'}
          </Button>

          <Button
            onClick={handleTestDownload}
            disabled={!uploadedFilePath}
            variant="outline"
            className="border-purple-400/50 text-purple-300"
          >
            Testar Download
          </Button>
        </div>

        {uploadedFilePath && (
          <div className="text-sm text-green-400">
            ✅ Arquivo enviado com sucesso! Path: {uploadedFilePath}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttachmentTestButton 