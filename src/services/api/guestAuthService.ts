import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

const GUEST_TOKEN_KEY = 'realestate_guest_token';
const GUEST_TOKEN_EXPIRY_KEY = 'realestate_guest_token_expiry';

interface GuestTokenResponse {
  token: string;
  expiresAt: string;
}

/**
 * Guest Authentication Service
 * Manages temporary tokens for public access to traces
 */
export const guestAuthService = {
  /**
   * Get a valid guest token (fetches new one if expired or missing)
   */
  async getGuestToken(): Promise<string> {
    // Check if we have a valid cached token
    const cachedToken = localStorage.getItem(GUEST_TOKEN_KEY);
    const expiryStr = localStorage.getItem(GUEST_TOKEN_EXPIRY_KEY);

    if (cachedToken && expiryStr) {
      const expiry = new Date(expiryStr);
      const now = new Date();
      
      // If token is still valid for at least 5 minutes, use it
      if (expiry.getTime() - now.getTime() > 5 * 60 * 1000) {
        return cachedToken;
      }
    }

    // Fetch new guest token
    return await this.fetchNewGuestToken();
  },

  /**
   * Fetch a new guest token from the API
   */
  async fetchNewGuestToken(): Promise<string> {
    try {
      const response = await axios.post<GuestTokenResponse>(
        `${API_BASE_URL}/auth/token`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token, expiresAt } = response.data;

      // Cache the token
      localStorage.setItem(GUEST_TOKEN_KEY, token);
      localStorage.setItem(GUEST_TOKEN_EXPIRY_KEY, expiresAt);

      return token;
    } catch (error) {
      console.error('Failed to fetch guest token:', error);
      throw new Error('Unable to authenticate for public access');
    }
  },

  /**
   * Clear cached guest token
   */
  clearGuestToken(): void {
    localStorage.removeItem(GUEST_TOKEN_KEY);
    localStorage.removeItem(GUEST_TOKEN_EXPIRY_KEY);
  },
};
