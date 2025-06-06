import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X } from 'lucide-react'

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  initialImage?: string | null;
}

export function ImageUploader({ onFileChange, initialImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setPreview(URL.createObjectURL(file))
      onFileChange(file)
    }
  }, [onFileChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false,
  })

  function handleRemoveImage(e: React.MouseEvent) {
    e.stopPropagation()
    setPreview(null)
    onFileChange(null)
  }

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'hover:border-primary/50'}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-background/50 rounded-full p-1 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <UploadCloud size={32} />
          <p className="text-sm">Arraste e solte uma imagem aqui, ou clique para selecionar</p>
          <p className="text-xs">PNG, JPG, GIF até 2MB</p>
        </div>
      )}
    </div>
  )
} 