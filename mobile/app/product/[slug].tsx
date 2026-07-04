import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ZoomIn, Minus, Plus, HelpCircle } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useCartStore } from '../../src/store/useCartStore';

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);

  // Giả lập lấy chi tiết sản phẩm
  const _getProductData = () => {
    if (slug === "chuoi-chong-duoi") {
      return {
        name: "Chuối Chống Đuối",
        price: 30000,
        badge: "Best Seller",
        brief: "Chuối tiêu sấy dẻo tự nhiên 100% không đường.",
        description: "Chuối Chống Đuối nhà S'mood được sấy lạnh khép kín giúp giữ nguyên chất dinh dưỡng. Miếng chuối thơm phức dẻo ngọt tự nhiên, không tẩm ướp đường hóa học, cung cấp nguồn năng lượng lành mạnh ngay lập tức khi bạn đuối sức.",
        specs: "• Khối lượng: 150g\n• Hạn sử dụng: 6 tháng từ ngày sản xuất\n• Thành phần: 100% Chuối chín tự nhiên",
      };
    }
    if (slug === "khoai-kho-khao") {
      return {
        name: "Khoai Khờ Khạo",
        price: 28000,
        badge: "New",
        brief: "Khoai lang vàng sấy giòn thơm bùi.",
        description: "Khoai Khờ Khạo ngọt bùi giòn rụm được tuyển chọn từ những củ khoai lang Đà Lạt tươi ngon nhất. Sấy chân không hiện đại giúp khoai giữ màu sắc tự nhiên và hương thơm ngậy đặc trưng.",
        specs: "• Khối lượng: 120g\n• Hạn sử dụng: 6 tháng từ ngày sản xuất\n• Thành phần: 98% Khoai lang, 2% dầu thực vật",
      };
    }
    return {
      name: "Món ăn vặt S'mood",
      price: 32000,
      badge: "Hot",
      brief: "Món ăn vặt thơm ngon mang lại tâm trạng mượt mà.",
      description: "Sản phẩm được tuyển chọn kỹ lượng mang lại hương vị thơm ngon đặc trưng độc nhất vô nhị chỉ có tại nhà S'mood.",
      specs: "• Khối lượng: 100g\n• Hạn sử dụng: 6 tháng",
    };
  };

  const product = _getProductData();
  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const handleAddToCart = () => {
    addItem({
      slug: slug as string,
      name: product.name,
      price: product.price,
      quantity: quantity,
      badge: product.badge,
    });
    Alert.alert('Giỏ hàng', `Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`, [
      { text: 'Xem giỏ hàng', onPress: () => router.push('/cart') },
      { text: 'Tiếp tục mua sắm', style: 'cancel' }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Zoomable Image Area */}
        <View style={styles.imageArea}>
          <HelpCircle color={AppTheme.colors.primaryGreen} size={90} opacity={0.2} />
          <TouchableOpacity style={styles.zoomButton}>
            <ZoomIn color={AppTheme.colors.white} size={14} />
            <Text style={styles.zoomText}>Chạm để xem ảnh lớn</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Info block */}
        <View style={styles.infoBlock}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatMoney(product.price)}</Text>
          
          <View style={styles.divider} />

          {/* 3. Description segments */}
          <Text style={styles.sectionTitle}>Tóm tắt sản phẩm</Text>
          <Text style={styles.briefText}>{product.brief}</Text>

          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.descText}>{product.description}</Text>

          <View style={styles.specsContainer}>
            <Text style={styles.specsTitle}>Thông số kỹ thuật:</Text>
            <Text style={styles.specsText}>{product.specs}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 4. Sticky Bottom Action Selector */}
      <View style={styles.bottomStickyBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus color={AppTheme.colors.darkText} size={16} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Plus color={AppTheme.colors.darkText} size={16} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartBtnText}>THÊM VÀO GIỎ</Text>
        </TouchableOpacity>
      </View>
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
  imageArea: {
    height: 280,
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  zoomText: {
    color: AppTheme.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoBlock: {
    padding: 20,
  },
  badge: {
    backgroundColor: AppTheme.colors.accentYellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  productName: {
    fontSize: 26,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginTop: 12,
    marginBottom: 6,
  },
  briefText: {
    fontSize: 14,
    color: AppTheme.colors.darkText,
    lineHeight: 20,
  },
  descText: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    lineHeight: 20,
  },
  specsContainer: {
    backgroundColor: AppTheme.colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginTop: 20,
  },
  specsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 8,
  },
  specsText: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 20,
  },
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 100,
  },
  quantityBtn: {
    padding: 10,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    color: AppTheme.colors.darkText,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  addToCartBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
});
