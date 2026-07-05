import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ZoomIn, Minus, Plus, HelpCircle, Sparkles, X } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useCartStore } from '../../src/store/useCartStore';
import api from '../../src/services/api';

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [zoomVisible, setZoomVisible] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${slug}`);
        const data = response.data.data?.product || response.data.product;
        setProduct(data);
      } catch (error) {
        console.warn("Không thể tải chi tiết sản phẩm:", error);
        Alert.alert("Lỗi", "Không tìm thấy thông tin sản phẩm.");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const imageUrl = getProductImageUrl();
    addItem({
      id: product.id,
      slug: slug as string,
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
      badge: product.badge || undefined,
      image: imageUrl || undefined,
    });
    Alert.alert('Giỏ hàng', `Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`, [
      { text: 'Xem giỏ hàng', onPress: () => router.push('/cart') },
      { text: 'Tiếp tục mua sắm', style: 'cancel' }
    ]);
  };

  const getProductImageUrl = () => {
    if (!product) return null;
    const primaryImg = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
    if (!primaryImg) return null;
    const url = primaryImg.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${api.defaults.baseURL?.replace('/api/v1', '')}${url}`;
  };

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppTheme.colors.accentYellow} />
        <Text style={styles.loadingText}>Đang lấy thông tin sản phẩm...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <HelpCircle color="#D6D3D1" size={50} />
        <Text style={styles.emptyText}>Sản phẩm không khả dụng hoặc đã bị gỡ bỏ.</Text>
      </View>
    );
  }

  const imageUrl = getProductImageUrl();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Zoomable Image Area */}
        <TouchableOpacity style={styles.imageArea} activeOpacity={0.9} onPress={() => setZoomVisible(true)}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
          ) : (
            <HelpCircle color={AppTheme.colors.primaryGreen} size={90} opacity={0.2} />
          )}
          <View style={styles.zoomButton}>
            <ZoomIn color={AppTheme.colors.white} size={14} />
            <Text style={styles.zoomText}>Chạm để phóng to</Text>
          </View>
        </TouchableOpacity>

        {/* 2. Info block */}
        <View style={styles.infoBlock}>
          {product.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          ) : null}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatMoney(Number(product.price))}</Text>
          
          <View style={styles.divider} />

          {/* 3. Description segments */}
          <Text style={styles.sectionTitle}>Tóm tắt sản phẩm</Text>
          <Text style={styles.briefText}>{product.shortDescription || "Không có tóm tắt sản phẩm."}</Text>

          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.descText}>{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</Text>

          <View style={styles.specsContainer}>
            <Text style={styles.specsTitle}>Thông số sản phẩm:</Text>
            <Text style={styles.specsText}>
              • SKU: {product.sku || "N/A"}{"\n"}
              • Dòng sản phẩm: {product.productLine || "N/A"}{"\n"}
              • Trạng thái kho: {product.inventory?.quantity ? `${product.inventory.quantity} sản phẩm có sẵn` : "Liên hệ"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 4. Sticky Bottom Action Selector */}
      <View style={styles.bottomStickyBar}>
        <TouchableOpacity 
          style={styles.customizeBtn}
          onPress={() => router.push(`/order?product=${slug}`)}
        >
          <Sparkles color={AppTheme.colors.primaryGreen} size={15} />
          <Text style={styles.customizeBtnText}>CÁ NHÂN HÓA</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartBtnText}>THÊM VÀO GIỎ</Text>
        </TouchableOpacity>
      </View>

      {/* Zoom Modal */}
      <Modal
        visible={zoomVisible}
        transparent
        onRequestClose={() => setZoomVisible(false)}
      >
        <TouchableOpacity style={styles.zoomOverlay} activeOpacity={1} onPress={() => setZoomVisible(false)}>
          <View style={styles.zoomModalContent}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.zoomedImage as any} resizeMode="contain" />
            ) : null}
            <TouchableOpacity style={styles.closeZoomBtn} onPress={() => setZoomVisible(false)}>
              <X color={AppTheme.colors.white} size={28} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  imageArea: {
    height: 280,
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
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
    fontSize: 24,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
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
    fontSize: 13.5,
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
  customizeBtn: {
    flex: 1.1,
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.accentYellow,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  customizeBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    letterSpacing: 1,
  },
  addToCartBtn: {
    flex: 0.9,
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addToCartBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  loadingText: {
    marginTop: 12,
    color: AppTheme.colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  emptyText: {
    marginTop: 12,
    color: AppTheme.colors.textMuted,
  },
  /* Zoom Modal Styles */
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomModalContent: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
  },
  closeZoomBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
});
