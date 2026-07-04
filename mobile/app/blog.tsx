import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowRight, Calendar } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';

const BLOGS = [
  {
    title: "Ăn vặt thế nào để không lo tăng cân?",
    date: "04/07/2026",
    summary: "Mẹo nhỏ chọn các món sấy tự nhiên và chia nhỏ khẩu phần giúp bạn duy trì vóc dáng hoàn hảo mà vẫn thỏa mãn cơn thèm ăn.",
  },
  {
    title: "Hành trình nông trại S'mood: Từ vườn đến gói snack",
    date: "30/06/2026",
    summary: "Khám phá quy trình tuyển chọn chuối chín tự nhiên tại các nhà vườn và công nghệ sấy khép kín lưu giữ hương vị tuyệt vời.",
  },
  {
    title: "Làm thế nào để lấy lại năng lượng tức thì khi cạn kiệt?",
    date: "15/06/2026",
    summary: "Những lưu ý dinh dưỡng quan trọng giúp bạn bừng tỉnh tinh thần vượt qua cơn buồn ngủ chiều muộn nơi công sở.",
  }
];

export default function BlogScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {BLOGS.map((blog, idx) => (
        <View key={idx} style={styles.blogCard}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>Dinh dưỡng</Text>
            </View>
            <View style={styles.dateRow}>
              <Calendar color={AppTheme.colors.textMuted} size={12} />
              <Text style={styles.dateText}>{blog.date}</Text>
            </View>
          </View>

          <Text style={styles.blogTitle}>{blog.title}</Text>
          <Text style={styles.blogSummary}>{blog.summary}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.readMore}>Đọc thêm</Text>
            <ArrowRight color={AppTheme.colors.primaryGreen} size={14} style={{ marginLeft: 4 }} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.backgroundLight,
  },
  scrollContent: {
    padding: 20,
  },
  blogCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(13, 92, 58, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    marginLeft: 4,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppTheme.colors.darkText,
    lineHeight: 22,
    marginBottom: 8,
  },
  blogSummary: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
});
