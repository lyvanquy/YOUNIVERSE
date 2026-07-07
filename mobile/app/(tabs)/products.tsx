import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, ImageBackground, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Heart, Compass, Plus, HelpCircle, Search, X } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import { useCartStore } from '../../src/store/useCartStore';
import api from '../../src/services/api';

export default function ProductListScreen() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});

  const fetchProducts = async (queryText = '') => {
    try {
      setIsLoading(true);
      const url = queryText ? `/products?search=${encodeURIComponent(queryText)}` : '/products';
      const response = await api.get(url);
      const items = response.data.data?.items || [];
      setProducts(items);
    } catch (error) {
      console.warn("Không thể tải danh sách sản phẩm từ API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const y = sectionPositions.current[sectionId];
    if (scrollRef.current && y !== undefined) {
      scrollRef.current.scrollTo({ y: y - 10, animated: true });
    }
  };

  const handleAddQuickToCart = (item: any) => {
    const imageUrl = getProductImageUrl(item);
    addItem({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      badge: item.badge || undefined,
      image: imageUrl || undefined,
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
    return `${api.defaults.baseURL?.replace('/api/v1', '')}${url}`;
  };

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const astraVariants = [
    { 
      img: 'https://youniverse.io.vn/images/astra-mat-troi.jpg', 
      name: 'Hệ Mặt Trời',
      desc: 'Năng lượng rực rỡ, tỏa sáng như mặt trời — biểu tượng của sức mạnh và niềm tin.'
    },
    { 
      img: 'https://youniverse.io.vn/images/astra-mat-trang.jpg', 
      name: 'Hệ Mặt Trăng',
      desc: 'Dịu dàng mà sâu lắng, ánh trăng dẫn lối qua những đêm tĩnh lặng nhất.'
    },
    { 
      img: 'https://youniverse.io.vn/images/astra-tinh-tu.jpg', 
      name: 'Hệ Tinh Tú',
      desc: 'Vô vàn ngôi sao, mỗi ánh sáng là một giấc mơ đang chờ bạn chạm tới.'
    },
  ];

  const siriusPets = [
    { img: 'https://youniverse.io.vn/images/sirius-cho.jpg', name: 'Chó', emoji: '🐕' },
    { img: 'https://youniverse.io.vn/images/sirius-meo.jpg', name: 'Mèo', emoji: '🐱' },
    { img: 'https://youniverse.io.vn/images/sirius-hamster.jpg', name: 'Hamster', emoji: '🐹' },
  ];

  const siriusDrinks = [
    { img: 'https://youniverse.io.vn/images/sirius-tra-sua.jpg', name: 'Trà Sữa', emoji: '🧋' },
    { img: 'https://youniverse.io.vn/images/sirius-matcha.jpg', name: 'Matcha Latte', emoji: '🍵' },
    { img: 'https://youniverse.io.vn/images/sirius-ca-phe.jpg', name: 'Cà Phê', emoji: '☕' },
  ];

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        {isSearchActive ? (
          <View style={styles.searchBarContainer}>
            <Search color={AppTheme.colors.textMuted} size={18} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm phôi vòng..."
              placeholderTextColor={AppTheme.colors.textMuted}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text === '') {
                  fetchProducts('');
                }
              }}
              onSubmitEditing={() => fetchProducts(searchQuery)}
              returnKeyType="search"
              autoFocus
            />
            <TouchableOpacity 
              style={styles.clearBtn} 
              onPress={() => {
                setSearchQuery('');
                fetchProducts('');
                setIsSearchActive(false);
              }}
            >
              <X color={AppTheme.colors.darkText} size={20} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.appBarTitle}>Sản phẩm YOUniverse</Text>
            <TouchableOpacity 
              style={styles.searchBtn} 
              onPress={() => setIsSearchActive(true)}
            >
              <Search color={AppTheme.colors.darkText} size={22} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView 
        ref={scrollRef} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://youniverse.io.vn/images/banner-products-new.png' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* 2. Navigation Jump Tabs */}
        <View style={styles.navigationTabs}>
          <TouchableOpacity 
            style={[styles.navTab, styles.navTabAstra]}
            onPress={() => handleScrollToSection('astra')}
          >
            <Sparkles color="#3B82F6" size={14} />
            <Text style={styles.navTabText}>Astra</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTab, styles.navTabSirius]}
            onPress={() => handleScrollToSection('sirius')}
          >
            <Heart color="#F59E0B" size={14} />
            <Text style={styles.navTabText}>Sirius</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navTab, styles.navTabPolaris]}
            onPress={() => handleScrollToSection('polaris')}
          >
            <Compass color="#EF4444" size={14} />
            <Text style={styles.navTabText}>Polaris</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Charm Astra Section */}
        <View 
          style={styles.section}
          onLayout={(e) => { sectionPositions.current['astra'] = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.sectionTitle}>Charm Astra</Text>
          <View style={styles.astraGrid}>
            {astraVariants.map((item, index) => (
              <View key={index} style={styles.astraCard}>
                <Image source={{ uri: item.img }} style={styles.showcaseImage} />
                <View style={styles.showcaseOverlay}>
                  <View style={[styles.badgeLine, { backgroundColor: '#3B82F6' }]}>
                    <Text style={styles.badgeLineText}>Astra</Text>
                  </View>
                  <Text style={styles.showcaseName}>{item.name}</Text>
                  <Text style={styles.showcaseDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Charm Sirius Section */}
        <View 
          style={styles.section}
          onLayout={(e) => { sectionPositions.current['sirius'] = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.sectionTitle}>Charm Sirius</Text>
          
          {/* Sub-category 1 */}
          <Text style={styles.subCategoryTitle}>🐾 Những người bạn 4 chân</Text>
          <View style={styles.siriusGrid}>
            {siriusPets.map((item, index) => (
              <View key={index} style={styles.siriusCard}>
                <Image source={{ uri: item.img }} style={styles.siriusImage} />
                <View style={styles.siriusOverlay}>
                  <View style={[styles.badgeLine, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.badgeLineText}>Sirius</Text>
                  </View>
                  <View style={styles.siriusTitleRow}>
                    <Text style={styles.siriusEmoji}>{item.emoji}</Text>
                    <Text style={styles.siriusName}>{item.name}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Sub-category 2 */}
          <Text style={[styles.subCategoryTitle, { marginTop: 24 }]}>☕ Năng lượng ngọt ngào</Text>
          <View style={styles.siriusGrid}>
            {siriusDrinks.map((item, index) => (
              <View key={index} style={styles.siriusCard}>
                <Image source={{ uri: item.img }} style={styles.siriusImage} />
                <View style={styles.siriusOverlay}>
                  <View style={[styles.badgeLine, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.badgeLineText}>Sirius</Text>
                  </View>
                  <View style={styles.siriusTitleRow}>
                    <Text style={styles.siriusEmoji}>{item.emoji}</Text>
                    <Text style={styles.siriusName}>{item.name}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. Charm Polaris Section */}
        <View 
          style={styles.section}
          onLayout={(e) => { sectionPositions.current['polaris'] = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.sectionTitle}>Charm Polaris</Text>
          <View style={styles.polarisCard}>
            <Image 
              source={{ uri: 'https://youniverse.io.vn/images/polaris-quote.jpg' }} 
              style={styles.polarisImage} 
              resizeMode="cover"
            />
            <View style={styles.polarisContent}>
              <View style={[styles.badgeLine, { backgroundColor: '#EF4444', alignSelf: 'flex-start', marginBottom: 12 }]}>
                <Text style={styles.badgeLineText}>Polaris</Text>
              </View>
              <Text style={styles.polarisTitle}>Tự viết nên châm ngôn của riêng bạn</Text>
              <Text style={styles.polarisDesc}>
                Mỏ neo cảm xúc thu nhỏ khắc sâu triết lý hoặc tiếng lòng chân thực nhất của riêng bạn.
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Purchase Base Chains Section */}
        <View 
          style={styles.section}
          onLayout={(e) => { sectionPositions.current['purchase'] = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.sectionTitle}>Đặt Mua Base Chain</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={AppTheme.colors.accentYellow} style={{ marginVertical: 30 }} />
          ) : products.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có phôi vòng nào được kích hoạt.</Text>
          ) : (
            <View style={styles.productGrid}>
              {products.map((item) => {
                const imageUrl = getProductImageUrl(item);
                return (
                  <TouchableOpacity 
                    key={item.id}
                    style={styles.productCard}
                    onPress={() => router.push(`/product/${item.slug}`)}
                  >
                    <View style={styles.productImgContainer}>
                      {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.productImg} />
                      ) : (
                        <HelpCircle color="#A8A29E" size={32} />
                      )}
                      {item.badge ? (
                        <View style={styles.badgeTag}>
                          <Text style={styles.badgeTagText}>{item.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>{formatMoney(Number(item.price))}</Text>
                        <TouchableOpacity 
                          style={styles.addBtn}
                          onPress={() => handleAddQuickToCart(item)}
                        >
                          <Plus color="#FFFFFF" size={14} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: AppTheme.colors.darkText,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    height: 140,
    marginBottom: 16,
    backgroundColor: '#000000',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 10,
  },
  navTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.white,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    gap: 6,
  },
  navTabAstra: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  navTabSirius: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  navTabPolaris: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  astraGrid: {
    gap: 16,
  },
  astraCard: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1C1917',
    position: 'relative',
  },
  showcaseImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  showcaseOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  badgeLine: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 8,
  },
  badgeLineText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  showcaseName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  showcaseDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    lineHeight: 16,
  },
  subCategoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 12,
    paddingLeft: 2,
  },
  siriusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  siriusCard: {
    flex: 1,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1C1917',
    position: 'relative',
  },
  siriusImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  siriusOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  siriusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  siriusEmoji: {
    fontSize: 14,
  },
  siriusName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  polarisCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  polarisImage: {
    width: '100%',
    height: 180,
  },
  polarisContent: {
    padding: 20,
  },
  polarisTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    lineHeight: 22,
    marginBottom: 6,
  },
  polarisDesc: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImgContainer: {
    height: 120,
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  badgeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: AppTheme.colors.accentYellow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgeTagText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 6,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
