import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, User, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAdminAvatarUpload } from '@/hooks/admin/useAdminAvatarUpload'
import { cn } from '@/lib/utils'

interface AdminAvatarUploaderProps {
  currentAvatar?: string | null
  adminId: string
  adminName: string
  onAvatarUpdate: (newAvatarUrl: string | null) => void
  className?: string
}

export function AdminAvatarUploader({ 
  currentAvatar, 
  adminId, 
  adminName,
  onAvatarUpdate,
  className 
}: AdminAvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const { uploadAvatar, removeAvatar, isUploading } = useAdminAvatarUpload()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && !isUploading) {
      const file = acceptedFiles[0]
      
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      
      // Upload to Supabase
      const uploadedUrl = await uploadAvatar(file, adminId)
      
      if (uploadedUrl) {
        // Update parent component
        onAvatarUpdate(uploadedUrl)
        // Clean up old preview URL
        URL.revokeObjectURL(previewUrl)
        // Set the actual uploaded URL
        setPreview(uploadedUrl)
      } else {
        // Revert preview on failure
        setPreview(currentAvatar || null)
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [uploadAvatar, adminId, onAvatarUpdate, currentAvatar, isUploading])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] 
    },
    multiple: false,
    disabled: isUploading
  })

  const handleRemoveAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isUploading) return
    
    const success = await removeAvatar(adminId)
    if (success) {
      setPreview(null)
      onAvatarUpdate(null)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-white">Avatar do Administrador</Label>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Current Avatar Display */}
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-neon-pink/30">
            {preview ? (
              <AvatarImage src={preview} alt={adminName} />
            ) : (
              <AvatarFallback className="bg-galaxy-purple text-2xl text-white">
                {getInitials(adminName)}
              </AvatarFallback>
            )}
          </Avatar>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 w-full max-w-sm",
            isDragActive 
              ? "border-neon-cyan bg-neon-cyan/10" 
              : "border-galaxy-purple/30 hover:border-neon-cyan/50 hover:bg-galaxy-deepPurple/20",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-2 py-2 text-gray-400">
            <div className="p-2 rounded-full bg-galaxy-deepPurple/50">
              {isDragActive ? (
                <UploadCloud className="h-6 w-6 text-neon-cyan" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive 
                  ? "Solte a imagem aqui..." 
                  : "Clique ou arraste uma nova imagem"
                }
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP até 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {preview && (
            <Button 
              onClick={handleRemoveAvatar}
              variant="outline" 
              size="sm"
              disabled={isUploading}
              className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
            >
              <X className="w-4 h-4 mr-2" />
              Remover Avatar
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Esta imagem será exibida como seu avatar no sistema
      </p>
    </div>
  )
} 