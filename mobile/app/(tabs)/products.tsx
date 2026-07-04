import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, HelpCircle } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useCartStore } from '../../src/store/useCartStore';
import api from '../../src/services/api';

export default function ProductListScreen() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/products');
        // Phản hồi từ backend chứa envelope { success: true, message: '...', data: { items: [...] } }
        const items = response.data.data?.items || [];
        setProducts(items);
      } catch (error) {
        console.warn("Không thể tải danh sách sản phẩm từ API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Tạo danh sách category động dựa trên sản phẩm trong DB
  const categories = ["Tất cả", ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)))];

  const filteredProducts = selectedCategory === "Tất cả"
    ? products
    : products.filter((p) => p.category?.name === selectedCategory);

  const handleAddQuickToCart = (item: any) => {
    addItem({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      badge: item.badge || undefined,
    });
    Alert.alert('Giỏ hàng', `Đã thêm 1 x ${item.name} vào giỏ hàng!`);
  };

  const getProductImageUrl = (item: any) => {
    const primaryImg = item.images?.find((img: any) => img.isPrimary) || item.images?.[0];
    if (!primaryImg) return null;
    const url = primaryImg.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Chuyển relative path (/images/...) thành full URL trỏ về Backend host
    return `${api.defaults.baseURL?.replace('/api/v1', '')}${url}`;
  };

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Sản phẩm YOUniverse</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search color={AppTheme.colors.darkText} size={22} />
        </TouchableOpacity>
      </View>

      {/* Category Selection Scroll */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => {
            const isSelected = cat === selectedCategory;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.primaryGreen} />
          <Text style={styles.loadingText}>Đang tải sản phẩm từ vũ trụ...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <HelpCircle color="#D6D3D1" size={50} />
          <Text style={styles.emptyText}>Chưa có sản phẩm nào được kích hoạt.</Text>
        </View>
      ) : (
        /* Products Grid */
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => {
            const imageUrl = getProductImageUrl(item);
            return (
              <TouchableOpacity 
                style={styles.gridCard}
                onPress={() => router.push(`/product/${item.slug}`)}
              >
                <View style={styles.cardImage}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                  ) : (
                    <HelpCircle color={AppTheme.colors.primaryGreen} size={42} opacity={0.3} />
                  )}
                  {item.badge ? (
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>{formatMoney(Number(item.price))}</Text>
                    <TouchableOpacity 
                      style={styles.quickAddBtn}
                      onPress={() => handleAddQuickToCart(item)}
                    >
                      <Plus color={AppTheme.colors.white} size={14} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
  },
  searchBtn: {
    padding: 6,
  },
  categoryContainer: {
    height: 56,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryBtn: {
    marginRight: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  categoryBtnActive: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderColor: AppTheme.colors.primaryGreen,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  categoryTextActive: {
    color: AppTheme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: AppTheme.colors.textMuted,
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridCard: {
    flex: 0.48,
    margin: 8,
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    height: 130,
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: AppTheme.colors.accentYellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  cardBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  cardDetails: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  quickAddBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: AppTheme.colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
