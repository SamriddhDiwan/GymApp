import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config.js';

class AuthService {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
  async getAccessToken() {
    return await SecureStore.getItemAsync('accessToken');
  }

  async getRefreshToken() {
    return await SecureStore.getItemAsync('refreshToken');
  }

  async saveTokens(accessToken, refreshToken) {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }

  async clearTokens() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await AsyncStorage.removeItem('user');
  }

  async isAuthenticated() {
    const refreshToken = await this.getRefreshToken();
    return !!refreshToken;
  }

  // ============================================
  // AUTH OPERATIONS (login, register, refresh)
  // ============================================

  async login(email, password) {
    const response = await fetch(`${config.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();

    // Save tokens (single place)
    await this.saveTokens(data.accessToken, data.refreshToken);

    // Save user info
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async register(name, email, password) {
    const response = await fetch(`${config.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();

    // Save tokens (single place)
    await this.saveTokens(data.accessToken, data.refreshToken);

    // Save user info
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh calls
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await this.getRefreshToken();

        if (!refreshToken) {
          throw new Error('NO_REFRESH_TOKEN');
        }

        const response = await fetch(`${config.API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
          throw new Error('REFRESH_FAILED');
        }

        const data = await response.json();

        // Save new access token; keep existing refresh token if API doesn't rotate it
        await this.saveTokens(data.accessToken, data.refreshToken ?? refreshToken);

        return data.accessToken;

      } catch (error) {
        // Refresh failed - clear everything
        await this.clearTokens();
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async logout() {
    await this.clearTokens();
    await AsyncStorage.removeItem('workoutHistory');
    await AsyncStorage.removeItem('userDetails');
  }
  async getUser() {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
  async sendOTP(email){
    const response=await fetch(`${config.API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email})
    });
    return response;
  }
  async resetPassword(email, newPassword, resetPasswordToken) {
    const response = await fetch(`${config.API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, resetPasswordToken })
    });
    return response;
  }
  async verifyOTP(email,otp){
    const response=await fetch(`${config.API_URL}/auth/forgot-password-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email,otp})
    });
    return response;
  }
}

export default new AuthService();