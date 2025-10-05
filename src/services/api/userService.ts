import { apiClient } from './apiClient';

export interface UpdateProfileDto {
  name: string;
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * User Service - Profile and password management
 */
export const userService = {
  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileDto): Promise<void> {
    await apiClient.put('/users/profile', data);
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    await apiClient.put('/users/change-password', data);
  },
};
