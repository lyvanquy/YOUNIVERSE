import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Sparkles, Heart, Compass, Flame, Eye, Star, Phone, ShieldAlert, Award } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';

const CORE_VALUES = [
  {
    letter: 'Y',
    title: 'You-nique',
    subtitle: 'Bản sắc độc bản',
    highlight: 'Vũ trụ của bạn là duy nhất.',
    desc: 'Tôn vinh bản sắc độc bản của riêng bạn. Vũ trụ của bạn là duy nhất và không thể bị sao chép hay trùng lặp bởi bất kỳ ai.',
    color: '#3B82F6', // Blue
    bg: 'rgba(59, 130, 246, 0.04)',
    border: 'rgba(59, 130, 246, 0.15)',
  },
  {
    letter: 'O',
    title: 'Out-of-the-box',
    subtitle: 'Tư duy đột phá',
    highlight: 'Không ngại tùy biến, không ngại điên rồ.',
    desc: 'Thách thức mọi giới hạn khuôn mẫu, mang đến tự do tuyệt đối để bạn thể hiện và định hình phong cách cá nhân.',
    color: '#EAB308', // Amber
    bg: 'rgba(230, 179, 8, 0.04)',
    border: 'rgba(230, 179, 8, 0.15)',
  },
  {
    letter: 'U',
    title: 'Unconditional connection',
    subtitle: 'Kết nối vô điều kiện',
    highlight: 'Hòa hợp cái tôi với thế giới.',
    desc: 'Hòa hợp cái tôi cá nhân với thế giới xung quanh qua những câu chuyện nhỏ được kể trên từng chiếc charm tinh xảo.',
    color: '#F43F5E', // Rose
    bg: 'rgba(244, 63, 94, 0.04)',
    border: 'rgba(244, 63, 94, 0.15)',
  }
];

const TEAM_MEMBERS = [
  {
    name: 'Nguyễn Linh Chi',
    role: 'Project Leader',
    phone: '0335173280',
    initials: 'LC',
    color: '#3B82F6',
  },
  {
    name: 'Trần Hải Đăng',
    role: 'Lead of Digital Media & Website',
    phone: '0795722279',
    initials: 'HĐ',
    color: '#EAB308',
  },
  {
    name: 'Quách Khả Thi',
    role: 'Lead of Market Research & Insights',
    phone: '0858062402',
    initials: 'KT',
    color: '#F43F5E',
  },
  {
    name: 'Nguyễn Lý An Nhiên',
    role: 'Lead of Operations',
    phone: '0334230606',
    initials: 'AN',
    color: '#10B981',
  },
  {
    name: 'Nguyễn Đỗ Như Hà',
    role: 'Lead of Research & Development',
    phone: '0943484784',
    initials: 'NH',
    color: '#8B5CF6',
  },
  {
    name: 'Lê Nữ Đan Vy',
    role: 'Lead of Sales',
    phone: '0914575205',
    initials: 'DV',
    color: '#EC4899',
  },
  {
    name: 'Dương Ngọc Phương Nghi',
    role: 'Lead of Production',
    phone: '0346229446',
    initials: 'PN',
    color: '#06B6D4',
  },
  {
    name: 'Trần Ngọc Thư',
    role: 'Lead of Public Relations',
    phone: '0913450445',
    initials: 'NT',
    color: '#F97316',
  }
];

