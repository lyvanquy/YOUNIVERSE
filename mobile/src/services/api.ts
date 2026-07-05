import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL API Production mặc định để khách hàng sử dụng trực tiếp
export const DEFAULT_API_URL = 'https://api.youniverse.io.vn/api/v1';

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Hàm để tải cấu hình động (dành cho thử nghiệm nội bộ)
export const initializeApiBaseUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem('custom_api_url');
    if (savedUrl) {
      api.defaults.baseURL = savedUrl;
    } else {
      api.defaults.baseURL = DEFAULT_API_URL;
    }
  } catch (e) {
    api.defaults.baseURL = DEFAULT_API_URL;
  }
};

// Khởi chạy thiết lập ban đầu
initializeApiBaseUrl();

// Chèn JWT Token tự động vào Header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Lỗi đọc Token bảo mật:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
