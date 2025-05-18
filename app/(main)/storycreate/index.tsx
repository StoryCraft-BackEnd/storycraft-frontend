/**
 * StoryCraft 동화 생성 페이지
 * 새로운 동화를 생성하는 화면입니다.
 */
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { router } from 'expo-router';
import { MainScreenStyles } from '@/styles/MainScreen';

export default function StoryCreateScreen() {
  return (
    <ThemedView style={MainScreenStyles.container}>
      {/* 헤더 */}
      <View style={MainScreenStyles.storyListHeader}>
        <TouchableOpacity onPress={() => router.back()} style={MainScreenStyles.backButton}>
          <Text style={MainScreenStyles.backButtonText}>{'<<'} 돌아가기</Text>
        </TouchableOpacity>
        <Text style={MainScreenStyles.storyListTitle}>동화 생성</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>동화 생성 페이지</Text>
      </View>
    </ThemedView>
  );
}
