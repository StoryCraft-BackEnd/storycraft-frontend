import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ImageBackground, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import styles from '@/styles/NoticeEventFAQScreen.styles';
import nightBg from '@/assets/images/background/night-bg.png';
import BackButton from '@/components/ui/BackButton';
import { getNoticeDetail, type Notice } from '@/shared/api';

const NoticeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoticeDetail = async () => {
      try {
        setLoading(true);
        const response = await getNoticeDetail(parseInt(id));
        setNotice(response.data);
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error);
        Alert.alert('오류', '공지사항을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadNoticeDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>공지사항을 불러오는 중...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (!notice) {
    return (
      <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>공지사항을 찾을 수 없습니다.</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{notice.title}</Text>
              {notice.importance === 'HIGH' && (
                <View style={styles.importantBadge}>
                  <Text style={styles.importantText}>중요</Text>
                </View>
              )}
            </View>
            <Text style={styles.detailDate}>
              {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.detailContent}>{notice.content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NoticeDetailScreen;
