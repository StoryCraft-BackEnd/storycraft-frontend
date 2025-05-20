/**
 * StoryCraft 동화 생성 페이지
 * 새로운 동화를 생성하는 화면입니다.
 */
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { router } from 'expo-router';
import { MainScreenStyles } from '@/styles/MainScreen';
import { StoryCreateScreenStyles } from '@/styles/StoryCreateScreen.styles';
import { API_CONFIG } from '@/shared/config/api';
import type { CreateStoryRequest, CreateStoryResponse } from '@/features/storyCreate/types';

export default function StoryCreateScreen() {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateStory = async () => {
    console.log('버튼 클릭됨');

    console.log('입력된 내용:', storyPrompt);

    console.log('API URL:', `${API_CONFIG.BASE_URL}/stories/create`);

    if (!storyPrompt.trim()) {
      Alert.alert('알림', '동화 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData: CreateStoryRequest = {
        prompt: storyPrompt,
        childId: '1', // TODO: 실제 자녀 프로필 ID로 교체 필요
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/stories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('API 응답 받음:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '동화 생성에 실패했습니다.');
      }

      const result: CreateStoryResponse = await response.json();

      if (result.status === 201 && result.data) {
        console.log('생성된 동화:', result);
        Alert.alert('성공', result.message);
        router.back();
      } else {
        throw new Error(result.message || '동화 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      Alert.alert(
        '오류',
        error instanceof Error ? error.message : '동화 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false); // 에러가 발생하더라도 로딩 상태 해제
    }
  };

  return (
    <ThemedView style={MainScreenStyles.container}>
      {/* 헤더 */}
      <View style={MainScreenStyles.storyListHeader}>
        <TouchableOpacity onPress={() => router.back()} style={MainScreenStyles.backButton}>
          <Text style={MainScreenStyles.backButtonText}>{'<<'} 돌아가기</Text>
        </TouchableOpacity>
        <Text style={MainScreenStyles.storyListTitle}>동화 생성</Text>
      </View>

      <View style={StoryCreateScreenStyles.container}>
        <Text style={StoryCreateScreenStyles.inputLabel}>동화 내용을 입력해주세요:</Text>
        <TextInput
          style={StoryCreateScreenStyles.textInput}
          multiline
          placeholder="동화의 내용을 자유롭게 입력해주세요..."
          value={storyPrompt}
          onChangeText={setStoryPrompt}
        />
        <TouchableOpacity
          onPress={handleCreateStory}
          style={[StoryCreateScreenStyles.createButton, isLoading && { opacity: 0.5 }]}
          disabled={isLoading}
        >
          <Text style={StoryCreateScreenStyles.createButtonText}>
            {isLoading ? '생성 중...' : '동화 생성하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
