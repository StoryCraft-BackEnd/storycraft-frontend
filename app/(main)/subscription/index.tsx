import React, { useState } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import nightBg from '../../../assets/images/background/night-bg.png';
import styles from '../../../styles/SubscriptionScreen.styles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    label: '무료',
    price: '0원',
    desc: ['월 5개 동화 생성', '기본 음성 기능'],
  },
  {
    key: 'premium',
    name: 'Premium',
    label: '월 9,900원',
    price: '9,900원',
    desc: ['무제한 동화 생성', '프리미엄 음성 기능', '학습 통계 분석'],
    popular: true,
  },
  {
    key: 'family',
    name: 'Family',
    label: '월 14,900원',
    price: '14,900원',
    desc: ['모든 Premium 기능', '최대 4명까지 이용', '가족 통계 관리'],
  },
];

const PAYMENT_HISTORY = [
  { date: '2024-01-15', plan: 'Premium 플랜', amount: '9,900원', status: '완료' },
  { date: '2023-12-15', plan: 'Premium 플랜', amount: '9,900원', status: '완료' },
  { date: '2023-11-15', plan: 'Premium 플랜', amount: '9,900원', status: '완료' },
];

const NEXT_PAYMENT_DATE = '2024-02-15';

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState('basic');
  const planObj = PLANS.find((p) => p.key === currentPlan);
  const isBasic = currentPlan === 'basic';

  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단: 뒤로가기 + 제목 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8, padding: 4 }}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>구독/결제</Text>
        </View>
        {/* 상단 현재 구독 플랜 정보 */}
        <View style={styles.currentPlanBox}>
          <Text style={styles.currentPlanTitle}>현재 구독 플랜</Text>
          <Text style={styles.currentPlanName}>{planObj?.name}</Text>
          <Text style={styles.currentPlanPrice}>{planObj?.label}</Text>
          {!isBasic && (
            <>
              <Text style={styles.nextPaymentDate}>다음 결제일: {NEXT_PAYMENT_DATE}</Text>
              <View style={styles.currentPlanBtnRow}>
                <TouchableOpacity style={styles.changePlanBtn}>
                  <Text style={styles.changePlanBtnText}>플랜 변경</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>구독 취소</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        {/* 구독 플랜 카드 */}
        <View style={styles.plansRow}>
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.key;
            return (
              <View
                key={plan.key}
                style={[
                  styles.planCard,
                  isCurrent && styles.currentPlanCard,
                  plan.popular && styles.popularPlanCard,
                ]}
              >
                {plan.popular && <Text style={styles.popularBadge}>인기</Text>}
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <View style={styles.planDescBox}>
                  {plan.desc.map((d, i) => (
                    <Text key={i} style={styles.planDesc}>
                      ✓ {d}
                    </Text>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.planButton, isCurrent && styles.currentPlanButton]}
                  disabled={isCurrent}
                  onPress={() => setCurrentPlan(plan.key)}
                >
                  <Text style={[styles.planButtonText, isCurrent && styles.currentPlanButtonText]}>
                    {isCurrent ? '현재 플랜' : plan.key === 'family' ? '업그레이드' : '선택하기'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        {/* 결제 내역 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 내역</Text>
          <FlatList
            data={PAYMENT_HISTORY}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.paymentRow}>
                <View>
                  <Text style={styles.paymentDate}>{item.date}</Text>
                  <Text style={styles.paymentPlan}>{item.plan}</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{item.amount}</Text>
                  <View style={styles.paymentStatusBox}>
                    <Text style={styles.paymentStatus}>{item.status}</Text>
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.allHistoryBtn}>
                <Text style={styles.allHistoryText}>전체 내역 보기</Text>
              </TouchableOpacity>
            }
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
