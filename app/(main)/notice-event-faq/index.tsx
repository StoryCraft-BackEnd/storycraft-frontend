/**
 * 공지사항, 이벤트, FAQ 화면 컴포넌트
 * 공지사항, 이벤트, FAQ를 탭으로 구분하여 표시하는 화면입니다.
 * 공지사항과 이벤트는 실제 API에서 데이터를 가져오며, FAQ는 현재 더미 데이터를 사용합니다.
 * 각 탭별로 다른 데이터를 표시하고, 상세 보기 기능을 제공합니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
  SafeAreaView, // 안전 영역을 고려한 컨테이너
  ImageBackground, // 배경 이미지가 있는 컨테이너
  FlatList, // 리스트 렌더링 컴포넌트
  Alert, // 알림 팝업 표시용
} from 'react-native';
// 아이콘 라이브러리
import { Ionicons } from '@expo/vector-icons';
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router } from 'expo-router';
// 공지/이벤트/FAQ 화면 전용 스타일
import styles from '@/styles/NoticeEventFAQScreen.styles';
// 배경 이미지 (밤하늘 배경)
import nightBg from '@/assets/images/background/night-bg.png';
// 뒤로가기 버튼 컴포넌트
import BackButton from '@/components/ui/BackButton';
// 공지사항, 이벤트 관련 API 함수들과 타입 정의
import { getNotices, getOngoingEvents, getPastEvents, type Notice, type Event } from '@/shared/api';

// 탭 구성 상수 (공지사항, 이벤트, FAQ)
const TABS = [
  { key: 'notice', label: '공지사항', iconName: 'notifications-outline' as const },
  { key: 'event', label: '이벤트', iconName: 'gift-outline' as const },
  { key: 'faq', label: 'FAQ', iconName: 'help-circle-outline' as const },
];

// FAQ 더미 데이터 (현재는 하드코딩된 데이터 사용)
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
 * 공지사항, 이벤트, FAQ 화면 컴포넌트
 * 탭별로 다른 데이터를 표시하고, 각 항목의 상세 보기 기능을 제공합니다.
 */
