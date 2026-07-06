import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Globe } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';
import { useAuthStore } from '../src/store/useAuthStore';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Setup Google login auth session request
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest({
    clientId: '416946845040-knj5710hjrll1547emrpfjova7tvifin.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (googleRequest?.redirectUri) {
      console.log("👉 EXPO GOOGLE REDIRECT URI:", googleRequest.redirectUri);
    }
  }, [googleRequest]);

  useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.authentication?.idToken) {
      const idToken = googleResponse.authentication.idToken;
      setIsLoading(true);
      loginWithGoogle(idToken)
        .then(() => {
          Alert.alert('Thành công', 'Đăng nhập Google thành công!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
          ]);
        })
        .catch((err) => {
          console.warn('Lỗi đăng nhập Google:', err);
          Alert.alert('Thất bại', err.response?.data?.message || err.message || 'Đăng nhập bằng Google thất bại.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [googleResponse]);

  const handleGoogleLoginPress = async () => {
    try {
      await promptGoogleAsync();
    } catch (error) {
      console.warn('Lỗi mở trình duyệt Google:', error);
      Alert.alert('Lỗi', 'Không thể mở trình duyệt đăng nhập Google.');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin đăng nhập');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (e: any) {
      Alert.alert('Thất bại', e.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.title}>Thông tin của bạn</Text>
        <Text style={styles.subtitle}>
          Đăng nhập để lưu lịch sử đặt hàng và đồng bộ giỏ hàng của bạn.
        </Text>

        {/* Email Input */}
        <Text style={styles.label}>Tên tài khoản hoặc địa chỉ email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Mật khẩu *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nhập mật khẩu..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry={obscurePassword}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setObscurePassword(!obscurePassword)}
          >
            {obscurePassword ? <EyeOff color="#78716C" size={20} /> : <Eye color="#78716C" size={20} />}
          </TouchableOpacity>
        </View>

        {/* Remember & Forgot */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Ghi nhớ mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Submit button */}
        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={AppTheme.colors.white} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>ĐĂNG NHẬP</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>HOẶC</Text>
          <View style={styles.divider} />
        </View>

        {/* Google sign-in */}
        <TouchableOpacity 
          style={styles.googleBtn} 
          onPress={handleGoogleLoginPress}
          disabled={!googleRequest || isLoading}
        >
          <Globe color="#EF4444" size={20} />
          <Text style={styles.googleBtnText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        {/* Go to register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 36,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 14,
    color: AppTheme.colors.darkText,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 14,
    color: AppTheme.colors.darkText,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.white,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderColor: AppTheme.colors.primaryGreen,
  },
  checkboxLabel: {
    fontSize: 13,
    color: AppTheme.colors.darkText,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  submitBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: AppTheme.colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 11,
    color: '#A8A29E',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.white,
    borderRadius: 100,
    paddingVertical: 14,
  },
  googleBtnText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
  },
  registerText: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
});
