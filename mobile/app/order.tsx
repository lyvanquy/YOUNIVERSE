import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Modal, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Sparkles, Heart, Compass, ChevronRight, Check, Plus, ShoppingBag, Info, ShieldAlert, ArrowLeft, Landmark } from 'lucide-react-native';
import { AppTheme } from '../src/config/theme';
import { useAuthStore } from '../src/store/useAuthStore';
import api from '../src/services/api';

// Static Data matching frontend exactly
const ASTRA_SYSTEMS = [
  {
    id: 'sun',
    emoji: '☀️',
    nameEn: 'The Sun',
    nameVi: 'Hệ Mặt Trời',
    descEn: 'For energetic souls, full of passion and always shining brightly.',
    descVi: 'Dành cho những tâm hồn năng động, tràn đầy nhiệt huyết và luôn tỏa sáng rực rỡ.',
    image: 'https://youniverse.io.vn/images/system-sun.png',
  },
  {
    id: 'moon',
    emoji: '🌙',
    nameEn: 'The Moon',
    nameVi: 'Hệ Mặt Trăng',
    descEn: 'A sanctuary of calmness, depth, mystery and keen intuition.',
    descVi: 'Nơi trú ngụ của sự điềm tĩnh, sâu sắc, một chút bí ẩn và trực giác nhạy bén.',
    image: 'https://youniverse.io.vn/images/system-moon.png',
  },
  {
    id: 'star',
    emoji: '⭐',
    nameEn: 'The Star',
    nameVi: 'Hệ Tinh Tú',
    descEn: 'Symbol of dreams, freedom, romance and the pursuit of wonder.',
    descVi: 'Biểu tượng của những ước mơ, sự tự do, lãng mạn và luôn tìm kiếm điều kỳ diệu.',
    image: 'https://youniverse.io.vn/images/system-star.png',
  },
];

const SIRIUS_CHARMS = [
  { id: 'dog', category: 'pet', emoji: '🐕', nameEn: 'Dog', nameVi: 'Chó', image: 'https://youniverse.io.vn/images/sirius-dog.png' },
  { id: 'cat', category: 'pet', emoji: '🐈', nameEn: 'Cat', nameVi: 'Mèo', image: 'https://youniverse.io.vn/images/sirius-cat.png' },
  { id: 'hamster', category: 'pet', emoji: '🐹', nameEn: 'Hamster', nameVi: 'Hamster', image: 'https://youniverse.io.vn/images/sirius-hamster.png' },
  { id: 'boba', category: 'drink', emoji: '🧋', nameEn: 'Bubble Tea', nameVi: 'Trà sữa', image: 'https://youniverse.io.vn/images/sirius-boba.png' },
  { id: 'matcha', category: 'drink', emoji: '🍵', nameEn: 'Matcha Latte', nameVi: 'Matcha Latte', image: 'https://youniverse.io.vn/images/sirius-matcha.png' },
  { id: 'coffee', category: 'drink', emoji: '☕', nameEn: 'Coffee', nameVi: 'Cà phê', image: 'https://youniverse.io.vn/images/sirius-coffee.png' },
];

const POLARIS_QUOTES = [
  { id: 'q1', textEn: "I'm pretty, your fault", textVi: 'Tôi xinh, Lỗi bạn' },
  { id: 'q2', textEn: 'Classy & Picky', textVi: 'Sang và Khó tính' },
  { id: 'q3', textEn: 'Sassy & Foodie', textVi: 'Kiêu và Ham ăn' },
  { id: 'q4', textEn: 'Goofy & Carefree', textVi: 'Hâm và Vô tư' },
  { id: 'q5', textEn: 'Gentle & Talented', textVi: 'Hiền và Nhiều tài' },
];

