import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, HelpCircle } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useCartStore } from '../../src/store/useCartStore';

const CATEGORIES = ["Tất cả", "Trái cây sấy", "Khoai & Củ sấy", "Mứt & Kẹo"];

const PRODUCTS = [
  {
    slug: "chuoi-chong-duoi",
    name: "Chuối Chống Đuối",
    price: 30000,
    badge: "Best Seller",
    category: "Trái cây sấy",
  },
  {
    slug: "khoai-kho-khao",
    name: "Khoai Khờ Khạo",
    price: 28000,
    badge: "New",
    category: "Khoai & Củ sấy",
  },
  {
    slug: "me-ngao-ngo",
    name: "Me Ngáo Ngơ",
    price: 32000,
    badge: "Hot",
    category: "Mứt & Kẹo",
  },
  {
    slug: "mit-mo-mang",
    name: "Mít Mơ Màng",
    price: 35000,
    badge: "Yêu thích",
    category: "Trái cây sấy",
  },
];

export default function ProductListScreen() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredProducts = selectedCategory === "Tất cả"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAddQuickToCart = (item: typeof PRODUCTS[0]) => {
    addItem({
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: 1,
      badge: item.badge,
    });
    Alert.alert('Giỏ hàng', `Đã thêm 1 x ${item.name} vào giỏ hàng!`);
  };

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Sản phẩm nhà S'mood</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search color={AppTheme.colors.darkText} size={22} />
        </TouchableOpacity>
      </View>

      {/* Category Selection Scroll */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
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

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => router.push(`/product/${item.slug}`)}
          >
            <View style={styles.cardImage}>
              <HelpCircle color={AppTheme.colors.primaryGreen} size={42} opacity={0.3} />
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.badge}</Text>
              </View>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{formatMoney(item.price)}</Text>
                <TouchableOpacity 
                  style={styles.quickAddBtn}
                  onPress={() => handleAddQuickToCart(item)}
                >
                  <Plus color={AppTheme.colors.white} size={14} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
