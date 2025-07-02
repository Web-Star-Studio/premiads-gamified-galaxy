/**
 * Utility to ensure values are safe to render as React children
 * Prevents "Objects are not valid as a React child" errors
 */

export function safeRenderValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (Array.isArray(value)) {
    return value.map(item => safeRenderValue(item)).join(', ');
  }
  
  if (typeof value === 'object') {
    // Convert object to JSON string as fallback
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }
  
  return String(value);
}

export function safeRenderArray(value: any): string[] {
  if (!value) return [];
  
  if (Array.isArray(value)) {
    return value.map(item => safeRenderValue(item));
  }
  
  return [safeRenderValue(value)];
}

export function ensureString(value: any, fallback: string = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return safeRenderValue(value);
}

export function ensureNumber(value: any, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) return value;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
} 