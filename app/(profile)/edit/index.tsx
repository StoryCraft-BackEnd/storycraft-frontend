/**
 * 프로필 수정 화면
 * 이름, 나이, 학습 레벨만 수정 가능한 간단한 편집 화면
 */
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createProfileEditFormStyles } from '@/styles/ProfileEditForm.styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ChildProfile } from '@/features/profile/types';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function ProfileEditScreen() {
  const backgroundColor = useThemeColor('background');
  const isDark = backgroundColor === '#0d1b1e';
  const insets = useSafeAreaInsets();
  const styles = createProfileEditFormStyles(isDark, insets);

  // URL 파라미터에서 프로필 정보 받아오기
  const params = useLocalSearchParams();
  const profileParam = params.profile as string;

  // 폼 상태 관리
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [learningLevel, setLearningLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 프로필 정보 파싱 및 초기화
  useEffect(() => {
    if (profileParam) {
      try {
        const profile: ChildProfile = JSON.parse(profileParam);
        setName(profile.name || '');
        setAge(profile.age?.toString() || '');
        setLearningLevel(profile.learning_level || '');
      } catch (error) {
        console.error('프로필 정보 파싱 실패:', error);
        Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
        router.back();
      }
    }
  }, [profileParam]);

  // 화면 방향을 가로 모드로 고정
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.error('화면 방향 잠금 실패:', error);
      }
    };

    lockOrientation();
  }, []);

  // 수정 완료 처리
  const handleSave = async () => {
    // 입력값 검증
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    if (!age.trim()) {
      Alert.alert('알림', '나이를 입력해주세요.');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 20) {
      Alert.alert('알림', '올바른 나이를 입력해주세요. (1-20세)');
      return;
    }

    if (!learningLevel.trim()) {
      Alert.alert('알림', '학습 레벨을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 API 호출로 프로필 수정
      // await updateProfile(profileId, { name, age: ageNum, learning_level: learningLevel });

      Alert.alert('성공', '프로필이 수정되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            // router.back() 사용하여 네비게이션 스택 유지
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '프로필 수정에 실패했습니다.');
      console.error('프로필 수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 뒤로가기 처리
  const handleBack = () => {
    // router.back() 사용하여 네비게이션 스택 유지
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>프로필 수정</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {/* 메인 콘텐츠 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* 이름 입력 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>이름</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              placeholderTextColor="#999"
              maxLength={20}
            />
          </View>

          {/* 나이 입력 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>나이</ThemedText>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="나이를 입력하세요 (1-20세)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          {/* 학습 레벨 선택 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>학습 레벨</ThemedText>
            <View style={styles.levelContainer}>
              {['초급', '중급', '고급'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    learningLevel === level && styles.levelButtonSelected,
                  ]}
                  onPress={() => setLearningLevel(level)}
                >
                  <ThemedText
                    style={[
                      styles.levelButtonText,
                      learningLevel === level && styles.levelButtonTextSelected,
                    ]}
                  >
                    {level}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 저장 버튼 */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <ThemedText style={styles.submitButtonText}>
              {isLoading ? '저장 중...' : '저장'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
