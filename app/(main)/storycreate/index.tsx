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
  BackHandler, // 안드로이드 뒤로가기 버튼 제어
} from 'react-native';

// --- 네비게이션 및 UI 라이브러리 ---
import { router, useFocusEffect } from 'expo-router'; // 화면 간 이동(네비게이션)을 관리하는 객체
import { LinearGradient } from 'expo-linear-gradient'; // 그라데이션 효과를 주는 컴포넌트
import { Ionicons } from '@expo/vector-icons'; // 아이콘을 사용하기 위해 import 합니다.

// --- 내부 모듈 및 타입 정의 ---
import {
  useStoryCreateScreenStyles,
  ICON_SIZES,
  GRADIENT_COLORS,
  COLORS,
} from '@/styles/StoryCreateScreen.styles'; // 이 화면 전용 스타일 시트
import { Popup } from '@/components/ui/Popup'; // 커스텀 팝업 컴포넌트
import { LoadingPopup } from '@/components/ui/LoadingPopup'; // 로딩 팝업 컴포넌트
import { createStory } from '@/features/storyCreate/storyApi';
import { addStoryToStorage, logProfileStructure } from '@/features/storyCreate/storyStorage';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import type { CreateStoryRequest, StoryData, Story } from '@/features/storyCreate/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createQuiz } from '@/features/quiz/quizApi';

// 배경 이미지 파일을 import 합니다.
import backgroundImage from '@/assets/images/background/night-bg.png';

