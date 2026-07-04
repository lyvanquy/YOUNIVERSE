import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, LogOut, Info, BookOpen, MessageSquare, LogIn, ChevronRight } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Đăng xuất', 
        style: 'destructive',
        onPress: async () => {
          await logout();
          Alert.alert('Đăng xuất', 'Đã đăng xuất thành công.');
        } 
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* 1. Header block */}
      <View style={styles.headerBlock}>
        {isAuthenticated && user ? (
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <User color={AppTheme.colors.primaryGreen} size={36} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user.fullName}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              {user.phone && <Text style={styles.profilePhone}>{user.phone}</Text>}
            </View>
          </View>
        ) : (
          <View style={styles.loginInvite}>
            <Text style={styles.loginInviteTitle}>Thành viên S'mood</Text>
            <Text style={styles.loginInviteDesc}>Đăng nhập để xem lịch sử đơn hàng và nhận nhiều ưu đãi độc quyền.</Text>
            <TouchableOpacity 
              style={styles.loginBtn}
              onPress={() => router.push('/login')}
            >
              <LogIn color={AppTheme.colors.primaryGreen} size={16} />
              <Text style={styles.loginBtnText}>ĐĂNG NHẬP NGAY</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 2. Menu Links */}
      <View style={styles.menuCard}>
        {_buildMenuItem(
          <Info color={AppTheme.colors.primaryGreen} size={20} />,
          "Về câu chuyện S'mood",
          () => router.push('/about')
        )}
        <View style={styles.menuDivider} />
        
        {_buildMenuItem(
          <BookOpen color={AppTheme.colors.primaryGreen} size={20} />,
          "Tin tức & Dinh dưỡng",
          () => router.push('/blog')
        )}
        <View style={styles.menuDivider} />

        {_buildMenuItem(
          <MessageSquare color={AppTheme.colors.primaryGreen} size={20} />,
          "Liên hệ đóng góp ý kiến",
          () => router.push('/contact')
        )}
      </View>

      {/* 3. Logout action */}
      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={AppTheme.colors.red} size={18} />
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function _buildMenuItem(icon: React.ReactNode, label: string, onPress: () => void) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <ChevronRight color={AppTheme.colors.textMuted} size={16} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  scrollContent: {
    padding: 20,
  },
  headerBlock: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(13, 92, 58, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  profileEmail: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  loginInvite: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginInviteTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 8,
  },
  loginInviteDesc: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    width: '100%',
  },
  loginBtnText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    letterSpacing: 0.8,
  },
  menuCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingVertical: 8,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginLeft: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginHorizontal: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.red,
    borderRadius: 100,
    paddingVertical: 14,
  },
  logoutBtnText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.red,
  },
});