export default function OrderScreen() {
  const router = useRouter();
  const { product } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);

  /* ── Step state ── */
  const [currentStep, setCurrentStep] = useState(1); // 1=Astra, 2=Sirius, 3=Polaris, 4=Invoice, 5=Success

  /* ── Step 1: Astra ── */
  const [astraSystem, setAstraSystem] = useState<string | null>(null);
  const [engraveChoice, setEngraveChoice] = useState<'engrave' | 'original' | null>(null);
  const [nickname, setNickname] = useState('');

  /* ── Step 2: Sirius ── */
  const [siriusCategory, setSiriusCategory] = useState<'pet' | 'drink' | null>(null);
  const [siriusCharm, setSiriusCharm] = useState<string | null>(null);
  const [siriusConfirmed, setSiriusConfirmed] = useState(false);

  /* ── Step 3: Polaris ── */
  const [polarisTab, setPolarisTab] = useState<'preset' | 'custom' | 'swap'>('preset');
  const [polarisPresetId, setPolarisPresetId] = useState<string | null>(null);
  const [polarisCustomText, setPolarisCustomText] = useState('');
  const [polarisCustomSealed, setPolarisCustomSealed] = useState(false);
  const [polarisSwapCharm, setPolarisSwapCharm] = useState<string | null>(null);

  /* ── Step 4: Customer info ── */
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Nhận tại Cơ sở B UEH (279 Nguyễn Tri Phương, Q10, TP.HCM)');
  const [note, setNote] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'UEH' | 'OTHER'>('UEH');
  const [paymentProvider, setPaymentProvider] = useState<'COD' | 'BANK_TRANSFER'>('BANK_TRANSFER');

  /* ── Loading and API integration states ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const user = useAuthStore((state) => state.user);

  // Pre-populate checkout form with saved profile details if logged in
  useEffect(() => {
    if (user) {
      if (user.fullName && !fullName) setFullName(user.fullName);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.email && !email) setEmail(user.email);
      if (user.address) {
        setShippingMethod('OTHER');
        setAddress(user.address);
      }
    }
  }, [user]);

  // Sync address with shippingMethod choice
  useEffect(() => {
    if (shippingMethod === 'UEH') {
      setAddress('Nhận tại Cơ sở B UEH (279 Nguyễn Tri Phương, Q10, TP.HCM)');
    } else {
      setAddress('');
    }
  }, [shippingMethod]);

  // Load backend products catalog to resolve IDs for custom items
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const res = await api.get('/products');
        const items = res.data.data?.items || [];
        setDbProducts(items);
      } catch (err) {
        console.warn("Lỗi tải thông tin sản phẩm hành tinh từ backend:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Luôn bắt đầu từ Bước 1 (Astra) để nhất quán với luồng thiết kế của Website
  useEffect(() => {
    setCurrentStep(1);
    if (product) {
      if (product === 'charm-astra') {
        setAstraSystem('sun');
        setEngraveChoice('engrave');
      } else if (product === 'charm-sirius') {
        setSiriusCategory('pet');
      } else if (product === 'charm-polaris') {
        setPolarisTab('preset');
      }
    }
  }, [product]);

  const handleNextStep = (step: number) => {
    setCurrentStep(step);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleConfirmOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*)');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Phân giải sản phẩm thật từ Database
      const astraDbProduct = dbProducts.find(p => p.slug === 'charm-astra');
      const siriusDbProduct = dbProducts.find(p => p.slug === 'charm-sirius');
      const polarisDbProduct = dbProducts.find(p => p.slug === 'charm-polaris');

      if (!astraDbProduct || !siriusDbProduct || !polarisDbProduct) {
        throw new Error('Hệ thống thiếu các sản phẩm custom charm-astra, charm-sirius, hoặc charm-polaris trên database.');
      }

      // 2. Tạo Session ID dạng UUID v4 hợp lệ để vượt qua kiểm tra Regex của Backend
      const generateUUIDv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      const sessionId = `order-${generateUUIDv4()}`;
      let cartId = '';

      const addCartItem = async (productId: string, customText: string, customData: any) => {
        const response = await api.post('/cart/items', {
          productId,
          quantity: 1,
          customText,
          customData,
        }, {
          headers: { 'x-session-id': sessionId }
        });
        cartId = response.data.data?.cart?.id || response.data.cart?.id;
      };

      // 3. Đưa Astra vào giỏ hàng
      const selectedAstra = ASTRA_SYSTEMS.find(s => s.id === astraSystem);
      if (selectedAstra) {
        const engraveText = engraveChoice === 'engrave' && nickname ? ` | Chữ khắc: ${nickname}` : '';
        await addCartItem(
          astraDbProduct.id,
          `${selectedAstra.nameVi}${engraveText}`,
          { line: 'ASTRA', system: astraSystem, engraveChoice, nickname }
        );
      }

      // 4. Đưa Sirius vào giỏ hàng
      const selectedSirius = SIRIUS_CHARMS.find(c => c.id === siriusCharm);
      if (selectedSirius) {
        await addCartItem(
          siriusDbProduct.id,
          `Sirius: ${selectedSirius.nameVi}`,
          { line: 'SIRIUS', category: siriusCategory, charm: siriusCharm }
        );
      }

      // 5. Đưa Polaris vào giỏ hàng
      if (polarisTab === 'preset' && polarisPresetId) {
        const quote = POLARIS_QUOTES.find(q => q.id === polarisPresetId);
        if (quote) {
          await addCartItem(
            polarisDbProduct.id,
            `Quote: ${quote.textVi}`,
            { line: 'POLARIS', type: 'preset', quoteId: polarisPresetId }
          );
        }
      } else if (polarisTab === 'custom' && polarisCustomSealed && polarisCustomText) {
        await addCartItem(
          polarisDbProduct.id,
          `Quote tự viết: ${polarisCustomText}`,
          { line: 'POLARIS', type: 'custom', quoteText: polarisCustomText }
        );
      } else if (polarisTab === 'swap' && polarisSwapCharm) {
        const swappedSirius = SIRIUS_CHARMS.find(c => c.id === polarisSwapCharm);
        if (swappedSirius) {
          await addCartItem(
            siriusDbProduct.id,
            `Charm Sirius thêm: ${swappedSirius.nameVi}`,
            { line: 'SIRIUS', type: 'swap', charm: polarisSwapCharm }
          );
        }
      }

      if (!cartId) {
        throw new Error('Không thể tạo giỏ hàng chế tác trên backend.');
      }

      // 6. Tạo đơn hàng chính thức
      const response = await api.post('/checkout/create-order', {
        cartId,
        customer: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        shipping: {
          addressLine: address.trim(),
          ward: null,
          district: null,
          province: null,
        },
        paymentProvider,
        note: note.trim() || null,
      }, {
        headers: { 'x-session-id': sessionId }
      });

      const orderData = response.data.data?.order || response.data.order;
      setCreatedOrderCode(orderData?.orderCode || response.data.data?.orderCode);
      setCurrentStep(5);
    } catch (err: any) {
      console.warn("Lỗi đặt hàng chế tác:", err);
      Alert.alert('Thất bại', err.response?.data?.message || err.message || 'Không thể gửi đơn hàng chế tác. Vui lòng kiểm tra lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSiriusSirius = polarisTab === 'swap';
  const totalPrice = isSiriusSirius ? 36000 : 32000; // Phù hợp với giá frontend & backend 36k / 32k
  const formatMoney = (v: number) => {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const selectedAstra = ASTRA_SYSTEMS.find(s => s.id === astraSystem);
  const selectedSirius = SIRIUS_CHARMS.find(c => c.id === siriusCharm);

  // Checks for step validation
  const step1Done = !!astraSystem && !!engraveChoice;
  const step2Done = siriusConfirmed && !!siriusCharm;
  const step3Done = 
    (polarisTab === 'preset' && !!polarisPresetId) ||
    (polarisTab === 'custom' && polarisCustomSealed && !!polarisCustomText.trim()) ||
    (polarisTab === 'swap' && !!polarisSwapCharm);

  return (
    <View style={styles.container}>
      {/* App bar with back button and brand Logo */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://youniverse.io.vn/images/logo-youniverse-transparent.png' }}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={{ width: 22 }} />
      </View>

      {/* Progress Indicators */}
      {currentStep < 5 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressStepsRow}>
            {[
              { label: 'Astra', icon: (c: string, s: number) => <Sparkles color={c} size={s} />, done: step1Done, color: '#3B82F6' },
              { label: 'Sirius', icon: (c: string, s: number) => <Heart color={c} size={s} />, done: step2Done, color: '#F59E0B' },
              { label: 'Polaris', icon: (c: string, s: number) => <Compass color={c} size={s} />, done: step3Done, color: '#EF4444' },
              { label: 'Giao hàng', icon: (c: string, s: number) => <ShoppingBag color={c} size={s} />, done: false, color: '#10B981' }
            ].map((stepItem, idx) => {
              const isCurrent = currentStep === idx + 1;
              const isDone = currentStep > idx + 1 || stepItem.done;
              const nodeBgColor = isDone ? '#10B981' : isCurrent ? stepItem.color : '#E7E5E4';
              const nodeBorderColor = isDone ? '#059669' : isCurrent ? stepItem.color : '#78716C';
              const iconColor = isCurrent || isDone ? AppTheme.colors.white : '#78716C';

              return (
                <React.Fragment key={idx}>
                  <View style={styles.progressNodeWrapper}>
                    <TouchableOpacity
                      disabled={idx + 1 > currentStep && !(idx === 1 && step1Done) && !(idx === 2 && step2Done)}
                      onPress={() => setCurrentStep(idx + 1)}
                      style={[
                        styles.progressNode,
                        {
                          backgroundColor: nodeBgColor,
                          borderColor: nodeBorderColor,
                        }
                      ]}
                    >
                      {isDone ? (
                        <Check color={AppTheme.colors.white} size={14} />
                      ) : (
                        stepItem.icon(iconColor, 14)
                      )}
                    </TouchableOpacity>
                    <Text style={[styles.progressNodeLabel, isCurrent && styles.progressNodeLabelCurrent]}>
                      {stepItem.label}
                    </Text>
                  </View>
                  {idx < 3 && (
                    <View style={[styles.progressLine, currentStep > idx + 1 && styles.progressLineActive]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>
      )}

      {isLoadingProducts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.accentYellow} />
          <Text style={styles.loadingText}>Đang khởi tạo linh hồn vũ trụ...</Text>
        </View>
      ) : (
        <ScrollView ref={scrollRef} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* ═══ HERO SECTION ═══ — Dark cosmic banner */}
          <View style={styles.heroSection}>
            <ImageBackground
              source={{ uri: 'https://youniverse.io.vn/images/home-banner-space.gif' }}
              style={styles.heroBg}
              resizeMode="cover"
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Cùng tạo nên vũ trụ của riêng bạn</Text>
                <Text style={styles.heroSubtitle}>
                  Khám phá và kết nối tần số tâm hồn thông qua chiếc móc khóa độc bản "Youniverse"
                </Text>

                {/* Charm Preview row */}
                <View style={styles.heroPreviewRow}>
                  <View style={styles.heroPreviewCard}>
                    <Image source={{ uri: 'https://youniverse.io.vn/images/system-star.png' }} style={styles.heroPreviewImg} />
                  </View>
                  <View style={[styles.heroPreviewCard, styles.heroPreviewCardCenter]}>
                    <Image source={{ uri: 'https://youniverse.io.vn/images/sirius-boba.png' }} style={styles.heroPreviewImg} />
                  </View>
                  <View style={styles.heroPreviewCard}>
                    <Image source={{ uri: 'https://youniverse.io.vn/images/charm-stock-3.png' }} style={styles.heroPreviewImg} />
                  </View>
                </View>

                {/* Caption info */}
                <View style={styles.heroCaptionBox}>
                  <Text style={styles.heroCaptionTitle}>✨ MẢNH GHÉP THỰC TẾ</Text>
                  <Text style={styles.heroCaptionText}>
                    Ảnh chụp thực tế cách 3 mảnh ghép (Astra + Sirius + Quote) được xâu chuỗi tỉ mỉ. Vũ trụ của bạn cũng sẽ được hoàn thiện với kết cấu đồng bộ như thế này!
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* STEP 1: ASTRA */}
          {currentStep === 1 && (
            <View style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Sparkles color={AppTheme.colors.white} size={14} />
                <Text style={styles.stepBadgeText}>Bước 1 — Chọn Hệ Của Bạn</Text>
              </View>

              <Text style={styles.stepTitle}>Hệ Năng Lượng Thiên Hà</Text>
              <Text style={styles.stepDesc}>
                Mỗi thực thể trong không gian đều mang một tần số năng lượng riêng biệt. Bạn đang thuộc về hệ nào trong YOUniverse?
              </Text>

              {/* Astra Cards */}
              <View style={styles.astraGrid}>
                {ASTRA_SYSTEMS.map((sys) => {
                  const isSelected = astraSystem === sys.id;
                  return (
                    <TouchableOpacity
                      key={sys.id}
                      onPress={() => { setAstraSystem(sys.id); setEngraveChoice(null); setNickname(''); }}
                      style={[styles.astraCard, isSelected && styles.astraCardSelected]}
                    >
                      <Image source={{ uri: sys.image }} style={styles.astraCardImg as any} resizeMode="cover" />
                      <Text style={styles.astraCardTitle}>{sys.emoji} {sys.nameVi}</Text>
                      <Text style={styles.astraCardDesc}>{sys.descVi}</Text>
                      {isSelected && (
                        <View style={styles.selectedTick}>
                          <Check color={AppTheme.colors.white} size={10} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Engraving choice */}
              {astraSystem && (
                <View style={styles.engraveSection}>
                  <View style={styles.divider} />
                  <Text style={styles.sectionSubtitle}>Bạn có muốn khắc tên riêng lên hành tinh này không?</Text>

                  {/* Comparison preview of charm engraving */}
                  <View style={styles.compareContainer}>
                    <View style={styles.compareBox}>
                      <View style={styles.compareImgWrapper}>
                        {selectedAstra?.image ? (
                          <Image source={{ uri: selectedAstra.image }} style={styles.compareImg as any} resizeMode="cover" />
                        ) : null}
                      </View>
                      <Text style={styles.compareLabel}>NGUYÊN BẢN</Text>
                    </View>

                    <View style={styles.compareBox}>
                      <View style={[styles.compareImgWrapper, styles.compareImgWrapperActive]}>
                        {selectedAstra?.image ? (
                          <Image source={{ uri: selectedAstra.image }} style={styles.compareImg as any} resizeMode="cover" />
                        ) : null}
                        <View style={styles.engraveTextOverlay}>
                          <Text style={styles.engraveTextContent}>
                            {nickname || 'NAME'}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.compareLabel, styles.compareLabelActive]}>SAU KHI KHẮC</Text>
                    </View>
                  </View>
                  
                  <View style={styles.engraveBtnsRow}>
                    <TouchableOpacity
                      style={[styles.engraveChoiceBtn, engraveChoice === 'engrave' && styles.engraveChoiceBtnActive]}
                      onPress={() => setEngraveChoice('engrave')}
                    >
                      <Text style={[styles.engraveChoiceBtnText, engraveChoice === 'engrave' && styles.engraveChoiceBtnTextActive]}>
                        ✨ Khắc dấu ấn riêng
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.engraveChoiceBtn, engraveChoice === 'original' && styles.engraveChoiceBtnActive]}
                      onPress={() => { setEngraveChoice('original'); setNickname(''); }}
                    >
                      <Text style={[styles.engraveChoiceBtnText, engraveChoice === 'original' && styles.engraveChoiceBtnTextActive]}>
                        Giữ nét nguyên bản
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Nickname input */}
                  {engraveChoice === 'engrave' && (
                    <View style={styles.nicknameInputContainer}>
                      <TextInput
                        style={styles.nicknameInput}
                        placeholder="Để lại dấu ấn (Tối đa 4 ký tự)..."
                        maxLength={4}
                        value={nickname}
                        onChangeText={setNickname}
                      />
                      <Text style={styles.charCount}>{nickname.length}/4 ký tự</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Next Button */}
              {step1Done && (
                <TouchableOpacity style={styles.nextStepBtn} onPress={() => handleNextStep(2)}>
                  <Text style={styles.nextStepBtnText}>Tiếp Tục Hành Trình</Text>
                  <ChevronRight color={AppTheme.colors.white} size={16} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* STEP 2: SIRIUS */}
          {currentStep === 2 && (
            <View style={styles.stepCard}>
              <View style={[styles.stepBadge, { backgroundColor: AppTheme.colors.accentYellow }]}>
                <Heart color={AppTheme.colors.primaryGreen} size={14} />
                <Text style={[styles.stepBadgeText, { color: AppTheme.colors.primaryGreen }]}>Bước 2 — Chọn Sirius</Text>
              </View>

              <Text style={styles.stepTitle}>Chọn Bạn Đồng Hành</Text>
              <Text style={styles.stepDesc}>
                Hành tinh của bạn sẽ thật cô đơn nếu thiếu đi những niềm vui nhỏ bé mỗi ngày. Charm Sirius chính là nơi lưu giữ những sở thích của bạn.
              </Text>

              {/* Category picker */}
              <View style={styles.categoryPickerRow}>
                <TouchableOpacity
                  style={[styles.categoryCardBtn, siriusCategory === 'pet' && styles.categoryCardBtnActive]}
                  onPress={() => { setSiriusCategory('pet'); setSiriusCharm(null); setSiriusConfirmed(false); }}
                >
                  <Text style={styles.categoryCardEmoji}>🐾</Text>
                  <Text style={[styles.categoryCardTitle, siriusCategory === 'pet' && styles.categoryCardTitleActive]}>
                    Bạn bốn chân (Pet)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.categoryCardBtn, siriusCategory === 'drink' && styles.categoryCardBtnActive]}
                  onPress={() => { setSiriusCategory('drink'); setSiriusCharm(null); setSiriusConfirmed(false); }}
                >
                  <Text style={styles.categoryCardEmoji}>🥤</Text>
                  <Text style={[styles.categoryCardTitle, siriusCategory === 'drink' && styles.categoryCardTitleActive]}>
                    Năng lượng (Drink)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Charms Grid */}
              {siriusCategory && (
                <View style={styles.charmsContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.sectionSubtitle}>Các mẫu charm sẵn có:</Text>
                  
                  <View style={styles.charmsGrid}>
                    {SIRIUS_CHARMS.filter(c => c.category === siriusCategory).map((c) => {
                      const isSelected = siriusCharm === c.id;
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={[styles.charmCard, isSelected && styles.charmCardSelected]}
                          onPress={() => { setSiriusCharm(c.id); setSiriusConfirmed(true); }}
                        >
                          <Image source={{ uri: c.image }} style={styles.charmCardImg as any} resizeMode="cover" />
                          <View style={styles.charmInfoRow}>
                            <Text style={styles.charmCardTitle}>{c.emoji} {c.nameVi}</Text>
                            {isSelected && (
                              <View style={[styles.selectedTick, { backgroundColor: '#10B981', borderColor: '#10B981' }]}>
                                <Check color={AppTheme.colors.white} size={8} />
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Next step CTA */}
              {step2Done && (
                <TouchableOpacity style={styles.nextStepBtn} onPress={() => handleNextStep(3)}>
                  <Text style={styles.nextStepBtnText}>Đi Đến Bước Cuối</Text>
                  <ChevronRight color={AppTheme.colors.white} size={16} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* STEP 3: POLARIS */}
          {currentStep === 3 && (
            <View style={styles.stepCard}>
              <View style={[styles.stepBadge, { backgroundColor: AppTheme.colors.red }]}>
                <Compass color={AppTheme.colors.white} size={14} />
                <Text style={styles.stepBadgeText}>Bước 3 — Lời Tuyên Ngôn</Text>
              </View>

              <Text style={styles.stepTitle}>Thông Điệp Cuối Cùng</Text>
              <Text style={styles.stepDesc}>
                Một vũ trụ hoàn chỉnh cần một lời tuyên ngôn. Câu nói nào có thể đại diện cho triết lý sống hoặc tiếng lòng hiện tại của bạn?
              </Text>

              {/* Polaris Tab Buttons */}
              <View style={styles.tabContainer}>
                {[
                  { id: 'preset', label: 'Ý nghĩa thiên hà' },
                  { id: 'custom', label: 'Tự viết Quote' },
                  { id: 'swap', label: 'Đổi lấy charm Sirius' }
                ].map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.tabBtn, polarisTab === t.id && styles.tabBtnActive]}
                    onPress={() => {
                      setPolarisTab(t.id as any);
                      setPolarisPresetId(null);
                      setPolarisCustomText('');
                      setPolarisCustomSealed(false);
                      setPolarisSwapCharm(null);
                    }}
                  >
                    <Text style={[styles.tabBtnText, polarisTab === t.id && styles.tabBtnTextActive]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tab Preset list */}
              {polarisTab === 'preset' && (
                <View style={styles.quotesPresetContainer}>
                  {POLARIS_QUOTES.map((q) => {
                    const isSelected = polarisPresetId === q.id;
                    return (
                      <TouchableOpacity
                        key={q.id}
                        style={[styles.quotePresetCard, isSelected && styles.quotePresetCardActive]}
                        onPress={() => setPolarisPresetId(q.id)}
                      >
                        <View style={styles.quoteRow}>
                          <Text style={styles.quoteEmoji}>✨</Text>
                          <View style={styles.quoteTextCol}>
                            <Text style={styles.quoteTitleVi}>{q.textVi}</Text>
                            <Text style={styles.quoteTitleEn}>"{q.textEn}"</Text>
                          </View>
                        </View>
                        {isSelected && (
                          <View style={[styles.selectedTick, { backgroundColor: AppTheme.colors.accentYellow }]}>
                            <Check color={AppTheme.colors.white} size={10} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Tab Custom Input */}
              {polarisTab === 'custom' && (
                <View style={styles.customQuoteContainer}>
                  <Text style={styles.sectionSubtitle}>Nhập thông điệp cá nhân hóa của bạn (Tối đa 15 ký tự):</Text>
                  <TextInput
                    style={styles.customQuoteInput}
                    placeholder="Gửi vào không gian thông điệp của bạn..."
                    maxLength={15}
                    value={polarisCustomText}
                    onChangeText={(val) => { setPolarisCustomText(val); setPolarisCustomSealed(false); }}
                  />
                  <Text style={styles.charCount}>{polarisCustomText.length}/15 ký tự</Text>

                  {polarisCustomText.trim().length > 0 && (
                    <TouchableOpacity
                      style={[styles.sealBtn, polarisCustomSealed && styles.sealBtnActive]}
                      onPress={() => setPolarisCustomSealed(!polarisCustomSealed)}
                    >
                      <Check color={polarisCustomSealed ? AppTheme.colors.white : AppTheme.colors.primaryGreen} size={16} />
                      <Text style={[styles.sealBtnText, polarisCustomSealed && styles.sealBtnTextActive]}>
                        {polarisCustomSealed ? 'Đã ni phong thông điệp' : 'Ni phong thông điệp'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {polarisCustomSealed && polarisCustomText.trim().length > 0 && (
                    <View style={styles.sealedPreviewCard}>
                      <Check color="#059669" size={18} style={{ marginBottom: 4 }} />
                      <Text style={styles.sealedPreviewText}>“ {polarisCustomText} ”</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Tab Swap Sirius charm */}
              {polarisTab === 'swap' && (
                <View style={styles.swapCharmContainer}>
                  <Text style={styles.stepDesc}>
                    Bạn muốn thể hiện bằng hình ảnh hơn từ ngữ? Hãy lấp đầy móc khóa bằng một hình vẽ Sirius khác!
                  </Text>
                  
                  <View style={styles.charmsGrid}>
                    {SIRIUS_CHARMS.filter(c => c.id !== siriusCharm).map((c) => {
                      const isSelected = polarisSwapCharm === c.id;
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={[styles.charmCard, isSelected && styles.charmCardSelected]}
                          onPress={() => setPolarisSwapCharm(c.id)}
                        >
                          <Image source={{ uri: c.image }} style={styles.charmCardImg as any} resizeMode="cover" />
                          <View style={styles.charmInfoRow}>
                            <Text style={styles.charmCardTitle}>{c.emoji} {c.nameVi}</Text>
                            {isSelected && (
                              <View style={[styles.selectedTick, { backgroundColor: AppTheme.colors.red, borderColor: AppTheme.colors.red }]}>
                                <Check color={AppTheme.colors.white} size={8} />
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Next step CTA */}
              {step3Done && (
                <TouchableOpacity style={styles.nextStepBtn} onPress={() => handleNextStep(4)}>
                  <Text style={styles.nextStepBtnText}>Giao Diện Hóa Đơn</Text>
                  <ChevronRight color={AppTheme.colors.white} size={16} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* STEP 4: INVOICE & CHECKOUT */}
          {currentStep === 4 && (
            <View style={styles.stepCard}>
              <View style={[styles.stepBadge, { backgroundColor: '#10B981' }]}>
                <ShoppingBag color={AppTheme.colors.white} size={14} />
                <Text style={styles.stepBadgeText}>Bước 4 — Cấu Hình Đơn Hàng</Text>
              </View>

              <Text style={styles.stepTitle}>Hóa Đơn Chế Tác</Text>

              {/* Configuration summary details */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxTitle}>Cấu hình vũ trụ đã chọn:</Text>
                
                {/* Astra details */}
                <View style={styles.summaryItemRow}>
                  <Text style={styles.summaryItemLabel}>• Astra (Bản ngã):</Text>
                  <Text style={styles.summaryItemVal}>
                    {selectedAstra?.nameVi} {engraveChoice === 'engrave' ? `(Khắc: ${nickname})` : '(Bản gốc)'}
                  </Text>
                </View>

                {/* Sirius details */}
                <View style={styles.summaryItemRow}>
                  <Text style={styles.summaryItemLabel}>• Sirius (Sở thích):</Text>
                  <Text style={styles.summaryItemVal}>{selectedSirius?.nameVi}</Text>
                </View>

                {/* Polaris details */}
                <View style={styles.summaryItemRow}>
                  <Text style={styles.summaryItemLabel}>• Polaris (Thông điệp):</Text>
                  <Text style={styles.summaryItemVal}>
                    {polarisTab === 'preset' && `Mẫu Quote "${POLARIS_QUOTES.find(q=>q.id===polarisPresetId)?.textVi}"`}
                    {polarisTab === 'custom' && `Tự viết: "${polarisCustomText}"`}
                    {polarisTab === 'swap' && `Đổi lấy charm: ${SIRIUS_CHARMS.find(c=>c.id===polarisSwapCharm)?.nameVi}`}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                {/* Price block */}
                <View style={styles.summaryItemRow}>
                  <Text style={styles.priceLabel}>Giá chế tác trọn gói:</Text>
                  <Text style={styles.priceVal}>{formatMoney(totalPrice)}</Text>
                </View>
              </View>

              {/* Shipping and customer Form */}
              <View style={styles.checkoutForm}>
                <Text style={styles.formSectionTitle}>Thông tin nhận hàng</Text>
                
                <Text style={styles.label}>Họ và tên người nhận *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Họ tên người nhận..."
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text style={styles.label}>Số điện thoại liên hệ *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Số điện thoại liên hệ..."
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />

                <Text style={styles.label}>Địa chỉ email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email nhận thông tin đơn..."
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                {/* Shipping method */}
                <Text style={styles.label}>Phương thức nhận hàng *</Text>
                <View style={styles.shippingMethodRow}>
                  <TouchableOpacity
                    style={[styles.shippingBtn, shippingMethod === 'UEH' && styles.shippingBtnActive]}
                    onPress={() => setShippingMethod('UEH')}
                  >
                    <Text style={[styles.shippingBtnText, shippingMethod === 'UEH' && styles.shippingBtnTextActive]}>
                      Lấy tại Cơ sở B UEH
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.shippingBtn, shippingMethod === 'OTHER' && styles.shippingBtnActive]}
                    onPress={() => setShippingMethod('OTHER')}
                  >
                    <Text style={[styles.shippingBtnText, shippingMethod === 'OTHER' && styles.shippingBtnTextActive]}>
                      Giao hàng tận nơi
                    </Text>
                  </TouchableOpacity>
                </View>

                {shippingMethod === 'OTHER' && (
                  <View>
                    <Text style={styles.label}>Địa chỉ giao hàng cụ thể *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Số nhà, tên đường, phường, quận, thành phố..."
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>
                )}

                <Text style={styles.label}>Ghi chú đơn hàng</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ghi chú thêm cho người chế tác..."
                  multiline
                  numberOfLines={2}
                  value={note}
                  onChangeText={setNote}
                />

                {/* Payment selection */}
                <Text style={styles.formSectionTitle}>Phương thức thanh toán</Text>
                <View style={styles.shippingMethodRow}>
                  <TouchableOpacity
                    style={[styles.shippingBtn, paymentProvider === 'BANK_TRANSFER' && styles.shippingBtnActive]}
                    onPress={() => setPaymentProvider('BANK_TRANSFER')}
                  >
                    <Text style={[styles.shippingBtnText, paymentProvider === 'BANK_TRANSFER' && styles.shippingBtnTextActive]}>
                      Chuyển khoản QR
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.shippingBtn, paymentProvider === 'COD' && styles.shippingBtnActive]}
                    onPress={() => setPaymentProvider('COD')}
                  >
                    <Text style={[styles.shippingBtnText, paymentProvider === 'COD' && styles.shippingBtnTextActive]}>
                      COD khi nhận hàng
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* QR details */}
                {paymentProvider === 'BANK_TRANSFER' && (
                  <View style={styles.bankBox}>
                    <Landmark color={AppTheme.colors.primaryGreen} size={30} style={styles.bankIcon} />
                    <Text style={styles.bankTitle}>Quét QR Chuyển Khoản Ngân Hàng</Text>
                    
                    {/* Mock QR image */}
                    <View style={styles.qrContainer}>
                      <Image 
                        source={{ uri: 'https://img.vietqr.io/image/mbbank-123456789-compact2.png?amount=' + totalPrice + '&addInfo=YOUniverse%20Mobile' }} 
                        style={styles.qrImg as any} 
                        resizeMode="contain" 
                      />
                    </View>

                    <Text style={styles.bankInfoText}>
                      • Tên tài khoản: YOUNIVERSE GROUP 3{"\n"}
                      • Số tài khoản: 123456789 - MB Bank{"\n"}
                      • Số tiền: {formatMoney(totalPrice)}
                    </Text>
                    <View style={styles.alertBox}>
                      <Info color="#B45309" size={14} />
                      <Text style={styles.alertText}>
                        Vui lòng chụp ảnh màn hình chuyển khoản thành công. Sau khi ấn Đặt Hàng, đại diện ISB Event Team sẽ liên hệ xác nhận qua Zalo/Email.
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Submit Action */}
              <TouchableOpacity
                style={[styles.orderBtn, isSubmitting && styles.orderBtnDisabled]}
                onPress={handleConfirmOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={AppTheme.colors.white} size="small" />
                ) : (
                  <Text style={styles.orderBtnText}>XÁC NHẬN ĐẶT HÀNG</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      )}

      {/* STEP 5: SUCCESS MODAL */}
      <Modal
        visible={currentStep === 5}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>✨🪐</Text>
            <Text style={styles.modalTitle}>Vũ Trụ Đã Khởi Tạo!</Text>
            <Text style={styles.modalDesc}>
              Đơn hàng chế tác cá nhân hóa YOUniverse của bạn đã được khởi tạo thành công trên hệ thống.
            </Text>
            
            {createdOrderCode && (
              <View style={styles.orderCodeBox}>
                <Text style={styles.orderCodeLabel}>Mã đơn hàng của bạn:</Text>
                <Text style={styles.orderCodeVal}>{createdOrderCode}</Text>
              </View>
            )}

            <Text style={styles.modalSubDesc}>
              Đây là sản phẩm thủ công tinh xảo do các nghệ nhân sinh viên UEH.ISB tỉ mỉ ghép nối. Chúng mình sẽ liên hệ với bạn trong thời gian sớm nhất để hoàn tất thiết kế vật lý.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setCurrentStep(1);
                setAstraSystem(null);
                setEngraveChoice(null);
                setNickname('');
                setSiriusCategory(null);
                setSiriusCharm(null);
                setSiriusConfirmed(false);
                setPolarisPresetId(null);
                setPolarisCustomText('');
                setPolarisCustomSealed(false);
                setPolarisSwapCharm(null);
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.modalBtnText}>Quay Về Trang Chủ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // stone-50
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#1C1917', // Dark cosmic theme matching home screen header
    borderBottomWidth: 1,
    borderBottomColor: '#2D2A26',
  },
  logoImage: {
    width: 140,
    height: 70, // perfect 2:1 aspect ratio to avoid squishing
  },
  heroSection: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#292524',
    backgroundColor: '#000000',
  },
  heroBg: {
    width: '100%',
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 11,
    color: '#D6D3D1',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  heroPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 18,
  },
  heroPreviewCard: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#44403C',
    overflow: 'hidden',
    backgroundColor: '#1C1917',
  },
  heroPreviewCardCenter: {
    width: 76,
    height: 76,
    borderRadius: 16,
    borderColor: AppTheme.colors.accentYellow,
    shadowColor: AppTheme.colors.accentYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  heroPreviewImg: {
    width: '100%',
    height: '100%',
  },
  heroCaptionBox: {
    marginTop: 4,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  heroCaptionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: AppTheme.colors.accentYellow,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroCaptionText: {
    fontSize: 10,
    color: '#A8A29E',
    textAlign: 'center',
    lineHeight: 14,
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
  progressContainer: {
    backgroundColor: AppTheme.colors.white,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  progressStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressNodeWrapper: {
    alignItems: 'center',
    width: 60,
  },
  progressNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E7E5E4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#78716C',
  },
  progressNodeCurrent: {
    backgroundColor: AppTheme.colors.accentYellow,
    borderColor: AppTheme.colors.accentYellow,
  },
  progressNodeDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  progressNodeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78716C',
  },
  progressNodeTextCurrent: {
    color: AppTheme.colors.white,
  },
  progressNodeLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#78716C',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  progressNodeLabelCurrent: {
    color: AppTheme.colors.darkText,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E7E5E4',
    marginBottom: 12,
  },
  progressLineActive: {
    backgroundColor: '#10B981',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stepCard: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  stepBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: AppTheme.colors.white,
    textTransform: 'uppercase',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: AppTheme.colors.darkText,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 20,
  },
  astraGrid: {
    gap: 12,
  },
  astraCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.white,
    padding: 16,
    position: 'relative',
  },
  astraCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.03)',
  },
  astraCardImg: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  astraCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 4,
  },
  astraCardDesc: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    lineHeight: 16,
  },
  selectedTick: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  engraveSection: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 12,
  },
  engraveBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  engraveChoiceBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.white,
    alignItems: 'center',
  },
  engraveChoiceBtnActive: {
    borderColor: AppTheme.colors.primaryGreen,
    backgroundColor: 'rgba(28, 25, 23, 0.03)',
  },
  engraveChoiceBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.textMuted,
  },
  engraveChoiceBtnTextActive: {
    color: AppTheme.colors.primaryGreen,
  },
  nicknameInputContainer: {
    backgroundColor: AppTheme.colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 12,
    alignItems: 'center',
  },
  nicknameInput: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    textAlign: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  charCount: {
    fontSize: 10,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  nextStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 14,
    marginTop: 24,
  },
  nextStepBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.white,
    marginRight: 6,
    letterSpacing: 0.5,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  categoryCardBtn: {
    flex: 1,
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  categoryCardBtnActive: {
    borderColor: AppTheme.colors.accentYellow,
    backgroundColor: 'rgba(230, 179, 8, 0.03)',
  },
  categoryCardEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
  },
  categoryCardTitleActive: {
    color: AppTheme.colors.darkText,
  },
  charmsContainer: {
    marginTop: 12,
  },
  charmsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  charmCard: {
    width: '48%',
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  charmCardSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  charmCardImg: {
    width: '100%',
    height: 110,
  },
  charmInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  charmCardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.backgroundLight,
    borderRadius: 100,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 100,
  },
  tabBtnActive: {
    backgroundColor: AppTheme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.textMuted,
  },
  tabBtnTextActive: {
    color: AppTheme.colors.darkText,
  },
  quotesPresetContainer: {
    gap: 10,
  },
  quotePresetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: AppTheme.colors.white,
  },
  quotePresetCardActive: {
    borderColor: AppTheme.colors.accentYellow,
    backgroundColor: 'rgba(230, 179, 8, 0.03)',
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quoteEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  quoteTextCol: {
    flex: 1,
  },
  quoteTitleVi: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  quoteTitleEn: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  customQuoteContainer: {
    backgroundColor: AppTheme.colors.backgroundLight,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  customQuoteInput: {
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: AppTheme.colors.darkText,
    marginTop: 8,
  },
  sealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 100,
    paddingVertical: 10,
    marginTop: 16,
  },
  sealBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  sealBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginLeft: 6,
  },
  sealBtnTextActive: {
    color: AppTheme.colors.white,
  },
  swapCharmContainer: {
    marginTop: 8,
  },
  summaryBox: {
    backgroundColor: 'rgba(28, 25, 23, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 20,
  },
  summaryBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 10,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
  },
  summaryItemVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: AppTheme.colors.accentYellow,
  },
  checkoutForm: {
    marginTop: 10,
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: AppTheme.colors.primaryGreen,
    marginBottom: 14,
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 6,
  },
  input: {
    backgroundColor: AppTheme.colors.white,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: AppTheme.colors.darkText,
    marginBottom: 16,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  shippingMethodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  shippingBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.white,
    alignItems: 'center',
  },
  shippingBtnActive: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderColor: AppTheme.colors.primaryGreen,
  },
  shippingBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: AppTheme.colors.textMuted,
  },
  shippingBtnTextActive: {
    color: AppTheme.colors.white,
  },
  bankBox: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  bankIcon: {
    marginBottom: 8,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 12,
  },
  qrContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 12,
  },
  qrImg: {
    width: '100%',
    height: '100%',
  },
  bankInfoText: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(230, 179, 8, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(230, 179, 8, 0.15)',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 10,
    color: '#B45309',
    lineHeight: 14,
  },
  orderBtn: {
    backgroundColor: AppTheme.colors.accentYellow,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: AppTheme.colors.accentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  orderBtnDisabled: {
    backgroundColor: AppTheme.colors.lightGray,
  },
  orderBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.white,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppTheme.colors.darkText,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  orderCodeBox: {
    backgroundColor: 'rgba(230, 179, 8, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(230, 179, 8, 0.15)',
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  orderCodeLabel: {
    fontSize: 9,
    color: '#B45309',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderCodeVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppTheme.colors.accentYellow,
    marginTop: 2,
  },
  modalSubDesc: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: AppTheme.colors.primaryGreen,
    borderRadius: 100,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: AppTheme.colors.white,
  },
  /* Customizer comparison and seal cards */
  compareContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 14,
  },
  compareBox: {
    alignItems: 'center',
    width: 110,
  },
  compareImgWrapper: {
    width: 100,
    height: 100,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E7E5E4',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FAF9F6',
  },
  compareImgWrapperActive: {
    borderColor: AppTheme.colors.primaryGreen,
    shadowColor: AppTheme.colors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  compareImg: {
    width: '100%',
    height: '100%',
  },
  engraveTextOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
  },
  engraveTextContent: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  compareLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#78716C',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  compareLabelActive: {
    color: AppTheme.colors.primaryGreen,
  },
  sealedPreviewCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  sealedPreviewText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#047857',
  },
});
