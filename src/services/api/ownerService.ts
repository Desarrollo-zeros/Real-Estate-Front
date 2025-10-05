import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../../utils/constants';
import { buildQueryString } from '../../utils/helpers';
import type { OwnerDto, CreateOwnerDto, UpdateOwnerDto, PaginatedResponse } from '../../types';

/**
 * Owner Service - CRUD operations for owners
 */
export const ownerService = {
  /**
   * Get all owners with pagination
   */
  async getOwners(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<OwnerDto>> {
    const queryString = buildQueryString({ page, pageSize });
    return apiClient.get<PaginatedResponse<OwnerDto>>(`${API_ENDPOINTS.OWNERS.BASE}${queryString}`);
  },

  /**
   * Get owner by ID
   */
  async getOwnerById(id: string): Promise<OwnerDto> {
    return apiClient.get<OwnerDto>(API_ENDPOINTS.OWNERS.BY_ID(id));
  },

  /**
   * Create new owner
   */
  async createOwner(owner: CreateOwnerDto): Promise<OwnerDto> {
    return apiClient.post<OwnerDto>(API_ENDPOINTS.OWNERS.BASE, owner);
  },

  /**
   * Update existing owner
   */
  async updateOwner(id: string, owner: UpdateOwnerDto): Promise<OwnerDto> {
    return apiClient.put<OwnerDto>(API_ENDPOINTS.OWNERS.BY_ID(id), owner);
  },

  /**
   * Delete owner
   */
  async deleteOwner(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.OWNERS.BY_ID(id));
  },

  /**
   * Get all owners (for dropdowns)
   */
  async getAllOwners(): Promise<OwnerDto[]> {
    const response = await this.getOwners(1, 1000);
    return response.items;
  },
};
