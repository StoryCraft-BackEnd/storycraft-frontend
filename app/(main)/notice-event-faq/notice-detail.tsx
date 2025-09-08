/**
 * 공지사항 상세 화면 컴포넌트
 * 특정 공지사항의 상세 정보를 조회하고 표시하는 화면입니다.
 * 공지사항 제목, 중요도, 생성일, 내용 등의 정보를 보여줍니다.
 * URL 파라미터로 받은 공지사항 ID를 사용하여 해당 공지사항의 상세 정보를 조회합니다.
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
} from 'react-native';
// Expo Router: URL 파라미터 추출용
import { useLocalSearchParams } from 'expo-router';
// 공지/이벤트/FAQ 화면 전용 스타일
import styles from '@/styles/NoticeEventFAQScreen.styles';
// 배경 이미지 (밤하늘 배경)
import nightBg from '@/assets/images/background/night-bg.png';
// 뒤로가기 버튼 컴포넌트
import BackButton from '@/components/ui/BackButton';
// 공지사항 관련 API 함수들과 타입 정의
import { getNoticeDetail, type Notice } from '@/shared/api';

/**
 * 공지사항 상세 화면 컴포넌트
 * URL 파라미터로 받은 공지사항 ID를 사용하여 공지사항 상세 정보를 조회하고 표시합니다.
 */
const NoticeDetailScreen = () => {
  // URL 파라미터에서 공지사항 ID 추출
  const { id } = useLocalSearchParams<{ id: string }>();
  // 공지사항 정보 상태 (API에서 받아온 공지사항 데이터)
  const [notice, setNotice] = useState<Notice | null>(null);
  // 로딩 상태 (API 호출 중 여부)
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 공지사항 상세 정보 조회 (공지사항 ID가 있을 때만 실행)
  useEffect(() => {
    /**
     * 공지사항 상세 정보 조회 함수
     * API에서 공지사항 상세 정보를 가져와서 상태에 저장합니다.
     */
    const loadNoticeDetail = async () => {
      try {
        setLoading(true); // 로딩 상태 시작
        const response = await getNoticeDetail(parseInt(id)); // API 호출로 공지사항 상세 정보 조회
        setNotice(response.data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error);
        Alert.alert('오류', '공지사항을 불러오는데 실패했습니다.'); // 사용자에게 오류 알림
      } finally {
        setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
      }
    };

    if (id) {
      loadNoticeDetail(); // 공지사항 ID가 있을 때만 함수 실행
    }
  }, [id]); // id가 변경될 때마다 실행

  // 로딩 상태일 때 표시되는 화면 (API 호출 중)
  if (loading) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton /> {/* 뒤로가기 버튼 */}
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>공지사항을 불러오는 중...</Text> {/* 로딩 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 공지사항 정보가 없을 때 표시되는 화면 (오류 상태)
  if (!notice) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton /> {/* 뒤로가기 버튼 */}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>공지사항을 찾을 수 없습니다.</Text> {/* 오류 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 메인 화면 렌더링 (공지사항 정보가 정상적으로 로드된 상태)
  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <BackButton /> {/* 뒤로가기 버튼 */}
        {/* 스크롤 가능한 공지사항 상세 정보 컨테이너 */}
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.detailContainer}>
            {/* 공지사항 헤더 (제목과 중요도 배지) */}
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{notice.title}</Text> {/* 공지사항 제목 */}
              {notice.importance === 'HIGH' && (
                <View style={styles.importantBadge}>
                  <Text style={styles.importantText}>중요</Text> {/* 중요 공지사항 배지 */}
                </View>
              )}
            </View>
            {/* 공지사항 생성일 (상세한 날짜/시간 형식) */}
            <Text style={styles.detailDate}>
              {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric', // 연도 (예: 2024)
                month: 'long', // 월 (예: 1월)
                day: 'numeric', // 일 (예: 15)
                hour: '2-digit', // 시간 (예: 14)
                minute: '2-digit', // 분 (예: 30)
              })}
            </Text>
            {/* 공지사항 내용 */}
            <Text style={styles.detailContent}>{notice.content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NoticeDetailScreen;
