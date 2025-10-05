import { apiClient } from './apiClient';
import type { PropertyTraceDto, CreatePropertyTraceDto, UpdatePropertyTraceDto } from '../../types';

/**
 * Traces Service - CRUD operations for property traces
 */
export const tracesService = {
  /**
   * Get all traces for a property
   */
  async getTracesByProperty(propertyId: string): Promise<PropertyTraceDto[]> {
    const response = await apiClient.get<PropertyTraceDto[]>(
      `/properties/${propertyId}/traces`
    );
    return response;
  },

  /**
   * Get trace by ID
   */
  async getTraceById(propertyId: string, traceId: string): Promise<PropertyTraceDto> {
    const response = await apiClient.get<PropertyTraceDto>(
      `/properties/${propertyId}/traces/${traceId}`
    );
    return response;
  },

  /**
   * Create new trace
   */
  async createTrace(
    propertyId: string,
    trace: CreatePropertyTraceDto
  ): Promise<PropertyTraceDto> {
    const response = await apiClient.post<{ id: string }>(
      `/properties/${propertyId}/traces`,
      trace
    );
    return { ...trace, id: response.id, idProperty: propertyId } as PropertyTraceDto;
  },

  /**
   * Update existing trace
   */
  async updateTrace(
    propertyId: string,
    traceId: string,
    trace: UpdatePropertyTraceDto
  ): Promise<void> {
    await apiClient.put<void>(`/properties/${propertyId}/traces/${traceId}`, trace);
  },

  /**
   * Delete trace (soft delete)
   */
  async deleteTrace(propertyId: string, traceId: string): Promise<void> {
    await apiClient.delete<void>(`/properties/${propertyId}/traces/${traceId}`);
  },

  /**
   * Get all traces across all properties (for traces list page)
   */
  async getAll(page: number = 1, pageSize: number = 20) {
    const response = await apiClient.get<{
      items: PropertyTraceDto[];
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    }>(`/traces?page=${page}&pageSize=${pageSize}`);
    return response;
  },

  /**
   * Get trace by ID (Public endpoint - no auth required)
   */
  async getPublicTraceById(traceId: string): Promise<PropertyTraceDto> {
    const response = await apiClient.get<PropertyTraceDto>(`/traces/${traceId}`);
    return response;
  },
};
