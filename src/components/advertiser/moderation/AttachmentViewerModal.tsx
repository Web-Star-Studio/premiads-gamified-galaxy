import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Download, Check, FileText, Image, Video, File } from 'lucide-react'
import { useSubmissionFileUpload } from '@/hooks/useSubmissionFileUpload'
import { useToast } from '@/hooks/use-toast'

interface AttachmentFile {
  name: string
  url: string
  path?: string
  type?: string
}

// Support for legacy data where files might be just strings
type FileData = AttachmentFile | string

interface AttachmentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  files: FileData[]
  onApprove?: () => Promise<void>
  onReject?: (reason?: string) => Promise<void>
  submissionId?: string
  userName?: string
  missionTitle?: string
}

function AttachmentViewerModal({
  isOpen,
  onClose,
  files,
  onApprove,
  onReject,
  submissionId,
  userName,
  missionTitle
}: AttachmentViewerModalProps) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { downloadFile, getFileUrl } = useSubmissionFileUpload()
  const { toast } = useToast()

  const currentFile = files[currentFileIndex]

  useEffect(() => {
    if (currentFile && isOpen) {
      loadFileUrl()
    }
  }, [currentFile, isOpen])

  const loadFileUrl = async () => {
    if (!currentFile) return

    setIsLoadingUrl(true)
    try {
      const filePath = getFilePath(currentFile)
      if (filePath) {
        const url = await getFileUrl(filePath)
        setFileUrl(url)
      } else {
        setFileUrl(getFileUrlFromData(currentFile))
      }
    } catch (error) {
      console.error('Erro ao carregar URL do arquivo:', error)
      setFileUrl(getFileUrlFromData(currentFile)) // Fallback to original URL
    } finally {
      setIsLoadingUrl(false)
    }
  }

  const handleDownload = async () => {
    if (!currentFile) return

    try {
      const filePath = getFilePath(currentFile)
      const fileName = getFileName(currentFile)
      
      if (filePath) {
        await downloadFile(filePath, fileName)
      } else {
        // Fallback for files without path - direct download
        const link = document.createElement('a')
        link.href = getFileUrlFromData(currentFile)
        link.download = fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Erro no download:', error)
    }
  }

  const handleApprove = async () => {
    if (!onApprove) return
    
    setIsProcessing(true)
    try {
      await onApprove()
      onClose()
    } catch (error) {
      console.error('Erro ao aprovar:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!onReject) return
    
    setIsProcessing(true)
    try {
      await onReject()
      onClose()
    } catch (error) {
      console.error('Erro ao rejeitar:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper functions to handle legacy data
  const getFileName = (file: FileData): string => {
    return typeof file === 'string' ? file : file.name
  }

  const getFileType = (file: FileData): string | undefined => {
    return typeof file === 'string' ? undefined : file.type
  }

  const getFileUrlFromData = (file: FileData): string => {
    return typeof file === 'string' ? '' : file.url
  }

  const getFilePath = (file: FileData): string | undefined => {
    return typeof file === 'string' ? undefined : file.path
  }

  const getFileIcon = (file: FileData) => {
    const fileName = getFileName(file)
    const fileType = getFileType(file)
    const type = fileType || fileName?.split('.').pop()?.toLowerCase()
    
    if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type || '')) {
      return <Image className="h-5 w-5" />
    }
    if (type?.includes('video') || ['mp4', 'mov', 'avi'].includes(type || '')) {
      return <Video className="h-5 w-5" />
    }
    if (['pdf', 'doc', 'docx'].includes(type || '')) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const renderFilePreview = () => {
    if (!currentFile || isLoadingUrl) {
      return (
        <div className="flex items-center justify-center h-96 bg-black/20 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      )
    }

    // Handle legacy data where files might be just strings
    const fileName = typeof currentFile === 'string' ? currentFile : currentFile.name
    const fileType = typeof currentFile === 'string' ? undefined : currentFile.type
    const type = fileType || fileName?.split('.').pop()?.toLowerCase()

    if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type || '')) {
      return (
        <div className="relative max-h-96 overflow-hidden rounded-lg bg-black/20">
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full h-auto max-h-96 object-contain"
            onError={() => {
              toast({
                title: 'Erro ao carregar imagem',
                description: 'Não foi possível carregar a imagem.',
                variant: 'destructive'
              })
            }}
          />
        </div>
      )
    }

    if (type?.includes('video') || ['mp4', 'mov', 'avi'].includes(type || '')) {
      return (
        <div className="relative max-h-96 overflow-hidden rounded-lg bg-black/20">
          <video
            src={fileUrl}
            controls
            className="w-full h-auto max-h-96"
            onError={() => {
              toast({
                title: 'Erro ao carregar vídeo',
                description: 'Não foi possível carregar o vídeo.',
                variant: 'destructive'
              })
            }}
          >
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      )
    }

    if (type === 'pdf') {
      return (
        <div className="h-96 w-full rounded-lg bg-black/20">
          <iframe
            src={fileUrl}
            className="w-full h-full rounded-lg"
            title={fileName}
          />
        </div>
      )
    }

    // Fallback for other file types
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-black/20 rounded-lg text-center p-8">
        {getFileIcon(currentFile)}
        <h3 className="text-lg font-medium text-white mt-4">{fileName}</h3>
        <p className="text-gray-400 mt-2">
          Visualização não disponível para este tipo de arquivo.
        </p>
        <Button 
          onClick={handleDownload}
          className="mt-4"
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar arquivo
        </Button>
      </div>
    )
  }

  if (!isOpen || files.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-purple-400/50 text-white max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span>Visualizar Anexos</span>
              {userName && missionTitle && (
                <div className="text-sm text-gray-400 mt-1">
                  {userName} • {missionTitle}
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {currentFileIndex + 1} de {files.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* File navigation */}
          {files.length > 1 && (
            <div className="flex gap-2 mb-4 pb-2 border-b border-white/10 overflow-x-auto">
              {files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFileIndex(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
                    index === currentFileIndex
                      ? 'bg-purple-600 text-white'
                      : 'bg-black/20 text-gray-300 hover:bg-black/40'
                  }`}
                >
                  {getFileIcon(file)}
                  <span className="truncate max-w-[120px]">{getFileName(file)}</span>
                </button>
              ))}
            </div>
          )}

          {/* File preview */}
          <div className="mb-4">
            {renderFilePreview()}
          </div>

          {/* File info */}
          <div className="bg-black/20 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(currentFile)}
                <span className="font-medium">{getFileName(currentFile)}</span>
              </div>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-purple-400/50 text-purple-300 hover:bg-purple-400/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Fechar
          </Button>
          
          {onReject && (
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isProcessing}
              className="w-full sm:w-auto border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
          )}
          
          {onApprove && (
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-green-600/80 hover:bg-green-600"
            >
              <Check className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AttachmentViewerModal 