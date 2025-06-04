
// Design System Tokens - Single Source of Truth
export const colors = {
  primary: {
    neonCyan: '#00f5ff',
    neonPink: '#ff0080',
    galaxyDark: '#0F0B1A',
    galaxyPurple: '#9B87F5',
    galaxyDeepPurple: '#2A1A4A'
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      100: '#F3F4F6',
      400: '#9CA3AF',
      700: '#374151',
      900: '#111827'
    }
  }
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
} as const;

export const typography = {
  fontFamily: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  }
} as const;
