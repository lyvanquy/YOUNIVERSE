import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, QrCode, CheckCircle2, Info, Landmark } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';
import { useCartStore } from '../src/store/useCartStore';
import { useAuthStore } from '../src/store/useAuthStore';
import api from '../src/services/api';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const discount = useCartStore((state) => state.discount);
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QR'>('COD');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Pre-populate fields with logged-in user profile details
  useEffect(() => {
    if (user) {
      if (user.fullName && !name) setName(user.fullName);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.email && !email) setEmail(user.email);
      if (user.address && !address) setAddress(user.address);
    }
  }, [user]);

  // Compute pricing
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const handleOrder = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*)');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Tạo session ID tạm thời giống hệt quy trình của Next.js Storefront
      const sessionId = `order-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
      let cartId = '';

      // 2. Thêm tuần tự từng item trong local cart của Mobile vào database cart trên backend
      for (const item of items) {
        const response = await api.post('/cart/items', {
          productId: item.id, // Sử dụng ID thật của sản phẩm lấy từ Database
          quantity: item.quantity,
          customText: null,
          customData: null,
        }, {
          headers: {
            'x-session-id': sessionId,
          }
        });
        
        // Nhận lại cartId
        cartId = response.data.data?.cart?.id || response.data.cart?.id;
      }

      if (!cartId) {
        throw new Error('Không thể khởi tạo giỏ hàng trên máy chủ.');
      }

      // 3. Nếu có coupon áp dụng ở local, gọi API đồng bộ coupon lên server cart
      if (appliedCoupon) {
        const cleanCode = appliedCoupon.split(' ')[0].toUpperCase();
        try {
          await api.post('/cart/apply-coupon', {
            code: cleanCode,
          }, {
            headers: {
              'x-session-id': sessionId,
            }
          });
        } catch (couponErr) {
          console.warn("Không áp dụng được coupon trên server:", couponErr);
        }
      }

      // 4. Gọi API thanh toán tạo đơn hàng chính thức
      const paymentProvider = paymentMethod === 'COD' ? 'COD' : 'BANK_TRANSFER';
      await api.post('/checkout/create-order', {
        cartId,
        customer: {
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        shipping: {
          addressLine: address.trim(),
          ward: null,
          district: null,
          province: null,
        },
        paymentProvider,
        note: note.trim() || null,
      }, {
        headers: {
          'x-session-id': sessionId,
        }
      });

      // Hiển thị modal đặt hàng thành công
      setIsSuccessModalVisible(true);
    } catch (error: any) {
      console.warn("Lỗi đặt hàng API:", error);
      Alert.alert('Thất bại', error.response?.data?.message || 'Không thể tạo đơn hàng trên hệ thống. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccessModalVisible(false);
    clearCart();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
          
          {/* Name */}
          <Text style={styles.label}>Họ và tên người nhận *</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ tên người nhận..."
            value={name}
            onChangeText={setName}
            editable={!isSubmitting}
          />

          {/* Phone */}
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại liên hệ..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!isSubmitting}
          />

          {/* Email */}
          <Text style={styles.label}>Địa chỉ email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Email nhận thông tin đơn hàng..."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isSubmitting}
          />

          {/* Address */}
          <Text style={styles.label}>Địa chỉ cụ thể *</Text>
          <TextInput
            style={styles.input}
            placeholder="Số nhà, tên đường, phường/xã..."
            value={address}
            onChangeText={setAddress}
            editable={!isSubmitting}
          />

          {/* Notes */}
          <Text style={styles.label}>Ghi chú giao hàng</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Giao giờ hành chính, gọi điện trước khi giao..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            editable={!isSubmitting}
          />

          {/* Order Summary Box */}
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Đơn hàng của bạn</Text>
          <View style={styles.summaryBox}>
            {items.map((item) => (
              <View key={item.slug} style={styles.summaryItemRow}>
                <Text style={styles.summaryItemLabel}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={styles.summaryItemVal}>
                  {formatMoney(item.price * item.quantity)}
                </Text>
              </View>
            ))}
            
            {discount > 0 && (
              <View style={styles.summaryItemRow}>
                <Text style={[styles.summaryItemLabel, { color: AppTheme.colors.red }]}>
                  Mã giảm giá ({appliedCoupon}):
                </Text>
                <Text style={[styles.summaryItemVal, { color: AppTheme.colors.red }]}>
                  -{formatMoney(discount)}
                </Text>
              </View>
            )}

            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLabel}>Phí vận chuyển:</Text>
              <Text style={styles.summaryItemVal}>
                {shippingFee === 0 ? 'Miễn phí' : formatMoney(shippingFee)}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItemRow}>
              <Text style={styles.priceLabel}>Tổng cộng cần thanh toán:</Text>
              <Text style={styles.priceVal}>{formatMoney(total)}</Text>
            </View>
          </View>

          {/* Payment selector */}
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Phương thức thanh toán</Text>

          <TouchableOpacity 
            style={[styles.paymentTile, paymentMethod === 'COD' && styles.paymentTileActive]}
            onPress={() => !isSubmitting && setPaymentMethod('COD')}
            disabled={isSubmitting}
          >
            <Wallet color={paymentMethod === 'COD' ? AppTheme.colors.primaryGreen : AppTheme.colors.textMuted} size={24} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Thanh toán khi nhận hàng (COD)</Text>
              <Text style={styles.paymentDesc}>Thanh toán bằng tiền mặt khi shipper giao hàng.</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'COD' && styles.radioActive]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentTile, paymentMethod === 'QR' && styles.paymentTileActive]}
            onPress={() => !isSubmitting && setPaymentMethod('QR')}
            disabled={isSubmitting}
          >
            <QrCode color={paymentMethod === 'QR' ? AppTheme.colors.primaryGreen : AppTheme.colors.textMuted} size={24} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Quét mã QR chuyển khoản</Text>
              <Text style={styles.paymentDesc}>Quét mã QR ngân hàng để hoàn tất thanh toán nhanh.</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'QR' && styles.radioActive]} />
          </TouchableOpacity>

          {/* QR details */}
          {paymentMethod === 'QR' && (
            <View style={styles.bankBox}>
              <Landmark color={AppTheme.colors.primaryGreen} size={30} style={styles.bankIcon} />
              <Text style={styles.bankTitle}>Quét QR Chuyển Khoản Ngân Hàng</Text>
              
              {/* VietQR dynamic QR image */}
              <View style={styles.qrContainer}>
                <Image 
                  source={{ uri: 'https://img.vietqr.io/image/mbbank-123456789-compact2.png?amount=' + total + '&addInfo=YOUniverse%20Store' }} 
                  style={styles.qrImg as any} 
                  resizeMode="contain" 
                />
              </View>

              <Text style={styles.bankInfoText}>
                • Tên tài khoản: YOUNIVERSE GROUP 3{"\n"}
                • Số tài khoản: 123456789 - MB Bank{"\n"}
                • Số tiền: {formatMoney(total)}
              </Text>
              
              <View style={styles.alertBox}>
                <Info color="#B45309" size={14} />
                <Text style={styles.alertText}>
                  Vui lòng chụp ảnh màn hình chuyển khoản thành công. Sau khi nhấn Xác Nhận Đặt Hàng, chúng mình sẽ đối soát và xử lý đơn hàng của bạn.
                </Text>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={[styles.actionFooter, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity 
          style={styles.orderBtn}
          onPress={handleOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={AppTheme.colors.white} size="small" />
          ) : (
            <Text style={styles.orderBtnText}>XÁC NHẬN ĐẶT HÀNG</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Dialog Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CheckCircle2 color={AppTheme.colors.green} size={64} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Đặt hàng thành công!</Text>
            <Text style={styles.modalText}>
              Cảm ơn bạn đã mua sắm tại YOUniverse. Chúng mình sẽ liên hệ xác nhận đơn hàng sớm nhất có thể qua số điện thoại của bạn.
            </Text>
            <TouchableOpacity 
              style={styles.modalBtn}
              onPress={handleModalClose}
            >
              <Text style={styles.modalBtnText}>VỀ TRANG CHỦ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: AppTheme.colors.darkText,
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  paymentTileActive: {
    borderColor: AppTheme.colors.primaryGreen,
    borderWidth: 1.5,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  paymentName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  paymentDesc: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.white,
  },
  radioActive: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderColor: AppTheme.colors.primaryGreen,
  },
  actionFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppTheme.colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  orderBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.0,
  },
  summaryBox: {
    backgroundColor: 'rgba(28, 25, 23, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 20,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
  },
  summaryItemVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: AppTheme.colors.accentYellow,
  },
  bankBox: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  bankIcon: {
    marginBottom: 8,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 12,
  },
  qrContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 12,
  },
  qrImg: {
    width: '100%',
    height: '100%',
  },
  bankInfoText: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(230, 179, 8, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(230, 179, 8, 0.15)',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 10,
    color: '#B45309',
    lineHeight: 14,
  },
});
