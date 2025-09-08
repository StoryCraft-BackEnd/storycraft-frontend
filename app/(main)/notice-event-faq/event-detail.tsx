/**
 * 이벤트 상세 화면 컴포넌트
 * 특정 이벤트의 상세 정보를 조회하고 표시하는 화면입니다.
 * 이벤트 제목, 기간, 참여자 수, 보상, 요약, 상세 설명 등의 정보를 보여줍니다.
 * 진행 중인 이벤트의 경우 참여하기 버튼을 제공합니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  SafeAreaView, // 안전 영역을 고려한 컨테이너
  ImageBackground, // 배경 이미지가 있는 컨테이너
  ScrollView, // 스크롤 가능한 컨테이너
  Alert, // 알림 팝업 표시용
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
} from 'react-native';
// Expo Router: URL 파라미터 추출용
import { useLocalSearchParams } from 'expo-router';
// 공지/이벤트/FAQ 화면 전용 스타일
import styles from '@/styles/NoticeEventFAQScreen.styles';
// 배경 이미지 (밤하늘 배경)
import nightBg from '@/assets/images/background/night-bg.png';
// 뒤로가기 버튼 컴포넌트
import BackButton from '@/components/ui/BackButton';
// 이벤트 관련 API 함수들과 타입 정의
import { getEventDetail, type Event } from '@/shared/api';

/**
 * 이벤트 상세 화면 컴포넌트
 * URL 파라미터로 받은 이벤트 ID를 사용하여 이벤트 상세 정보를 조회하고 표시합니다.
 */
const EventDetailScreen = () => {
  // URL 파라미터에서 이벤트 ID 추출
  const { id } = useLocalSearchParams<{ id: string }>();
  // 이벤트 정보 상태 (API에서 받아온 이벤트 데이터)
  const [event, setEvent] = useState<Event | null>(null);
  // 로딩 상태 (API 호출 중 여부)
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 이벤트 상세 정보 조회 (이벤트 ID가 있을 때만 실행)
  useEffect(() => {
    /**
     * 이벤트 상세 정보 조회 함수
     * API에서 이벤트 상세 정보를 가져와서 상태에 저장합니다.
     * 서버 응답을 클라이언트 타입에 맞게 변환합니다.
     */
    const loadEventDetail = async () => {
      try {
        setLoading(true); // 로딩 상태 시작
        const response = await getEventDetail(parseInt(id)); // API 호출로 이벤트 상세 정보 조회

        // 서버 응답을 클라이언트 타입에 맞게 변환
        const eventData = {
          ...response.data,
          isOngoing: (response.data as any).ongoing || false, // ongoing -> isOngoing으로 변환
        };

        setEvent(eventData); // 변환된 데이터를 상태에 저장
      } catch (error) {
        console.error('이벤트 상세 조회 실패:', error);
        Alert.alert('오류', '이벤트를 불러오는데 실패했습니다.'); // 사용자에게 오류 알림
      } finally {
        setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
      }
    };

    if (id) {
      loadEventDetail(); // 이벤트 ID가 있을 때만 함수 실행
    }
  }, [id]); // id가 변경될 때마다 실행

  /**
   * 이벤트 참여 핸들러 함수
   * 진행 중인 이벤트에 참여할 때 호출되는 함수입니다.
   */
  const handleParticipate = () => {
    if (event?.isOngoing) {
      Alert.alert('이벤트 참여', '이벤트에 참여하시겠습니까?'); // 참여 확인 알림
    }
  };

  // 로딩 상태일 때 표시되는 화면 (API 호출 중)
  if (loading) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton /> {/* 뒤로가기 버튼 */}
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>이벤트를 불러오는 중...</Text> {/* 로딩 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 이벤트 정보가 없을 때 표시되는 화면 (오류 상태)
  if (!event) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton /> {/* 뒤로가기 버튼 */}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>이벤트를 찾을 수 없습니다.</Text> {/* 오류 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 메인 화면 렌더링 (이벤트 정보가 정상적으로 로드된 상태)
  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <BackButton /> {/* 뒤로가기 버튼 */}
        {/* 스크롤 가능한 이벤트 상세 정보 컨테이너 */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={styles.detailContainer}>
            {/* 이벤트 헤더 (제목과 상태 배지) */}
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{event.title}</Text> {/* 이벤트 제목 */}
              <View style={[styles.statusBadge, event.isOngoing && styles.activeBadge]}>
                <Text style={[styles.statusText, event.isOngoing && styles.activeStatusText]}>
                  {event.isOngoing ? '진행중' : '종료'} {/* 이벤트 상태 표시 */}
                </Text>
              </View>
            </View>

            {/* 이벤트 기간 정보 */}
            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoLabel}>이벤트 기간</Text> {/* 라벨 */}
              <Text style={styles.eventInfoValue}>{event.eventPeriod}</Text> {/* 값 */}
            </View>

            {/* 참여자 수 정보 */}
            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoLabel}>참여자 수</Text> {/* 라벨 */}
              <Text style={styles.eventInfoValue}>{event.participantCount}</Text> {/* 값 */}
            </View>

            {/* 보상 정보 (보상이 있는 경우에만 표시) */}
            {event.reward && (
              <View style={styles.eventInfoContainer}>
                <Text style={styles.eventInfoLabel}>보상</Text> {/* 라벨 */}
                <Text style={styles.eventInfoValue}>{event.reward}</Text> {/* 값 */}
              </View>
            )}

            {/* 이벤트 요약 정보 */}
            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoLabel}>요약</Text> {/* 라벨 */}
              <Text style={styles.detailContent}>{event.summary}</Text> {/* 요약 내용 */}
            </View>

            {/* 상세 설명 (설명이 있는 경우에만 표시) */}
            {event.description && (
              <View style={styles.eventInfoContainer}>
                <Text style={styles.eventInfoLabel}>상세 설명</Text> {/* 라벨 */}
                <Text style={styles.detailContent}>{event.description}</Text> {/* 상세 설명 내용 */}
              </View>
            )}

            {/* 이벤트 참여 버튼 (진행 중인 이벤트인 경우에만 표시) */}
            {event.isOngoing && (
              <TouchableOpacity style={styles.participateButton} onPress={handleParticipate}>
                <Text style={styles.participateButtonText}>이벤트 참여하기</Text>{' '}
                {/* 참여 버튼 텍스트 */}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default EventDetailScreen;
