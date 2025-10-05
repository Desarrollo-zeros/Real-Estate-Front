// Core Types and Interfaces

export type UserRole = 'Admin' | 'Editor' | 'Viewer';

/**
 * Standardized API response matching backend ApiResponse<T>
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

/**
 * @deprecated Use ApiResponse<T> instead
 */
export interface ResponseData<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  userId: string;
  username: string;
  name?: string;
  email?: string;
  roles: UserRole[];
}

export interface AuthToken {
  token: string;
  username?: string;
  user?: User;
  roles?: UserRole[];
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Property Types
export interface PropertyDto {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
  ownerName?: string;
  owner?: OwnerDto;
  images?: PropertyImageDto[];
}

export interface CreatePropertyDto {
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

export interface UpdatePropertyDto {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

export interface PropertyFilterDto {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Owner Types
export interface OwnerDto {
  idOwner: string;
  name: string;
  address: string;
  photo?: string;
  birthday: string;
  properties?: PropertyDto[];
}

export interface CreateOwnerDto {
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

export interface UpdateOwnerDto {
  id: string;
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

// Property Image Types
export interface PropertyImageDto {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

export interface CreatePropertyImageDto {
  idProperty: string;
  file: string;
  enabled: boolean;
}

// Property Trace Types
export interface PropertyTraceDto {
  id: string;
  idPropertyTrace: string;
  idProperty: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
  propertyName?: string;
  propertyAddress?: string;
}

export interface CreatePropertyTraceDto {
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}

export interface UpdatePropertyTraceDto {
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  totalCount: number;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Dashboard Types
export interface DashboardMetrics {
  totalProperties: number;
  totalValue: number;
  averagePrice: number;
  propertiesThisMonth: number;
  recentProperties: PropertyDto[];
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
