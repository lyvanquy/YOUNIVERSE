import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, ImageBackground, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell, Smile, ShieldCheck, ChevronRight, MessageCircle, Heart, Video, HelpCircle, Sparkles, Compass, Camera, Gift, ShoppingBag, Bookmark, Menu, X } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';
import api from '../../src/services/api';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function HomeScreen() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    'https://youniverse.io.vn/images/home-astra.jpg',
    'https://youniverse.io.vn/images/home-sirius.jpg',
    'https://youniverse.io.vn/images/home-polaris.jpg'
  ];

  const photoshootScrollRef = React.useRef<ScrollView>(null);
  const photoshootX = React.useRef(0);
  const isUserScrolling = React.useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUserScrolling.current) return;
      photoshootX.current += 1.0;
      if (photoshootX.current >= 1272) { // 6 cards * 212px = 1272px (width of one loop set)
        photoshootX.current = 0;
        photoshootScrollRef.current?.scrollTo({ x: 0, animated: false });
      } else {
        photoshootScrollRef.current?.scrollTo({ x: photoshootX.current, animated: false });
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/products');
        const items = response.data.data?.items || [];
        setFeaturedProducts(items.slice(0, 5));
      } catch (error) {
        console.warn("Không thể tải danh sách sản phẩm nổi bật từ API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Header (Hamburger, Centered Logo, Cart Icon) */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerMenuBtn}
            onPress={() => setMenuOpen(true)}
          >
            <Menu color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          <Image
            source={{ uri: 'https://youniverse.io.vn/images/logo-youniverse-transparent.png' }}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <TouchableOpacity 
            style={styles.headerCartBtn}
            onPress={() => router.push('/cart')}
          >
            <ShoppingBag color="#FFFFFF" size={22} />
          </TouchableOpacity>
        </View>

        {/* Drawer Menu Modal */}
        <Modal
          visible={menuOpen}
          animationType="none"
          transparent
          onRequestClose={() => setMenuOpen(false)}
        >
          <View style={styles.drawerContainer}>
            {/* Drawer Content */}
            <View style={styles.drawerContent}>
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <Image
                  source={{ uri: 'https://youniverse.io.vn/images/logo-youniverse-transparent.png' }}
                  style={styles.drawerLogo}
                  resizeMode="contain"
                />
                <TouchableOpacity onPress={() => setMenuOpen(false)} style={styles.drawerCloseBtn}>
                  <X color="#FFFFFF" size={24} />
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <ScrollView style={styles.drawerScroll} contentContainerStyle={styles.drawerScrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={styles.drawerItem} 
                  onPress={() => { setMenuOpen(false); }}
                >
                  <Text style={[styles.drawerItemText, styles.drawerItemActiveText]}>Trang chủ</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem} 
                  onPress={() => { setMenuOpen(false); router.push('/order'); }}
                >
                  <Text style={styles.drawerItemText}>Khám phá YOUniverse (Thiết kế)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem} 
                  onPress={() => { setMenuOpen(false); router.push('/products'); }}
                >
                  <Text style={styles.drawerItemText}>Sản phẩm tinh vân</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem} 
                  onPress={() => { setMenuOpen(false); router.push('/about'); }}
                >
                  <Text style={styles.drawerItemText}>Về chúng mình (Câu chuyện)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem} 
                  onPress={() => { setMenuOpen(false); router.push('/policy'); }}
                >
                  <Text style={styles.drawerItemText}>Chính sách đổi trả & bảo hành</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerItem} 
                  onPress={() => { setMenuOpen(false); router.push('/contact'); }}
                >
                  <Text style={styles.drawerItemText}>Liên hệ góp ý</Text>
                </TouchableOpacity>

                <View style={styles.drawerDivider} />

                {/* Language Switcher Mock */}
                <View style={styles.drawerLangRow}>
                  <Text style={styles.drawerLangLabel}>Ngôn ngữ:</Text>
                  <View style={styles.langPills}>
                    <View style={[styles.langPill, styles.langPillActive]}>
                      <Text style={[styles.langPillText, styles.langPillActiveText]}>VI</Text>
                    </View>
                    <View style={styles.langPill}>
                      <Text style={styles.langPillText}>EN</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.drawerDivider} />

                {/* Authentication Info */}
                {isAuthenticated && user ? (
                  <View style={styles.drawerUserBox}>
                    <Text style={styles.drawerUserWelcome}>Xin chào,</Text>
                    <Text style={styles.drawerUserName}>{user.fullName}</Text>
                    <TouchableOpacity 
                      style={styles.drawerLogoutBtn}
                      onPress={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      <Text style={styles.drawerLogoutText}>Đăng xuất tài khoản</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.drawerLoginBtn}
                    onPress={() => {
                      setMenuOpen(false);
                      router.push('/login');
                    }}
                  >
                    <Text style={styles.drawerLoginText}>Đăng nhập / Đăng ký</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.drawerDivider} />

                {/* Buy Now CTA button */}
                <TouchableOpacity 
                  style={styles.drawerBuyBtn}
                  onPress={() => { setMenuOpen(false); router.push('/order'); }}
                >
                  <ShoppingBag color="#1C1917" size={15} />
                  <Text style={styles.drawerBuyBtnText}>MUA NGAY (ORDER)</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Backdrop */}
            <TouchableOpacity 
              style={styles.drawerBackdrop} 
              activeOpacity={1} 
              onPress={() => setMenuOpen(false)} 
            />
          </View>
        </Modal>

        {/* 2. Banner / Hero Section (Split / Slideshow Layout) */}
        <View style={styles.banner}>
          <ImageBackground
            source={{ uri: 'https://youniverse.io.vn/images/home-banner-space.gif' }}
            style={styles.bannerBackground}
            resizeMode="cover"
          >
            {/* Dark semi-transparent mask layer */}
            <View style={styles.bannerOverlay}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroDot} />
                <Text style={styles.heroBadgeText}>CHÀO MỪNG ĐẾN VỚI YOUNIVERSE</Text>
              </View>

              <Text style={styles.heroTitleMain}>
                MỖI VŨ TRỤ{"\n"}
                <Text style={{ color: AppTheme.colors.accentYellow }}>LÀ MỘT CÂU CHUYỆN</Text>{"\n"}
                ĐƯỢC KỂ
              </Text>

              <Text style={styles.heroTaglineText}>
                Chúng ta luôn khao khát được thấu hiểu, nhưng lại ngại ngần việc phải giải thích quá nhiều.
              </Text>

              {/* Automatic Rotating Image Slideshow */}
              <View style={styles.heroSliderContainer}>
                <Image
                  source={{ uri: heroImages[heroIndex] }}
                  style={styles.heroSliderImage}
                  resizeMode="cover"
                />
                {/* Dots indicator */}
                <View style={styles.heroSliderDots}>
                  {heroImages.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.heroSliderDot,
                        heroIndex === idx && styles.heroSliderDotActive
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Action Buttons Row */}
              <View style={styles.heroButtonsRow}>
                <TouchableOpacity
                  style={styles.heroPrimaryBtn}
                  onPress={() => router.push('/order')}
                >
                  <Sparkles color="#1C1917" size={13} style={{ marginRight: 6 }} />
                  <Text style={styles.heroPrimaryBtnText}>KHỞI TẠO VŨ TRỤ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.heroSecondaryBtn}
                  onPress={() => router.push('/about')}
                >
                  <Bookmark color="#FFF" size={13} style={{ marginRight: 6 }} />
                  <Text style={styles.heroSecondaryBtnText}>CÂU CHUYỆN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 3. Marquee Slogan Bar */}
        <View style={styles.marqueeBar}>
          <Text style={styles.marqueeText} numberOfLines={1}>
            ✨ LÊN TIẾNG MÀ KHÔNG CẦN CẤT LỜI • SPEAK WITHOUT SPOKEN WORDS • YOUNIVERSE CO. ✨
          </Text>
        </View>

        {/* 4. Pop-Art Brand Intro Section */}
        <View style={styles.brandIntroCard}>
          <View style={styles.introBadge}>
            <Text style={styles.introBadgeText}>THE SILENT COMMUNICATOR</Text>
          </View>
          <Text style={styles.brandIntroTitle}>YOU-niverse</Text>
          <Text style={styles.brandIntroDesc}>
            YOUniverse tin rằng mỗi chiếc charm tinh xảo sẽ là tiếng nói đại diện cho thế giới nội tâm phong phú và độc bản của riêng bạn.
          </Text>

          {/* Formula pills row */}
          <View style={styles.formulaRow}>
            <View style={[styles.formulaPill, { backgroundColor: '#3B82F6' }]}>
              <Sparkles color="#FFF" size={10} style={styles.pillIcon} />
              <Text style={styles.formulaPillText}>Astra</Text>
            </View>
            <Text style={styles.formulaOperator}>+</Text>
            <View style={[styles.formulaPill, { backgroundColor: '#F59E0B' }]}>
              <Heart color="#FFF" size={10} style={styles.pillIcon} />
              <Text style={styles.formulaPillText}>Sirius</Text>
            </View>
            <Text style={styles.formulaOperator}>+</Text>
            <View style={[styles.formulaPill, { backgroundColor: '#EF4444' }]}>
              <Compass color="#FFF" size={10} style={styles.pillIcon} />
              <Text style={styles.formulaPillText}>Polaris</Text>
            </View>
            <Text style={styles.formulaOperator}>=</Text>
            <View style={[styles.formulaPill, { backgroundColor: '#1C1917' }]}>
              <Text style={[styles.formulaPillText, { fontWeight: '900', color: '#F59E0B' }]}>YOUniverse</Text>
            </View>
          </View>
        </View>

        {/* 5. Planets/Charm Lines Showcase cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Khám Phá Các Hành Tinh</Text>
        </View>
        <View style={styles.planetsContainer}>
          {[
            {
              id: 'astra',
              name: 'Charm Line — ASTRA',
              tagline: 'Hệ năng lượng thiên hà',
              desc: 'Thể hiện tần số bản ngã của bạn thông qua chòm sao bản mệnh lấp lánh.',
              image: 'https://youniverse.io.vn/images/charm-stock-1.jpg',
              theme: '#3B82F6',
            },
            {
              id: 'sirius',
              name: 'Charm Line — SIRIUS',
              tagline: 'Bạn đồng hành & Năng lượng',
              desc: 'Lưu giữ những sở thích nhỏ bé và những người bạn bốn chân đáng yêu mỗi ngày.',
              image: 'https://youniverse.io.vn/images/charm-stock-2.jpg',
              theme: '#F59E0B',
            },
            {
              id: 'polaris',
              name: 'Charm Line — POLARIS',
              tagline: 'Thông điệp & Tuyên ngôn',
              desc: 'Khắc dấu ấn triết lý sống hoặc tiếng lòng hiện tại của bạn vào chiếc móc khóa.',
              image: 'https://youniverse.io.vn/images/charm-stock-3.png',
              theme: '#EF4444',
            }
          ].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.planetCard}
              onPress={() => router.push('/products')}
            >
              <ImageBackground source={{ uri: item.image }} style={styles.planetCardBg} resizeMode="cover">
                <View style={styles.planetCardOverlay}>
                  <View style={styles.planetCardBadge}>
                    <Text style={styles.planetCardBadgeText}>Hành tinh</Text>
                  </View>
                  <Text style={styles.planetCardName}>{item.name}</Text>
                  <Text style={[styles.planetCardTagline, { color: item.theme }]}>"{item.tagline}"</Text>
                  <Text style={styles.planetCardDesc}>{item.desc}</Text>
                  <View style={styles.planetCardLink}>
                    <Text style={styles.planetCardLinkText}>Khám phá chi tiết</Text>
                    <ChevronRight color="#FFF" size={12} />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* 6. Featured Products Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Text style={styles.sectionLink}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* 7. Featured Products Horizontal Scroll */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={AppTheme.colors.primaryGreen} />
          </View>
        ) : featuredProducts.length === 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {_buildProductCard(
              router,
              "Astra Base Chain",
              "30.000đ",
              "Bestseller",
              "astra-base-chain"
            )}
            {_buildProductCard(
              router,
              "Sirius Base Chain",
              "28.000đ",
              "New",
              "sirius-base-chain"
            )}
            {_buildProductCard(
              router,
              "Polaris Base Chain",
              "32.000đ",
              "Hot",
              "polaris-base-chain"
            )}
          </ScrollView>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredProducts.map((item) => (
              _buildProductCard(
                router,
                item.name,
                formatMoney(Number(item.price)),
                item.badge,
                item.slug,
                getProductImageUrl(item)
              )
            ))}
          </ScrollView>
        )}

        {/* 8. Photoshoot Gallery */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photoshoot Gallery</Text>
        </View>
        <Text style={styles.gallerySubtitle}>
          Những khoảnh khắc lấp lánh của các charm tinh vân ngoài đời thực.
        </Text>
        <ScrollView 
          ref={photoshootScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          onScrollBeginDrag={() => { isUserScrolling.current = true; }}
          onScrollEndDrag={(event) => { 
            photoshootX.current = event.nativeEvent.contentOffset.x; 
            setTimeout(() => { isUserScrolling.current = false; }, 3000); 
          }}
          onMomentumScrollEnd={(event) => { 
            photoshootX.current = event.nativeEvent.contentOffset.x; 
            setTimeout(() => { isUserScrolling.current = false; }, 3000); 
          }}
        >
          {[
            'https://youniverse.io.vn/images/photoshoot-2.jpg',
            'https://youniverse.io.vn/images/photoshoot-1.jpg',
            'https://youniverse.io.vn/images/photoshoot-4.jpg',
            'https://youniverse.io.vn/images/photoshoot-3.jpg',
            'https://youniverse.io.vn/images/photoshoot-6.jpg',
            'https://youniverse.io.vn/images/photoshoot-5.jpg',
            // Duplicated loop set for seamless infinite scrolling wrapping
            'https://youniverse.io.vn/images/photoshoot-2.jpg',
            'https://youniverse.io.vn/images/photoshoot-1.jpg',
            'https://youniverse.io.vn/images/photoshoot-4.jpg',
            'https://youniverse.io.vn/images/photoshoot-3.jpg',
            'https://youniverse.io.vn/images/photoshoot-6.jpg',
            'https://youniverse.io.vn/images/photoshoot-5.jpg'
          ].map((src, idx) => (
            <View key={idx} style={styles.galleryImageCard}>
              <Image source={{ uri: src }} style={styles.galleryImage} resizeMode="cover" />
            </View>
          ))}
        </ScrollView>

        {/* 9. Use Cases Section */}
        <View style={styles.usecaseSection}>
          <Text style={styles.usecaseTitle}>Tính Ứng Dụng Thực Tế</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {[
              { title: 'Định danh duy nhất.', desc: 'Không chỉ là một sản phẩm, đây là “bản quyền” của riêng bạn trên bản đồ giao tiếp vô ngôn.', image: 'https://youniverse.io.vn/images/usecase-1.jpg' },
              { title: 'Phép màu cô đọng cá tính.', desc: 'Mọi ý tưởng “điên rồ” nhất của bạn đều được vẽ tay trên nhựa màng co, sau đó trải qua nhiệt độ cao để cô đặc lại thành một “tiểu hành tinh” cứng cáp, sắc nét và bền bỉ.', image: 'https://youniverse.io.vn/images/usecase-2.jpg' },
              { title: 'Đam mê lên tiếng.', desc: 'Tín hiệu ngầm tinh tế để những tâm hồn đồng điệu dễ dàng nhận ra nhau giữa đám đông.', image: 'https://youniverse.io.vn/images/usecase-3.jpg' },
              { title: 'Kim chỉ nam cảm xúc.', desc: 'Tuyên ngôn sống thu nhỏ, thay bạn nói lên thế giới nội tâm phong phú mà không cần giải thích dài dòng.', image: 'https://youniverse.io.vn/images/usecase-4.jpg' },
              { title: 'Hạ cánh siêu tốc.', desc: 'Khao khát bộc lộ bản thân là điều không thể chờ đợi. Dù là sản phẩm thủ công đo ni đóng giày, YOUniverse vẫn tối ưu tốc độ chế tác để “vũ trụ” của bạn hạ cánh an toàn và nhanh chóng nhất.', image: 'https://youniverse.io.vn/images/usecase-5.jpg' }
            ].map((slide, idx) => (
              <View key={idx} style={styles.usecaseCard}>
                <Image source={{ uri: slide.image }} style={styles.usecaseCardImg} />
                <View style={styles.usecaseCardInfo}>
                  <Text style={styles.usecaseCardTitle}>{slide.title}</Text>
                  <Text style={styles.usecaseCardDesc}>{slide.desc}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 10. Core Values */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Giá trị cốt lõi (Y.O.U)</Text>
          <View style={styles.valueList}>
            {_buildValueTile(
              <Smile color={AppTheme.colors.primaryGreen} size={22} />,
              "1. You-nique (Độc bản)",
              "Tôn vinh bản sắc độc bản của riêng bạn. Vũ trụ của bạn là duy nhất và không thể sao chép."
            )}
            {_buildValueTile(
              <ShieldCheck color={AppTheme.colors.primaryGreen} size={22} />,
              "2. Out-of-the-box (Sáng tạo)",
              "Phá vỡ mọi khuôn khổ đại trà, mang đến sự tự do thiết kế phong cách cá nhân hóa."
            )}
          </View>
        </View>

        {/* 11. Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>YOUniverse</Text>
          <Text style={styles.footerSlogan}>Lên Tiếng Mà Không Cần Cất Lời</Text>
          
          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialIcon}><MessageCircle color={AppTheme.colors.white} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Heart color={AppTheme.colors.white} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Video color={AppTheme.colors.white} size={18} /></TouchableOpacity>
          </View>

          <View style={styles.footerDivider} />
          
          <Text style={styles.footerContact}>
            Hotline: 1900 1234{"\n"}
            Email: contact@youniverse.io.vn{"\n"}
            Địa chỉ: 279 Nguyễn Tri Phương, Phường 5, Quận 10, TP.HCM
          </Text>
          
          <Text style={styles.copyright}>© 2026 YOUniverse. Designed by Group 3.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function _buildProductCard(
  router: any,
  name: string,
  price: string,
  badge: string,
  slug: string,
  imageUrl?: string | null
) {
  return (
    <TouchableOpacity 
      key={slug}
      style={styles.productCard}
      onPress={() => router.push(`/product/${slug}`)}
    >
      <View style={styles.cardImageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <HelpCircle color={AppTheme.colors.primaryGreen} size={42} opacity={0.3} />
        )}
        {badge ? (
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

function _buildValueTile(icon: React.ReactNode, title: string, subtitle: string) {
  return (
    <View style={styles.valueTile}>
      <View style={styles.valueIconContainer}>{icon}</View>
      <View style={styles.valueText}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueSubtitle}>{subtitle}</Text>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#1C1917', // Dark cosmic theme matching frontend
    borderBottomWidth: 1,
    borderBottomColor: '#2D2A26',
  },
  headerMenuBtn: {
    padding: 6,
  },
  logoImage: {
    width: 140,
    height: 70, // perfect 2:1 aspect ratio to avoid squishing
  },
  headerCartBtn: {
    padding: 6,
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  bannerBackground: {
    width: '100%',
  },
  bannerOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppTheme.colors.accentYellow,
    marginRight: 6,
  },
  heroBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: AppTheme.colors.accentYellow,
    letterSpacing: 1,
  },
  heroTitleMain: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 30,
    marginBottom: 10,
  },
  heroTaglineText: {
    fontSize: 12,
    color: '#D6D3D1',
    lineHeight: 18,
    marginBottom: 18,
  },
  heroSliderContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  heroSliderImage: {
    width: '100%',
    height: '100%',
  },
  heroSliderDots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  heroSliderDot: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  heroSliderDotActive: {
    width: 24,
    backgroundColor: AppTheme.colors.accentYellow,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1.2,
    backgroundColor: AppTheme.colors.accentYellow,
    borderRadius: 100,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPrimaryBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1C1917',
    letterSpacing: 0.5,
  },
  heroSecondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 100,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroSecondaryBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  marqueeBar: {
    backgroundColor: AppTheme.colors.accentYellow,
    paddingVertical: 10,
    marginVertical: 12,
  },
  marqueeText: {
    fontSize: 10,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  brandIntroCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 24,
    backgroundColor: '#FAF6EE',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1C1917',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 4,
  },
  introBadge: {
    backgroundColor: '#1C1917',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  introBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: AppTheme.colors.accentYellow,
    letterSpacing: 1,
  },
  brandIntroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1C1917',
    marginBottom: 8,
  },
  brandIntroDesc: {
    fontSize: 13,
    color: '#44403C',
    lineHeight: 18,
    marginBottom: 16,
  },
  formulaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  formulaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#1C1917',
  },
  formulaPillText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  formulaOperator: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78716C',
  },
  pillIcon: {
    marginRight: 4,
  },
  planetsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  planetCard: {
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  planetCardBg: {
    width: '100%',
    height: '100%',
  },
  planetCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  planetCardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  planetCardBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  planetCardName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  planetCardTagline: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 6,
  },
  planetCardDesc: {
    fontSize: 11,
    color: '#D6D3D1',
    lineHeight: 15,
    marginBottom: 12,
  },
  planetCardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planetCardLinkText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gallerySubtitle: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: -4,
  },
  galleryImageCard: {
    width: 200,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  usecaseSection: {
    backgroundColor: '#1C1917',
    paddingVertical: 24,
    marginVertical: 24,
  },
  usecaseTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    paddingHorizontal: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  usecaseCard: {
    width: 240,
    backgroundColor: '#272522',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#44403C',
  },
  usecaseCardImg: {
    width: '100%',
    height: 140,
  },
  usecaseCardInfo: {
    padding: 14,
  },
  usecaseCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  usecaseCardDesc: {
    fontSize: 11,
    color: '#A8A29E',
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  horizontalScroll: {
    paddingLeft: 12,
    paddingRight: 20,
  },
  productCard: {
    width: 150,
    margin: 8,
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImageContainer: {
    height: 130,
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: AppTheme.colors.accentYellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  cardBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  valuesSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  valueList: {
    marginTop: 12,
  },
  valueTile: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  valueIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 92, 58, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    flex: 1,
    marginLeft: 12,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  valueSubtitle: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    marginTop: 2,
  },
  footer: {
    backgroundColor: '#272522', // stone-800
    padding: 24,
    marginTop: 24,
  },
  footerLogo: {
    fontSize: 24,
    fontWeight: '900',
    color: AppTheme.colors.white,
  },
  footerSlogan: {
    fontSize: 12,
    color: '#A8A29E', // stone-400
    fontStyle: 'italic',
    marginTop: 4,
  },
  socials: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  socialIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#44403C', // stone-700
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#44403C',
    marginVertical: 12,
  },
  footerContact: {
    fontSize: 12,
    color: '#A8A29E',
    lineHeight: 20,
  },
  copyright: {
    fontSize: 10,
    color: '#57534E', // stone-600
    marginTop: 20,
  },
  /* Drawer Menu Styles */
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    width: '30%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    width: '70%',
    height: '100%',
    backgroundColor: '#1C1917', // Dark cosmic drawer matching frontend
    paddingTop: 40,
    paddingBottom: 24,
    borderRightWidth: 1,
    borderRightColor: '#2D2A26',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2A26',
  },
  drawerLogo: {
    width: 120,
    height: 60, // perfect 2:1 aspect ratio
  },
  drawerCloseBtn: {
    padding: 4,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  drawerItem: {
    paddingVertical: 12,
    marginBottom: 4,
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E7E5E4', // light stone text
  },
  drawerItemActiveText: {
    color: AppTheme.colors.accentYellow, // active item is yellow matching frontend links hover
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#2D2A26',
    marginVertical: 16,
  },
  drawerLangRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerLangLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A8A29E',
  },
  langPills: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#44403C',
    borderRadius: 100,
    padding: 2,
    backgroundColor: '#272522',
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  langPillActive: {
    backgroundColor: '#44403C',
  },
  langPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A8A29E',
  },
  langPillActiveText: {
    color: '#FFFFFF',
  },
  drawerUserBox: {
    backgroundColor: '#272522',
    borderRadius: 14,
    padding: 12,
  },
  drawerUserWelcome: {
    fontSize: 11,
    color: '#A8A29E',
  },
  drawerUserName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  drawerLogoutBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  drawerLogoutText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: AppTheme.colors.red,
  },
  drawerLoginBtn: {
    backgroundColor: '#1C1917',
    borderRadius: 100,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerLoginText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  drawerBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.accentYellow,
    borderRadius: 100,
    paddingVertical: 12,
    gap: 8,
    marginTop: 10,
  },
  drawerBuyBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1C1917',
    letterSpacing: 0.5,
  },
});
