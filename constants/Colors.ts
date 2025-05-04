export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#0096FF',
    secondary: '#6B7280',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    primary: '#3B82F6',
    secondary: '#9CA3AF',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#2563EB',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorName = keyof typeof Colors.light; 