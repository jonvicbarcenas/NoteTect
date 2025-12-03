import { User, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/auth';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  async signup(data: SignupRequest): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = {
          message: 'Signup failed. Please try again.',
          status: response.status,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Unable to connect to the server. Please try again later.',
      } as ApiError;
    }
  },

  async login(data: LoginRequest): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = {
          message: 'Invalid email or password.',
          status: response.status,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Unable to connect to the server. Please try again later.',
      } as ApiError;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
    } catch {
      // Ignore errors on logout
    }
  },

  async updateName(name: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/update-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error: ApiError = {
          message: 'Failed to update name. Please try again.',
          status: response.status,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Unable to connect to the server. Please try again later.',
      } as ApiError;
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        let message = 'Failed to update password. Please try again.';
        if (response.status === 400) {
          message = 'Current password is incorrect.';
        }
        const error: ApiError = {
          message,
          status: response.status,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Unable to connect to the server. Please try again later.',
      } as ApiError;
    }
  },
};
