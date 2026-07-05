import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MapPin, Clock, PhoneCall } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    Alert.alert('Thành công', 'Cảm ơn phản hồi của bạn! YOUniverse sẽ phản hồi sớm nhất qua email.', [
      {
        text: 'OK',
        onPress: () => {
          setName('');
          setEmail('');
          setMessage('');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <Text style={styles.headerTitle}>Bạn cần hỗ trợ?</Text>

      {/* Info Tiles */}
      {_buildInfoTile(
        <MapPin color={AppTheme.colors.primaryGreen} size={22} />,
        "Ghé thăm tụi mình tại",
        "279 Nguyễn Tri Phương, Phường 5, Quận 10, TP.HCM"
      )}
      {_buildInfoTile(
        <Clock color={AppTheme.colors.primaryGreen} size={22} />,
        "Giờ tụi mình hoạt động",
        "Thứ Hai - Thứ Bảy: 8:00 AM - 18:00 PM"
      )}
      {_buildInfoTile(
        <PhoneCall color={AppTheme.colors.primaryGreen} size={22} />,
        "Bạn cần hỗ trợ gấp?",
        "Hotline: 1900 1234\nEmail: contact@youniverse.io.vn"
      )}

      <View style={styles.divider} />

      {/* Feedback Form */}
      <Text style={styles.formTitle}>Để lại lời nhắn</Text>

      <Text style={styles.label}>Họ và tên *</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên của bạn..."
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Địa chỉ email *</Text>
      <TextInput
        style={styles.input}
        placeholder="Email để YOUniverse phản hồi..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Lời nhắn của bạn *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Bạn cần góp ý hay hỏi gì cứ viết ở đây nha..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSendMessage}>
        <Text style={styles.submitBtnText}>GỬI LỜI NHĂN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function _buildInfoTile(icon: React.ReactNode, title: string, content: string) {
  return (
    <View style={styles.infoTile}>
      <View style={styles.iconCircle}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoContent}>{content}</Text>
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
    padding: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 20,
  },
  infoTile: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(13, 92, 58, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 14,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
  },
  infoContent: {
    fontSize: 12,
    color: AppTheme.colors.darkText,
    lineHeight: 18,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: AppTheme.colors.darkText,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 1.2,
  },
});