export default function AboutScreen() {
  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Lỗi', 'Không thể gọi số điện thoại này.');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* 1. Brand Intro Banner */}
      <View style={styles.bannerContainer}>
        <Image 
          source={{ uri: 'https://api.youniverse.io.vn/images/banner-about-us-new.png' }} 
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>CÂU CHUYỆN CỦA CHÚNG MÌNH</Text>
          <Text style={styles.bannerSub}>Khởi nguồn từ UEH.ISB • Thiết kế bởi thế hệ trẻ</Text>
        </View>
      </View>

      {/* 2. Brand Identity Concept */}
      <View style={styles.identitySection}>
        <Text style={styles.brandTitle}>
          YOU<Text style={{ color: AppTheme.colors.accentYellow }}>niverse</Text>
        </Text>
        
        <View style={styles.badgeRow}>
          <Sparkles color={AppTheme.colors.accentYellow} size={14} />
          <Text style={styles.badgeText}>CÔNG CỤ GIAO TIẾP THẦM LẶNG</Text>
        </View>

        <Text style={styles.brandDesc}>
          Giúp định hình và khẳng định bản sắc cá nhân thông qua từng món phụ kiện nhỏ chứa đựng những khao khát thầm kín của riêng bạn.
        </Text>

        {/* Tagline Card */}
        <View style={styles.taglineCard}>
          <Text style={styles.taglineTitle}>"Unspoken Desires, Bespoke YOUniverse."</Text>
          <View style={styles.divider} />
          <Text style={styles.taglineDesc}>
            Nơi những khao khát chưa từng được cất lời sẽ được hữu hình hóa trong một "vũ trụ" độc bản của riêng bạn. 
            Giải quyết nút thắt tâm lý của thế hệ trẻ: ngại đòi hỏi trực tiếp nhưng khao khát được thấu hiểu.
          </Text>
        </View>
      </View>

      {/* 3. Our Story Section */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Từ rập khuôn đến tự do</Text>
        <Text style={styles.paragraph}>
          Chúng ta luôn khao khát được thấu hiểu, nhưng lại chán ghét việc phải giải thích về bản thân mình. 
          Với Gen Z, ai cũng từng giấu một mong muốn nhỏ bé: Giá như những người thân yêu có thể tự "đọc vị" sở thích của mình mà không cần đến những lời gợi ý gượng gạo hay đòi hỏi trực tiếp.
        </Text>
        <Text style={styles.paragraph}>
          Nắm bắt tâm lý đó, YOUniverse ra đời cùng công thức "Vũ trụ 3 ngôi" độc quyền. 
          Một chiếc móc khóa mang đậm dấu ấn cá nhân—tích hợp Biệt danh (Astra), Sở thích (Sirius) và một Câu Quote tuyên ngôn (Polaris)—giờ đây không chỉ là phụ kiện trang trí đơn thuần. Nó hóa thân thành một "Bản đồ thấu hiểu" không lời.
        </Text>
      </View>

      {/* 4. Sứ mệnh & Tầm nhìn */}
      <View style={styles.splitRow}>
        <View style={[styles.splitCard, { marginRight: 8 }]}>
          <View style={styles.splitHeader}>
            <Flame color="#3B82F6" size={18} />
            <Text style={[styles.splitTitle, { color: '#3B82F6' }]}>Sứ mệnh</Text>
          </View>
          <Text style={styles.splitDesc}>
            Giải tỏa áp lực giao tiếp và phá vỡ rào cản "ngại bày tỏ". 
            Chúng tôi trao quyền để bạn tự tin phơi bày thế giới nội tâm phong phú mà chẳng cần một lời giải thích.
          </Text>
        </View>

        <View style={[styles.splitCard, { marginLeft: 8 }]}>
          <View style={styles.splitHeader}>
            <Eye color={AppTheme.colors.accentYellow} size={18} />
            <Text style={[styles.splitTitle, { color: AppTheme.colors.accentYellow }]}>Tầm nhìn</Text>
          </View>
          <Text style={styles.splitDesc}>
            Trở thành thương hiệu phụ kiện mô-đun cá nhân hóa hàng đầu dành cho Gen Z, 
            tiên phong khai mở phân khúc "Phụ kiện Tâm lý Xã hội" tại Việt Nam.
          </Text>
        </View>
      </View>

      {/* 5. Deep Insight Callout */}
      <View style={styles.insightBox}>
        <View style={styles.insightHeader}>
          <Award color={AppTheme.colors.accentYellow} size={18} />
          <Text style={styles.insightTitle}>TÍN HIỆU NGẦM (DEEP INSIGHT)</Text>
        </View>
        <Text style={styles.insightDesc}>
          Giới trẻ khao khát nhận được những món quà "chuẩn gu" từ bạn bè và người thân, nhưng lại bị kìm hãm bởi tâm lý e ngại việc đòi hỏi trực tiếp. 
          Họ cần một điểm chạm vật lý nhỏ gọn đồng hành mỗi ngày để đóng vai trò gợi ý khéo léo nhằm định hướng sự thấu hiểu từ người khác.
        </Text>
      </View>

      {/* 6. Core Values */}
      <View style={styles.valuesContainer}>
        <Text style={styles.sectionHeadingCenter}>Giá trị cốt lõi (Y.O.U)</Text>
        
        {CORE_VALUES.map((val) => (
          <View key={val.letter} style={[styles.valueCard, { backgroundColor: val.bg, borderColor: val.border }]}>
            <View style={styles.valueRow}>
              <View style={[styles.letterBadge, { backgroundColor: val.color }]}>
                <Text style={styles.letterBadgeText}>{val.letter}</Text>
              </View>
              <View style={styles.valueTextContainer}>
                <Text style={styles.valueTitle}>{val.title}</Text>
                <Text style={[styles.valueSubtitle, { color: val.color }]}>{val.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.valueHighlight}>{val.highlight}</Text>
            <Text style={styles.valueDesc}>{val.desc}</Text>
          </View>
        ))}
      </View>

      {/* 7. Meet The Team */}
      <View style={styles.teamSection}>
        <Text style={styles.sectionHeadingCenter}>Đội ngũ sáng lập (UEH.ISB)</Text>
        <Text style={styles.teamSub}>Gặp gỡ những mảnh ghép sáng lập nên vũ trụ YOUniverse</Text>

        <View style={styles.teamGrid}>
          {TEAM_MEMBERS.map((member) => (
            <View key={member.name} style={styles.memberCard}>
              <View style={[styles.memberAvatar, { backgroundColor: member.color + '15', borderColor: member.color + '40' }]}>
                <Text style={[styles.memberInitials, { color: member.color }]}>{member.initials}</Text>
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole} numberOfLines={2}>{member.role}</Text>
              
              <TouchableOpacity 
                style={styles.callBtn} 
                onPress={() => handlePhoneCall(member.phone)}
              >
                <Phone color={AppTheme.colors.primaryGreen} size={11} />
                <Text style={styles.callBtnText}>{member.phone}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    height: 180,
    position: 'relative',
    backgroundColor: AppTheme.colors.darkText,
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
    right: 20,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  identitySection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 25, 23, 0.05)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
    gap: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    letterSpacing: 1,
  },
  brandDesc: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  taglineCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginTop: 20,
    width: '100%',
  },
  taglineTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 12,
  },
  taglineDesc: {
    fontSize: 11.5,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 13,
    color: AppTheme.colors.darkText,
    lineHeight: 20,
    marginBottom: 10,
  },
  splitRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  splitCard: {
    flex: 1,
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 16,
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  splitTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  splitDesc: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    lineHeight: 16,
  },
  insightBox: {
    backgroundColor: AppTheme.colors.darkText,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: AppTheme.colors.accentYellow,
    letterSpacing: 1,
  },
  insightDesc: {
    fontSize: 12,
    color: '#D6D3D1',
    lineHeight: 18,
  },
  valuesContainer: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeadingCenter: {
    fontSize: 18,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    textAlign: 'center',
    marginBottom: 16,
  },
  valueCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  letterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterBadgeText: {
    color: AppTheme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueTextContainer: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  valueSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  valueHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginTop: 8,
  },
  valueDesc: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  teamSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  teamSub: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  memberCard: {
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 6,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberInitials: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 9.5,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
    height: 28,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 92, 58, 0.05)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    marginTop: 6,
    width: '100%',
  },
  callBtnText: {
    fontSize: 9.5,
    color: AppTheme.colors.primaryGreen,
    fontWeight: 'bold',
  },
});
