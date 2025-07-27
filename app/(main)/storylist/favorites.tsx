/**
 * @description
 * StoryCraft 즐겨찾기 페이지
 * 사용자가 즐겨찾기한 단어들을 표시하는 화면입니다.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
import styles from '@/styles/StoryListScreen.styles';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import { loadFavoriteWords, removeFavoriteWord } from '@/features/storyCreate/storyStorage';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

/**
 * 즐겨찾기 화면의 메인 컴포넌트
 * 사용자가 즐겨찾기한 단어들을 표시합니다.
 */
export default function FavoritesScreen() {
  const [favoriteWords, setFavoriteWords] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 즐겨찾기 단어 목록 로드
  useEffect(() => {
    loadFavoriteWordsData();
  }, []);

  const loadFavoriteWordsData = async () => {
    try {
      setIsLoading(true);

      // 선택된 프로필 가져오기
      const profile = await loadSelectedProfile();
      if (!profile) {
        console.log('선택된 프로필이 없습니다.');
        setFavoriteWords([]);
        return;
      }

      setSelectedProfile(profile);

      // 즐겨찾기 단어 목록 가져오기
      const words = await loadFavoriteWords(profile.childId);
      setFavoriteWords(words);

      console.log(`즐겨찾기 단어 ${words.length}개 로드 완료`);
    } catch (error) {
      console.error('즐겨찾기 단어 로드 실패:', error);
      setFavoriteWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 즐겨찾기 단어 삭제
  const removeWord = async (word: string) => {
    if (!selectedProfile) return;

    Alert.alert('즐겨찾기 삭제', `"${word}" 단어를 즐겨찾기에서 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFavoriteWord(selectedProfile.childId, word);
            setFavoriteWords((prev) => prev.filter((w) => w !== word));
            console.log(`즐겨찾기 단어 "${word}" 삭제 완료`);
          } catch (error) {
            console.error('즐겨찾기 단어 삭제 실패:', error);
            Alert.alert('오류', '즐겨찾기 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      {/* 헤더 제목 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.headerTitle}>즐겨찾기 단어</Text>
          <Ionicons name="star" size={24} color="#FFD700" />
        </View>
        {selectedProfile && (
          <Text style={[styles.headerTitle, { fontSize: 16, marginTop: 8 }]}>
            {selectedProfile.name}의 즐겨찾기
          </Text>
        )}
      </View>

      {/* 즐겨찾기 단어 목록 */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>즐겨찾기 단어를 불러오는 중...</Text>
        </View>
      ) : favoriteWords.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="star-outline" size={64} color="#B6AFFF" style={{ marginBottom: 16 }} />
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            즐겨찾기한 단어가 없습니다
          </Text>
          <Text style={{ color: '#B6AFFF', fontSize: 14, textAlign: 'center' }}>
            영어 학습 화면에서 단어를 즐겨찾기에 추가해보세요
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteWords}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { marginBottom: 12, padding: 16 }]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { fontSize: 18, marginBottom: 4 }]}>{item}</Text>
                  <Text style={{ color: '#B6AFFF', fontSize: 14 }}>즐겨찾기한 단어</Text>
                </View>
                <TouchableOpacity onPress={() => removeWord(item)} style={{ padding: 8 }}>
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
}
