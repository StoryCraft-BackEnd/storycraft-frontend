import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
import { router, Stack } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { MainScreenStyles } from '@/styles/MainScreen';
import { createProfile } from '@/features/profile/profileApi';
import { LearningLevel } from '@/features/profile/types';
import { createProfileCreateScreenStyles } from '@/styles/ProfileCreateScreen.styles';
import { addProfileToStorage } from '@/features/profile/profileStorage';

export default function CreateProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('초급');
  const [isLoading, setIsLoading] = useState(false);

  const styles = createProfileCreateScreenStyles();

  const handleCreateProfile = async () => {
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
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
      Alert.alert('알림', '올바른 나이를 입력해주세요 (1-99).');
      return;
    }

    try {
      setIsLoading(true);
      const response = await createProfile({
        name: name.trim(),
        age: ageNum,
        learning_level: learningLevel,
      });

      if (response.status === 201) {
        // 로컬 스토리지에도 저장
        await addProfileToStorage(response.data);
        Alert.alert('성공', '프로필이 생성되었습니다.', [
          {
            text: '확인',
            onPress: () => router.replace('/(profile)'),
          },
        ]);
      } else {
        throw new Error(response.message || '프로필 생성에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '프로필 생성에 실패했습니다.');
      console.error('프로필 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[MainScreenStyles.container, styles.container]}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: '새 프로필 추가',
        }}
      />
      <StatusBar hidden />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backButton}>← 뒤로</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>새 프로필 추가</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          {/* 이름 입력 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>이름</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              placeholderTextColor={styles.input.color}
            />
          </View>

          {/* 나이 입력 */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>나이</ThemedText>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="나이를 입력하세요"
              placeholderTextColor={styles.input.color}
              keyboardType="number-pad"
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
                  onPress={() => setLearningLevel(level as LearningLevel)}
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

          {/* 생성 버튼 */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleCreateProfile}
            disabled={isLoading}
          >
            <ThemedText style={styles.submitButtonText}>
              {isLoading ? '생성 중...' : '프로필 생성'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
