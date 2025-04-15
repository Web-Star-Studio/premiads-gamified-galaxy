
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, Camera } from "lucide-react";

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
    <div className="form-container">
      <Label className="form-label">
        {type === "photo" ? "Enviar Imagem" : "Enviar Vídeo"}
      </Label>
      
      {!imagePreview ? (
        <div className="bg-galaxy-deepPurple/80 border border-dashed border-galaxy-purple/40 rounded-md p-6 text-center">
          <div className="flex flex-col items-center justify-center">
            {type === "photo" 
              ? <Image className="w-10 h-10 md:w-12 md:h-12 text-medium-contrast mb-3" /> 
              : <Camera className="w-10 h-10 md:w-12 md:h-12 text-medium-contrast mb-3" />
            }
            <p className="text-medium-contrast text-base mb-4">
              {type === "photo" 
                ? "Arraste uma imagem ou clique para fazer upload" 
                : "Arraste um vídeo ou clique para fazer upload"
              }
            </p>
            <input
              type="file"
              accept={type === "photo" ? "image/*" : "video/*"}
              onChange={onImageUpload}
              className="hidden"
              id="media-upload"
            />
            <label htmlFor="media-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer flex items-center gap-2"
                type="button"
              >
                <Upload className="w-4 h-4" />
                Escolher arquivo
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative bg-galaxy-deepPurple/80 rounded-md overflow-hidden">
          {type === "photo" ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-auto max-h-80 object-contain"
            />
          ) : (
            <video 
              src={imagePreview} 
              controls 
              className="w-full h-auto max-h-80"
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 bg-galaxy-dark/80 hover:bg-galaxy-dark"
            onClick={onClearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <p className="text-medium-contrast text-sm mt-2">
        {type === "photo" 
          ? "Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB." 
          : "Formatos aceitos: MP4, MOV, AVI. Tamanho máximo: 50MB."
        }
      </p>
    </div>
  );
};

export default MediaSubmissionForm;
