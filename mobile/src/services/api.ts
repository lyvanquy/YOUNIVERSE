import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Tự động nhận diện IP máy host khi chạy Expo Go trên điện thoại thật
const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri; // Ví dụ: "192.168.1.5:8081"
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:4000/api/v1`;
  }
  return 'http://localhost:4000/api/v1'; // Fallback khi chạy giả lập
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

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
