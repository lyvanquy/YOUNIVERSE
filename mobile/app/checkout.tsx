import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, QrCode, CheckCircle2 } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';
import { useCartStore } from '../src/store/useCartStore';
import api from '../src/services/api';

export default function CheckoutScreen() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QR'>('COD');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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
    router.replace('/home');
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
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.actionFooter}>
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
              Cảm ơn bạn đã mua sắm tại S'mood. Chúng mình sẽ liên hệ xác nhận đơn hàng sớm nhất có thể qua số điện thoại của bạn.
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
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
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
});
