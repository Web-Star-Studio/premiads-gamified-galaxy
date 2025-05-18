
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Submission } from '@/types/missions';

/**
 * Format a date string for display
 */
export function getFormattedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Get the initials from a user name
 */
export function getUserInitials(name?: string): string {
  if (!name) return '?';
  
  const names = name.split(' ').filter(n => n.length > 0);
  
  if (names.length === 0) return '?';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Determine submission type based on content
 */
export function getSubmissionType(submission: Submission): 'image' | 'text' | 'video' | 'audio' | 'creative' {
  if (!submission || !submission.submission_data) return 'text';
  
  const data = submission.submission_data;
  
  if (data.image_url || data.photos || data.photo_url || data.images || data.fileUrls?.some(url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url))) {
    return 'image';
  } else if (data.video_url || data.fileUrls?.some(url => /\.(mp4|webm|mov|avi)$/i.test(url))) {
    return 'video';
  } else if (data.audio_url || data.fileUrls?.some(url => /\.(mp3|wav|ogg)$/i.test(url))) {
    return 'audio';
  } else if (data.creative_content) {
    return 'creative';
  } else {
    return 'text';
  }
}

/**
 * Get type label for display
 */
export function getTypeLabel(type: 'image' | 'text' | 'video' | 'audio' | 'creative'): string {
  switch (type) {
    case 'image': return 'Imagem';
    case 'text': return 'Texto';
    case 'video': return 'Vídeo';
    case 'audio': return 'Áudio';
    case 'creative': return 'Criativo';
    default: return 'Conteúdo';
  }
}

/**
 * Extract submission content for display
 */
export function getSubmissionContent(submission: Submission): string {
  if (!submission || !submission.submission_data) return 'Sem conteúdo disponível';
  
  const data = submission.submission_data;
  const type = getSubmissionType(submission);
  
  switch (type) {
    case 'image':
      return data.image_url || 
             (data.photos && data.photos[0]) || 
             data.photo_url || 
             (data.fileUrls && data.fileUrls.find(url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url))) || 
             '';
    case 'video':
      return data.video_url || 
             (data.fileUrls && data.fileUrls.find(url => /\.(mp4|webm|mov|avi)$/i.test(url))) || 
             '';
    case 'audio':
      return data.audio_url || 
             (data.fileUrls && data.fileUrls.find(url => /\.(mp3|wav|ogg)$/i.test(url))) || 
             '';
    case 'creative':
      return data.creative_content || '';
    case 'text':
    default:
      return data.content || 
             data.text || 
             data.feedback || 
             data.answer || 
             JSON.stringify(data, null, 2);
  }
}

/**
 * Get status badge style
 */
export function getStatusStyle(status: string): { 
  color: string; 
  bgColor: string; 
  text: string 
} {
  switch (status) {
    case 'approved':
      return { color: 'text-emerald-500', bgColor: 'bg-emerald-500/20', text: 'Aprovado' };
    case 'rejected':
      return { color: 'text-rose-500', bgColor: 'bg-rose-500/20', text: 'Rejeitado' };
    case 'second_instance_pending':
      return { color: 'text-amber-500', bgColor: 'bg-amber-500/20', text: 'Segunda instância' };
    case 'returned_to_advertiser':
      return { color: 'text-blue-500', bgColor: 'bg-blue-500/20', text: 'Retornou ao anunciante' };
    case 'pending':
    default:
      return { color: 'text-blue-400', bgColor: 'bg-blue-400/20', text: 'Pendente' };
  }
}
