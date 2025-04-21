
/**
 * Form validation utilities for consistent validation across the application
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 6 characters)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Required field validation
export const isRequired = (value: string | null | undefined): boolean => {
  return !!value && value.trim().length > 0;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// File size validation (in bytes)
export const isValidFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

// File type validation
export const isValidFileType = (file: File, acceptedTypes: string[]): boolean => {
  return acceptedTypes.includes(file.type);
};

// Form field validator that returns error message if validation fails
export const validateField = (
  value: any, 
  validations: Array<{
    validator: (val: any) => boolean;
    errorMessage: string;
  }>
): string | null => {
  for (const validation of validations) {
    if (!validation.validator(value)) {
      return validation.errorMessage;
    }
  }
  return null;
};

// Validation for common form fields
export const validateFormFields = (fields: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(fields).forEach(([fieldName, value]) => {
    if (fieldName.includes('email')) {
      if (!isValidEmail(value)) {
        errors[fieldName] = 'Email inválido';
      }
    } else if (fieldName.includes('password')) {
      if (!isValidPassword(value)) {
        errors[fieldName] = 'A senha deve ter pelo menos 6 caracteres';
      }
    } else if (fieldName.includes('name') || fieldName.includes('title')) {
      if (!isRequired(value)) {
        errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} é obrigatório`;
      }
    } else if (fieldName.includes('url') || fieldName.includes('link')) {
      if (value && !isValidUrl(value)) {
        errors[fieldName] = 'URL inválida';
      }
    }
  });
  
  return errors;
};
