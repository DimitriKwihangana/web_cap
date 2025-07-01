// Application constants

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
    PREDICTION: {
      PREDICT: '/predict',
      HISTORY: '/api/predictions',
      SAVE: '/api/predictions',
    },
    DASHBOARD: {
      STATS: '/api/dashboard/stats',
      RECENT_TESTS: '/api/dashboard/recent-tests',
    },
    USER: {
      PROFILE: '/api/users',
      UPDATE: '/api/users',
    }
  }
  
  // User types and roles
  export const USER_TYPES = {
    INSTITUTION: 'institution',
    PROCESSOR: 'processor',
    LABORATORY: 'laboratory',
    ADMIN: 'admin'
  }
  
  export const USER_TYPE_LABELS = {
    [USER_TYPES.INSTITUTION]: 'Institution (Schools, Prisons, Bulk Buyers)',
    [USER_TYPES.PROCESSOR]: 'Food Processor',
    [USER_TYPES.LABORATORY]: 'Laboratory/Research Facility',
    [USER_TYPES.ADMIN]: 'System Administrator'
  }
  
  // Prediction parameters
  export const PREDICTION_FIELDS = {
    MOISTURE: 'moisture_maize_grain',
    IMMATURE_GRAINS: 'Immaturegrains',
    DISCOLORED_GRAINS: 'Discolored_grains',
    BROKEN_KERNELS: 'broken_kernels_percent_maize_grain',
    FOREIGN_MATTER: 'foreign_matter_percent_maize_grain',
    PEST_DAMAGED: 'pest_damaged',
    ROTTEN: 'rotten',
    LIVE_INFESTATION: 'Liveinfestation',
    ABNORMAL_ODOURS: 'abnormal_odours_maize_grain'
  }
  
  export const FIELD_RANGES = {
    [PREDICTION_FIELDS.MOISTURE]: { min: 0, max: 30, unit: '%' },
    [PREDICTION_FIELDS.IMMATURE_GRAINS]: { min: 0, max: 20, unit: '%' },
    [PREDICTION_FIELDS.DISCOLORED_GRAINS]: { min: 0, max: 15, unit: '%' },
    [PREDICTION_FIELDS.BROKEN_KERNELS]: { min: 0, max: 10, unit: '%' },
    [PREDICTION_FIELDS.FOREIGN_MATTER]: { min: 0, max: 5, unit: '%' },
    [PREDICTION_FIELDS.PEST_DAMAGED]: { min: 0, max: 25, unit: '%' },
    [PREDICTION_FIELDS.ROTTEN]: { min: 0, max: 10, unit: '%' },
    [PREDICTION_FIELDS.LIVE_INFESTATION]: { min: 0, max: 1, unit: 'binary' },
    [PREDICTION_FIELDS.ABNORMAL_ODOURS]: { min: 0, max: 1, unit: 'binary' }
  }
  
  // Aflatoxin safety levels
  export const AFLATOXIN_LEVELS = {
    SAFE: 'safe',
    WARNING: 'warning',
    DANGER: 'danger'
  }
  
  export const AFLATOXIN_THRESHOLDS = {
    [AFLATOXIN_LEVELS.SAFE]: { max: 4, color: 'green', label: 'Safe to Consume' },
    [AFLATOXIN_LEVELS.WARNING]: { max: 10, color: 'yellow', label: 'Monitor Closely' },
    [AFLATOXIN_LEVELS.DANGER]: { max: Infinity, color: 'red', label: 'High Risk - Do Not Consume' }
  }
  
  // Application settings
  export const APP_CONFIG = {
    NAME: import.meta.env.VITE_APP_NAME || 'AflaGuard Pro',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    DESCRIPTION: 'Advanced Aflatoxin Detection Platform',
    COMPANY: 'AflaGuard Technologies',
    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'support@aflaguard.com',
    CONTACT_PHONE: import.meta.env.VITE_CONTACT_PHONE || '+1-800-AFLA-GUARD',
  }
  
  // Local storage keys
  export const STORAGE_KEYS = {
    USER: 'aflaguard_user',
    TOKEN: 'aflaguard_token',
    THEME: 'aflaguard_theme',
    LANGUAGE: 'aflaguard_language',
    SETTINGS: 'aflaguard_settings',
    CACHE: 'aflaguard_cache'
  }
  
  // Theme configuration
  export const THEME_CONFIG = {
    COLORS: {
      PRIMARY: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      },
      SECONDARY: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      }
    }
  }
  
  // Validation rules
  export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\+]?[1-9][\d]{0,15}$/,
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL: false
    }
  }
  
  // File upload settings
  export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  }
  
  // Pagination settings
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 25,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_VISIBLE_PAGES: 7
  }
  
  // Date/Time formats
  export const DATE_FORMATS = {
    SHORT: 'MMM dd, yyyy',
    LONG: 'MMMM dd, yyyy',
    WITH_TIME: 'MMM dd, yyyy HH:mm',
    ISO: 'yyyy-MM-dd',
    TIME_ONLY: 'HH:mm'
  }
  
  // Error messages
  export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. Please contact support if you believe this is an error.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    TIMEOUT: 'Request timeout. Please try again.',
    UNKNOWN: 'An unexpected error occurred. Please try again.'
  }
  
  // Success messages
  export const SUCCESS_MESSAGES = {
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    REGISTER: 'Account created successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PREDICTION_SAVED: 'Prediction result saved successfully!',
    DATA_EXPORTED: 'Data exported successfully!',
    EMAIL_SENT: 'Email sent successfully!'
  }
  
  // Navigation menu items
  export const NAVIGATION_ITEMS = {
    PUBLIC: [
      { key: 'home', label: 'Home', path: '/' },
      { key: 'about', label: 'About', path: '/about' },
      { key: 'contact', label: 'Contact', path: '/contact' },
      { key: 'pricing', label: 'Pricing', path: '/pricing' }
    ],
    AUTHENTICATED: [
      { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { key: 'predict', label: 'Predict', path: '/predict' },
      { key: 'history', label: 'History', path: '/history' },
      { key: 'learn', label: 'Learn', path: '/learn' },
      { key: 'profile', label: 'Profile', path: '/profile' }
    ],
    ADMIN: [
      { key: 'admin', label: 'Admin Panel', path: '/admin' },
      { key: 'users', label: 'User Management', path: '/admin/users' },
      { key: 'analytics', label: 'Analytics', path: '/admin/analytics' },
      { key: 'settings', label: 'System Settings', path: '/admin/settings' }
    ]
  }
  
  // Chart colors for data visualization
  export const CHART_COLORS = [
    '#3b82f6', // Blue
    '#22c55e', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
    '#ec4899', // Pink
    '#6366f1'  // Indigo
  ]
  
  // Learning center categories and content structure
  export const LEARNING_CATEGORIES = {
    PREVENTION: {
      key: 'prevention',
      title: 'Prevention Methods',
      description: 'Learn effective strategies to prevent aflatoxin contamination',
      icon: 'Shield'
    },
    STORAGE: {
      key: 'storage',
      title: 'Storage Best Practices',
      description: 'Master proper grain storage techniques',
      icon: 'Database'
    },
    TESTING: {
      key: 'testing',
      title: 'Testing Procedures',
      description: 'Comprehensive guide to testing methods',
      icon: 'FlaskConical'
    },
    REGULATIONS: {
      key: 'regulations',
      title: 'Regulations & Standards',
      description: 'Navigate food safety regulations',
      icon: 'FileText'
    }
  }
  
  // Export all constants as default
  export default {
    API_ENDPOINTS,
    USER_TYPES,
    USER_TYPE_LABELS,
    PREDICTION_FIELDS,
    FIELD_RANGES,
    AFLATOXIN_LEVELS,
    AFLATOXIN_THRESHOLDS,
    APP_CONFIG,
    STORAGE_KEYS,
    THEME_CONFIG,
    VALIDATION_RULES,
    FILE_UPLOAD,
    PAGINATION,
    DATE_FORMATS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    NAVIGATION_ITEMS,
    CHART_COLORS,
    LEARNING_CATEGORIES
  }