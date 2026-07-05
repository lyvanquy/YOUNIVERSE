import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { User, LogOut, Info, BookOpen, MessageSquare, LogIn, ChevronRight, ShoppingBag, MapPin, Edit3, Check, X, Database, ShieldAlert } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme } from '../../src/config/theme';
import { useAuthStore } from '../../src/store/useAuthStore';
import api, { DEFAULT_API_URL } from '../../src/services/api';

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();

  /* ── Order History States ── */
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  /* ── Edit Profile States ── */
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  /* ── Server Config States ── */
  const [showServerModal, setShowServerModal] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState(DEFAULT_API_URL);
  const [customUrlInput, setCustomUrlInput] = useState(DEFAULT_API_URL);

  // Fetch orders when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderHistory();
    } else {
      setOrders([]);
    }
  }, [isAuthenticated]);

  // Load saved custom API URL on load
  useEffect(() => {
    AsyncStorage.getItem('custom_api_url').then((val) => {
      if (val) {
        setCurrentApiUrl(val);
        setCustomUrlInput(val);
      }
    });
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.get('/orders/me?page=1&limit=20');
      const items = response.data.data?.items || response.data.items || [];
      setOrders(items);
    } catch (err) {
      console.warn("Lỗi tải lịch sử đơn hàng:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStartEdit = () => {
    if (user) {
      setEditName(user.fullName || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền họ và tên.');
      return;
    }
    
    try {
      setIsUpdating(true);
      await updateProfile(editName.trim(), editPhone.trim(), editAddress.trim());
      setIsEditing(false);
      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân.');
    } catch (err: any) {
      Alert.alert('Thất bại', err.response?.data?.message || err.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenServerSettings = async () => {
    const val = await AsyncStorage.getItem('custom_api_url');
    setCurrentApiUrl(val || DEFAULT_API_URL);
    setCustomUrlInput(val || DEFAULT_API_URL);
    setShowServerModal(true);
  };

  const handleSelectServerPreset = async (url: string) => {
    try {
      if (url === DEFAULT_API_URL) {
        await AsyncStorage.removeItem('custom_api_url');
      } else {
        await AsyncStorage.setItem('custom_api_url', url);
      }
      api.defaults.baseURL = url;
      setCurrentApiUrl(url);
      setCustomUrlInput(url);
      Alert.alert('Thành công', `Đã chuyển kết nối API sang:\n${url}`);
      setShowServerModal(false);
      if (isAuthenticated) {
        fetchOrderHistory();
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lưu cấu hình.');
    }
  };

  const handleSaveCustomServer = async () => {
    const url = customUrlInput.trim();
    if (!url) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL hợp lệ.');
      return;
    }
    await handleSelectServerPreset(url);
  };

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

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* 1. Profile / Login Box */}
      <View style={styles.headerBlock}>
        {isAuthenticated && user ? (
          isEditing ? (
            /* Editing Profile View */
            <View style={styles.editForm}>
              <Text style={styles.formTitle}>Chỉnh sửa thông tin</Text>
              
              <Text style={styles.label}>Họ và tên *</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Nhập họ và tên..."
              />

              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Nhập số điện thoại..."
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Địa chỉ giao hàng mặc định</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder="Nhập địa chỉ nhà riêng hoặc cơ sở UEH..."
                multiline
                numberOfLines={2}
              />

              <View style={styles.editActionsRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.cancelBtn]} 
                  onPress={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  <X color={AppTheme.colors.textMuted} size={14} />
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionBtn, styles.saveBtn]} 
                  onPress={handleSaveProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color={AppTheme.colors.white} />
                  ) : (
                    <>
                      <Check color={AppTheme.colors.white} size={14} />
                      <Text style={styles.saveBtnText}>Lưu</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Display Profile View */
            <View style={styles.profileContainer}>
              <View style={styles.profileRow}>
                <View style={styles.avatarCircle}>
                  <User color={AppTheme.colors.primaryGreen} size={36} />
                </View>
                <View style={styles.profileText}>
                  <Text style={styles.profileName}>{user.fullName}</Text>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                  {user.phone && <Text style={styles.profilePhone}>{user.phone}</Text>}
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={handleStartEdit}>
                  <Edit3 color={AppTheme.colors.primaryGreen} size={18} />
                </TouchableOpacity>
              </View>
              {user.address ? (
                <View style={styles.addressBox}>
                  <MapPin color={AppTheme.colors.textMuted} size={14} />
                  <Text style={styles.addressText} numberOfLines={2}>{user.address}</Text>
                </View>
              ) : null}
            </View>
          )
        ) : (
          /* Login invite view */
          <View style={styles.loginInvite}>
            <Text style={styles.loginInviteTitle}>Thành viên YOUniverse</Text>
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

      {/* 2. Logged In: Order History List */}
      {isAuthenticated && (
        <View style={styles.orderHistorySection}>
          <View style={styles.sectionHeader}>
            <ShoppingBag color={AppTheme.colors.primaryGreen} size={18} />
            <Text style={styles.sectionTitle}>Lịch sử đơn hàng của bạn</Text>
          </View>
          
          {ordersLoading ? (
            <ActivityIndicator size="small" color={AppTheme.colors.accentYellow} style={{ marginVertical: 20 }} />
          ) : orders.length === 0 ? (
            <View style={styles.emptyOrdersCard}>
              <Text style={styles.emptyOrdersText}>Chưa ghi nhận đơn hàng nào trên tài khoản này.</Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderCode}>{order.orderCode}</Text>
                    <View style={styles.orderStatusBadge}>
                      <Text style={styles.orderStatusText}>{order.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderDate}>
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                  
                  <View style={styles.orderItemsBox}>
                    {order.items?.map((item: any) => (
                      <Text key={item.id} style={styles.orderItemRow} numberOfLines={1}>
                        • {item.productName} x {item.quantity}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.orderTotalVal}>{formatMoney(Number(order.totalAmount))}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 3. Navigation Menu Cards */}
      <View style={styles.menuCard}>
        {_buildMenuItem(
          <Info color={AppTheme.colors.primaryGreen} size={20} />,
          "Về câu chuyện YOUniverse",
          () => router.push('/about')
        )}
        <View style={styles.menuDivider} />

        {_buildMenuItem(
          <ShieldAlert color={AppTheme.colors.primaryGreen} size={20} />,
          "Chính sách đổi trả & bảo hành",
          () => router.push('/policy')
        )}
        <View style={styles.menuDivider} />
        
        {_buildMenuItem(
          <BookOpen color={AppTheme.colors.primaryGreen} size={20} />,
          "Tin tức & Chuyện hành tinh",
          () => router.push('/blog')
        )}
        <View style={styles.menuDivider} />

        {_buildMenuItem(
          <MessageSquare color={AppTheme.colors.primaryGreen} size={20} />,
          "Liên hệ đóng góp ý kiến",
          () => router.push('/contact')
        )}
        <View style={styles.menuDivider} />

        {_buildMenuItem(
          <Database color={AppTheme.colors.primaryGreen} size={20} />,
          "Cấu hình máy chủ (API Server)",
          handleOpenServerSettings
        )}
      </View>

      {/* 4. Logout Action button */}
      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={AppTheme.colors.red} size={18} />
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      )}

      {/* 5. Server Configuration Modal */}
      <Modal
        visible={showServerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowServerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cấu hình API Server</Text>
              <TouchableOpacity onPress={() => setShowServerModal(false)}>
                <X color={AppTheme.colors.darkText} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSub}>Chọn một máy chủ để kết nối ứng dụng:</Text>
              
              {/* Presets */}
              <TouchableOpacity 
                style={[styles.presetTile, currentApiUrl === DEFAULT_API_URL && styles.presetTileActive]}
                onPress={() => handleSelectServerPreset(DEFAULT_API_URL)}
              >
                <Text style={styles.presetName}>Cloud Production Server (Khuyên dùng)</Text>
                <Text style={styles.presetUrl}>{DEFAULT_API_URL}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.presetTile, currentApiUrl === 'http://192.168.1.33:4000/api/v1' && styles.presetTileActive]}
                onPress={() => handleSelectServerPreset('http://192.168.1.33:4000/api/v1')}
              >
                <Text style={styles.presetName}>Local Dev Server (Wi-Fi)</Text>
                <Text style={styles.presetUrl}>http://192.168.1.33:4000/api/v1</Text>
              </TouchableOpacity>

              <Text style={styles.modalLabel}>Hoặc nhập địa chỉ IP / Tunnel tự do:</Text>
              <TextInput
                style={styles.modalInput}
                value={customUrlInput}
                onChangeText={setCustomUrlInput}
                placeholder="http://192.168.x.x:4000/api/v1"
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.applyBtn} onPress={handleSaveCustomServer}>
                <Text style={styles.applyBtnText}>Lưu cấu hình tự chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    paddingBottom: 40,
  },
  headerBlock: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginBottom: 20,
  },
  profileContainer: {
    width: '100%',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(28, 25, 23, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  profileEmail: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  editBtn: {
    padding: 6,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 14,
    gap: 8,
  },
  addressText: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    flex: 1,
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
  editForm: {
    width: '100%',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 6,
  },
  input: {
    backgroundColor: AppTheme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: AppTheme.colors.darkText,
    marginBottom: 12,
  },
  textArea: {
    height: 50,
    textAlignVertical: 'top',
  },
  editActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  cancelBtn: {
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  saveBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
  },
  cancelBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.textMuted,
  },
  saveBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.white,
  },
  orderHistorySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 4,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  emptyOrdersCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    alignItems: 'center',
  },
  emptyOrdersText: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  orderStatusBadge: {
    backgroundColor: 'rgba(230, 179, 8, 0.08)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  orderStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: AppTheme.colors.accentYellow,
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 10,
    color: AppTheme.colors.textMuted,
    marginBottom: 10,
  },
  orderItemsBox: {
    backgroundColor: 'rgba(28, 25, 23, 0.02)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    gap: 4,
  },
  orderItemRow: {
    fontSize: 11,
    color: AppTheme.colors.darkText,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    paddingTop: 10,
  },
  orderTotalLabel: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
  },
  orderTotalVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.accentYellow,
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
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppTheme.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
    paddingBottom: 16,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  modalBody: {
    width: '100%',
  },
  modalSub: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    marginBottom: 16,
  },
  presetTile: {
    backgroundColor: AppTheme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  presetTileActive: {
    borderColor: AppTheme.colors.primaryGreen,
    backgroundColor: 'rgba(13, 92, 58, 0.03)',
  },
  presetName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 4,
  },
  presetUrl: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    fontFamily: 'monospace',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginTop: 12,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: AppTheme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'monospace',
    color: AppTheme.colors.darkText,
    marginBottom: 20,
  },
  applyBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.white,
  },
});
