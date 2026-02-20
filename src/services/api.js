// src/services/api.js
import authService from './authService';
import config from '../config/config.js';

class ApiService {
  
  async makeRequest(endpoint, options = {}) {
    let token = await authService.getAccessToken();
    if (!token) {
      throw new Error('NO_TOKEN');
    }
    let response = await fetch(`${config.API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    // If 401, refresh via AuthService
    if (response.status === 401) {
      try {
        // AuthService handles the refresh
        token = await authService.refreshAccessToken();
        
        // Retry with new token
        response = await fetch(`${config.API_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
          }
        });

      } catch (error) {
        throw new Error('SESSION_EXPIRED');
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

export default new ApiService();