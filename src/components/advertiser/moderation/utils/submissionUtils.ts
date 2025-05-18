
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Submission } from '../ModerationContent';

/**
 * Format a date string to a user-friendly format
 */
export const getFormattedDate = (dateString?: string): string => {
  if (!dateString) return 'Data desconhecida';
  
  try {
    return format(parseISO(dateString), "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
  } catch (e) {
    return dateString;
  }
};

/**
 * Get user initials from their name
 */
export const getUserInitials = (name: string): string => {
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Determine the submission type based on its content
 */
export const getSubmissionType = (submission: Submission): 'image' | 'text' | 'video' | 'audio' => {
  if (!submission) return 'text';
  
  // Check for proof_url first (direct property)
  if (submission.proof_url && submission.proof_url.length > 0) {
    const url = submission.proof_url[0].toLowerCase();
    
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.includes('image/')) {
      return 'image';
    }
    
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('video/')) {
      return 'video';
    }
    
    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.includes('audio/')) {
      return 'audio';
    }
  }
  
  // Check submission_data for media URLs
  if (submission.submission_data) {
    const data = submission.submission_data;
    
    if (data.image_url || data.photo_url || (data.photos && data.photos.length > 0)) {
      return 'image';
    }
    
    if (data.video_url) {
      return 'video';
    }
    
    if (data.audio_url) {
      return 'audio';
    }
  }
  
  return 'text';
};

/**
 * Extract the main content from a submission
 */
export const getSubmissionContent = (submission: Submission): string => {
  if (!submission) return '';
  
  // Handle direct proof properties first
  if (submission.proof_url && submission.proof_url.length > 0) {
    return submission.proof_url[0];
  }
  
  if (submission.proof_text) {
    return submission.proof_text;
  }
  
  // Handle submission_data
  if (submission.submission_data) {
    const data = submission.submission_data;
    
    // Try to extract media URLs
    if (data.image_url) return data.image_url;
    if (data.photo_url) return data.photo_url;
    if (data.photos && data.photos.length > 0) return data.photos[0];
    if (data.video_url) return data.video_url;
    if (data.audio_url) return data.audio_url;
    
    // Try to extract text content
    if (data.text) return data.text;
    if (data.message) return data.message;
    if (data.content) return data.content;
    if (data.feedback) return data.feedback;
    if (data.answer) return data.answer;
    
    // If we can't find anything specific, stringify the data
    return JSON.stringify(data, null, 2);
  }
  
  return 'Sem conteúdo disponível';
};
