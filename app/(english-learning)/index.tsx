import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 내부 모듈 및 스타일 ---
import englishLearningStyles from '@/styles/EnglishLearningScreen.styles';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import {
  loadStoriesByChildId,
  addStoryToStorage,
  loadStoryTTSFromStorage,
  saveStoryTTS,
} from '@/features/storyCreate/storyStorage';
import {
  fetchStorySections,
  fetchIllustrations,
  syncMissingIllustrations,
} from '@/features/storyCreate/storyApi';
import * as FileSystem from 'expo-file-system';
import {
  convertStoryToLearningStoryWithPages,
  convertStoryToLearningStoryWithSections,
  getStoryIllustrationPathFromStory,
} from '@/features/storyCreate/storyUtils';
import { Story, LearningStoryWithSections } from '@/features/storyCreate/types';
import QuizModal from '@/components/ui/QuizModal';
import { Audio } from 'expo-av';
import { requestAllSectionsTTS, TTSAudioInfo } from '@/features/storyCreate/storyApi';
import {
  getQuizzesByStory,
  submitQuiz,
  getQuizResults,
  Quiz,
  QuizSubmitRequest,
} from '@/features/quiz/quizApi';
import { saveWordsByStory, getStoredUserId } from '@/shared/api';
import {
  addFavoriteWord,
  removeFavoriteWord,
  getFavoriteWordsByStory,
} from '@/features/storyCreate/storyStorage';

// --- 이미지 및 리소스 ---
import defaultBackgroundImage from '@/assets/images/background/night-bg.png';

