import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import styles from '@/styles/NoticeEventFAQScreen.styles';
import nightBg from '@/assets/images/background/night-bg.png';
import BackButton from '@/components/ui/BackButton';
import { getEventDetail, type Event } from '@/shared/api';

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventDetail = async () => {
      try {
        setLoading(true);
        const response = await getEventDetail(parseInt(id));
        setEvent(response.data);
      } catch (error) {
        console.error('이벤트 상세 조회 실패:', error);
        Alert.alert('오류', '이벤트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEventDetail();
    }
  }, [id]);

  const handleParticipate = () => {
    if (event?.isOngoing) {
      Alert.alert('이벤트 참여', '이벤트에 참여하시겠습니까?');
    }
  };

  if (loading) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>이벤트를 불러오는 중...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (!event) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>이벤트를 찾을 수 없습니다.</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{event.title}</Text>
              <View style={[styles.statusBadge, event.isOngoing && styles.activeBadge]}>
                <Text style={[styles.statusText, event.isOngoing && styles.activeStatusText]}>
                  {event.isOngoing ? '진행중' : '종료'}
                </Text>
              </View>
            </View>

            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoLabel}>이벤트 기간</Text>
              <Text style={styles.eventInfoValue}>{event.eventPeriod}</Text>
            </View>

            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoLabel}>참여자 수</Text>
              <Text style={styles.eventInfoValue}>{event.participantCount}</Text>
            </View>

            {event.reward && (
              <View style={styles.eventInfoContainer}>
                <Text style={styles.eventInfoLabel}>보상</Text>
                <Text style={styles.eventInfoValue}>{event.reward}</Text>
              </View>
            )}

            <View style={styles.eventInfoContainer}>
              <Text style={styles.eventInfoLabel}>요약</Text>
              <Text style={styles.detailContent}>{event.summary}</Text>
            </View>

            {event.description && (
              <View style={styles.eventInfoContainer}>
                <Text style={styles.eventInfoLabel}>상세 설명</Text>
                <Text style={styles.detailContent}>{event.description}</Text>
              </View>
            )}

            {event.isOngoing && (
              <TouchableOpacity style={styles.participateButton} onPress={handleParticipate}>
                <Text style={styles.participateButtonText}>이벤트 참여하기</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default EventDetailScreen;
