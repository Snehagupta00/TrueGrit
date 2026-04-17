// TrueGrit Fitness Theme — Light mode first, energetic palette
export const modernTheme = {
  brand: {
    primary: '#F97316',       // Energetic orange
    primaryHover: '#EA6A00',
    primaryLight: '#FFEDD5',
    primaryDark: '#C2510F',
    secondary: '#10B981',     // Fresh emerald
    secondaryHover: '#059669',
    accent: '#6366F1',        // Indigo accent
    accentHover: '#4F46E5',
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#22C55E',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    secondary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    accent: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    hero: 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)',
    card: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
    sidebar: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  },

  backgrounds: {
    page: '#F5F7FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    muted: '#F9FAFB',
    hover: '#F3F4F6',
    sidebar: '#FFFFFF',
    active: '#FFF7ED',
    // dark overrides
    darkPage: '#0F0F23',
    darkSurface: '#1A1A2E',
    darkCard: '#16213E',
  },

  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
    brand: '#F97316',
  },

  borders: {
    default: '#E5E7EB',
    strong: '#D1D5DB',
    focus: '#F97316',
    card: '#F3F4F6',
  },

  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 24px rgba(0,0,0,0.1)',
    xl: '0 20px 40px rgba(0,0,0,0.12)',
    brand: '0 4px 16px rgba(249,115,22,0.25)',
    brandHover: '0 8px 24px rgba(249,115,22,0.35)',
  },

  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },

  transitions: {
    fast: '0.15s ease-out',
    normal: '0.25s ease-out',
    slow: '0.35s ease-out',
  },

  sidebar: {
    width: 260,
    collapsedWidth: 72,
  },
};

export const getThemeValue = (lightValue, darkValue, isDark = false) =>
  isDark ? darkValue : lightValue;

export default modernTheme;