export default function EnglishLearningScreen() {
  const params = useLocalSearchParams();
  const [currentStory, setCurrentStory] = useState<LearningStoryWithSections | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordFavorites, setWordFavorites] = useState<boolean[]>([]);
  const [wordClicked, setWordClicked] = useState<boolean[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [ttsAudioMap, setTtsAudioMap] = useState<{ [sectionId: number]: TTSAudioInfo }>({});
  const [ttsSound, setTtsSound] = useState<Audio.Sound | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isStoryLoaded, setIsStoryLoaded] = useState(false);

  // 퀴즈 관련 상태
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizSubmitRequest[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // TTS 요청 상태 관리
  const [ttsRequested, setTtsRequested] = useState<Set<number>>(new Set());

  // 즐겨찾기 단어 페이지네이션 상태
  const [favoriteWordsPage, setFavoriteWordsPage] = useState(1);
  const [favoriteWordsPerPage] = useState(3); // 한 페이지당 표시할 단어 수 (3개 이상일 때 페이지네이션)

  // 로컬에 동화별 단어 저장하는 함수
  const saveWordsToLocalStorage = async (storyId: number, childId: number, words: any[]) => {
    try {
      const key = `story_words_${storyId}_${childId}`;
      const data = {
        storyId,
        childId,
        words,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log('💾 동화 단어 로컬 저장 완료:', {
        storyId,
        childId,
        wordsCount: words.length,
        key,
      });
    } catch (error) {
      console.error('❌ 동화 단어 로컬 저장 실패:', error);
    }
  };

  // 로컬에서 동화별 단어 불러오는 함수
  const loadWordsFromLocalStorage = async (storyId: number, childId: number) => {
    try {
      const key = `story_words_${storyId}_${childId}`;
      const storedData = await AsyncStorage.getItem(key);

      if (storedData) {
        const data = JSON.parse(storedData);
        const isExpired =
          new Date().getTime() - new Date(data.timestamp).getTime() > 24 * 60 * 60 * 1000; // 24시간

        if (!isExpired && data.words && data.words.length > 0) {
          console.log('📖 로컬에서 동화 단어 불러오기 성공:', {
            storyId,
            childId,
            wordsCount: data.words.length,
            timestamp: data.timestamp,
            isExpired,
          });
          return data.words;
        } else if (isExpired) {
          console.log('⏰ 로컬 단어 데이터가 만료되었습니다. API에서 새로 가져옵니다.');
          await AsyncStorage.removeItem(key); // 만료된 데이터 삭제
        }
      }

      return null;
    } catch (error) {
      console.error('❌ 로컬에서 동화 단어 불러오기 실패:', error);
      return null;
    }
  };

  // 동화별 단어를 가져오는 통합 함수 (로컬 우선, 없으면 API)
  const getWordsForStory = async (storyId: number, childId: number) => {
    try {
      console.log('🔍 동화 단어 조회 시작:', { storyId, childId });

      // 1. 로컬에서 먼저 확인
      const localWords = await loadWordsFromLocalStorage(storyId, childId);
      if (localWords) {
        console.log('✅ 로컬에서 단어 로드 완료:', localWords.length, '개');

        // 로컬에서 가져온 단어를 currentStory에 추가
        setCurrentStory((prevStory) => {
          if (!prevStory) return prevStory;
          return {
            ...prevStory,
            savedWords: localWords,
          };
        });

        // 즐겨찾기 상태 로드
        await loadFavoriteWordsState(childId, localWords, storyId);

        return localWords;
      }

      // 2. 로컬에 없으면 API에서 가져오기
      console.log('🌐 로컬에 단어가 없어 API에서 가져옵니다.');
      const userId = await getStoredUserId();
      if (!userId) {
        console.warn('⚠️ 사용자 ID가 없어 단어 저장을 건너뜁니다.');
        return [];
      }

      const apiWords = await saveWordsByStory(storyId, childId);

      // 3. API에서 가져온 단어를 로컬에 저장
      if (apiWords && apiWords.length > 0) {
        await saveWordsToLocalStorage(storyId, childId, apiWords);
        console.log('💾 API에서 가져온 단어를 로컬에 저장 완료');

        // API에서 가져온 단어를 currentStory에 추가
        setCurrentStory((prevStory) => {
          if (!prevStory) return prevStory;
          return {
            ...prevStory,
            savedWords: apiWords,
          };
        });

        // 즐겨찾기 상태 로드
        await loadFavoriteWordsState(childId, apiWords, storyId);
      }

      return apiWords;
    } catch (error) {
      console.debug('❌ 동화 단어 조회 실패:', error);
      return [];
    }
  };

  // 즐겨찾기 단어 상태 로드 함수
  const loadFavoriteWordsState = useCallback(
    async (childId: number, words: any[], storyId?: number) => {
      try {
        const targetStoryId = storyId || currentStory?.storyId;
        if (!targetStoryId) {
          console.warn('⚠️ storyId가 없어 즐겨찾기 상태를 로드할 수 없습니다.');
          setWordFavorites(new Array(words.length).fill(false));
          return;
        }

        if (!words || words.length === 0) {
          console.warn('⚠️ 단어 배열이 비어있어 즐겨찾기 상태를 로드할 수 없습니다.');
          setWordFavorites([]);
          return;
        }

        // 1. 현재 동화에서 즐겨찾기한 단어들만 조회
        const storyFavorites = await getFavoriteWordsByStory(childId, targetStoryId);
        console.log(
          '🔍 즐겨찾기된 단어들:',
          storyFavorites.map((f) => f.word)
        );

        // 2. 현재 동화의 단어들이 즐겨찾기에 있는지 확인 (더 정확한 매칭)
        const favoriteStates = words.map((word, index) => {
          const isFavorite = storyFavorites.some((fav) => fav.word === word.word);
          // console.log(
          //   `🔍 단어 "${word.word}" (인덱스 ${index}): 즐겨찾기 ${isFavorite ? '✅' : '❌'}`
          // );
          return isFavorite;
        });

        // 3. 즐겨찾기 상태 설정
        setWordFavorites(favoriteStates);

        console.log('⭐ 현재 동화 즐겨찾기 상태 로드 완료:', {
          storyId: targetStoryId,
          totalWords: words.length,
          favoriteCount: favoriteStates.filter((f) => f).length,
          storyFavorites: storyFavorites.length,
          favoriteWords: words.filter((_, index) => favoriteStates[index]).map((w) => w.word),
        });
      } catch (error) {
        console.error('❌ 즐겨찾기 상태 로드 실패:', error);
        // 기본값으로 초기화
        setWordFavorites(new Array(words.length).fill(false));
      }
    },
    [currentStory?.storyId]
  );

  // 컴포넌트 마운트 시 동화 데이터 로드
  useEffect(() => {
    const loadStoryData = async () => {
      try {
        if (params.storyId && params.title && params.content) {
          const storyData: Story = {
            storyId: parseInt(params.storyId as string),
            title: params.title as string,
            content: params.content as string,
            contentKr: params.contentKr as string,
            keywords: params.keywords ? (params.keywords as string).split(',') : [],
            childId: 0, // 나중에 설정
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // 선택된 프로필 불러오기
          const selectedProfile = await loadSelectedProfile();
          if (selectedProfile && selectedProfile.childId) {
            storyData.childId = selectedProfile.childId;
            console.log('✅ 선택된 프로필에서 childId 설정:', storyData.childId);
          } else {
            console.warn('⚠️ 선택된 프로필이 없거나 childId가 유효하지 않음:', selectedProfile);
            console.log('기본 childId 사용:', storyData.childId);
          }

          console.log('동화 데이터 로드 시작:', {
            storyId: storyData.storyId,
            title: storyData.title,
            childId: storyData.childId,
            hasValidChildId: storyData.childId > 0,
          });

          // API에서 동화 단락 조회
          try {
            console.log(`동화 ${storyData.storyId} 단락 조회 시작...`);
            console.log('🔍 단락 조회 파라미터:', {
              storyId: storyData.storyId,
              childId: storyData.childId,
              hasValidStoryId: !!storyData.storyId && storyData.storyId > 0,
              hasValidChildId: !!storyData.childId && storyData.childId > 0,
            });

            const sections = await fetchStorySections(storyData.storyId, storyData.childId);
            console.log(`동화 ${storyData.storyId} 단락 조회 완료:`, sections.length, '개 단락');

            if (sections.length === 0) {
              console.warn(
                `⚠️ 동화 ${storyData.storyId}의 단락이 0개입니다. API 응답을 확인해보세요.`
              );
            }

            const learningStory = convertStoryToLearningStoryWithSections(storyData, sections);
            console.log('✅ 동화 단락 변환 완료:', {
              title: learningStory.title,
              content: learningStory.content
                ? learningStory.content.split('\n').slice(0, 3).join('\n') +
                  (learningStory.content.split('\n').length > 3 ? '\n...' : '')
                : '없음',
              contentLength: learningStory.content?.length || 0,
              sectionsCount: learningStory.sections?.length || 0,
            });
            setCurrentStory(learningStory);
            setIsStoryLoaded(true);

            // 단어 즐겨찾기 상태 초기화
            setWordFavorites(new Array(learningStory.savedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.savedWords?.length || 0).fill(false));

            // 동화에서 단어 추출 및 저장 (로컬 우선, 없으면 API)
            await getWordsForStory(storyData.storyId, storyData.childId);
          } catch (sectionError) {
            console.error(`동화 ${storyData.storyId} 단락 조회 실패:`, {
              error: sectionError,
              errorMessage:
                sectionError instanceof Error ? sectionError.message : '알 수 없는 오류',
              errorType: sectionError.constructor.name,
              storyId: storyData.storyId,
              childId: storyData.childId,
            });
            console.log('기존 방식으로 동화 로드 (프론트엔드 단락 분할)...');

            // API 실패 시 기존 방식 사용
            const learningStory = convertStoryToLearningStoryWithPages(storyData);
            const fallbackStory = {
              ...learningStory,
              sections: [], // 빈 배열로 설정
              highlightedWords: learningStory.highlightedWords || [], // 안전장치 추가
            };
            console.log('✅ 기존 방식으로 동화 변환 완료:', {
              title: fallbackStory.title,
              content: fallbackStory.content
                ? fallbackStory.content.split('\n').slice(0, 3).join('\n') +
                  (fallbackStory.content.split('\n').length > 3 ? '\n...' : '')
                : '없음',
              contentLength: fallbackStory.content?.length || 0,
            });
            setCurrentStory(fallbackStory);
            setIsStoryLoaded(true);

            setWordFavorites(new Array(learningStory.highlightedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords?.length || 0).fill(false));
          }

          // 삽화 이미지 로드 (재시도 없음)
          if (!storyData.childId || storyData.childId <= 0) {
            console.warn(
              `⚠️ 동화 ${storyData.storyId}의 childId가 유효하지 않음:`,
              storyData.childId
            );
            console.log('삽화 로드 건너뛰기 - 기본 배경 사용');
            setBackgroundImage(null);
          } else {
            console.log(`동화 ${storyData.storyId} 삽화 이미지 로드 시작...`);

            try {
              // 해당 동화의 삽화 동기화 (1회만 시도)
              await syncMissingIllustrations([storyData.storyId], storyData.childId);

              // 서버에서 최신 삽화 목록 조회
              const illustrations = await fetchIllustrations(storyData.childId);
              const storyIllustrations = illustrations.filter(
                (illustration) => illustration.storyId === storyData.storyId
              );

              console.log(`동화 ${storyData.storyId} 삽화 정보:`, {
                totalIllustrations: illustrations.length,
                storyIllustrations: storyIllustrations.length,
                illustrations: storyIllustrations.map((ill) => ({
                  id: ill.illustrationId,
                  orderIndex: ill.orderIndex,
                  hasImageUrl: !!ill.imageUrl,
                })),
              });

              if (storyIllustrations.length > 0) {
                // Story 객체에 illustrations 정보 추가
                const storyWithIllustrations = {
                  ...storyData,
                  illustrations: storyIllustrations.map((illustration) => ({
                    illustrationId: illustration.illustrationId,
                    storyId: illustration.storyId,
                    orderIndex: illustration.orderIndex,
                    localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`,
                    imageUrl: illustration.imageUrl,
                    description: illustration.description,
                    createdAt: illustration.createdAt,
                  })),
                };

                // Story 객체를 illustrations 정보와 함께 저장
                await addStoryToStorage(storyWithIllustrations);

                // LearningStoryWithSections 객체에 삽화 정보 추가
                setCurrentStory((prevStory) => {
                  const learningStoryWithIllustrations = {
                    ...prevStory,
                    illustrations: storyWithIllustrations.illustrations,
                    content: prevStory?.content || storyData.content,
                    title: prevStory?.title || storyData.title,
                    contentKr: prevStory?.contentKr || storyData.contentKr,
                    highlightedWords: prevStory?.highlightedWords || [],
                    sections: prevStory?.sections || [],
                    totalPages: prevStory?.sections?.length || 1,
                    storyId: prevStory?.storyId || storyData.storyId,
                    childId: prevStory?.childId || storyData.childId,
                    keywords: prevStory?.keywords || storyData.keywords,
                    savedWords: prevStory?.savedWords || [],
                  };
                  console.log('✅ 삽화 정보 추가 후 currentStory 업데이트:', {
                    title: learningStoryWithIllustrations.title,
                    contentLength: learningStoryWithIllustrations.content?.length || 0,
                    sectionsCount: learningStoryWithIllustrations.sections?.length || 0,
                    illustrationsCount: learningStoryWithIllustrations.illustrations?.length || 0,
                  });
                  return learningStoryWithIllustrations;
                });

                // 삽화 경로 확인
                const illustrationPath =
                  await getStoryIllustrationPathFromStory(storyWithIllustrations);
                if (illustrationPath) {
                  setBackgroundImage(illustrationPath);
                  console.log(`동화 ${storyData.storyId} 로컬 삽화 배경 설정:`, illustrationPath);
                } else {
                  setBackgroundImage(null);
                  console.log(`동화 ${storyData.storyId} 삽화 이미지가 없습니다. 기본 배경 사용`);
                }
              } else {
                setBackgroundImage(null);
                console.log(`동화 ${storyData.storyId}에 해당하는 삽화가 없습니다. 기본 배경 사용`);
              }
            } catch (illustrationError) {
              console.error('삽화 정보 조회 실패 (재시도 없음):', illustrationError);
              setBackgroundImage(null);
            }
          }

          console.log('동화 데이터 로드 완료:', {
            title: currentStory?.title,
            contentLength: currentStory?.content?.length || 0,
            highlightedWordsCount: currentStory?.highlightedWords?.length || 0,
            sectionsCount: currentStory?.sections?.length || 0,
            hasBackgroundImage: !!backgroundImage,
            currentStoryKeys: currentStory ? Object.keys(currentStory) : [],
            currentStoryContent: currentStory?.content
              ? currentStory.content.split('\n').slice(0, 3).join('\n') +
                (currentStory.content.split('\n').length > 3 ? '\n...' : '')
              : '없음',
          });
        } else {
          // 기존 로직: 선택된 프로필의 최신 동화 사용
          const selectedProfile = await loadSelectedProfile();
          if (!selectedProfile || !selectedProfile.childId || selectedProfile.childId <= 0) {
            console.warn('⚠️ 선택된 프로필이 없거나 childId가 유효하지 않음:', selectedProfile);
            console.log('동화 로드 건너뛰기');
            return;
          }

          console.log('✅ 선택된 프로필 확인:', {
            childId: selectedProfile.childId,
            name: selectedProfile.name,
          });

          const stories = await loadStoriesByChildId(selectedProfile.childId);
          if (stories.length === 0) {
            console.log('동화가 없습니다.');
            return;
          }

          const latestStory = stories[0];
          console.log('최신 동화 데이터:', {
            storyId: latestStory.storyId,
            title: latestStory.title,
            childId: latestStory.childId,
            hasValidChildId: latestStory.childId > 0,
          });

          // API에서 동화 단락 조회
          try {
            console.log(`동화 ${latestStory.storyId} 단락 조회 시작...`);
            console.log('🔍 최신 동화 단락 조회 파라미터:', {
              storyId: latestStory.storyId,
              childId: latestStory.childId,
              hasValidStoryId: !!latestStory.storyId && latestStory.storyId > 0,
              hasValidChildId: !!latestStory.childId && latestStory.childId > 0,
            });

            const sections = await fetchStorySections(latestStory.storyId, latestStory.childId);
            console.log(`동화 ${latestStory.storyId} 단락 조회 완료:`, sections.length, '개 단락');

            if (sections.length === 0) {
              console.warn(
                `⚠️ 최신 동화 ${latestStory.storyId}의 단락이 0개입니다. API 응답을 확인해보세요.`
              );
            }

            const learningStory = convertStoryToLearningStoryWithSections(latestStory, sections);
            console.log('✅ 최신 동화 단락 변환 완료:', {
              title: learningStory.title,
              content: learningStory.content
                ? learningStory.content.split('\n').slice(0, 3).join('\n') +
                  (learningStory.content.split('\n').length > 3 ? '\n...' : '')
                : '없음',
              contentLength: learningStory.content?.length || 0,
              sectionsCount: learningStory.sections?.length || 0,
            });
            setCurrentStory(learningStory);
            setIsStoryLoaded(true);

            setWordFavorites(new Array(learningStory.highlightedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords?.length || 0).fill(false));

            // 최신 동화에서 단어 자동 저장 (로컬 우선, 없으면 API)
            await getWordsForStory(latestStory.storyId, latestStory.childId);
          } catch (sectionError) {
            console.error(`동화 ${latestStory.storyId} 단락 조회 실패:`, {
              error: sectionError,
              errorMessage:
                sectionError instanceof Error ? sectionError.message : '알 수 없는 오류',
              errorType: sectionError.constructor.name,
              storyId: latestStory.storyId,
              childId: latestStory.childId,
            });
            console.log('기존 방식으로 동화 로드 (프론트엔드 단락 분할)...');

            // API 실패 시 기존 방식 사용
            const learningStory = convertStoryToLearningStoryWithPages(latestStory);
            const fallbackStory = {
              ...learningStory,
              sections: [],
              highlightedWords: learningStory.highlightedWords || [], // 안전장치 추가
            };
            console.log('✅ 최신 동화 기존 방식 변환 완료:', {
              title: fallbackStory.title,
              content: fallbackStory.content
                ? fallbackStory.content.split('\n').slice(0, 3).join('\n') +
                  (fallbackStory.content.split('\n').length > 3 ? '\n...' : '')
                : '없음',
              contentLength: fallbackStory.content?.length || 0,
            });
            setCurrentStory(fallbackStory);
            setIsStoryLoaded(true);

            setWordFavorites(new Array(learningStory.highlightedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords?.length || 0).fill(false));
          }

          // 삽화 이미지 로드 (재시도 없음)
          if (!latestStory.childId || latestStory.childId <= 0) {
            console.warn(
              `⚠️ 동화 ${latestStory.storyId}의 childId가 유효하지 않음:`,
              latestStory.childId
            );
            console.log('삽화 로드 건너뛰기 - 기본 배경 사용');
            setBackgroundImage(null);
          } else {
            console.log(`동화 ${latestStory.storyId} 삽화 이미지 로드 시작...`);

            try {
              // 해당 동화의 삽화 동기화 (1회만 시도)
              await syncMissingIllustrations([latestStory.storyId], latestStory.childId);

              // 서버에서 최신 삽화 목록 조회
              const illustrations = await fetchIllustrations(latestStory.childId);
              const storyIllustrations = illustrations.filter(
                (illustration) => illustration.storyId === latestStory.storyId
              );

              console.log(`동화 ${latestStory.storyId} 삽화 정보:`, {
                totalIllustrations: illustrations.length,
                storyIllustrations: storyIllustrations.length,
                illustrations: storyIllustrations.map((ill) => ({
                  id: ill.illustrationId,
                  orderIndex: ill.orderIndex,
                  hasImageUrl: !!ill.imageUrl,
                })),
              });

              if (storyIllustrations.length > 0) {
                // Story 객체에 illustrations 정보 추가
                const storyWithIllustrations = {
                  ...latestStory,
                  illustrations: storyIllustrations.map((illustration) => ({
                    illustrationId: illustration.illustrationId,
                    storyId: illustration.storyId,
                    orderIndex: illustration.orderIndex,
                    localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`,
                    imageUrl: illustration.imageUrl,
                    description: illustration.description,
                    createdAt: illustration.createdAt,
                  })),
                };

                // Story 객체를 illustrations 정보와 함께 저장
                await addStoryToStorage(storyWithIllustrations);

                // LearningStoryWithSections 객체에 삽화 정보 추가
                setCurrentStory((prevStory) => {
                  const learningStoryWithIllustrations = {
                    ...prevStory,
                    illustrations: storyWithIllustrations.illustrations,
                    content: prevStory?.content || latestStory.content,
                    title: prevStory?.title || latestStory.title,
                    contentKr: prevStory?.contentKr || latestStory.contentKr,
                    highlightedWords: prevStory?.highlightedWords || [],
                    sections: prevStory?.sections || [],
                    totalPages: prevStory?.sections?.length || 1,
                    storyId: prevStory?.storyId || latestStory.storyId,
                    childId: prevStory?.childId || latestStory.childId,
                    keywords: prevStory?.keywords || latestStory.keywords,
                    savedWords: prevStory?.savedWords || [],
                  };
                  console.log('✅ 최신 동화 삽화 정보 추가 후 currentStory 업데이트:', {
                    title: learningStoryWithIllustrations.title,
                    contentLength: learningStoryWithIllustrations.content?.length || 0,
                    sectionsCount: learningStoryWithIllustrations.sections?.length || 0,
                    illustrationsCount: learningStoryWithIllustrations.illustrations?.length || 0,
                  });
                  return learningStoryWithIllustrations;
                });

                // 삽화 경로 확인
                const illustrationPath =
                  await getStoryIllustrationPathFromStory(storyWithIllustrations);
                if (illustrationPath) {
                  setBackgroundImage(illustrationPath);
                  console.log(`동화 ${latestStory.storyId} 로컬 삽화 배경 설정:`, illustrationPath);
                } else {
                  setBackgroundImage(null);
                  console.log(`동화 ${latestStory.storyId} 삽화 이미지가 없습니다. 기본 배경 사용`);
                }
              } else {
                setBackgroundImage(null);
                console.log(
                  `동화 ${latestStory.storyId}에 해당하는 삽화가 없습니다. 기본 배경 사용`
                );
              }
            } catch (illustrationError) {
              console.error('삽화 정보 조회 실패 (재시도 없음):', illustrationError);
              setBackgroundImage(null);
            }
          }
        }
      } catch (error) {
        console.error('동화 데이터 로드 실패:', error);
      }
    };

    loadStoryData();
  }, [params.storyId, params.title, params.content, params.keywords]);

  // 화면이 포커스될 때마다 즐겨찾기 상태 다시 로드
  useFocusEffect(
    useCallback(() => {
      if (currentStory && currentStory.storyId && currentStory.childId) {
        const words = currentStory.savedWords || currentStory.highlightedWords || [];
        if (words.length > 0) {
          console.log('🔄 화면 포커스됨 - 즐겨찾기 상태 다시 로드:', {
            storyId: currentStory.storyId,
            childId: currentStory.childId,
            wordsCount: words.length,
            wordsType: currentStory.savedWords ? 'savedWords' : 'highlightedWords',
            currentWordFavoritesLength: wordFavorites.length,
          });

          // wordFavorites 배열 길이를 현재 단어 수에 맞춰 초기화
          if (wordFavorites.length !== words.length) {
            console.log('🔄 wordFavorites 배열 길이 조정:', {
              from: wordFavorites.length,
              to: words.length,
            });
            setWordFavorites(new Array(words.length).fill(false));
          }

          loadFavoriteWordsState(currentStory.childId, words, currentStory.storyId);
        } else {
          console.log('🔄 화면 포커스됨 - 단어가 없어 즐겨찾기 상태 로드 건너뛰기');
          setWordFavorites([]);
        }
      }
    }, [currentStory, loadFavoriteWordsState, wordFavorites.length])
  );

  // currentStory 로드 완료 후 퀴즈 로드
  useEffect(() => {
    if (currentStory && currentStory.storyId && currentStory.childId) {
      console.log('🎯 동화 로드 완료, 퀴즈 준비');
      loadQuizzes();
    }
  }, [currentStory]);

  // currentStory 상태 변경 감지
  /*
  {
    "content": "없음",           // 동화 내용이 없음
    "contentLength": 0,          // 내용 길이가 0
    "hasStory": false,           // 동화 데이터가 없음
    "highlightedWordsCount": 0,  // 하이라이트된 단어가 0개
    "sections": [],              // 동화 단락이 빈 배열
    "sectionsCount": 0,          // 단락 수가 0
    "storyKeys": [],             // 동화 객체의 키가 없음
    "title": "없음"              // 제목이 없음
  }
  */
  useEffect(() => {
    // 실제 동화 데이터가 있을 때만 로그 출력
    if (currentStory && currentStory.title && currentStory.content) {
      console.log('🔄 currentStory 상태 변경:', {
        hasStory: !!currentStory,
        title: currentStory.title,
        content: currentStory.content
          ? currentStory.content.split('\n').slice(0, 3).join('\n') +
            (currentStory.content.split('\n').length > 3 ? '\n...' : '')
          : '없음',
        contentLength: currentStory.content?.length || 0,
        sectionsCount: currentStory.sections?.length || 0,
        highlightedWordsCount: currentStory.highlightedWords?.length || 0,
        storyKeys: Object.keys(currentStory),
        sections: currentStory.sections
          ? currentStory.sections.map((s, i) => ({
              index: i,
              orderIndex: s.orderIndex,
              textPreview: s.paragraphText?.substring(0, 30) + '...',
            }))
          : [],
      });
    }
  }, [currentStory]);

  // 기존 useEffect 내부, 동화 단락 조회 성공 후 추가
  useEffect(() => {
    if (currentStory && currentStory.sections && currentStory.sections.length > 0) {
      // 이미 TTS를 요청한 동화인지 확인
      if (ttsRequested.has(currentStory.storyId)) {
        console.log('🎵 TTS 이미 요청됨, 로컬에서만 확인:', currentStory.storyId);
        return;
      }

      console.log('🎵 TTS 요청 시작:', {
        storyId: currentStory.storyId,
        sectionsCount: currentStory.sections.length,
        voiceId: 'Seoyeon',
        speechRate: 0.8,
      });

      // TTS 요청 상태에 추가
      setTtsRequested((prev) => new Set(prev).add(currentStory.storyId));

      // 로컬에서 TTS 정보 확인
      loadStoryTTSFromStorage(currentStory.childId, currentStory.storyId)
        .then(async (localTTSMap) => {
          if (Object.keys(localTTSMap).length > 0) {
            console.log('✅ 로컬 TTS 정보 발견:', Object.keys(localTTSMap).length, '개 단락');

            // 실제 파일이 존재하는지 확인
            const validTTSInfo: { [sectionId: number]: { audioPath: string; ttsUrl: string } } = {};
            let hasValidFiles = false;

            for (const [sectionId, ttsInfo] of Object.entries(localTTSMap)) {
              try {
                const fileInfo = await FileSystem.getInfoAsync(ttsInfo.audioPath);
                if (fileInfo.exists) {
                  validTTSInfo[parseInt(sectionId)] = ttsInfo;
                  hasValidFiles = true;
                } else {
                  console.log(`⚠️ TTS 파일이 존재하지 않음: ${ttsInfo.audioPath}`);
                }
              } catch (error) {
                console.log(`⚠️ TTS 파일 확인 실패: ${ttsInfo.audioPath}`, error);
              }
            }

            if (hasValidFiles && Object.keys(validTTSInfo).length > 0) {
              console.log(
                '✅ 유효한 로컬 TTS 파일 사용:',
                Object.keys(validTTSInfo).length,
                '개 단락'
              );
              // 유효한 TTS 정보를 TTSAudioInfo 타입으로 변환
              const ttsAudioMap: { [sectionId: number]: TTSAudioInfo } = {};
              Object.entries(validTTSInfo).forEach(([sectionId, ttsInfo]) => {
                ttsAudioMap[parseInt(sectionId)] = {
                  storyId: currentStory.storyId,
                  sectionId: parseInt(sectionId),
                  audioPath: ttsInfo.audioPath,
                  ttsUrl: ttsInfo.ttsUrl,
                };
              });
              setTtsAudioMap(ttsAudioMap);

              // 유효하지 않은 파일 정보가 있으면 로컬 저장소 업데이트
              if (Object.keys(validTTSInfo).length !== Object.keys(localTTSMap).length) {
                console.log('🔄 유효하지 않은 TTS 파일 정보 제거 및 로컬 저장소 업데이트');
                saveStoryTTS(currentStory.childId, currentStory.storyId, validTTSInfo);
              }
            } else {
              console.log('🔄 유효한 로컬 TTS 파일이 없음, API 요청 진행');
              // 유효한 파일이 없으면 로컬 정보 삭제
              saveStoryTTS(currentStory.childId, currentStory.storyId, {});
              requestTTSFromAPI(currentStory);
            }
          } else {
            console.log('🔄 로컬 TTS 정보 없음, API 요청 진행');
            requestTTSFromAPI(currentStory);
          }
        })
        .catch((error) => {
          console.warn('⚠️ 로컬 TTS 정보 로드 실패:', error.message);
          // 로컬 저장소 로드 실패 시 API 요청
          requestTTSFromAPI(currentStory);
        });
    }
  }, [currentStory?.storyId, ttsRequested]);

  // API에서 TTS 요청하는 함수
  const requestTTSFromAPI = (story: LearningStoryWithSections) => {
    requestAllSectionsTTS(story.childId, story.storyId, story.sections, 'Seoyeon', 0.8)
      .then((ttsList) => {
        console.log('✅ TTS 요청 완료:', ttsList.length, '개 단락');
        const map: { [sectionId: number]: TTSAudioInfo } = {};
        ttsList.forEach((info) => {
          map[info.sectionId] = info;
        });
        setTtsAudioMap(map);
        // TTS 정보를 로컬에 저장할 수 있는 형태로 변환
        const ttsInfoForStorage: { [sectionId: number]: { audioPath: string; ttsUrl: string } } =
          {};
        ttsList.forEach((info) => {
          ttsInfoForStorage[info.sectionId] = {
            audioPath: info.audioPath,
            ttsUrl: info.ttsUrl,
          };
        });
        saveStoryTTS(story.childId, story.storyId, ttsInfoForStorage);
      })
      .catch((error) => {
        console.warn('⚠️ TTS 요청 실패, 음성 없이 동화 학습 진행:', error.message);
        // TTS 실패해도 동화 학습은 계속 진행
        setTtsAudioMap({});
      });
  };

  // 하이라이트된 텍스트를 굵은 글씨로 변환하는 함수
  const formatHighlightedText = (text: string) => {
    if (!text) return '';

    // **단어** 형태를 찾아서 ** 제거
    return text.replace(/\*\*(.*?)\*\*/g, (match, word) => {
      return word; // ** 제거하고 단어만 반환
    });
  };

  // 현재 페이지의 영어 텍스트 가져오기
  const getCurrentPageText = () => {
    if (!currentStory) {
      console.log('❌ getCurrentPageText: currentStory가 null입니다');
      return '';
    }

    // console.log('🔍 getCurrentPageText 디버깅:', {
    //   hasSections: !!currentStory.sections,
    //   sectionsLength: currentStory.sections?.length || 0,
    //   hasContent: !!currentStory.content,
    //   contentLength: currentStory.content?.length || 0,
    //   currentPage,
    //   storyTitle: currentStory.title,
    // });

    // API에서 받아온 단락이 있으면 사용
    if (currentStory.sections && currentStory.sections.length > 0) {
      const currentSection = currentStory.sections[currentPage - 1];
      console.log('📖 현재 단락 정보:', {
        page: currentPage,
        totalPages: currentStory.sections.length,
        section: currentSection,
        orderIndex: currentSection?.orderIndex,
        paragraphText: currentSection?.paragraphText?.substring(0, 50) + '...',
      });

      if (currentSection) {
        return formatHighlightedText(currentSection.paragraphText);
      } else {
        console.warn(`⚠️ 페이지 ${currentPage}에 해당하는 단락이 없습니다.`);
        return '이 페이지의 내용을 찾을 수 없습니다.';
      }
    }

    // 기존 방식 (전체 내용을 현재 페이지로 표시)
    return formatHighlightedText(currentStory.content || '');
  };

  // 현재 페이지의 한국어 번역 가져오기
  const getCurrentPageKoreanText = () => {
    if (!currentStory) return '';

    // API에서 받아온 단락이 있으면 사용
    if (currentStory.sections && currentStory.sections.length > 0) {
      const currentSection = currentStory.sections[currentPage - 1];
      if (currentSection) {
        return formatHighlightedText(currentSection.paragraphTextKr);
      } else {
        return '이 페이지의 번역을 찾을 수 없습니다.';
      }
    }

    // 기존 방식 (전체 한국어 내용)
    return formatHighlightedText(currentStory.contentKr || '');
  };

  // 현재 페이지에 있는 단어만 필터링하는 함수
  const getCurrentPageWords = () => {
    if (!currentStory?.savedWords) {
      console.log('📚 getCurrentPageWords: 단어 데이터 로딩 중...', {
        hasCurrentStory: !!currentStory,
        storyTitle: currentStory?.title || '없음',
        currentPage,
        hasSections: !!currentStory?.sections,
        sectionsLength: currentStory?.sections?.length || 0,
      });
      return [];
    }

    if (currentStory.savedWords.length === 0) {
      console.warn('⚠️ getCurrentPageWords: 단어 데이터가 비어있습니다:', {
        hasCurrentStory: !!currentStory,
        storyTitle: currentStory?.title || '없음',
        savedWordsLength: 0,
        currentPage,
      });
      return [];
    }

    // 원본 텍스트를 가져와서 **로 감싸진 단어들을 찾기
    let currentPageText = '';
    if (currentStory.sections && currentStory.sections.length > 0) {
      const currentSection = currentStory.sections[currentPage - 1];
      if (currentSection) {
        currentPageText = currentSection.paragraphText || '';
      }
    } else {
      currentPageText = currentStory.content || '';
    }

    if (!currentPageText) {
      console.warn('⚠️ getCurrentPageWords: 현재 페이지 텍스트가 없습니다:', {
        currentPage,
        hasSections: !!currentStory.sections,
        sectionsLength: currentStory.sections?.length || 0,
        currentSection: currentStory.sections?.[currentPage - 1],
      });
      return [];
    }

    // 현재 페이지 텍스트에서 **로 감싸진 단어들을 찾기
    const highlightedWords = currentPageText.match(/\*\*(.*?)\*\*/g);
    if (!highlightedWords) {
      console.warn('⚠️ getCurrentPageWords: 하이라이트된 단어가 없습니다:', {
        currentPageText: currentPageText.substring(0, 100) + '...',
        currentPage,
      });
      return [];
    }

    // ** 제거하고 실제 단어만 추출
    const wordsInCurrentPage = highlightedWords.map((word) => word.replace(/\*\*/g, ''));

    // savedWords에서 현재 페이지에 있는 단어들만 필터링
    const currentPageWords = currentStory.savedWords.filter((savedWord) =>
      wordsInCurrentPage.includes(savedWord.word)
    );

    console.log('🔍 현재 페이지 단어 필터링:', {
      currentPage,
      highlightedWords,
      wordsInCurrentPage,
      totalSavedWords: currentStory.savedWords.length,
      currentPageWordsCount: currentPageWords.length,
      currentPageWordsList: currentPageWords.map((w) => w.word),
    });

    return currentPageWords;
  };

  // 즐겨찾기 단어 페이지네이션 핸들러
  const handleFavoriteWordsPageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && favoriteWordsPage > 1) {
      setFavoriteWordsPage(favoriteWordsPage - 1);
    } else if (direction === 'next') {
      const totalFavoriteWords =
        currentStory?.savedWords?.filter((_, index) => wordFavorites[index]).length || 0;
      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);
      if (favoriteWordsPage < maxPage) {
        setFavoriteWordsPage(favoriteWordsPage + 1);
      }
    }
  };

  // 현재 즐겨찾기 단어 페이지의 단어들 가져오기
  const getCurrentFavoriteWordsPage = () => {
    if (!currentStory?.savedWords) return [];

    // 전체 동화에서의 등장 순서를 계산
    const favoriteWords = currentStory.savedWords
      .map((wordData, savedIndex) => {
        // 동화 전체에서 이 단어가 몇 번째로 등장했는지 찾기
        let globalOrder = Infinity; // 기본값

        if (currentStory.sections) {
          for (let sectionIndex = 0; sectionIndex < currentStory.sections.length; sectionIndex++) {
            const section = currentStory.sections[sectionIndex];
            if (section.paragraphText) {
              const wordIndex = section.paragraphText
                .toLowerCase()
                .indexOf(wordData.word.toLowerCase());
              if (wordIndex !== -1) {
                // 이 단어가 이 단락에서 발견됨
                globalOrder = sectionIndex * 1000 + wordIndex; // 단락 순서 * 1000 + 단어 위치
                break;
              }
            }
          }
        }

        return { wordData, savedIndex, globalOrder };
      })
      .filter(({ savedIndex }) => wordFavorites[savedIndex])
      .sort((a, b) => {
        // 전체 동화에서의 등장 순서로 정렬
        // globalOrder가 낮을수록(먼저 등장한 단어일수록) 앞에 오도록
        return a.globalOrder - b.globalOrder;
      });

    const startIndex = (favoriteWordsPage - 1) * favoriteWordsPerPage;
    const endIndex = startIndex + favoriteWordsPerPage;

    return favoriteWords.slice(startIndex, endIndex);
  };

  // 읽어주기 버튼 핸들러
  const handleTextToSpeech = async () => {
    if (!currentStory || !currentStory.sections || currentStory.sections.length === 0) {
      Alert.alert('TTS', '동화 단락 정보가 없습니다.');
      return;
    }

    const section = currentStory.sections[currentPage - 1];
    if (!section) {
      Alert.alert('TTS', '현재 단락을 찾을 수 없습니다.');
      return;
    }

    const ttsInfo = ttsAudioMap[section.sectionId];
    if (!ttsInfo) {
      Alert.alert(
        'TTS',
        '이 단락의 음성 파일이 준비되지 않았습니다.\nTTS 서비스에 문제가 있을 수 있습니다.'
      );
      return;
    }

    try {
      if (ttsSound) {
        await ttsSound.unloadAsync();
        setTtsSound(null);
      }

      console.log('🔊 TTS 재생 시작:', {
        sectionId: section.sectionId,
        audioPath: ttsInfo.audioPath,
        ttsUrl: ttsInfo.ttsUrl,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: ttsInfo.audioPath });
      setTtsSound(sound);
      await sound.playAsync();

      console.log('✅ TTS 재생 성공');
    } catch (error) {
      console.error('❌ TTS 재생 실패:', error);
      Alert.alert('TTS', '음성 재생에 실패했습니다.\n파일이 손상되었거나 접근할 수 없습니다.');
    }
  };

  // 단어 클릭 핸들러
  const handleWordPress = useCallback(
    (index: number) => {
      // 현재 페이지의 단어만 필터링하여 인덱스 매핑
      const currentPageWords = getCurrentPageWords();

      if (currentPageWords.length === 0) {
        console.warn('⚠️ 현재 페이지에 단어가 없습니다:', {
          index,
          currentPage,
          hasCurrentStory: !!currentStory,
          hasSavedWords: !!currentStory?.savedWords,
          savedWordsLength: currentStory?.savedWords?.length || 0,
        });
        return;
      }

      const wordData = currentPageWords[index];

      if (!wordData) {
        console.warn('⚠️ 현재 페이지에서 해당 인덱스의 단어 데이터를 찾을 수 없습니다:', {
          index,
          currentPageWordsCount: currentPageWords.length,
          currentPageWords: currentPageWords.map((w) => w.word),
        });
        return;
      }

      // 현재 상태를 직접 복사하여 변경
      const newWordClicked = [...wordClicked];
      newWordClicked[index] = !newWordClicked[index];

      // 상태 업데이트를 최적화
      setWordClicked(newWordClicked);

      console.log('🔍 단어 클릭:', {
        wordIndex: index,
        word: wordData.word,
        isClicked: newWordClicked[index],
        action: newWordClicked[index] ? '한글 뜻 표시' : '한글 뜻 숨김',
      });
    },
    [wordClicked, currentPage, currentStory] // currentStory 추가하여 의존성 복원
  );

  // 단어 즐겨찾기 토글 핸들러
  const handleToggleWordFavorite = useCallback(
    async (index: number) => {
      if (!currentStory?.childId) {
        console.warn('⚠️ childId가 없어 즐겨찾기를 설정할 수 없습니다.');
        return;
      }

      // 현재 페이지의 단어만 필터링
      const currentPageWords = getCurrentPageWords();

      if (currentPageWords.length === 0) {
        console.warn('⚠️ 현재 페이지에 단어가 없습니다:', {
          index,
          currentPage,
          hasCurrentStory: !!currentStory,
          hasSavedWords: !!currentStory?.savedWords,
          savedWordsLength: currentStory?.savedWords?.length || 0,
        });
        return;
      }

      const wordData = currentPageWords[index];

      if (!wordData) {
        console.warn('⚠️ 현재 페이지에서 해당 인덱스의 단어 데이터를 찾을 수 없습니다:', {
          index,
          currentPageWordsCount: currentPageWords.length,
          currentPageWords: currentPageWords.map((w) => w.word),
        });
        return;
      }

      try {
        // 전체 savedWords 배열에서 해당 단어의 인덱스 찾기
        const globalIndex = currentStory.savedWords.findIndex(
          (savedWord) => savedWord.word === wordData.word
        );

        if (globalIndex === -1) {
          console.warn('⚠️ 단어를 전체 배열에서 찾을 수 없음:', wordData.word);
          return;
        }

        const isCurrentlyFavorite = wordFavorites[globalIndex];

        if (isCurrentlyFavorite) {
          // 즐겨찾기 제거
          await removeFavoriteWord(currentStory.childId, wordData.word);
          console.log('⭐ 즐겨찾기 제거:', wordData.word);
        } else {
          // 즐겨찾기 추가 (예문 데이터 포함)
          await addFavoriteWord(currentStory.childId, {
            word: wordData.word,
            meaning: wordData.meaning,
            exampleEng: wordData.exampleEng,
            exampleKor: wordData.exampleKor,
            storyId: currentStory.storyId, // 동화 ID 추가
          });
          console.log('⭐ 즐겨찾기 추가:', wordData.word);
        }

        // 로컬 상태 업데이트 - 전체 배열의 인덱스 사용
        const newWordFavorites = [...wordFavorites];
        newWordFavorites[globalIndex] = !newWordFavorites[globalIndex];
        setWordFavorites(newWordFavorites);

        // 즐겨찾기 단어가 변경되면 페이지를 1로 리셋
        setFavoriteWordsPage(1);

        console.log('🔍 즐겨찾기 상태 업데이트:', {
          word: wordData.word,
          currentPageIndex: index,
          globalIndex,
          newFavoriteState: newWordFavorites[globalIndex],
        });
      } catch (error) {
        console.error('❌ 즐겨찾기 토글 실패:', error);
        Alert.alert('오류', '즐겨찾기 설정에 실패했습니다.');
      }
    },
    [wordFavorites, currentStory?.childId, currentPage, currentStory]
  );

  // 페이지 네비게이션 핸들러
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!currentStory) return;

    const totalPages =
      currentStory.sections && currentStory.sections.length > 0 ? currentStory.sections.length : 1;

    console.log('🔄 페이지 네비게이션:', {
      direction,
      currentPage,
      totalPages,
      canGoPrev: currentPage > 1,
      canGoNext: currentPage < totalPages,
    });

    if (direction === 'prev' && currentPage > 1) {
      const newPage = currentPage - 1;
      console.log(`⬅️ 이전 페이지로 이동: ${currentPage} → ${newPage}`);
      setCurrentPage(newPage);
    } else if (direction === 'next' && currentPage < totalPages) {
      const newPage = currentPage + 1;
      console.log(`➡️ 다음 페이지로 이동: ${currentPage} → ${newPage}`);
      setCurrentPage(newPage);
    } else {
      console.log(`⚠️ 페이지 이동 불가: ${direction} (현재: ${currentPage}, 전체: ${totalPages})`);
    }
  };

  // 퀴즈 제출 후 자동으로 다음 페이지로 이동하는 함수
  const handleQuizSubmitAndContinue = (selectedAnswer: string) => {
    if (!quizzes[currentQuizIndex]) return;

    const currentQuiz = quizzes[currentQuizIndex];
    const answer: QuizSubmitRequest = {
      quizId: currentQuiz.quizId,
      selectedAnswer,
    };

    setQuizAnswers((prev) => [...prev, answer]);
    console.log('📝 퀴즈 답변 제출:', {
      quizId: currentQuiz.quizId,
      selectedAnswer,
      currentIndex: currentQuizIndex,
      totalAnswers: quizAnswers.length + 1,
    });

    // 퀴즈 팝업 닫기
    setShowQuizPopup(false);

    // 다음 퀴즈로 이동하거나 퀴즈 완료
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);

      // 다음 퀴즈가 있다면 잠시 후 표시
      setTimeout(() => {
        setShowQuizPopup(true);
      }, 500);
    } else {
      // 마지막 퀴즈 완료 - 결과 제출
      console.log('🏁 마지막 퀴즈 완료 - 결과 제출 시작');
      submitQuizResults();
    }
  };

  // 퀴즈 관련 함수들
  const loadQuizzes = async () => {
    if (!currentStory?.storyId || !currentStory?.childId) {
      console.warn('⚠️ 퀴즈 로드 실패: storyId 또는 childId가 없습니다');
      return;
    }

    try {
      setIsQuizLoading(true);
      console.log('🎯 퀴즈 로드 시작:', {
        storyId: currentStory.storyId,
        childId: currentStory.childId,
      });

      const quizList = await getQuizzesByStory(currentStory.storyId, currentStory.childId);
      setQuizzes(quizList);
      console.log('✅ 퀴즈 로드 완료:', quizList.length, '개');
    } catch (error) {
      console.error('❌ 퀴즈 로드 실패:', error);
      Alert.alert('퀴즈 로드 실패', '퀴즈를 불러올 수 없습니다.');
    } finally {
      setIsQuizLoading(false);
    }
  };

  const submitQuizResults = async () => {
    if (!currentStory?.storyId || !currentStory?.childId || quizAnswers.length === 0) {
      console.warn('⚠️ 퀴즈 결과 제출 실패: 필요한 데이터가 없습니다');
      return;
    }

    try {
      console.log('📤 퀴즈 결과 제출 시작:', {
        storyId: currentStory.storyId,
        childId: currentStory.childId,
        answerCount: quizAnswers.length,
      });

      await submitQuiz(currentStory.storyId, currentStory.childId, quizAnswers);
      console.log('✅ 퀴즈 결과 제출 완료');

      // 결과 조회 및 표시
      await loadQuizResults();
    } catch (error) {
      console.error('❌ 퀴즈 결과 제출 실패:', error);
      Alert.alert('제출 실패', '퀴즈 결과를 제출할 수 없습니다.');
    }
  };

  const loadQuizResults = async () => {
    if (!currentStory?.storyId || !currentStory?.childId) return;

    try {
      console.log('🏆 퀴즈 결과 조회 시작');
      const results = await getQuizResults(currentStory.storyId, currentStory.childId);

      // 결과를 Alert로 표시
      Alert.alert(
        '🎉 퀴즈 완료!',
        `총점: ${results.score}점\n정답: ${results.correctAnswers}/${results.totalQuiz}개\n\n정답률: ${Math.round((results.correctAnswers / results.totalQuiz) * 100)}%`,
        [
          {
            text: '확인',
            onPress: () => {
              console.log('✅ 퀴즈 결과 표시 완료');
            },
          },
        ]
      );

      console.log('✅ 퀴즈 결과 조회 완료:', results);
    } catch (error) {
      console.error('❌ 퀴즈 결과 조회 실패:', error);
      Alert.alert('결과 조회 실패', '퀴즈 결과를 불러올 수 없습니다.');
    }
  };

  const startQuiz = () => {
    if (quizzes.length === 0) {
      Alert.alert('퀴즈 없음', '이 동화에는 아직 퀴즈가 생성되지 않았습니다.');
      return;
    }

    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setShowQuizPopup(true);
    console.log('🎯 수동 퀴즈 시작:', {
      totalQuizzes: quizzes.length,
      currentIndex: 0,
    });
  };

  // 현재 페이지 변경 시 배경 이미지 업데이트
  useEffect(() => {
    console.log('🔄 페이지 변경 감지:', {
      currentPage,
      totalSections: currentStory?.sections?.length || 0,
      currentSection: currentStory?.sections?.[currentPage - 1],
      hasIllustrations: !!currentStory?.illustrations?.length,
    });

    if (currentStory && currentStory.sections && currentStory.sections.length > 0) {
      const currentSection = currentStory.sections[currentPage - 1];
      if (currentSection && currentStory.illustrations && currentStory.illustrations.length > 0) {
        // 삽화 로딩 시작
        setIsImageLoading(true);

        // 현재 단락 순서에 해당하는 삽화 찾기 (단락 수에 맞춰 균등 분배)
        const totalSections = currentStory.sections.length;
        const totalIllustrations = currentStory.illustrations.length;
        const sectionsPerIllustration = Math.ceil(totalSections / totalIllustrations);

        // 현재 페이지가 몇 번째 삽화 구간에 속하는지 계산
        const illustrationIndex = Math.min(
          Math.floor((currentPage - 1) / sectionsPerIllustration),
          totalIllustrations - 1
        );

        const sectionIllustration = currentStory.illustrations[illustrationIndex];

        if (sectionIllustration) {
          // 로컬 경로가 있으면 사용, 없으면 원격 URL 사용

          // 로컬 파일 존재 여부 확인
          if (sectionIllustration.localPath) {
            FileSystem.getInfoAsync(sectionIllustration.localPath)
              .then((fileInfo) => {
                if (fileInfo.exists) {
                  setBackgroundImage(sectionIllustration.localPath);
                  console.log(
                    `페이지 ${currentPage} (삽화 ${illustrationIndex + 1}/${totalIllustrations}, 구간 ${Math.floor((currentPage - 1) / sectionsPerIllustration) + 1}) 로컬 삽화 설정:`,
                    sectionIllustration.localPath
                  );
                } else {
                  // 로컬 파일이 없으면 원격 URL 사용
                  setBackgroundImage(sectionIllustration.imageUrl);
                  console.log(
                    `페이지 ${currentPage} (삽화 ${illustrationIndex + 1}/${totalIllustrations}, 구간 ${Math.floor((currentPage - 1) / sectionsPerIllustration) + 1}) 원격 삽화 설정:`,
                    sectionIllustration.imageUrl
                  );
                }
                setIsImageLoading(false);
              })
              .catch(() => {
                // 에러 발생 시 원격 URL 사용
                setBackgroundImage(sectionIllustration.imageUrl);
                console.log(
                  `페이지 ${currentPage} (삽화 ${illustrationIndex + 1}/${totalIllustrations}, 구간 ${Math.floor((currentPage - 1) / sectionsPerIllustration) + 1}) 원격 삽화 사용 (로컬 확인 실패):`,
                  sectionIllustration.imageUrl
                );
                setIsImageLoading(false);
              });
          } else {
            // 로컬 경로가 없으면 원격 URL 사용
            setBackgroundImage(sectionIllustration.imageUrl);
            console.log(
              `페이지 ${currentPage} (삽화 ${illustrationIndex + 1}/${totalIllustrations}, 구간 ${Math.floor((currentPage - 1) / sectionsPerIllustration) + 1}) 원격 삽화 설정:`,
              sectionIllustration.imageUrl
            );
            setIsImageLoading(false);
          }
        } else {
          // 해당 단락의 삽화가 없으면 기본 배경 사용
          setBackgroundImage(null);
          console.log(`페이지 ${currentPage}에 해당하는 삽화가 없습니다. 기본 배경 사용`);
          setIsImageLoading(false);
        }
      } else {
        // 삽화 정보가 없으면 기본 배경 사용
        setBackgroundImage(null);
        console.log(`페이지 ${currentPage}: 삽화 정보가 없습니다. 기본 배경 사용`);
        setIsImageLoading(false);
      }
    }
  }, [currentPage, currentStory]);

  return (
    <View style={englishLearningStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {!isStoryLoaded || !currentStory ? (
        // 로딩 상태 또는 데이터가 없을 때
        <ImageBackground
          source={defaultBackgroundImage}
          style={englishLearningStyles.backgroundImage}
          resizeMode="cover"
        >
          <View style={englishLearningStyles.overlay}>
            <TouchableOpacity
              style={englishLearningStyles.backButton}
              onPress={() => router.replace('/')}
            >
              <Text style={englishLearningStyles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={englishLearningStyles.titleSection}>
              <Text style={englishLearningStyles.storyTitle}>동화를 불러오는 중...</Text>
            </View>
          </View>
        </ImageBackground>
      ) : backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={englishLearningStyles.backgroundImage}
          resizeMode="cover"
        >
          <View style={englishLearningStyles.overlay}>
            <TouchableOpacity
              style={englishLearningStyles.backButton}
              onPress={() => router.back()}
            >
              <Text style={englishLearningStyles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={englishLearningStyles.topControls}>
              <TouchableOpacity
                style={englishLearningStyles.readAloudButtonInGroup}
                onPress={handleTextToSpeech}
              >
                <Text style={englishLearningStyles.quizButtonText}>🔊 읽어주기</Text>
              </TouchableOpacity>

              <View style={englishLearningStyles.progressContainerInGroup}>
                <Text style={englishLearningStyles.progressText}>
                  {currentPage} /{' '}
                  {currentStory.sections && currentStory.sections.length > 0
                    ? currentStory.sections.length
                    : 1}
                </Text>
              </View>
            </View>

            <View style={englishLearningStyles.titleSection}>
              <Text style={englishLearningStyles.storyTitle}>
                {currentStory?.title || '제목 없음'}
              </Text>
              {isImageLoading && (
                <Text style={englishLearningStyles.loadingText}>삽화 로딩 중...</Text>
              )}
            </View>

            <View style={englishLearningStyles.mainContent}>
              <View style={englishLearningStyles.storyContentSection}>
                {/* 현재 페이지 정보 디버깅 */}
                {currentStory?.sections && currentStory.sections.length > 0 && (
                  <Text style={englishLearningStyles.storyText}>
                    📖 페이지 {currentPage} (총 {currentStory.sections.length}페이지)
                  </Text>
                )}
                <Text style={englishLearningStyles.storyText}>{getCurrentPageText()}</Text>

                {getCurrentPageKoreanText() && (
                  <Text style={englishLearningStyles.koreanTranslation}>
                    {getCurrentPageKoreanText()}
                  </Text>
                )}

                <View style={englishLearningStyles.keyWords}>
                  {!currentStory?.savedWords ? (
                    <Text style={englishLearningStyles.loadingText}>단어 로딩 중...</Text>
                  ) : getCurrentPageWords().length === 0 ? (
                    <Text style={englishLearningStyles.loadingText}>
                      이 페이지에 단어가 없습니다.
                    </Text>
                  ) : (
                    getCurrentPageWords().map((wordData, index) => (
                      <TouchableOpacity
                        key={index}
                        style={englishLearningStyles.keyWordItem}
                        onPress={() => handleWordPress(index)}
                      >
                        <TouchableOpacity
                          style={englishLearningStyles.wordFavoriteButton}
                          onPress={() => handleToggleWordFavorite(index)}
                        >
                          <Text style={englishLearningStyles.wordFavoriteText}>
                            {(() => {
                              // 전체 savedWords 배열에서 해당 단어의 인덱스 찾기
                              const globalIndex = currentStory?.savedWords?.findIndex(
                                (savedWord) => savedWord.word === wordData.word
                              );
                              return globalIndex !== -1 && wordFavorites[globalIndex] ? '⭐' : '☆';
                            })()}
                          </Text>
                        </TouchableOpacity>
                        <View style={englishLearningStyles.wordTextContainer}>
                          <Text style={englishLearningStyles.keyWordText}>{wordData.word}</Text>
                          {wordClicked[index] && (
                            <Text style={englishLearningStyles.keyWordKorean}>
                              {wordData.meaning}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>

              <View style={englishLearningStyles.vocabularyPanel}>
                <Text style={englishLearningStyles.vocabularyTitle}>즐겨찾기 단어</Text>

                {currentStory?.savedWords && wordFavorites.some((favorite) => favorite) ? (
                  <View style={englishLearningStyles.favoriteWordsContainer}>
                    {/* 즐겨찾기 단어 페이지네이션 - 좌측 */}
                    {(() => {
                      const totalFavoriteWords = currentStory.savedWords.filter(
                        (_, index) => wordFavorites[index]
                      ).length;
                      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);

                      if (maxPage > 1 && totalFavoriteWords > 3) {
                        return (
                          <TouchableOpacity
                            style={[
                              englishLearningStyles.leftArrowButton,
                              favoriteWordsPage === 1 && englishLearningStyles.disabledArrowButton,
                            ]}
                            onPress={() => handleFavoriteWordsPageChange('prev')}
                            disabled={favoriteWordsPage === 1}
                          >
                            <Text
                              style={[
                                englishLearningStyles.arrowButtonText,
                                favoriteWordsPage === 1 && englishLearningStyles.disabledArrowText,
                              ]}
                            >
                              ◀
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    })()}

                    {/* 즐겨찾기 단어 목록 */}
                    <View style={englishLearningStyles.favoriteWordsPage}>
                      {getCurrentFavoriteWordsPage().map(({ wordData, index }) => (
                        <View
                          key={`favorite-${wordData.word}-${index}`}
                          style={englishLearningStyles.favoriteWordItem}
                        >
                          <Text style={englishLearningStyles.favoriteWordEnglish}>
                            {wordData.word}
                          </Text>
                          <Text style={englishLearningStyles.favoriteWordKorean}>
                            {wordData.meaning}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* 즐겨찾기 단어 페이지네이션 - 우측 */}
                    {(() => {
                      const totalFavoriteWords = currentStory.savedWords.filter(
                        (_, index) => wordFavorites[index]
                      ).length;
                      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);

                      if (maxPage > 1 && totalFavoriteWords > 3) {
                        return (
                          <TouchableOpacity
                            style={[
                              englishLearningStyles.rightArrowButton,
                              favoriteWordsPage === maxPage &&
                                englishLearningStyles.disabledArrowButton,
                            ]}
                            onPress={() => handleFavoriteWordsPageChange('next')}
                            disabled={favoriteWordsPage === maxPage}
                          >
                            <Text
                              style={[
                                englishLearningStyles.arrowButtonText,
                                favoriteWordsPage === maxPage &&
                                  englishLearningStyles.disabledArrowText,
                              ]}
                            >
                              ▶
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    })()}

                    {/* 페이지 정보 표시 */}
                    {(() => {
                      const totalFavoriteWords = currentStory.savedWords.filter(
                        (_, index) => wordFavorites[index]
                      ).length;
                      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);

                      if (maxPage > 1 && totalFavoriteWords > 3) {
                        return (
                          <Text style={englishLearningStyles.favoritePageInfo}>
                            {favoriteWordsPage} / {maxPage}
                          </Text>
                        );
                      }
                      return null;
                    })()}
                  </View>
                ) : (
                  <>
                    <Text style={englishLearningStyles.vocabularyIcon}>⭐</Text>
                    <Text style={englishLearningStyles.vocabularyDescription}>
                      영어 학습 화면에서 단어를 즐겨찾기에 추가하면{'\n'}여기에 표시됩니다.
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View style={englishLearningStyles.navigationSection}>
              <TouchableOpacity
                style={[
                  englishLearningStyles.navButton,
                  currentPage === 1 && englishLearningStyles.navButtonDisabled,
                ]}
                onPress={() => handleNavigation('prev')}
                disabled={currentPage === 1}
              >
                <Text style={englishLearningStyles.navButtonText}>◀ 이전</Text>
              </TouchableOpacity>

              {/* 퀴즈 시작 버튼 - 마지막 페이지에서만 표시 */}
              {currentPage === (currentStory?.sections?.length || 1) && (
                <TouchableOpacity
                  style={[
                    englishLearningStyles.navButton,
                    { backgroundColor: '#FF6B6B', marginHorizontal: 10 },
                  ]}
                  onPress={startQuiz}
                  disabled={isQuizLoading || quizzes.length === 0}
                >
                  <Text style={englishLearningStyles.navButtonText}>
                    {isQuizLoading ? '로딩중...' : `🎯 퀴즈 (${quizzes.length})`}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  englishLearningStyles.navButton,
                  currentPage === (currentStory?.sections?.length || 1) &&
                    englishLearningStyles.navButtonDisabled,
                ]}
                onPress={() => handleNavigation('next')}
                disabled={currentPage === (currentStory?.sections?.length || 1)}
              >
                <Text style={englishLearningStyles.navButtonText}>다음 ▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={defaultBackgroundImage}
          style={englishLearningStyles.backgroundImage}
          resizeMode="cover"
        >
          <View style={englishLearningStyles.overlay}>
            <TouchableOpacity
              style={englishLearningStyles.backButton}
              onPress={() => router.back()}
            >
              <Text style={englishLearningStyles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={englishLearningStyles.topControls}>
              <TouchableOpacity
                style={englishLearningStyles.readAloudButtonInGroup}
                onPress={handleTextToSpeech}
              >
                <Text style={englishLearningStyles.quizButtonText}>🔊 읽어주기</Text>
              </TouchableOpacity>

              <View style={englishLearningStyles.progressContainerInGroup}>
                <Text style={englishLearningStyles.progressText}>
                  {currentPage} /{' '}
                  {currentStory.sections && currentStory.sections.length > 0
                    ? currentStory.sections.length
                    : 1}
                </Text>
              </View>
            </View>

            <View style={englishLearningStyles.titleSection}>
              <Text style={englishLearningStyles.storyTitle}>{currentStory.title}</Text>
            </View>

            <View style={englishLearningStyles.mainContent}>
              <View style={englishLearningStyles.storyContentSection}>
                <Text style={englishLearningStyles.storyText}>{getCurrentPageText()}</Text>

                {getCurrentPageKoreanText() && (
                  <Text style={englishLearningStyles.koreanTranslation}>
                    {getCurrentPageKoreanText()}
                  </Text>
                )}

                <View style={englishLearningStyles.keyWords}>
                  {!currentStory?.savedWords ? (
                    <Text style={englishLearningStyles.loadingText}>단어 로딩 중...</Text>
                  ) : getCurrentPageWords().length === 0 ? (
                    <Text style={englishLearningStyles.loadingText}>
                      이 페이지에 단어가 없습니다.
                    </Text>
                  ) : (
                    getCurrentPageWords().map((wordData, index) => (
                      <TouchableOpacity
                        key={index}
                        style={englishLearningStyles.keyWordItem}
                        onPress={() => handleWordPress(index)}
                      >
                        <TouchableOpacity
                          style={englishLearningStyles.wordFavoriteButton}
                          onPress={() => handleToggleWordFavorite(index)}
                        >
                          <Text style={englishLearningStyles.wordFavoriteText}>
                            {(() => {
                              // 전체 savedWords 배열에서 해당 단어의 인덱스 찾기
                              const globalIndex = currentStory?.savedWords?.findIndex(
                                (savedWord) => savedWord.word === wordData.word
                              );
                              return globalIndex !== -1 && wordFavorites[globalIndex] ? '⭐' : '☆';
                            })()}
                          </Text>
                        </TouchableOpacity>

                        <View style={englishLearningStyles.wordTextContainer}>
                          <Text style={englishLearningStyles.keyWordText}>{wordData.word}</Text>
                          {wordClicked[index] && (
                            <Text style={englishLearningStyles.keyWordKorean}>
                              {wordData.meaning}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>

              <View style={englishLearningStyles.vocabularyPanel}>
                <Text style={englishLearningStyles.vocabularyTitle}>즐겨찾기 단어</Text>

                {currentStory?.savedWords && wordFavorites.some((favorite) => favorite) ? (
                  <View style={englishLearningStyles.favoriteWordsContainer}>
                    {/* 즐겨찾기 단어 페이지네이션 - 좌측 */}
                    {(() => {
                      const totalFavoriteWords = currentStory.savedWords.filter(
                        (_, index) => wordFavorites[index]
                      ).length;
                      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);

                      if (maxPage > 1 && totalFavoriteWords > 3) {
                        return (
                          <TouchableOpacity
                            style={[
                              englishLearningStyles.leftArrowButton,
                              favoriteWordsPage === 1 && englishLearningStyles.disabledArrowButton,
                            ]}
                            onPress={() => handleFavoriteWordsPageChange('prev')}
                            disabled={favoriteWordsPage === 1}
                          >
                            <Text
                              style={[
                                englishLearningStyles.arrowButtonText,
                                favoriteWordsPage === 1 && englishLearningStyles.disabledArrowText,
                              ]}
                            >
                              ◀
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    })()}

                    {/* 즐겨찾기 단어 목록 */}
                    <View style={englishLearningStyles.favoriteWordsPage}>
                      {getCurrentFavoriteWordsPage().map(({ wordData, index }) => (
                        <View
                          key={`favorite-${wordData.word}-${index}`}
                          style={englishLearningStyles.favoriteWordItem}
                        >
                          <Text style={englishLearningStyles.favoriteWordEnglish}>
                            {wordData.word}
                          </Text>
                          <Text style={englishLearningStyles.favoriteWordKorean}>
                            {wordData.meaning}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* 즐겨찾기 단어 페이지네이션 - 우측 */}
                    {(() => {
                      const totalFavoriteWords = currentStory.savedWords.filter(
                        (_, index) => wordFavorites[index]
                      ).length;
                      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);

                      if (maxPage > 1 && totalFavoriteWords > 3) {
                        return (
                          <TouchableOpacity
                            style={[
                              englishLearningStyles.rightArrowButton,
                              favoriteWordsPage === maxPage &&
                                englishLearningStyles.disabledArrowButton,
                            ]}
                            onPress={() => handleFavoriteWordsPageChange('next')}
                            disabled={favoriteWordsPage === maxPage}
                          >
                            <Text
                              style={[
                                englishLearningStyles.arrowButtonText,
                                favoriteWordsPage === maxPage &&
                                  englishLearningStyles.disabledArrowText,
                              ]}
                            >
                              ▶
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    })()}

                    {/* 페이지 정보 표시 */}
                    {(() => {
                      const totalFavoriteWords = currentStory.savedWords.filter(
                        (_, index) => wordFavorites[index]
                      ).length;
                      const maxPage = Math.ceil(totalFavoriteWords / favoriteWordsPerPage);

                      if (maxPage > 1 && totalFavoriteWords > 3) {
                        return (
                          <Text style={englishLearningStyles.favoritePageInfo}>
                            {favoriteWordsPage} / {maxPage}
                          </Text>
                        );
                      }
                      return null;
                    })()}
                  </View>
                ) : (
                  <>
                    <Text style={englishLearningStyles.vocabularyIcon}>⭐</Text>
                    <Text style={englishLearningStyles.vocabularyDescription}>
                      영어 학습 화면에서 단어를 즐겨찾기에 추가하면{'\n'}여기에 표시됩니다.
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View style={englishLearningStyles.navigationSection}>
              <TouchableOpacity
                style={[
                  englishLearningStyles.navButton,
                  currentPage === 1 && englishLearningStyles.navButtonDisabled,
                ]}
                onPress={() => handleNavigation('prev')}
                disabled={currentPage === 1}
              >
                <Text style={englishLearningStyles.navButtonText}>◀ 이전</Text>
              </TouchableOpacity>

              {/* 퀴즈 시작 버튼 - 마지막 페이지에서만 표시 */}
              {currentPage === (currentStory?.sections?.length || 1) && (
                <TouchableOpacity
                  style={[
                    englishLearningStyles.navButton,
                    { backgroundColor: '#FF6B6B', marginHorizontal: 10 },
                  ]}
                  onPress={startQuiz}
                  disabled={isQuizLoading || quizzes.length === 0}
                >
                  <Text style={englishLearningStyles.navButtonText}>
                    {isQuizLoading ? '로딩중...' : `🎯 퀴즈 (${quizzes.length})`}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  englishLearningStyles.navButton,
                  currentPage === (currentStory?.sections?.length || 1) &&
                    englishLearningStyles.navButtonDisabled,
                ]}
                onPress={() => handleNavigation('next')}
                disabled={currentPage === (currentStory?.sections?.length || 1)}
              >
                <Text style={englishLearningStyles.navButtonText}>다음 ▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}

      {/* 퀴즈 팝업 */}
      <QuizModal
        visible={showQuizPopup}
        quiz={quizzes[currentQuizIndex] || null}
        onClose={() => setShowQuizPopup(false)}
        onSubmit={handleQuizSubmitAndContinue}
        isLastQuiz={currentQuizIndex === quizzes.length - 1}
      />
    </View>
  );
}
