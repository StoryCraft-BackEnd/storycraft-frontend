/**
 * @description
 * StoryCraft 동화 생성 페이지
 * 새로운 동화를 생성하는 화면입니다.
 */
import React, { useState } from 'react';
import {
  Text, // 텍스트를 표시하는 컴포넌트
  TouchableOpacity, // 터치 가능한 영역을 만드는 컴포넌트 (버튼 등에 사용)
  View, // UI 요소를 그룹화하는 컨테이너 컴포넌트
  TextInput, // 사용자가 텍스트를 입력할 수 있는 필드
  ImageBackground, // 배경 이미지를 적용할 수 있는 컨테이너
  ScrollView, // 콘텐츠가 화면을 벗어날 경우 스크롤 가능하게 만드는 컨테이너
} from 'react-native';

// --- 네비게이션 및 UI 라이브러리 ---
import { router } from 'expo-router'; // 화면 간 이동(네비게이션)을 관리하는 객체
import { LinearGradient } from 'expo-linear-gradient'; // 그라데이션 효과를 주는 컴포넌트
import { Ionicons } from '@expo/vector-icons'; // 아이콘을 사용하기 위해 import 합니다.
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 기기의 안전 영역을 가져오는 훅

// --- 내부 모듈 및 타입 정의 ---
import { StoryCreateScreenStyles as styles } from '@/styles/StoryCreateScreen.styles'; // 이 화면 전용 스타일 시트
import { Popup } from '@/components/ui/Popup'; // 커스텀 팝업 컴포넌트
import { API_CONFIG } from '@/shared/config/api'; // API 서버 주소 등 설정 값
import type { CreateStoryRequest, CreateStoryResponse } from '@/features/storyCreate/types'; // API 요청/응답에 대한 타입 정의

// 배경 이미지 파일을 import 합니다.
import backgroundImage from '@/assets/images/background/night-bg.png';

