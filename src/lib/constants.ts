export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Real Estate Management System';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001/api/v1';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: (id: string | number) => `/properties/${id}`,
  PROPERTY_CREATE: '/properties/create',
  PROPERTY_EDIT: (id: string | number) => `/properties/${id}/edit`,
  OWNERS: '/owners',
  OWNER_DETAILS: (id: string | number) => `/owners/${id}`,
  TRACES: '/traces',
  SETTINGS: '/settings',
} as const;

export const ROLES = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
} as const;

export const COLORS = {
  PRIMARY: '#003366',
  SECONDARY: '#0099CC',
  ACCENT: '#FFCC00',
  NEUTRAL: '#F5F5F5',
  TEXT: '#333333',
} as const;
