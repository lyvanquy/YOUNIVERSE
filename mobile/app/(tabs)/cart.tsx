import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Minus, Plus, ShoppingCart, HelpCircle } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useCartStore } from '../../src/store/useCartStore';

export default function CartScreen() {
  const router = useRouter();
  const { items, discount, appliedCoupon, updateQuantity, removeItem, applyCoupon } = useCartStore();

  const [couponCode, setCouponCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode, subtotal);
    if (success) {
      Alert.alert('Mã giảm giá', 'Áp dụng mã giảm giá thành công!');
    } else {
      Alert.alert('Lỗi', 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Giỏ hàng của bạn</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingCart color="#D6D3D1" size={64} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Giỏ hàng trống trơn!</Text>
          <TouchableOpacity 
            style={styles.shopNowBtn}
            onPress={() => router.push('/products')}
          >
            <Text style={styles.shopNowBtnText}>ĐI MUA SẮM NGAY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* List items */}
          <ScrollView style={styles.itemList} contentContainerStyle={styles.scrollContent}>
            {items.map((item) => (
              <View key={item.slug} style={styles.itemCard}>
                <View style={styles.itemImage}>
                  <HelpCircle color={AppTheme.colors.primaryGreen} size={30} opacity={0.3} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{formatMoney(item.price)}</Text>
                  
                  {/* Quantity adjustments */}
                  <View style={styles.qtyRow}>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.slug, item.quantity - 1)}
                    >
                      <Minus color={AppTheme.colors.darkText} size={12} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.slug, item.quantity + 1)}
                    >
                      <Plus color={AppTheme.colors.darkText} size={12} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.slug)}
                >
                  <Trash2 color={AppTheme.colors.red} size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Coupon apply bar */}
          <View style={styles.couponBar}>
            <TextInput
              style={styles.couponInput}
              placeholder="Mã giảm giá (WELCOME10)..."
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={styles.couponBtn}
              onPress={handleApplyCoupon}
            >
              <Text style={styles.couponBtnText}>ÁP DỤNG</Text>
            </TouchableOpacity>
          </View>

          {/* Checkout calculations summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính</Text>
              <Text style={styles.summaryVal}>{formatMoney(subtotal)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: AppTheme.colors.red }]}>Mã giảm giá {appliedCoupon}</Text>
                <Text style={[styles.summaryVal, { color: AppTheme.colors.red }]}>-{formatMoney(discount)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryVal}>{formatMoney(shippingFee)}</Text>
            </View>
            
            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalVal}>{formatMoney(total)}</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutBtn}
              onPress={() => router.push('/checkout')}
            >
              <Text style={styles.checkoutBtnText}>ĐẶT HÀNG</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  appBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: AppTheme.colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 16,
  },
  shopNowBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  shopNowBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
  itemList: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: AppTheme.colors.darkText,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 100,
    padding: 4,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: AppTheme.colors.darkText,
  },
  removeBtn: {
    padding: 10,
  },
  couponBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppTheme.colors.white,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  couponInput: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: AppTheme.colors.darkText,
  },
  couponBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginLeft: 12,
  },
  couponBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.0,
  },
  summaryContainer: {
    backgroundColor: AppTheme.colors.white,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  checkoutBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  checkoutBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
});