// 동화 생성 화면의 메인 컴포넌트
export default function StoryCreateScreen() {
  // --- 상태 관리 (State) ---

  // 기기의 안전 영역(상태바, 노치 등)의 크기를 가져옵니다.
  const insets = useSafeAreaInsets();

  // 사용자가 추가한 키워드 목록을 저장하는 상태. 초기값은 빈 배열입니다.
  const [keywords, setKeywords] = useState<string[]>([]);
  // 사용자가 현재 입력창에 입력 중인 키워드를 저장하는 상태. 초기값은 빈 문자열입니다.
  const [currentKeyword, setCurrentKeyword] = useState('');
  // API 요청이 진행 중인지 여부를 저장하는 상태. 로딩 인디케이터 표시에 사용됩니다.
  const [isLoading, setIsLoading] = useState(false);

  // 팝업 상태 관리
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  // --- 이벤트 핸들러 함수 ---

  /**
   * 입력창의 키워드를 키워드 목록에 추가하는 함수.
   */
  const handleAddKeyword = () => {
    // 입력된 키워드의 앞뒤 공백을 제거하고, 비어있지 않은지 확인합니다.
    // 또한, 이미 목록에 있는 키워드인지 중복 확인을 합니다.
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      // 기존 키워드 목록(...keywords)에 새로운 키워드를 추가하여 상태를 업데이트합니다.
      setKeywords([...keywords, currentKeyword.trim()]);
      // 키워드를 추가한 후, 입력창을 비웁니다.
      setCurrentKeyword('');
    }
  };

  /**
   * 키워드 목록에서 특정 키워드를 제거하는 함수.
   * @param keywordToRemove - 제거할 키워드 문자열
   */
  const handleRemoveKeyword = (keywordToRemove: string) => {
    // filter 함수를 사용하여 제거할 키워드를 제외한 새 배열을 만들어 상태를 업데이트합니다.
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  /**
   * 팝업을 표시하는 함수
   * @param title - 팝업 제목
   * @param message - 팝업 메시지
   */
  const showPopup = (title: string, message: string) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  /**
   * 'Create My Story!' 버튼을 눌렀을 때 실행되는 함수.
   * 키워드 목록을 서버에 전송하여 동화 생성을 요청합니다.
   */
  const handleCreateStory = async () => {
    // 키워드가 하나도 없으면 사용자에게 알림을 표시하고 함수를 종료합니다.
    if (keywords.length === 0) {
      showPopup('알림', '키워드를 하나 이상 추가해주세요.');
      return;
    }

    setIsLoading(true); // API 요청 시작 전, 로딩 상태를 true로 설정합니다.
    try {
      // 서버에 보낼 요청 데이터를 구성합니다.
      const requestData: CreateStoryRequest = {
        prompt: keywords.join(', '), // 키워드 배열을 쉼표로 구분된 하나의 문자열로 합칩니다.
        childId: '1', // TODO: 실제 자녀 프로필 ID로 교체해야 합니다.
      };

      // fetch 함수를 사용하여 서버에 POST 요청을 보냅니다.
      const response = await fetch(`${API_CONFIG.BASE_URL}/stories`, {
        method: 'POST', // HTTP 요청 메서드
        headers: { 'Content-Type': 'application/json' }, // 요청 본문이 JSON 형식임을 알립니다.
        body: JSON.stringify(requestData), // JavaScript 객체를 JSON 문자열로 변환하여 전송합니다.
      });

      // 서버 응답이 성공적이지(ok: false) 않으면 에러를 발생시킵니다.
      if (!response.ok) {
        const errorData = await response.json(); // 에러 메시지를 담은 JSON 응답을 파싱합니다.
        throw new Error(errorData.message || '동화 생성에 실패했습니다.');
      }

      // 성공적인 응답을 JSON 형식으로 파싱합니다.
      const result: CreateStoryResponse = await response.json();

      // 서버에서 정의한 성공 상태 코드(201)이고 데이터가 있으면 성공 처리합니다.
      if (result.status === 201 && result.data) {
        showPopup('성공', result.message);
        // 성공 팝업 닫힌 후 메인 화면으로 이동
        setTimeout(() => {
          router.push('/(main)');
        }, 1500);
      } else {
        // 그 외의 경우는 실패로 간주하고 에러를 발생시킵니다.
        throw new Error(result.message || '동화 생성에 실패했습니다.');
      }
    } catch (error) {
      // try 블록에서 발생한 모든 에러를 여기서 처리합니다.
      console.error('Error creating story:', error); // 에러 로그를 콘솔에 출력합니다.
      showPopup(
        '오류',
        error instanceof Error ? error.message : '동화 생성 중 오류가 발생했습니다.'
      );
    } finally {
      // 요청이 성공하든 실패하든 관계없이 항상 실행됩니다.
      setIsLoading(false); // 로딩 상태를 false로 되돌립니다.
    }
  };

  // --- 렌더링 (JSX) ---
  // 화면에 보여질 UI 구조를 정의합니다.
  return (
    // 1. 전체 배경 이미지를 적용하는 컨테이너
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top > 0 ? insets.top : 20 }]}
      >
        <Ionicons name="arrow-back-circle" size={48} color="rgba(255, 255, 255, 0.7)" />
      </TouchableOpacity>
      {/* 2. 배경 위에 어두운 오버레이 효과를 주는 뷰 */}
      <View style={styles.overlay} />
      {/* 3. 화면 콘텐츠를 스크롤 가능하게 만드는 래퍼 */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 4. 메인 UI를 담는 반투명 카드 */}
        <View style={styles.card}>
          {/* 앱 제목 */}
          <Text style={styles.title}>✨ Magic Story Creator ✨</Text>
          {/* 부제 */}
          <Text style={styles.subtitle}>Enter keywords to create your magical English story!</Text>

          {/* 5. 키워드 입력 필드와 추가 버튼을 담는 컨테이너 */}
          <View style={styles.inputContainer}>
            {/* 키워드 입력 필드 */}
            <TextInput
              style={styles.textInput}
              placeholder="Enter a keyword (e.g., dragon, castle, princess...)"
              placeholderTextColor="#999"
              value={currentKeyword} // 입력창의 값은 currentKeyword 상태와 연결됩니다.
              onChangeText={setCurrentKeyword} // 텍스트가 변경될 때마다 currentKeyword 상태를 업데이트합니다.
              onSubmitEditing={handleAddKeyword} // 키보드의 '완료' 버튼을 누르면 키워드를 추가합니다.
            />
            {/* 키워드 추가 버튼 */}
            <TouchableOpacity onPress={handleAddKeyword} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* 6. 추가된 키워드 목록을 보여주는 컨테이너 */}
          <View style={styles.keywordContainer}>
            {/* keywords 배열을 순회하며 각 키워드를 칩 형태로 렌더링합니다. */}
            {keywords.map((keyword, index) => (
              <View key={index} style={styles.keywordChip}>
                <Text style={styles.keywordText}>{keyword}</Text>
                {/* 키워드 삭제 버튼 */}
                <TouchableOpacity onPress={() => handleRemoveKeyword(keyword)}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color="#fff"
                    style={styles.keywordCloseIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* 7. 동화 생성 버튼 */}
          <TouchableOpacity onPress={handleCreateStory} disabled={isLoading}>
            {/* 그라데이션 효과를 적용한 버튼 배경 */}
            <LinearGradient
              colors={['#8A2BE2', '#4B0082']}
              style={[styles.createButton, isLoading && styles.disabledButton]}
            >
              {/* 반짝이는 별 아이콘 */}
              <Ionicons name="sparkles" size={22} color="#fff" />
              {/* 버튼 텍스트 (로딩 상태에 따라 다른 텍스트 표시) */}
              <Text style={styles.createButtonText}>
                {isLoading ? 'Creating Story...' : 'Create My Story!'}
              </Text>
              {/* 아이콘과 텍스트의 중앙 정렬을 위한 보이지 않는 스페이서 */}
              <View style={styles.buttonIconSpacer} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Popup
        visible={popupVisible}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </ImageBackground>
  );
}
