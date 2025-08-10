import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import styles from '@/styles/NoticeEventFAQScreen.styles';
import nightBg from '@/assets/images/background/night-bg.png';
import BackButton from '@/components/ui/BackButton';
import { getNotices, getOngoingEvents, getPastEvents, type Notice, type Event } from '@/shared/api';

const TABS = [
  { key: 'notice', label: '공지사항', iconName: 'notifications-outline' as const },
  { key: 'event', label: '이벤트', iconName: 'gift-outline' as const },
  { key: 'faq', label: 'FAQ', iconName: 'help-circle-outline' as const },
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

/**
 * 공지사항, 이벤트, FAQ 화면
 *
 * 공지사항과 이벤트는 실제 API에서 데이터를 가져오며,
 * FAQ는 현재 더미 데이터를 사용합니다.
 */
const NoticeEventFAQScreen = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // API 데이터 로드 함수들
  const loadNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices();
      setNotices(response.data);
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      Alert.alert('오류', '공지사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [ongoingResponse, pastResponse] = await Promise.all([
        getOngoingEvents(),
        getPastEvents(),
      ]);
      console.log('진행중인 이벤트:', ongoingResponse.data);
      console.log('지난 이벤트:', pastResponse.data);

      // 서버 응답을 클라이언트 타입에 맞게 변환
      const convertEventData = (events: any[]) => {
        return events.map((event) => ({
          ...event,
          isOngoing: event.ongoing || false, // ongoing -> isOngoing으로 변환
        }));
      };

      setOngoingEvents(convertEventData(ongoingResponse.data));
      setPastEvents(convertEventData(pastResponse.data));
    } catch (error) {
      console.error('이벤트 로드 실패:', error);
      Alert.alert('오류', '이벤트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (activeTab === 'notice') {
      loadNotices();
    } else if (activeTab === 'event') {
      loadEvents();
    }
  }, [activeTab]);

  const getTabData = () => {
    switch (activeTab) {
      case 'notice':
        return notices;
      case 'event':
        return [...ongoingEvents, ...pastEvents];
      case 'faq':
        return DUMMY_FAQS;
      default:
        return [];
    }
  };

  const renderItem = ({ item }: { item: Notice | Event | any }) => {
    if (activeTab === 'notice') {
      const notice = item as Notice;
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{notice.title}</Text>
            {notice.importance === 'HIGH' && (
              <View style={styles.importantBadge}>
                <Text style={styles.importantText}>중요</Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</Text>
          <Text style={styles.content} numberOfLines={3}>
            {notice.content}
          </Text>
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => router.push(`/(main)/notice-event-faq/notice-detail?id=${notice.id}`)}
          >
            <Text style={styles.readMoreText}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === 'event') {
      const event = item as Event;
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={[styles.statusBadge, event.isOngoing && styles.activeBadge]}>
              <Text style={[styles.statusText, event.isOngoing && styles.activeStatusText]}>
                {event.isOngoing ? '진행중' : '종료'}
              </Text>
            </View>
          </View>
          <Text style={styles.date}>{event.eventPeriod}</Text>
          <Text style={styles.content} numberOfLines={3}>
            {event.summary}
          </Text>
          <TouchableOpacity
            style={[styles.readMoreBtn, !event.isOngoing && styles.disabledBtn]}
            onPress={() =>
              event.isOngoing && router.push(`/(main)/notice-event-faq/event-detail?id=${event.id}`)
            }
          >
            <Text style={[styles.readMoreText, !event.isOngoing && styles.disabledText]}>
              {event.isOngoing ? '참여하기' : '종료됨'}
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
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => Alert.alert('FAQ', item.answer)}
          >
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
          </View>
        ) : (
          <FlatList
            data={getTabData()}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              getTabData().length === 0 ? styles.emptyCardList : styles.cardList
            }
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {activeTab === 'notice'
                    ? '공지사항이 없습니다.'
                    : activeTab === 'event'
                      ? '이벤트가 없습니다.'
                      : 'FAQ가 없습니다.'}
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NoticeEventFAQScreen;
