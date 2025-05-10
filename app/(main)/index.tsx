/**
 * StoryCraft 메인 화면 컴포넌트
 * 로그인 후 사용자가 보게 되는 메인 화면입니다.
 */
import React from 'react';
import { TouchableOpacity, Alert, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 토큰 삭제 위해 사용 추후 삭제!!

export default function MainScreen() {
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('card');

  // StoryCraft Dev로 돌아가는 함수 추후 삭제!!
  const handleBackToDev = async () => {
    try {
      // 토큰 삭제
      await AsyncStorage.removeItem('token');
      // (auth) 스택으로 이동
      router.replace('/(auth)');
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* 사용자 정보 섹션 */}
        <View
          style={{
            backgroundColor: cardColor,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: textColor,
              marginBottom: 8,
            }}
          >
            환영합니다!
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              color: textColor,
              opacity: 0.8,
            }}
          >
            오늘도 좋은 이야기를 만들어보세요
          </ThemedText>
        </View>

        {/* 빠른 시작 섹션 */}
        <View
          style={{
            backgroundColor: cardColor,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: textColor,
              marginBottom: 12,
            }}
          >
            빠른 시작
          </ThemedText>
          <TouchableOpacity
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
              marginBottom: 8,
            }}
            onPress={() => Alert.alert('새 이야기 작성')}
          >
            <ThemedText style={{ fontSize: 16, color: textColor }}>새 이야기 작성하기</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
            }}
            onPress={() => Alert.alert('이야기 탐색')}
          >
            <ThemedText style={{ fontSize: 16, color: textColor }}>이야기 탐색하기</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 최근 활동 섹션 */}
        <View
          style={{
            backgroundColor: cardColor,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: textColor,
              marginBottom: 12,
            }}
          >
            최근 활동
          </ThemedText>
          <TouchableOpacity
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
              marginBottom: 8,
            }}
            onPress={() => Alert.alert('최근 작성한 이야기')}
          >
            <ThemedText style={{ fontSize: 16, color: textColor }}>최근 작성한 이야기</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
            }}
            onPress={() => Alert.alert('저장된 이야기')}
          >
            <ThemedText style={{ fontSize: 16, color: textColor }}>저장된 이야기</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 설정 섹션 */}
        <View
          style={{
            backgroundColor: cardColor,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: textColor,
              marginBottom: 12,
            }}
          >
            설정
          </ThemedText>
          <TouchableOpacity
            style={{
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
              marginBottom: 8,
            }}
            onPress={() => Alert.alert('프로필 설정')}
          >
            <ThemedText style={{ fontSize: 16, color: textColor }}>프로필 설정</ThemedText>
          </TouchableOpacity>
          {/* StoryCraft Dev로 돌아가는 버튼 추후 삭제!!*/}
          <TouchableOpacity
            style={{
              backgroundColor: '#FF6B6B',
              padding: 16,
              borderRadius: 8,
            }}
            onPress={handleBackToDev}
          >
            <ThemedText style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
              StoryCraft Dev로 돌아가기
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
