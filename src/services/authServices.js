import config from '../config/config.js';

export const authService = {
  async register(email, password) {
    const response = await fetch(`${config.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response;
  },

  async login(email, password) {
    console.log("sending request "+`${config.API_URL}/auth/login`);
    const response = await fetch(`${config.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response;
  },

  async refreshToken(refreshToken) {
    const response = await fetch(`${config.API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    return response.json();
  }
};