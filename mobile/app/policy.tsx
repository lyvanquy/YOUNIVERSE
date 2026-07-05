import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Shield, Truck, PhoneCall, AlertTriangle, CheckCircle, XCircle, Sparkles, Heart, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppTheme } from '../src/config/theme';

export default function PolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color={AppTheme.colors.darkText} size={24} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Chính sách mua hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Header Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://youniverse.io.vn/images/banner-policy-new.png' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>CHÍNH SÁCH MUA HÀNG</Text>
            <Text style={styles.bannerSub}>Đảm bảo quyền lợi khách hàng tuyệt đối</Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introBlock}>
          <Text style={styles.introText}>
            YOUniverse luôn mong muốn mang đến những sản phẩm chất lượng và trải nghiệm mua sắm tốt nhất cho khách iu. Để đảm bảo quyền lợi của khách hàng, chúng mình áp dụng chính sách đổi trả và bảo hành như sau:
          </Text>
        </View>

        {/* 2. CHÍNH SÁCH ĐỔI TRẢ */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F3E8FF' }]}>
              <Shield color="#9333EA" size={20} />
            </View>
            <View>
              <Text style={styles.sectionBadge}>01</Text>
              <Text style={styles.sectionTitle}>Chính sách đổi trả</Text>
            </View>
          </View>

          <Text style={styles.sectionDesc}>
            YOUniverse hỗ trợ đổi/trả sản phẩm trong vòng 02 ngày kể từ ngày khách hàng nhận được hàng đối với các trường hợp:
          </Text>

          {/* Supported cases */}
          <View style={[styles.box, styles.successBox]}>
            <View style={styles.boxTitleRow}>
              <CheckCircle color="#10B981" size={14} />
              <Text style={[styles.boxTitle, { color: '#065F46' }]}>Được hỗ trợ đổi/trả</Text>
            </View>
            {[
              'Giao thiếu sản phẩm.',
              'Giao sai sản phẩm so với đơn đặt hàng.',
              'Sản phẩm bị lỗi hoặc hư hỏng do quá trình vận chuyển.',
              'Sản phẩm bị lỗi từ phía nhà sản xuất.',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#34D399' }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Conditions */}
          <View style={[styles.box, styles.warningBox]}>
            <View style={styles.boxTitleRow}>
              <AlertTriangle color="#F59E0B" size={14} />
              <Text style={[styles.boxTitle, { color: '#92400E' }]}>Điều kiện áp dụng</Text>
            </View>
            {[
              'Khách iu vui lòng quay video unbox từ lúc còn nguyên kiện hàng đến khi kiểm tra sản phẩm.',
              'Video cần được quay liên tục, rõ nét, không cắt ghép, không chỉnh sửa hoặc tua nhanh.',
              'Sản phẩm cần còn đầy đủ phụ kiện, bao bì và chưa có dấu hiệu sử dụng.',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#FBBF24' }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Unsupport cases */}
          <View style={[styles.box, styles.dangerBox]}>
            <View style={styles.boxTitleRow}>
              <XCircle color="#EF4444" size={14} />
              <Text style={[styles.boxTitle, { color: '#991B1B' }]}>Chưa thể hỗ trợ đổi/trả</Text>
            </View>
            {[
              'Khách hàng thay đổi nhu cầu hoặc sở thích cá nhân.',
              'Sản phẩm bị hư hỏng do sử dụng, bảo quản không đúng cách.',
              'Liên hệ đổi trả sau thời gian quy định.',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#F87171' }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3. CHÍNH SÁCH BẢO HÀNH */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: '#DBEAFE' }]}>
              <CheckCircle color="#2563EB" size={20} />
            </View>
            <View>
              <Text style={styles.sectionBadge}>02</Text>
              <Text style={styles.sectionTitle}>Chính sách bảo hành</Text>
            </View>
          </View>

          <Text style={styles.sectionDesc}>
            YOUniverse hỗ trợ bảo hành đối với các lỗi phát sinh từ quá trình sản xuất, bao gồm:
          </Text>

          <View style={[styles.box, styles.infoBox]}>
            {[
              'Sản phẩm nhận được không đúng mẫu hoặc thiếu charm so với đơn hàng đã đặt.',
              'Móc khóa bị lỏng lẻo khiến các charm bị rời ra.',
              'Charm bị nứt, gãy hoặc biến dạng bất thường ngay khi nhận hàng hoặc trong thời gian ngắn sử dụng do lỗi sản xuất.',
              'Khoen, móc khóa hoặc phụ kiện kim loại bị tuột khỏi sản phẩm do lỗi gia công.',
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#60A5FA' }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Small Note Card */}
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Heart color="#FBBF24" size={14} />
              <Text style={styles.noteTitle}>Một số lưu ý nho nhỏ</Text>
            </View>
            <Text style={styles.noteDesc}>
              Tất cả sản phẩm tại YOUniverse đều được làm thủ công, nên mỗi bé móc khóa sẽ có một chút khác biệt riêng. Vì vậy, bạn iu có thể gặp những trường hợp như:
            </Text>
            {[
              'Chênh lệch nhẹ về màu sắc do tô màu thủ công.',
              'Kích thước có thể sai số nhỏ sau khi co nhiệt.',
              'Độ dày resin hoặc độ bóng khác nhau đôi chút.',
              'Chi tiết vẽ tay nét vẽ có thể không giống 100% hình mẫu.',
              'Có thể xuất hiện bọt khí rất nhỏ trên lớp resin.',
            ].map((item, i) => (
              <View key={i} style={styles.noteBulletRow}>
                <View style={styles.noteBulletDot} />
                <Text style={styles.noteBulletText}>{item}</Text>
              </View>
            ))}
            <View style={styles.noteDivider} />
            <Text style={styles.noteFooter}>
              Những khác biệt nhỏ mang tính đặc trưng của sản phẩm handmade sẽ không được xem là lỗi sản xuất. Mong bạn iu thông cảm và yêu thương những nét riêng nhé 💖
            </Text>
          </View>
        </View>

        {/* 4. CHÍNH SÁCH VẬN CHUYỂN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: '#D1FAE5' }]}>
              <Truck color="#059669" size={20} />
            </View>
            <View>
              <Text style={styles.sectionBadge}>03</Text>
              <Text style={styles.sectionTitle}>Chính sách vận chuyển</Text>
            </View>
          </View>

          <Text style={styles.sectionDesc}>
            YOUniverse hỗ trợ giao hàng toàn quốc thông qua Viettel Post. Phí vận chuyển dao động tùy theo khu vực nhận hàng.
          </Text>

          {/* Shipping Times */}
          <View style={styles.shippingRow}>
            <View style={styles.shippingCol}>
              <Text style={styles.shippingLoc}>TP. Hồ Chí Minh</Text>
              <Text style={styles.shippingDays}>1-3</Text>
              <Text style={styles.shippingSub}>ngày làm việc</Text>
            </View>
            <View style={styles.shippingCol}>
              <Text style={styles.shippingLoc}>Tỉnh thành khác</Text>
              <Text style={styles.shippingDays}>3-7</Text>
              <Text style={styles.shippingSub}>ngày làm việc</Text>
            </View>
          </View>

          {/* UEH Campus B Pickup */}
          <View style={[styles.box, styles.pickupBox]}>
            <View style={styles.boxTitleRow}>
              <Sparkles color="#F59E0B" size={14} />
              <Text style={[styles.boxTitle, { color: '#92400E' }]}>Nhận hàng trực tiếp tại UEH</Text>
            </View>
            <Text style={styles.pickupDesc}>
              Khách iu có thể lựa chọn nhận hàng trực tiếp tại Cơ sở B - UEH để tiết kiệm chi phí vận chuyển.
            </Text>
            <View style={styles.pickupTimeRow}>
              <Text style={styles.pickupTimeEmoji}>🕐</Text>
              <View>
                <Text style={styles.pickupTimeTitle}>Khung giờ giao hàng</Text>
                <Text style={styles.pickupTimeText}>Thứ 2 - Thứ 6, 9h00 - 11h00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactBlock}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFE4E6' }]}>
              <PhoneCall color="#E11D48" size={20} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            </View>
          </View>

          <Text style={styles.contactDesc}>
            Nếu cần hỗ trợ về đổi trả hoặc bảo hành, khách iu vui lòng liên hệ với YOUniverse qua:
          </Text>

          <View style={styles.contactChannels}>
            {[
              { icon: '💬', name: 'Fanpage', desc: 'Direct chat' },
              { icon: '🛒', name: 'Bán hàng', desc: 'Sales channels' },
              { icon: '📞', name: 'Hotline', desc: '1900 1234' }
            ].map((c) => (
              <View key={c.name} style={styles.contactChannelCard}>
                <Text style={styles.channelIcon}>{c.icon}</Text>
                <Text style={styles.channelName}>{c.name}</Text>
                <Text style={styles.channelDesc}>{c.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.contactFooter}>
            YOUniverse chân thành cảm ơn khách iu đã tin tưởng và đồng hành cùng chúng mình 💜
          </Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: AppTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  backBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    height: 140,
    position: 'relative',
    backgroundColor: '#000000',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  bannerOverlay: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  introBlock: {
    padding: 20,
    backgroundColor: AppTheme.colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  introText: {
    fontSize: 13,
    color: '#44403C',
    lineHeight: 19,
  },
  sectionCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: AppTheme.colors.textMuted,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    textTransform: 'uppercase',
  },
  sectionDesc: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  box: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  warningBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  dangerBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  pickupBox: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    marginTop: 12,
  },
  boxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12.5,
    color: '#44403C',
    lineHeight: 18,
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#1C1917',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: AppTheme.colors.accentYellow,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noteDesc: {
    fontSize: 11,
    color: '#E7E5E4',
    lineHeight: 16,
    marginBottom: 10,
  },
  noteBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  noteBulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppTheme.colors.accentYellow,
    marginTop: 6,
    marginRight: 8,
  },
  noteBulletText: {
    fontSize: 11,
    color: '#A8A29E',
    lineHeight: 15,
    flex: 1,
  },
  noteDivider: {
    height: 1,
    backgroundColor: '#44403C',
    marginVertical: 12,
  },
  noteFooter: {
    fontSize: 10.5,
    color: '#A8A29E',
    lineHeight: 15,
    fontStyle: 'italic',
  },
  shippingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  shippingCol: {
    flex: 1,
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  shippingLoc: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 4,
  },
  shippingDays: {
    fontSize: 26,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
  },
  shippingSub: {
    fontSize: 10,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  pickupDesc: {
    fontSize: 12,
    color: '#78716C',
    lineHeight: 16,
    marginBottom: 10,
  },
  pickupTimeRow: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.white,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems: 'center',
    gap: 10,
  },
  pickupTimeEmoji: {
    fontSize: 18,
  },
  pickupTimeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  pickupTimeText: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  contactBlock: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  contactDesc: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  contactChannels: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  contactChannelCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  channelIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  channelName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  channelDesc: {
    fontSize: 9.5,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  contactFooter: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
