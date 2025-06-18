import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, ImageIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface CashbackImageUploaderProps {
  onFileChange: (file: File | null) => void
  initialImage?: string | null
  label?: string
  required?: boolean
  className?: string
}

export function CashbackImageUploader({ 
  onFileChange, 
  initialImage, 
  label = "Imagem do Cupom",
  required = false,
  className 
}: CashbackImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 5MB')
        return
      }
      
      setIsUploading(true)
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      onFileChange(file)
      setIsUploading(false)
    }
  }, [onFileChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] 
    },
    multiple: false,
    disabled: isUploading
  })

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onFileChange(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="cashback-image">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200",
          isDragActive 
            ? "border-neon-cyan bg-neon-cyan/10" 
            : "border-galaxy-purple/30 hover:border-neon-cyan/50 hover:bg-galaxy-deepPurple/20",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} id="cashback-image" />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview da imagem do cupom" 
              className="mx-auto h-32 w-32 object-cover rounded-lg border border-galaxy-purple/30"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-4 text-gray-400">
            <div className="p-3 rounded-full bg-galaxy-deepPurple/50">
              {isDragActive ? (
                <UploadCloud className="h-8 w-8 text-neon-cyan" />
              ) : (
                <ImageIcon className="h-8 w-8" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive 
                  ? "Solte a imagem aqui..." 
                  : "Clique ou arraste uma imagem"
                }
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP até 5MB
              </p>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div className="text-white text-sm">Processando...</div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Esta imagem será exibida como capa do cupom no painel do cliente
      </p>
    </div>
  )
} 