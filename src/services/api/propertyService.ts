import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../../utils/constants';
import { buildQueryString } from '../../utils/helpers';
import type {
  PropertyDto,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyFilterDto,
  PaginatedResponse,
  PropertyImageDto,
  CreatePropertyImageDto,
  PropertyTraceDto,
} from '../../types';

/**
 * Property Service - CRUD operations for properties
 */
export const propertyService = {
  /**
   * Get all properties with optional filters
   */
  async getProperties(filters?: PropertyFilterDto): Promise<PaginatedResponse<PropertyDto>> {
    const queryString = filters ? buildQueryString(filters) : '';
    return apiClient.get<PaginatedResponse<PropertyDto>>(
      `${API_ENDPOINTS.PROPERTIES.BASE}${queryString}`
    );
  },

  /**
   * Get property by ID
   */
  async getPropertyById(id: string): Promise<PropertyDto> {
    return apiClient.get<PropertyDto>(API_ENDPOINTS.PROPERTIES.BY_ID(id));
  },

  /**
   * Create new property
   */
  async createProperty(property: CreatePropertyDto): Promise<PropertyDto> {
    return apiClient.post<PropertyDto>(API_ENDPOINTS.PROPERTIES.BASE, property);
  },

  /**
   * Update existing property
   */
  async updateProperty(id: string, property: UpdatePropertyDto): Promise<PropertyDto> {
    return apiClient.put<PropertyDto>(API_ENDPOINTS.PROPERTIES.BY_ID(id), property);
  },

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PROPERTIES.BY_ID(id));
  },

  /**
   * Add image to property
   */
  async addPropertyImage(
    id: string,
    imageData: CreatePropertyImageDto
  ): Promise<PropertyImageDto> {
    return apiClient.post<PropertyImageDto>(
      API_ENDPOINTS.PROPERTIES.IMAGES(id),
      imageData
    );
  },

  /**
   * Upload image file - converts to base64 before sending
   */
  async uploadPropertyImage(id: string, file: File): Promise<PropertyImageDto> {
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    // Send as JSON with base64 string
    const imageData: CreatePropertyImageDto = {
      idProperty: id,
      file: base64,
      enabled: true,
    };

    return apiClient.post<PropertyImageDto>(
      API_ENDPOINTS.PROPERTIES.IMAGES(id),
      imageData
    );
  },

  /**
   * Convert File to base64 string
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Delete property image
   */
  async deletePropertyImage(id: string, imageId: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PROPERTIES.DELETE_IMAGE(id, imageId));
  },

  /**
   * Get property traces (sale history)
   */
  async getPropertyTraces(id: string): Promise<PropertyTraceDto[]> {
    return apiClient.get<PropertyTraceDto[]>(API_ENDPOINTS.PROPERTIES.TRACES(id));
  },

  /**
   * Get recent properties
   */
  async getRecentProperties(limit: number = 5): Promise<PropertyDto[]> {
    const response = await this.getProperties({
      pageSize: limit,
      sortBy: 'idProperty',
      sortOrder: 'desc',
    });
    return response.items;
  },

  /**
   * Search properties by name or address
   */
  async searchProperties(searchTerm: string): Promise<PropertyDto[]> {
    const response = await this.getProperties({
      name: searchTerm,
      pageSize: 50,
    });
    return response.items;
  },
};
