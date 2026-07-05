import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowRight, Calendar } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';

const BLOGS = [
  {
    title: "Ý nghĩa sâu sắc của 3 dòng charm Astra, Sirius và Polaris",
    date: "04/07/2026",
    category: "Kiến thức",
    summary: "Tìm hiểu cách 3 dòng charm kết hợp với nhau tạo nên một bản đồ nội tâm hoàn hảo đại diện cho cá tính của bạn.",
  },
  {
    title: "Gen Z và xu hướng phụ kiện cá nhân hóa 'Speak Without Words'",
    date: "30/06/2026",
    category: "Xu hướng",
    summary: "Lên tiếng mà không cần cất lời. Khám phá cách các bạn trẻ sử dụng phụ kiện để thể hiện bản ngã thầm kín.",
  },
  {
    title: "Chất liệu Nhựa co nhiệt (Heat-Shrink Plastic) trong chế tác thủ công",
    date: "15/06/2026",
    category: "Chế tác",
    summary: "Hành trình từ những hình vẽ phẳng thô sơ được co lại dưới nhiệt độ cao để trở thành những hành tinh cứng cáp, bền bỉ.",
  }
];

export default function BlogScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {BLOGS.map((blog, idx) => (
        <View key={idx} style={styles.blogCard}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{blog.category}</Text>
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
