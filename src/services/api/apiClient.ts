import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import {
  API_BASE_URL,
  API_TIMEOUT,
  TOKEN_STORAGE_KEY,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../../utils/constants';
import type { ProblemDetails, ApiResponse } from '../../types';

/**
 * API Client with JWT authentication and error handling
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  private loadingCallbacks: { start: () => void; stop: () => void } | null = null;

  publicPaths = ['/login'];

  private isPublicPath(pathname: string): boolean {
    return this.publicPaths.some(path => pathname.startsWith(path));
  }

  /**
   * Register loading callbacks from React context
   */
  public registerLoadingCallbacks(callbacks: { start: () => void; stop: () => void }) {
    this.loadingCallbacks = callbacks;
  }

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, 
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - Attach JWT token and start loading
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Start global loading
        if (this.loadingCallbacks) {
          this.loadingCallbacks.start();
        }

        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        // Stop loading on request error
        if (this.loadingCallbacks) {
          this.loadingCallbacks.stop();
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle ApiResponse and show toasts
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        // Stop global loading on success
        if (this.loadingCallbacks) {
          this.loadingCallbacks.stop();
        }

        // Handle successful ApiResponse with message
        const data = response.data;
        
        // Check if response is ApiResponse format
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          const method = response.config.method?.toLowerCase();
          
          // Handle success: false (business logic error with 200 status)
          if (!data.success && data.message) {
            toast.error(data.message);
          }
          // Show success toast for write operations (POST, PUT, DELETE)
          else if (data.success && data.message && ['post', 'put', 'delete', 'patch'].includes(method || '')) {
            toast.success(data.message);
          }
        }
        
        return response;
      },
      async (error: AxiosError<ApiResponse<any> | ProblemDetails>) => {
        // Stop global loading on error
        if (this.loadingCallbacks) {
          this.loadingCallbacks.stop();
        }
        if (error.response) {
          const { status, data } = error.response;
          const requestUrl = error.config?.url || '';
          
          // Handle 401 Unauthorized
          if (status === HTTP_STATUS.UNAUTHORIZED) {
            // Extract message from response
            let message: string = ERROR_MESSAGES.UNAUTHORIZED;
            if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
              message = (data.message as string) || ERROR_MESSAGES.UNAUTHORIZED;
            } else if (data && typeof data === 'object' && 'title' in data) {
              const problemDetails = data as ProblemDetails;
              message = (problemDetails.detail || problemDetails.title || ERROR_MESSAGES.UNAUTHORIZED) as string;
            }
            
            // Check if this is a login request or public endpoint - don't redirect, let component handle it
            const isLoginRequest = requestUrl.includes('/auth/login');
            const isPublicEndpoint = requestUrl.includes('/traces/') && !requestUrl.includes('/properties/');
            
            if (isLoginRequest || isPublicEndpoint) {
              // Show toast but don't redirect - let the component handle the error
              toast.error(message);
            } else {
              // For other 401 errors (expired token, etc.), show toast and redirect to login
              toast.error(message);
              this.handleUnauthorized();
            }
          }
          // Handle ApiResponse error format
          else if (data && typeof data === 'object' && 'success' in data && !data.success) {
            const message = data.message || ERROR_MESSAGES.GENERIC;
            toast.error(message);
          }
          // Handle ProblemDetails format
          else if (data && typeof data === 'object' && 'title' in data) {
            const problemDetails = data as ProblemDetails;
            const message = problemDetails.detail || problemDetails.title || ERROR_MESSAGES.GENERIC;
            toast.error(message);
          }
          // Handle other status codes
          else {
            switch (status) {
              case HTTP_STATUS.FORBIDDEN:
                toast.error(ERROR_MESSAGES.FORBIDDEN);
                break;
              case HTTP_STATUS.TOO_MANY_REQUESTS:
                toast.error(ERROR_MESSAGES.RATE_LIMIT);
                break;
              case HTTP_STATUS.NOT_FOUND:
                toast.error(ERROR_MESSAGES.NOT_FOUND);
                break;
              case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                toast.error(ERROR_MESSAGES.GENERIC);
                break;
              default:
                toast.error(ERROR_MESSAGES.GENERIC);
            }
          }
        } else if (error.request) {
          toast.error(ERROR_MESSAGES.NETWORK);
        } else {
          toast.error(ERROR_MESSAGES.GENERIC);
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Handle unauthorized access (401)
   */
  private handleUnauthorized(): void {
    this.clearToken();
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    if(!this.isPublicPath){
      window.location.href = '/login';
    }
  }

  /**
   * Map 'id' field to entity-specific ID field (idProperty, idOwner, etc.)
   * @param data - Response data
   * @param url - Request URL to determine entity type
   */
  private mapIdField<T>(data: T, url: string): T {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Check if data has an 'id' field
    const dataWithId = data as any;
    if (!('id' in dataWithId) || dataWithId.id === undefined) {
      return data;
    }

    // Entity mapping based on URL
    const entityMappings: Record<string, string> = {
      '/properties': 'idProperty',
      '/owners': 'idOwner',
      '/property-images': 'idPropertyImage',
      '/property-traces': 'idPropertyTrace',
    };

    // Find matching entity type from URL
    for (const [urlPattern, idFieldName] of Object.entries(entityMappings)) {
      if (url.includes(urlPattern)) {
        // Create new object with mapped ID field
        const mappedData = { ...dataWithId };
        mappedData[idFieldName] = dataWithId.id;
        // Keep the original 'id' field for compatibility
        return mappedData as T;
      }
    }

    return data;
  }

  /**
   * Normalize error response
   */
  private normalizeError(error: AxiosError<ApiResponse<any> | ProblemDetails>): Error {
    if (error.response?.data) {
      const data = error.response.data;
      let message: string = ERROR_MESSAGES.GENERIC;
      let errors: Record<string, string[]> | undefined;
      
      // Handle ApiResponse format
      if ('success' in data && 'message' in data) {
        message = (data.message as string) || ERROR_MESSAGES.GENERIC;
        errors = data.errors as Record<string, string[]>;
      }
      // Handle ProblemDetails format
      else if ('title' in data) {
        const problemDetails = data as ProblemDetails;
        message = (problemDetails.detail || problemDetails.title || ERROR_MESSAGES.GENERIC) as string;
        errors = problemDetails.errors;
      }
      
      const normalizedError = new Error(message) as Error & {
        status?: number;
        errors?: Record<string, string[]>;
      };
      normalizedError.status = error.response.status;
      normalizedError.errors = errors;
      return normalizedError;
    }

    return error;
  }

  /**
   * Get stored JWT token
   */
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Clear stored token
   */
  private clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.get(url, config);
    // Unwrap ApiResponse to get actual data
    return response.data.data as T;
  }

  /**
   * POST request
   */
  async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.post(url, data, config);
    // Unwrap ApiResponse and map id field to entity-specific field
    const responseData = response.data.data as T;
    return this.mapIdField(responseData, url);
  }

  /**
   * PUT request
   */
  async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.put(url, data, config);
    // Unwrap ApiResponse to get actual data
    return response.data.data as T;
  }

  /**
   * PATCH request
   */
  async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.patch(url, data, config);
    // Unwrap ApiResponse to get actual data
    return response.data.data as T;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.delete(url, config);
    // Unwrap ApiResponse to get actual data
    return response.data.data as T;
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