const NoticeEventFAQScreen = () => {
  // ===== 상태 변수 정의 =====
  // 활성 탭 상태 (현재 선택된 탭)
  const [activeTab, setActiveTab] = useState('notice');
  // 공지사항 목록 상태 (API에서 받아온 공지사항 데이터)
  const [notices, setNotices] = useState<Notice[]>([]);
  // 진행 중인 이벤트 목록 상태 (API에서 받아온 진행 중인 이벤트 데이터)
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);
  // 지난 이벤트 목록 상태 (API에서 받아온 지난 이벤트 데이터)
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  // 로딩 상태 (API 호출 중 여부)
  const [loading, setLoading] = useState(false);

  // ===== 함수 정의 부분 =====
  /**
   * 공지사항 로드 함수
   * API에서 공지사항 목록을 가져와서 상태에 저장합니다.
   */
  const loadNotices = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      const response = await getNotices(); // API 호출로 공지사항 목록 조회
      setNotices(response.data); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      Alert.alert('오류', '공지사항을 불러오는데 실패했습니다.'); // 사용자에게 오류 알림
    } finally {
      setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 이벤트 로드 함수
   * API에서 진행 중인 이벤트와 지난 이벤트를 동시에 가져와서 상태에 저장합니다.
   * 서버 응답을 클라이언트 타입에 맞게 변환합니다.
   */
  const loadEvents = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      // 진행 중인 이벤트와 지난 이벤트를 동시에 조회
      const [ongoingResponse, pastResponse] = await Promise.all([
        getOngoingEvents(), // 진행 중인 이벤트 조회
        getPastEvents(), // 지난 이벤트 조회
      ]);
      console.log('진행중인 이벤트:', ongoingResponse.data);
      console.log('지난 이벤트:', pastResponse.data);

      // 서버 응답을 클라이언트 타입에 맞게 변환하는 함수
      const convertEventData = (events: any[]) => {
        return events.map((event) => ({
          ...event,
          isOngoing: event.ongoing || false, // ongoing -> isOngoing으로 변환
        }));
      };

      setOngoingEvents(convertEventData(ongoingResponse.data)); // 진행 중인 이벤트 상태 저장
      setPastEvents(convertEventData(pastResponse.data)); // 지난 이벤트 상태 저장
    } catch (error) {
      console.error('이벤트 로드 실패:', error);
      Alert.alert('오류', '이벤트를 불러오는데 실패했습니다.'); // 사용자에게 오류 알림
    } finally {
      setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 현재 활성 탭에 맞는 데이터 반환 함수
   * 탭에 따라 다른 데이터를 반환합니다.
   * @returns {any[]} 현재 탭에 맞는 데이터 배열
   */
  const getTabData = () => {
    switch (activeTab) {
      case 'notice':
        return notices; // 공지사항 데이터 반환
      case 'event':
        return [...ongoingEvents, ...pastEvents]; // 진행 중인 이벤트와 지난 이벤트를 합쳐서 반환
      case 'faq':
        return DUMMY_FAQS; // FAQ 더미 데이터 반환
      default:
        return []; // 기본값: 빈 배열
    }
  };

  /**
   * 리스트 아이템 렌더링 함수
   * 현재 활성 탭에 따라 다른 형태의 카드를 렌더링합니다.
   * @param {Object} param0 - FlatList의 renderItem 파라미터
   * @param {Notice | Event | any} param0.item - 렌더링할 아이템 데이터
   * @returns {JSX.Element} 렌더링된 카드 컴포넌트
   */
  const renderItem = ({ item }: { item: Notice | Event | any }) => {
    if (activeTab === 'notice') {
      // 공지사항 탭일 때 공지사항 카드 렌더링
      const notice = item as Notice;
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{notice.title}</Text> {/* 공지사항 제목 */}
            {notice.importance === 'HIGH' && (
              <View style={styles.importantBadge}>
                <Text style={styles.importantText}>중요</Text> {/* 중요 공지사항 배지 */}
              </View>
            )}
          </View>
          <Text style={styles.date}>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</Text>{' '}
          {/* 생성일 */}
          <Text style={styles.content} numberOfLines={3}>
            {notice.content} {/* 공지사항 내용 (최대 3줄) */}
          </Text>
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => router.push(`/(main)/notice-event-faq/notice-detail?id=${notice.id}`)} // 공지사항 상세 화면으로 이동
          >
            <Text style={styles.readMoreText}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === 'event') {
      // 이벤트 탭일 때 이벤트 카드 렌더링
      const event = item as Event;
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{event.title}</Text> {/* 이벤트 제목 */}
            <View style={[styles.statusBadge, event.isOngoing && styles.activeBadge]}>
              <Text style={[styles.statusText, event.isOngoing && styles.activeStatusText]}>
                {event.isOngoing ? '진행중' : '종료'} {/* 이벤트 상태 표시 */}
              </Text>
            </View>
          </View>
          <Text style={styles.date}>{event.eventPeriod}</Text> {/* 이벤트 기간 */}
          <Text style={styles.content} numberOfLines={3}>
            {event.summary} {/* 이벤트 요약 (최대 3줄) */}
          </Text>
          <TouchableOpacity
            style={[styles.readMoreBtn, !event.isOngoing && styles.disabledBtn]} // 종료된 이벤트는 비활성화 스타일 적용
            onPress={
              () =>
                event.isOngoing &&
                router.push(`/(main)/notice-event-faq/event-detail?id=${event.id}`) // 진행 중인 이벤트만 상세 화면으로 이동
            }
          >
            <Text style={[styles.readMoreText, !event.isOngoing && styles.disabledText]}>
              {event.isOngoing ? '참여하기' : '종료됨'} {/* 버튼 텍스트 (상태에 따라 변경) */}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      // FAQ 탭일 때 FAQ 카드 렌더링
      const faq = item as (typeof DUMMY_FAQS)[0];
      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{faq.question}</Text> {/* FAQ 질문 */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{faq.category}</Text> {/* FAQ 카테고리 */}
            </View>
          </View>
          <Text style={styles.content} numberOfLines={3}>
            {faq.answer} {/* FAQ 답변 (최대 3줄) */}
          </Text>
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => Alert.alert('FAQ', faq.answer)} // FAQ 답변을 알림으로 표시
          >
            <Text style={styles.readMoreText}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // ===== 실행 부분 =====
  // 탭 변경 시 해당 탭의 데이터 로드 (탭이 변경될 때마다 실행)
  useEffect(() => {
    if (activeTab === 'notice') {
      loadNotices(); // 공지사항 탭일 때 공지사항 데이터 로드
    } else if (activeTab === 'event') {
      loadEvents(); // 이벤트 탭일 때 이벤트 데이터 로드
    }
    // FAQ 탭은 더미 데이터를 사용하므로 별도 로드 불필요
  }, [activeTab]); // activeTab이 변경될 때마다 실행

  // 메인 화면 렌더링
  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <BackButton /> {/* 뒤로가기 버튼 */}
        {/* 탭 네비게이션 (공지사항, 이벤트, FAQ) */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key; // 현재 활성 탭 여부
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]} // 활성 탭 스타일 적용
                onPress={() => setActiveTab(tab.key)} // 탭 클릭 시 활성 탭 변경
              >
                <Ionicons
                  name={tab.iconName}
                  size={18}
                  color={isActive ? '#fff' : '#b3b3ff'} // 활성 탭은 흰색, 비활성 탭은 연한 보라색
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>{' '}
                {/* 탭 라벨 */}
              </TouchableOpacity>
            );
          })}
        </View>
        {/* 로딩 상태일 때 표시되는 화면 */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>데이터를 불러오는 중...</Text> {/* 로딩 메시지 */}
          </View>
        ) : (
          /* 데이터가 로드된 후 표시되는 가로 스크롤 리스트 */
          <FlatList
            data={getTabData()} // 현재 탭에 맞는 데이터
            keyExtractor={(item) => item.id.toString()} // 고유 키 추출
            horizontal // 가로 스크롤 설정
            showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
            contentContainerStyle={
              getTabData().length === 0 ? styles.emptyCardList : styles.cardList // 데이터가 없으면 빈 리스트 스타일 적용
            }
            renderItem={renderItem} // 아이템 렌더링 함수
            ListEmptyComponent={
              /* 데이터가 없을 때 표시되는 빈 상태 컴포넌트 */
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {activeTab === 'notice'
                    ? '공지사항이 없습니다.' // 공지사항 탭일 때 메시지
                    : activeTab === 'event'
                      ? '이벤트가 없습니다.' // 이벤트 탭일 때 메시지
                      : 'FAQ가 없습니다.'}{' '}
                  {/* FAQ 탭일 때 메시지 */}
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