// 동화 생성 화면의 메인 컴포넌트
const StoryCreateScreen = () => {
  // --- 상태 관리 (State) ---
  const styles = useStoryCreateScreenStyles();
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

  // 로딩 팝업 상태 관리
  const [loadingPopupVisible, setLoadingPopupVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(3);

  // 동화 생성 완료 후 퀴즈 자동 생성 함수
  const generateQuizForStory = async (storyId: number, storyKeywords: string[]) => {
    try {
      console.log('🎯 동화 기반 퀴즈 자동 생성 시작:', {
        storyId,
        keywords: storyKeywords,
        keywordsCount: storyKeywords.length,
      });

      // 퀴즈 생성 API 호출 - POST /quizzes
      const quizzes = await createQuiz({
        storyId,
        keywords: storyKeywords.length > 0 ? storyKeywords : undefined,
      });

      console.log('✅ 퀴즈 자동 생성 완료:', {
        storyId,
        generatedQuizzes: quizzes.length,
        quizzes: quizzes.map((q) => ({
          quizId: q.quizId,
          question: q.question.substring(0, 50) + '...',
          optionsCount: Object.keys(q.options).length,
        })),
      });

      return quizzes;
    } catch (error) {
      console.error('❌ 퀴즈 자동 생성 실패:', {
        storyId,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        errorType: error instanceof Error ? error.constructor.name : '알 수 없음',
      });
      // 퀴즈 생성 실패는 동화 생성 실패로 처리하지 않음
      return [];
    }
  };

  // 뒤로가기 방지 로직
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 로딩 중일 때는 뒤로가기 방지
        if (isLoading) {
          console.log('동화 생성 중: 뒤로가기 차단됨');
          return true; // true를 반환하면 뒤로가기를 막음
        }
        return false; // false를 반환하면 기본 뒤로가기 동작 실행
      };

      // 뒤로가기 이벤트 리스너 등록
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // 화면이 포커스를 잃을 때 리스너 제거
      return () => subscription.remove();
    }, [isLoading])
  );

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
   * 음성 입력 버튼을 눌렀을 때 실행되는 함수 (추후 서비스 제공 예정)
   *
   * TODO: NATIVE로 음성 입출력 기능 추가 필요
   * - React Native Voice Recognition 라이브러리 사용
   * - 사용자 음성을 텍스트로 변환하여 키워드 입력
   * - 마이크 권한 요청 및 처리
   * - 음성 인식 시작/중지 상태 관리
   * - 영어 음성 인식 설정 (키워드가 영어이므로)
   */
  const handleVoiceInput = () => {
    showPopup('알림', '음성 입력 기능은 추후 서비스 제공 예정입니다.');
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
    setLoadingPopupVisible(true); // 로딩 팝업 표시
    try {
      // 로그인 상태 확인
      console.log('🔐 로그인 상태 확인 중...');
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ 로그인 토큰이 없습니다. 로그인 화면으로 이동합니다.');
        showPopup('알림', '동화 생성을 위해 로그인이 필요합니다.');
        setTimeout(() => {
          router.push('/(auth)/login');
        }, 1500);
        return;
      }
      console.log('✅ 로그인 상태 확인 완료');

      // 선택된 프로필 불러오기
      const selectedProfile = await loadSelectedProfile();
      if (!selectedProfile) {
        showPopup('오류', '프로필을 먼저 선택해주세요.');
        return;
      }

      // 서버에 보낼 요청 데이터를 구성합니다.
      const requestData: CreateStoryRequest = {
        keywords: keywords, // 키워드 배열 (API 스펙에 맞춤)
        childId: selectedProfile.childId, // 선택된 프로필의 ID 사용
      };

      // 동화 생성 요청 (내부적으로 삽화와 TTS도 함께 생성됨)
      setCurrentStep(1);
      const result: StoryData = await createStory(requestData);

      // 모든 단계 완료
      setCurrentStep(3);

      // 서버 응답에서 실제 동화 데이터 추출 (API 스펙에 따라 직접 객체 반환)
      const storyData = result;

      // 생성된 동화를 로컬에 저장할 데이터 구성
      const storyToSave: Story = {
        ...storyData,
        childId: selectedProfile.childId,
        keywords: storyData.keywords || keywords, // 서버에서 받은 키워드 사용, 없으면 로컬 키워드 사용
      };

      console.log('저장할 동화 데이터:', {
        ...storyToSave,
        content: storyToSave.content
          ? storyToSave.content.split('\n').slice(0, 3).join('\n') +
            (storyToSave.content.split('\n').length > 3 ? '\n...' : '')
          : '없음',
        contentKr: storyToSave.contentKr
          ? storyToSave.contentKr.split('\n').slice(0, 3).join('\n') +
            (storyToSave.contentKr.split('\n').length > 3 ? '\n...' : '')
          : '없음',
      });

      // 프로필별 폴더 구조에 동화 저장
      await addStoryToStorage(storyToSave);

      // 프로필 구조 로깅 (디버깅용)
      await logProfileStructure(selectedProfile.childId);

      // 동화 생성 완료 후 퀴즈 자동 생성
      console.log('🎯 동화 생성 완료, 퀴즈 자동 생성 시작...');
      const generatedQuizzes = await generateQuizForStory(
        storyData.storyId,
        storyData.keywords || keywords
      );

      // 로딩 팝업 숨기기
      setLoadingPopupVisible(false);

      // 성공 메시지 표시 (퀴즈 생성 결과 포함)
      const quizMessage =
        generatedQuizzes.length > 0
          ? `"${storyData.title}" 동화가 생성되었습니다!\n\n🎯 ${generatedQuizzes.length}개의 퀴즈도 함께 생성되었습니다.\n\n잠시 후 영어 학습 화면으로 이동합니다.`
          : `"${storyData.title}" 동화가 생성되었습니다!\n\n⚠️ 퀴즈 생성에 실패했습니다. 나중에 수동으로 생성할 수 있습니다.\n\n잠시 후 영어 학습 화면으로 이동합니다.`;

      showPopup('성공', quizMessage);

      // 성공 팝업 닫힌 후 생성된 동화의 영어 학습 화면으로 이동
      setTimeout(() => {
        router.push({
          pathname: '/(english-learning)',
          params: {
            storyId: storyData.storyId.toString(),
            title: storyData.title,
            content: storyData.content,
            contentKr: storyData.contentKr || '',
            keywords: storyData.keywords?.join(',') || '',
            createdAt: storyData.createdAt,
            updatedAt: storyData.updatedAt,
            childId: selectedProfile.childId.toString(),
          },
        });
      }, 1500);
    } catch (error) {
      // try 블록에서 발생한 모든 에러를 여기서 처리합니다.
      console.error('Error creating story:', error); // 에러 로그를 콘솔에 출력합니다.

      // 로딩 팝업 숨기기
      setLoadingPopupVisible(false);

      // 504 Gateway Timeout 오류에 대한 특별한 안내
      let errorMessage = '동화 생성 중 오류가 발생했습니다.';
      let errorTitle = '오류';

      if (error instanceof Error) {
        if (error.message.includes('504') || error.message.includes('Gateway Timeout')) {
          errorTitle = '삽화 생성 지연';
          errorMessage = `삽화 생성 시간이 너무 오래 걸려서 일시적으로 실패했습니다.\n\n일부 삽화는 이미 생성되었을 수 있습니다.\n\n잠시 후 다시 시도해주세요.`;
        } else if (error.message.includes('삽화 생성')) {
          errorTitle = '삽화 생성 실패';
          errorMessage = `${error.message}\n\n동화와 음성은 정상적으로 생성되었습니다.\n\n삽화는 나중에 다시 시도할 수 있습니다.`;
        } else {
          errorMessage = error.message;
        }
      }

      showPopup(errorTitle, errorMessage);
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
      <View style={styles.overlay} />
      {/* 뒤로가기 버튼: 절대 위치로 배치 */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, isLoading && styles.disabledBackButton]}
        disabled={isLoading}
      >
        <Ionicons
          name="arrow-back"
          size={ICON_SIZES.backButton}
          color={isLoading ? COLORS.disabled : COLORS.headerIcon}
        />
        <Text style={[styles.backButtonText, isLoading && styles.disabledBackButtonText]}>
          Back
        </Text>
      </TouchableOpacity>
      {/* 3. 화면 콘텐츠를 스크롤 가능하게 만드는 래퍼 */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 4. 메인 UI를 담는 반투명 카드 */}
        <View style={styles.card}>
          <View style={styles.contentContainer}>
            {/* 앱 제목 */}
            <Text style={styles.title}>✨ Magic Story Creator ✨</Text>
            {/* 부제 */}
            <Text style={styles.subtitle}>
              Enter keywords to create your magical English story!
            </Text>

            {/* 5. 키워드 입력 필드와 추가 버튼을 담는 컨테이너 */}
            <View style={styles.inputContainer}>
              {/* 키워드 입력 필드 */}
              <TextInput
                style={styles.textInput}
                placeholder="Enter a keyword (e.g., dragon, castle, princess...)"
                placeholderTextColor={COLORS.placeholder}
                value={currentKeyword}
                onChangeText={setCurrentKeyword}
                onSubmitEditing={handleAddKeyword}
              />
              {/* 음성 입력 버튼 (추후 서비스 제공 예정) */}
              {/* TODO: NATIVE 음성 인식 구현 시 아이콘 상태 변경 필요 (mic-outline <-> mic, 색상 변경) */}
              <TouchableOpacity onPress={handleVoiceInput} style={styles.voiceButton}>
                <Ionicons
                  name="mic-outline"
                  size={ICON_SIZES.voiceButton}
                  color={COLORS.voiceButton}
                />
              </TouchableOpacity>
              {/* 키워드 추가 버튼 */}
              <TouchableOpacity onPress={handleAddKeyword} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. 추가된 키워드 목록을 보여주는 컨테이너 (키워드가 있을 때만 표시) */}
          <View style={styles.keywordContainer}>
            {keywords.length > 0 &&
              keywords.map((keyword, index) => (
                <View key={index} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>{keyword}</Text>
                  <TouchableOpacity onPress={() => handleRemoveKeyword(keyword)}>
                    <Ionicons
                      name="close-circle"
                      size={ICON_SIZES.keywordClose}
                      color={styles.keywordCloseIcon.color}
                      style={styles.keywordCloseIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {/* 신축성 있는 빈 공간(스페이서) */}
          <View style={styles.spacer} />

          {/* 7. 동화 생성 버튼 */}
          <TouchableOpacity onPress={handleCreateStory} disabled={isLoading}>
            {/* 그라데이션 효과를 적용한 버튼 배경 */}
            <LinearGradient
              colors={GRADIENT_COLORS.createButton}
              style={[styles.createButton, isLoading && styles.disabledButton]}
            >
              {/* 반짝이는 별 아이콘 */}
              <Ionicons name="sparkles" size={ICON_SIZES.createButtonSparkles} color="#fff" />
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
      <LoadingPopup
        visible={loadingPopupVisible}
        title="동화를 생성중입니다"
        message="잠시만 기다려주세요"
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepMessages={[
          '동화 생성 중...',
          '삽화 생성 중... (예상 2-3분)\nDALL-E AI가 14개 단락의 삽화를 생성합니다',
          '음성 생성 중...',
        ]}
      />
    </ImageBackground>
  );
};

export default StoryCreateScreen;
