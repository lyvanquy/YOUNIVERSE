import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { AppTheme } from '../src/config/theme';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>Câu chuyện S'mood</Text>
        <Text style={styles.text}>
          S'mood ra đời từ một buổi chiều làm việc mệt mỏi, khi mọi người trong đội ngũ đều cảm thấy cạn kiệt năng lượng và cần một cái gì đó ăn vặt ngọt lành để giải tỏa căng thẳng.
        </Text>
        <Text style={styles.text}>
          Chúng mình tự hỏi: Tại sao không tạo ra những món ăn vặt vừa tốt cho sức khỏe, vừa có những cái tên "nhí nhố" mang lại tiếng cười cho người ăn? Thế là S'mood (Mood mượt mà) ra đời với những sản phẩm làm hoàn toàn từ trái cây và củ quả Việt Nam.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Tại sao lại chọn chúng mình?</Text>
        
        <Text style={styles.subtitle}>🌿 100% Nguyên liệu tự nhiên</Text>
        <Text style={styles.subtext}>
          Nguồn hoa quả chín tự nhiên được tuyển chọn nghiêm ngặt trực tiếp từ các vườn cây ăn trái miền Tây và Đà Lạt.
        </Text>

        <Text style={styles.subtitle}>💨 Công nghệ sấy lạnh giữ chất</Text>
        <Text style={styles.subtext}>
          Quy trình sấy lạnh khép kín giúp giữ lại đến 95% vitamin, màu sắc và hương vị nguyên bản của sản phẩm mà không cần chất bảo quản.
        </Text>

        <Text style={styles.subtitle}>💛 Tinh thần tươi vui</Text>
        <Text style={styles.subtext}>
          Từng gói snack gửi tới bạn đều được đóng gói tỉ mỉ kèm theo những thông điệp vui vẻ, giúp bạn lấy lại tinh thần làm việc tức thì.
        </Text>
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
    padding: 20,
  },
  card: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 14,
  },
  text: {
    fontSize: 14,
    color: AppTheme.colors.darkText,
    lineHeight: 22,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginTop: 16,
    marginBottom: 6,
  },
  subtext: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    lineHeight: 20,
  },
});
