import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
}

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: String) => Promise<void>;
  register: (fullName: String, email: string, phone: string, password: String) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (fullName: string, phone: string, address: string) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken } = response.data;
    
    await SecureStore.setItemAsync('auth_token', accessToken);
    set({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        address: user.address,
      },
      isAuthenticated: true,
    });
  },

  register: async (fullName, email, phone, password) => {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      phone: phone || undefined,
      password,
      confirmPassword: password,
    });
    const { user, accessToken } = response.data;

    await SecureStore.setItemAsync('auth_token', accessToken);
    set({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        address: user.address,
      },
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    await SecureStore.deleteItemAsync('auth_token');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (fullName, phone, address) => {
    const response = await api.patch('/auth/me/profile', {
      fullName,
      phone: phone || undefined,
      address: address || undefined,
    });
    const { user } = response.data.data || response.data;
    set({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        address: user.address,
      }
    });
  },

  updateAvatar: async (avatarUrl) => {
    const response = await api.patch('/auth/me/avatar', { avatarUrl });
    const { user } = response.data.data || response.data;
    set({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        address: user.address,
      }
    });
  },

  loginWithGoogle: async (credential) => {
    const response = await api.post('/auth/google', { credential });
    const { user, accessToken } = response.data;

    await SecureStore.setItemAsync('auth_token', accessToken);
    set({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        address: user.address,
      },
      isAuthenticated: true,
    });
  },

  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        const response = await api.get('/auth/me');
        const { user } = response.data;
        set({
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            address: user.address,
          },
          isAuthenticated: true,
        });
      }
    } catch (e) {
      await SecureStore.deleteItemAsync('auth_token');
    } finally {
      set({ isInitialized: true });
    }
  },
}));
