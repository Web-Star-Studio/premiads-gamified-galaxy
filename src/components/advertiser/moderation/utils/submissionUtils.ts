
import { MissionSubmission } from "@/types/missions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Determine submission type
export const getSubmissionType = (submission: MissionSubmission): 'image' | 'text' | 'creative' | 'video' => {
  const data = submission.submission_data;
  
  if (!data) return 'text';
  
  if (data.image_url || data.photos || data.photo_url) {
    return 'image';
  } else if (data.video_url) {
    return 'video';
  } else if (data.creative_content) {
    return 'creative';
  } else {
    return 'text';
  }
};

// Get submission content
export const getSubmissionContent = (submission: MissionSubmission): string => {
  const data = submission.submission_data;
  const type = getSubmissionType(submission);
  
  if (!data) return 'Sem conteúdo disponível';
  
  switch (type) {
    case 'image':
      return data.image_url || data.photos?.[0] || data.photo_url || '';
    case 'video':
      return data.video_url || '';
    case 'creative':
      return data.creative_content || '';
    case 'text':
    default:
      return data.text || data.feedback || data.answer || JSON.stringify(data);
  }
};

// Get formatted date
export const getFormattedDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
  } catch (e) {
    return dateString;
  }
};

// Get the submission type label
export const getTypeLabel = (submission: MissionSubmission): string => {
  const type = getSubmissionType(submission);
  
  switch (type) {
    case 'image':
      return 'Imagem';
    case 'video':
      return 'Vídeo';
    case 'creative':
      return 'Conteúdo Criativo';
    case 'text':
    default:
      return 'Texto';
  }
};

// Get user initials for avatar
export const getUserInitials = (userName?: string): string => {
  if (!userName) return '?';
  
  const nameParts = userName.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};
