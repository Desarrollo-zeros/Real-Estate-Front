// Application Constants

export const APP_NAME = 'Real Estate Management System';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// Authentication
export const TOKEN_STORAGE_KEY = 'realestate_auth_token';
export const USER_STORAGE_KEY = 'realestate_user';
export const TOKEN_EXPIRY_KEY = 'realestate_token_expiry';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: '/properties/:id',
  PROPERTY_CREATE: '/properties/create',
  PROPERTY_EDIT: '/properties/:id/edit',
  OWNERS: '/owners',
  OWNER_DETAILS: '/owners/:id',
  TRACES: '/traces',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// User Roles
export const ROLES = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
} as const;

// Role Permissions
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['read', 'create', 'update', 'delete'],
  [ROLES.EDITOR]: ['read', 'create', 'update'],
  [ROLES.VIEWER]: ['read'],
} as const;

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

// Validation
export const VALIDATION = {
  MIN_PROPERTY_NAME_LENGTH: 3,
  MAX_PROPERTY_NAME_LENGTH: 100,
  MIN_PRICE: 0,
  MAX_PRICE: 999999999,
  MIN_YEAR: 1900,
  MAX_YEAR: new Date().getFullYear() + 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

// Toast Configuration
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

// Theme
export const THEME_STORAGE_KEY = 'realestate_theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    TOKEN: '/auth/token', // Deprecated - use LOGIN
    BY_ID: (userId: string) => `/auth/${userId}`,
    BY_EMAIL: (email: string) => `/auth/by-email/${email}`,
  },
  PROPERTIES: {
    BASE: '/properties',
    BY_ID: (id: string) => `/properties/${id}`,
    IMAGES: (id: string) => `/properties/${id}/images`,
    DELETE_IMAGE: (id: string, imageId: string) =>
      `/properties/${id}/images/${imageId}`,
    TRACES: (id: string) => `/properties/${id}/traces`,
  },
  OWNERS: {
    BASE: '/owners',
    BY_ID: (id: string) => `/owners/${id}`,
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check the form for errors.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  PROPERTY_CREATED: 'Property created successfully',
  PROPERTY_UPDATED: 'Property updated successfully',
  PROPERTY_DELETED: 'Property deleted successfully',
  IMAGE_UPLOADED: 'Image uploaded successfully',
  IMAGE_DELETED: 'Image deleted successfully',
  OWNER_CREATED: 'Owner created successfully',
  OWNER_UPDATED: 'Owner updated successfully',
  OWNER_DELETED: 'Owner deleted successfully',
  TRACE_CREATED: 'Property trace created successfully',
  TRACE_UPDATED: 'Property trace updated successfully',
  TRACE_DELETED: 'Property trace deleted successfully',
} as const;
