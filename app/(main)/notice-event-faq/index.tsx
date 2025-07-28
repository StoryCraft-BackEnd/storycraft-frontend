import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import styles from '@/styles/NoticeEventFAQScreen.styles';
import nightBg from '@/assets/images/background/night-bg.png';
import BackButton from '@/components/ui/BackButton';

const TABS = [
  { key: 'notice', label: '공지사항', iconName: 'notifications-outline' as const },
  { key: 'event', label: '이벤트', iconName: 'gift-outline' as const },
  { key: 'faq', label: 'FAQ', iconName: 'help-circle-outline' as const },
];

const DUMMY_NOTICES = [
  {
    id: '1',
    title: 'StoryCraft 앱 업데이트 안내',
    date: '2024-01-15',
    content:
      '새로운 기능이 추가되었습니다. 더 나은 학습 경험을 제공하기 위해 지속적으로 개선하고 있습니다.',
    isImportant: true,
  },
  {
    id: '2',
    title: '서버 점검 안내',
    date: '2024-01-14',
    content: '2024년 1월 20일 새벽 2시부터 4시까지 서버 점검이 예정되어 있습니다.',
    isImportant: false,
  },
  {
    id: '3',
    title: '개인정보 처리방침 개정',
    date: '2024-01-13',
    content: '개인정보 처리방침이 개정되었습니다. 자세한 내용은 설정에서 확인하실 수 있습니다.',
    isImportant: true,
  },
];

const DUMMY_EVENTS = [
  {
    id: '1',
    title: '겨울방학 특별 이벤트',
    date: '2024-01-15',
    content:
      '겨울방학을 맞아 특별한 동화 만들기 이벤트를 진행합니다. 참여하시면 특별한 보상을 받으실 수 있습니다.',
    isActive: true,
  },
  {
    id: '2',
    title: '신규 사용자 환영 이벤트',
    date: '2024-01-14',
    content: '새로 가입하신 분들을 위한 특별한 환영 이벤트입니다. 첫 동화를 만들어보세요!',
    isActive: true,
  },
  {
    id: '3',
    title: '크리스마스 특별 이벤트',
    date: '2024-01-13',
    content: '크리스마스 테마의 동화를 만들어보세요. 특별한 크리스마스 선물을 드립니다.',
    isActive: false,
  },
];

const DUMMY_FAQS = [
  {
    id: '1',
    question: '동화는 어떻게 만들 수 있나요?',
    answer: '동화 만들기 버튼을 클릭하시면 AI가 도와주는 동화 생성 기능을 이용하실 수 있습니다.',
    category: '사용법',
  },
  {
    id: '2',
    question: '동화를 저장할 수 있나요?',
    answer: '네, 만든 동화는 자동으로 저장되며 마이페이지에서 언제든지 확인하실 수 있습니다.',
    category: '저장',
  },
  {
    id: '3',
    question: '구독을 취소하려면 어떻게 해야 하나요?',
    answer: '마이페이지 > 구독/결제에서 구독 취소 버튼을 클릭하시면 됩니다.',
    category: '결제',
  },
];

const NoticeEventFAQScreen = () => {
  const [activeTab, setActiveTab] = useState('notice');

  const getTabData = () => {
    switch (activeTab) {
      case 'notice':
        return DUMMY_NOTICES;
      case 'event':
        return DUMMY_EVENTS;
      case 'faq':
        return DUMMY_FAQS;
      default:
        return [];
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (activeTab === 'notice') {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {item.isImportant && (
              <View style={styles.importantBadge}>
                <Text style={styles.importantText}>중요</Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.content} numberOfLines={3}>
            {item.content}
          </Text>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === 'event') {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.statusBadge, item.isActive && styles.activeBadge]}>
              <Text style={[styles.statusText, item.isActive && styles.activeStatusText]}>
                {item.isActive ? '진행중' : '종료'}
              </Text>
            </View>
          </View>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.content} numberOfLines={3}>
            {item.content}
          </Text>
          <TouchableOpacity style={[styles.readMoreBtn, !item.isActive && styles.disabledBtn]}>
            <Text style={[styles.readMoreText, !item.isActive && styles.disabledText]}>
              {item.isActive ? '참여하기' : '종료됨'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.question}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.content} numberOfLines={3}>
            {item.answer}
          </Text>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.tabRow}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={tab.iconName}
                  size={18}
                  color={isActive ? '#fff' : '#b3b3ff'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={getTabData()}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NoticeEventFAQScreen;
