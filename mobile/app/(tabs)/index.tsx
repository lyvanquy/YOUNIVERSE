import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell, Smile, ShieldCheck, ChevronRight, MessageCircle, Heart, Video, HelpCircle } from 'lucide-react-native';
import { AppTheme } from '../../src/config/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Header (Logo, Search, Notification) */}
        <View style={styles.header}>
          <Text style={styles.logoText}>S'mood</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search color={AppTheme.colors.darkText} size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Bell color={AppTheme.colors.darkText} size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Banner Section */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>NEW RELEASE</Text>
            </View>
            <Text style={styles.bannerTitle}>Ăn một miếng,{"\n"}mood mượt liền</Text>
            <TouchableOpacity 
              style={styles.bannerCta}
              onPress={() => router.push('/products')}
            >
              <Text style={styles.bannerCtaText}>MUA NGAY</Text>
              <ChevronRight color={AppTheme.colors.primaryGreen} size={14} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Introduction "S'mood là ai?" */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>S'mood là ai?</Text>
          <Text style={styles.introDesc}>
            S'mood là thương hiệu Việt Nam cung cấp những sản phẩm ăn vặt tiện lợi, ngon miệng và cực kỳ vui tính. Chúng mình tin rằng các món ăn vặt ngon lành, có màu sắc tươi tắn sẽ mang đến một ngày mượt mà cho tâm hồn bạn.
          </Text>
          <TouchableOpacity 
            style={styles.introButton}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.introButtonText}>Tìm hiểu thêm</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Featured Products Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
          <TouchableOpacity onPress={() => router.push('/products')}>
            <Text style={styles.sectionLink}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Featured Products Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {_buildProductCard(
            router,
            "Chuối Chống Đuối",
            "30.000đ",
            "Best Seller",
            "chuoi-chong-duoi"
          )}
          {_buildProductCard(
            router,
            "Khoai Khờ Khạo",
            "28.000đ",
            "New",
            "khoai-kho-khao"
          )}
          {_buildProductCard(
            router,
            "Me Ngáo Ngơ",
            "32.000đ",
            "Hot",
            "me-ngao-ngo"
          )}
        </ScrollView>

        {/* 6. Core Values */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Giá trị cốt lõi</Text>
          <View style={styles.valueList}>
            {_buildValueTile(
              <Smile color={AppTheme.colors.primaryGreen} size={22} />,
              "1. Tiện lợi & Vui vẻ",
              "Ăn vặt không chỉ để no, mà còn để vui. Tiện mang theo mọi lúc mọi nơi."
            )}
            {_buildValueTile(
              <ShieldCheck color={AppTheme.colors.primaryGreen} size={22} />,
              "2. Chất lượng & Sạch sẽ",
              "Nguyên liệu tự nhiên, quy trình đóng gói vệ sinh đạt chuẩn an toàn thực phẩm."
            )}
          </View>
        </View>

        {/* 7. Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>S'mood</Text>
          <Text style={styles.footerSlogan}>Ăn một miếng, mood mượt liền</Text>
          
          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialIcon}><MessageCircle color={AppTheme.colors.white} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Heart color={AppTheme.colors.white} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Video color={AppTheme.colors.white} size={18} /></TouchableOpacity>
          </View>

          <View style={styles.footerDivider} />
          
          <Text style={styles.footerContact}>
            Hotline: 1900 1234{"\n"}
            Email: contact@smood.io.vn{"\n"}
            Địa chỉ: Hà Nội, Việt Nam
          </Text>
          
          <Text style={styles.copyright}>© 2026 S'mood. All rights reserved.</Text>
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
  slug: string
) {
  return (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${slug}`)}
    >
      <View style={styles.cardImageContainer}>
        {/* Placeholder Icon for Product Image */}
        <HelpCircle color={AppTheme.colors.primaryGreen} size={42} opacity={0.3} />
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{badge}</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
        {/* <Text style={styles.cardPrice}>{price}</Text> */}
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
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 12,
    padding: 6,
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    height: 180,
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 24,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  bannerBadge: {
    backgroundColor: AppTheme.colors.accentYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: AppTheme.colors.white,
    marginTop: 12,
    lineHeight: 28,
  },
  bannerCta: {
    backgroundColor: AppTheme.colors.white,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  bannerCtaText: {
    fontSize: 11,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    marginRight: 4,
  },
  introCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 10,
  },
  introDesc: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  introButton: {
    borderWidth: 1,
    borderColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  introButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
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
});
