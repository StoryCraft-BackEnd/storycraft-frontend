import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { MainScreenStyles } from '@/styles/MainScreen';
import { createProfile } from '@/features/profile/profileApi';
import { LearningLevel } from '@/features/profile/types';
import { createProfileCreateScreenStyles } from '@/styles/ProfileCreateScreen.styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { getRandomAnimalImage, AnimalImageType } from '@/shared/utils/profileImageUtils';
import { loadImage } from '@/features/main/imageLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('초급');
  const [selectedImage, setSelectedImage] = useState<AnimalImageType>('african_elephant9');
  const [isLoading, setIsLoading] = useState(false);

  const styles = createProfileCreateScreenStyles();

  // 테마 색상 가져오기
  const backgroundColor = useThemeColor('background');
  const colorScheme = useColorScheme();

  // 화이트모드에서만 크림베이지 색상 적용
  const finalBackgroundColor = colorScheme === 'light' ? '#FFF8F0' : backgroundColor;

  /**
   * 다른 이미지로 변경하는 함수
   */
  const handleChangeImage = () => {
    const randomImage = getRandomAnimalImage();
    setSelectedImage(randomImage);
    console.log('이미지 변경됨:', randomImage);
  };

  /**
   * 프로필 생성 핸들러
   * 입력값 검증 후 서버에 프로필 생성 요청
   */
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
        learningLevel: learningLevel,
        // profileImage: selectedImage, // 서버에서 지원하지 않으므로 주석 처리
      });

      if (response.status === 200 || response.status === 201) {
        // 프로필 생성 성공 후 로컬에 이미지 정보 저장
        const createdProfile = {
          childId: response.data.childId,
          name: name.trim(),
          age: ageNum,
          learningLevel: learningLevel,
          profileImage: selectedImage,
        };

        // 로컬 스토리지에 프로필 정보 저장 (이미지 포함)
        const existingProfiles = await AsyncStorage.getItem('profiles');
        const profiles = existingProfiles ? JSON.parse(existingProfiles) : [];
        profiles.push(createdProfile);
        await AsyncStorage.setItem('profiles', JSON.stringify(profiles));

        Alert.alert('성공', '프로필이 생성되었습니다.', [
          {
            text: '확인',
            onPress: () => router.back(),
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

  // ===== 실행 부분 =====
  // 컴포넌트 마운트 시 랜덤 이미지 선택
  useEffect(() => {
    const randomImage = getRandomAnimalImage();
    setSelectedImage(randomImage);
    console.log('초기 선택된 이미지:', randomImage);
  }, []);

  return (
    <ThemedView
      style={[
        MainScreenStyles.container,
        styles.container,
        { backgroundColor: finalBackgroundColor },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          title: '새 프로필 추가',
        }}
      />
      <StatusBar hidden />

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colorScheme === 'light' ? '#333' : '#fff'} />
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          {/* 프로필 이미지 선택 */}
          <View style={styles.imageContainer}>
            <ThemedText style={styles.inputLabel}>프로필 이미지</ThemedText>
            <View style={styles.imagePreviewContainer}>
              <Image
                source={loadImage(selectedImage)}
                style={styles.profileImagePreview}
                onError={(error) => console.log('이미지 로딩 에러:', error)}
                onLoad={() => console.log('이미지 로딩 성공:', selectedImage)}
              />
              <TouchableOpacity style={styles.changeImageButton} onPress={handleChangeImage}>
                <ThemedText style={styles.changeImageButtonText}>다른 이미지</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

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
