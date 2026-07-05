import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';
import { AppTheme } from '../src/config/theme';

import { initializeApiBaseUrl } from '../src/services/api';

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    const initApp = async () => {
      await initializeApiBaseUrl();
      await initializeAuth();
    };
    initApp();
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppTheme.colors.backgroundLight }}>
        <ActivityIndicator size="large" color={AppTheme.colors.primaryGreen} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="product/[slug]" 
        options={{ 
          headerShown: true, 
          title: 'Chi tiết sản phẩm',
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="checkout" 
        options={{ 
          headerShown: true, 
          title: 'Thanh toán',
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: true, 
          title: 'Đăng nhập',
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          headerShown: true, 
          title: 'Đăng ký',
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          headerShown: true, 
          title: "Về YOUniverse",
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="blog" 
        options={{ 
          headerShown: true, 
          title: 'Tin tức',
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="contact" 
        options={{ 
          headerShown: true, 
          title: 'Liên hệ',
          headerTintColor: AppTheme.colors.darkText,
          headerStyle: { backgroundColor: AppTheme.colors.backgroundLight },
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="order" 
        options={{ 
          headerShown: false,
          title: 'Thiết kế vũ trụ',
        }} 
      />
    </Stack>
  );
}
