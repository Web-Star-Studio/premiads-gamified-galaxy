
import React from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MediaSubmissionFormProps {
  type: "photo" | "video";
  imagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

const MediaSubmissionForm = ({ 
  type, 
  imagePreview, 
  onImageUpload, 
  onClearImage 
}: MediaSubmissionFormProps) => {
  return (
    <div className="space-y-2">
      <Label>Enviar {type === "photo" ? "foto" : "vídeo"}</Label>
      {imagePreview ? (
        <div className="relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-[200px] w-full object-cover rounded-md" 
          />
          <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-2 right-2"
            onClick={onClearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center">
          <Camera className="mx-auto h-8 w-8 text-gray-400" />
          <div className="mt-2">
            <label htmlFor="file-upload" className="cursor-pointer text-neon-cyan hover:underline">
              Clique para enviar
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept={type === "photo" ? "image/*" : "video/*"}
              onChange={onImageUpload}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {type === "photo" 
              ? "PNG, JPG ou GIF até 5MB" 
              : "MP4 ou MOV até 50MB"}
          </p>
        </div>
      )}
      
      {type === "photo" && (
        <p className="text-sm text-gray-400">
          Dica: Certifique-se de que a foto esteja bem iluminada e claramente mostrando o produto.
        </p>
      )}
    </div>
  );
};

export default MediaSubmissionForm;
