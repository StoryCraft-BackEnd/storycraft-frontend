import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/shared/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  saveAgreements,
  setCachedTermsAgreement,
  type Agreements,
} from '@/shared/utils/termsUtils';

const TermsAgreementScreen = () => {
  console.log('🎯 TermsAgreementScreen 컴포넌트 마운트');
  console.log('🔍 약관 동의 화면이 렌더링되었습니다');
  console.log('🔍 현재 경로: /(terms-agreement)');

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [agreements, setAgreements] = useState<Agreements>({
    termsOfService: false,
    privacyPolicy: false,
    marketingConsent: false,
  });

  const [allAgreed, setAllAgreed] = useState(false);

  // 전체 동의 상태 업데이트
  const updateAllAgreed = (newAgreements: typeof agreements) => {
    const allChecked = Object.values(newAgreements).every((value) => value);
    setAllAgreed(allChecked);
  };

  // 개별 약관 동의 토글
  const toggleAgreement = (key: keyof typeof agreements) => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };
    setAgreements(newAgreements);
    updateAllAgreed(newAgreements);
  };

  // 전체 동의 토글
  const toggleAllAgreed = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setAgreements({
      termsOfService: newValue,
      privacyPolicy: newValue,
      marketingConsent: newValue,
    });
  };

  // 약관 동의 처리
  const handleAgreement = async () => {
    console.log('🔍 약관 동의 처리 시작...');
    console.log('📋 동의 상태:', agreements);

    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      console.log('❌ 필수 약관 미동의');
      Alert.alert('필수 약관 동의 필요', '서비스 이용약관과 개인정보 처리방침에 동의해주세요.', [
        { text: '확인' },
      ]);
      return;
    }

    try {
      console.log('💾 약관 동의 상태 저장 중...');
      // 약관 동의 상태 저장
      await saveAgreements(agreements);

      // 캐시 업데이트
      setCachedTermsAgreement(true);

      console.log('✅ 약관 동의 완료 - 로그인 화면으로 이동');
      // 약관 동의 완료 후 로그인 화면으로 이동
      router.replace('/(auth)');
    } catch (error) {
      console.error('❌ 약관 동의 저장 중 오류:', error);
      Alert.alert('오류', '약관 동의 처리 중 오류가 발생했습니다.');
    }
  };

  // 약관 링크 열기
  const openTermsLink = (type: 'terms' | 'privacy') => {
    const urls = {
      terms: 'https://storycraft.com/terms',
      privacy: 'https://storycraft.com/privacy',
    };

    Linking.openURL(urls[type]).catch(() => {
      Alert.alert('오류', '약관 페이지를 열 수 없습니다.');
    });
  };

  const Checkbox = ({
    checked,
    onPress,
    label,
    required = false,
    showLink = false,
    linkType,
  }: {
    checked: boolean;
    onPress: () => void;
    label: string;
    required?: boolean;
    showLink?: boolean;
    linkType?: 'terms' | 'privacy';
  }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.checkboxLabel, { color: colors.text }]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {showLink && linkType && (
          <TouchableOpacity onPress={() => openTermsLink(linkType)}>
            <Text style={[styles.termsLink, { color: colors.tint }]}>자세히 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  console.log('🎨 TermsAgreementScreen 렌더링 시작');

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'light' ? '#FFF8F0' : colors.background },
      ]}
    >
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: colors.tint }]}>StoryCraft</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>약관 동의</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          StoryCraft 서비스 이용을 위한 약관에 동의해주세요{'\n'}
          동의 후 로그인 화면으로 이동합니다.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 전체 동의 */}
        <View style={styles.section}>
          <Checkbox checked={allAgreed} onPress={toggleAllAgreed} label="모든 약관에 동의합니다" />
        </View>

        <View style={styles.divider} />

        {/* 개별 약관 동의 */}
        <View style={styles.section}>
          <Checkbox
            checked={agreements.termsOfService}
            onPress={() => toggleAgreement('termsOfService')}
            label="서비스 이용약관"
            required
            showLink
            linkType="terms"
          />

          <Checkbox
            checked={agreements.privacyPolicy}
            onPress={() => toggleAgreement('privacyPolicy')}
            label="개인정보 처리방침"
            required
            showLink
            linkType="privacy"
          />

          <Checkbox
            checked={agreements.marketingConsent}
            onPress={() => toggleAgreement('marketingConsent')}
            label="마케팅 정보 수신 동의 (선택)"
          />
        </View>

        {/* 약관 내용 미리보기 */}
        <View style={styles.termsPreview}>
          <Text style={[styles.termsTitle, { color: colors.text }]}>서비스 이용약관</Text>
          <ScrollView style={styles.termsContent} nestedScrollEnabled>
            <Text style={[styles.termsText, { color: colors.text }]}>
              제1조 (목적){'\n'}이 약관은 StoryCraft(이하 "회사")가 제공하는 영어 학습 서비스의
              이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              {'\n\n'}
              제2조 (정의){'\n'}
              1. "서비스"라 함은 회사가 제공하는 영어 학습 관련 모든 서비스를 의미합니다.{'\n'}
              2. "이용자"라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고
              회사가 제공하는 서비스를 이용하는 고객을 말합니다.
              {'\n\n'}
              제3조 (약관의 효력 및 변경){'\n'}
              1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이
              발생합니다.{'\n'}
              2. 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.
              {'\n\n'}
              제4조 (서비스 이용){'\n'}
              1. 이용자는 서비스 이용 시 관련법령 및 이 약관을 준수해야 합니다.{'\n'}
              2. 이용자는 서비스 이용을 통해 얻은 정보를 상업적 목적으로 사용할 수 없습니다.
              {'\n\n'}
              제5조 (개인정보 보호){'\n'}
              1. 회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를
              준수합니다.{'\n'}
              2. 이용자는 개인정보처리방침에 따라 개인정보 수집, 이용, 제공에 동의합니다.
              {'\n\n'}
              제6조 (서비스 중단){'\n'}
              1. 회사는 시스템 점검, 보수, 교체 등의 사유로 서비스를 일시적으로 중단할 수 있습니다.
              {'\n'}
              2. 회사는 서비스 중단 시 사전에 공지하거나, 긴급한 경우 사후에 공지합니다.
            </Text>
          </ScrollView>
        </View>

        {/* 연령 제한 안내 */}
        <View style={styles.section}>
          <Text style={[styles.ageNotice, { color: colors.icon }]}>
            * 만 14세 미만의 경우 법정대리인의 동의가 필요합니다.
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.agreeButton,
            (!agreements.termsOfService || !agreements.privacyPolicy) && styles.disabledButton,
          ]}
          onPress={handleAgreement}
          disabled={!agreements.termsOfService || !agreements.privacyPolicy}
        >
          <Text style={styles.agreeButtonText}>동의하고 계속하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => {
            Alert.alert('앱 종료', '약관에 동의하지 않으시면 앱을 이용할 수 없습니다.', [
              { text: '취소', style: 'cancel' },
              { text: '종료', style: 'destructive', onPress: () => {} },
            ]);
          }}
        >
          <Text style={[styles.declineButtonText, { color: colors.icon }]}>동의하지 않음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0a7ea4',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  required: {
    color: '#FF3B30',
  },
  termsPreview: {
    marginTop: 20,
    marginBottom: 40,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  termsContent: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  agreeButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  declineButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 14,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
  ageNotice: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
});

export default TermsAgreementScreen;
