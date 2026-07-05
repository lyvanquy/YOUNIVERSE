import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';
import { useAuthStore } from '../src/store/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu cần tối thiểu 8 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName.trim(), email.trim(), phone.trim(), password);
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (e: any) {
      Alert.alert('Thất bại', e.response?.data?.message || 'Không thể đăng ký. Email có thể đã tồn tại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.title}>Tạo tài khoản mới</Text>
        <Text style={styles.subtitle}>
          Trở thành thành viên của gia đình YOUniverse để nhận nhiều ưu đãi đặc biệt.
        </Text>

        {/* Full Name Input */}
        <Text style={styles.label}>Họ và tên *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên..."
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email Input */}
        <Text style={styles.label}>Địa chỉ email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Phone Input */}
        <Text style={styles.label}>Số điện thoại (tùy chọn)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại..."
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Password Input */}
        <Text style={styles.label}>Mật khẩu *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)..."
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

        {/* Submit button */}
        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={AppTheme.colors.white} size="small" />
          ) : (
            <Text style={styles.submitBtnText}>ĐĂNG KÝ NGAY</Text>
          )}
        </TouchableOpacity>

        {/* Go to login */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Đăng nhập ngay</Text>
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
    marginBottom: 28,
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
    marginBottom: 32,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
});
