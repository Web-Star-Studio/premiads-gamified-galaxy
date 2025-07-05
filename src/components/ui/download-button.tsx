import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useDocumentationDownload } from '@/hooks/admin/useDocumentationDownload';

interface DownloadButtonProps {
  variant?: 'default' | 'subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function DownloadButton({ 
  variant = 'subtle', 
  size = 'sm', 
  showLabel = false,
  className = ''
}: DownloadButtonProps) {
  const { isDownloading, downloadDocumentation } = useDocumentationDownload();

  const getButtonStyles = () => {
    switch (variant) {
      case 'default':
        return "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white";
      case 'subtle':
        return "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10";
      case 'ghost':
        return "hover:bg-white/5 text-white/70 hover:text-white";
      default:
        return "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return "h-8 px-3";
      case 'md':
        return "h-10 px-4";
      case 'lg':
        return "h-12 px-6";
      default:
        return "h-8 px-3";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 14;
    }
  };

  return (
    <Button
      onClick={downloadDocumentation}
      disabled={isDownloading}
      className={`${getButtonStyles()} ${getSizeStyles()} transition-all duration-200 ${className}`}
      title="Baixar documentação PDF"
    >
      {isDownloading ? (
        <Loader2 className="animate-spin" size={getIconSize()} />
      ) : (
        <>
          <Download size={getIconSize()} />
          {showLabel && (
            <>
              <FileText className="ml-1" size={getIconSize()} />
              <span className="ml-2">PDF</span>
            </>
          )}
        </>
      )}
    </Button>
  );
} 