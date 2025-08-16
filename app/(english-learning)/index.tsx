import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

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
  getAllWordsByChild,
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

  // 동화 로드 시 자동으로 단어를 저장하는 함수
  const saveWordsFromStory = async (storyId: number, childId: number) => {
    try {
      console.log('📚 동화 기반 단어 자동 저장 시작:', { storyId, childId });

      // 사용자 ID 가져오기
      const userId = await getStoredUserId();
      if (!userId) {
        console.warn('⚠️ 사용자 ID가 없어 단어 저장을 건너뜁니다. 로그인이 필요합니다.');
        return;
      }

      // 동화에서 단어 추출 및 저장
      const savedWords = await saveWordsByStory(storyId, childId);
      console.log('✅ 동화 기반 단어 저장 완료:', {
        storyId,
        childId,
        savedWordsCount: savedWords.length,
        words: savedWords.map((word) => word.word),
      });

      // 저장된 단어를 currentStory에 추가
      setCurrentStory((prevStory) => {
        if (!prevStory) return prevStory;

        return {
          ...prevStory,
          savedWords: savedWords,
        };
      });

      return savedWords;
    } catch (error) {
      console.error('❌ 동화 기반 단어 저장 실패:', error);
      // 단어 저장 실패는 동화 로드 실패로 처리하지 않음
      return [];
    }
  };

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

            // 동화에서 단어 자동 저장
            await saveWordsFromStory(storyData.storyId, storyData.childId);

            // 저장된 단어 정보 가져오기 (전체 단어 목록 조회)
            try {
              console.log(`동화 ${storyData.storyId} 저장된 단어 조회 시작...`);
              const userId = 1; // 실제로는 로그인 시 저장된 사용자 ID 사용
              const savedWords = await getAllWordsByChild(userId, storyData.childId);
              console.log(`동화 ${storyData.storyId} 저장된 단어 ${savedWords.length}개 조회 완료`);

              // 저장된 단어 정보를 LearningStory에 추가
              const learningStoryWithWords = {
                ...learningStory,
                savedWords: savedWords,
              };
              setCurrentStory(learningStoryWithWords);
            } catch (wordsError) {
              console.error(`동화 ${storyData.storyId} 저장된 단어 조회 실패:`, wordsError);
              // 단어 조회 실패는 동화 로드 실패로 처리하지 않음
            }
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

            // 최신 동화에서 단어 자동 저장
            await saveWordsFromStory(latestStory.storyId, latestStory.childId);
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

  // currentStory 로드 완료 후 퀴즈 로드
  useEffect(() => {
    if (currentStory && currentStory.storyId && currentStory.childId) {
      console.log('🎯 동화 로드 완료, 퀴즈 준비');
      loadQuizzes();
    }
  }, [currentStory]);

  // currentStory 상태 변경 감지
  useEffect(() => {
    console.log('🔄 currentStory 상태 변경:', {
      hasStory: !!currentStory,
      title: currentStory?.title || '없음',
      content: currentStory?.content
        ? currentStory.content.split('\n').slice(0, 3).join('\n') +
          (currentStory.content.split('\n').length > 3 ? '\n...' : '')
        : '없음',
      contentLength: currentStory?.content?.length || 0,
      sectionsCount: currentStory?.sections?.length || 0,
      highlightedWordsCount: currentStory?.highlightedWords?.length || 0,
      storyKeys: currentStory ? Object.keys(currentStory) : [],
      sections: currentStory?.sections
        ? currentStory.sections.map((s, i) => ({
            index: i,
            orderIndex: s.orderIndex,
            textPreview: s.paragraphText?.substring(0, 30) + '...',
          }))
        : [],
    });
  }, [currentStory]);

  // 기존 useEffect 내부, 동화 단락 조회 성공 후 추가
  useEffect(() => {
    if (currentStory && currentStory.sections && currentStory.sections.length > 0) {
      console.log('🎵 TTS 요청 시작:', {
        storyId: currentStory.storyId,
        sectionsCount: currentStory.sections.length,
        voiceId: 'Seoyeon',
        speechRate: 0.8,
      });

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
  }, [currentStory?.storyId]);

  // API에서 TTS 요청하는 함수
  const requestTTSFromAPI = (story: LearningStoryWithSections) => {
    requestAllSectionsTTS(story.storyId, story.sections, 'Seoyeon', 0.8)
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

    console.log('🔍 getCurrentPageText 디버깅:', {
      hasSections: !!currentStory.sections,
      sectionsLength: currentStory.sections?.length || 0,
      hasContent: !!currentStory.content,
      contentLength: currentStory.content?.length || 0,
      currentPage,
      storyTitle: currentStory.title,
    });

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
    console.log('📝 전체 내용 사용:', currentStory.content);
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
  const handleWordPress = (index: number) => {
    const newWordClicked = [...wordClicked];
    newWordClicked[index] = !newWordClicked[index];
    setWordClicked(newWordClicked);
  };

  // 단어 즐겨찾기 토글 핸들러
  const handleToggleWordFavorite = (index: number) => {
    const newWordFavorites = [...wordFavorites];
    newWordFavorites[index] = !newWordFavorites[index];
    setWordFavorites(newWordFavorites);
  };

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

      const quizList = await getQuizzesByStory(currentStory.storyId);
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
                  {(currentStory?.savedWords || []).map((wordData, index) => (
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
                          {wordFavorites[index] ? '⭐' : '☆'}
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
                  ))}
                </View>

                {/* 저장된 단어 표시 */}
                {currentStory?.savedWords && currentStory.savedWords.length > 0 && (
                  <View style={englishLearningStyles.savedWordsContainer}>
                    <Text style={englishLearningStyles.savedWordsTitle}>📚 학습 단어</Text>
                    {currentStory.savedWords.map((savedWord, index) => (
                      <View key={index} style={englishLearningStyles.savedWordsContainer}>
                        <Text style={englishLearningStyles.savedWordText}>{savedWord.word}</Text>
                        <Text style={englishLearningStyles.savedWordMeaning}>
                          {savedWord.meaning}
                        </Text>
                        <Text style={englishLearningStyles.savedWordExample}>
                          {savedWord.exampleEng}
                        </Text>
                        <Text style={englishLearningStyles.savedWordExampleKr}>
                          {savedWord.exampleKor}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={englishLearningStyles.vocabularyPanel}>
                <Text style={englishLearningStyles.vocabularyTitle}>즐겨찾기 단어</Text>
                <Text style={englishLearningStyles.vocabularyIcon}>⭐</Text>
                <Text style={englishLearningStyles.vocabularyDescription}>
                  영어 학습 화면에서 단어를 즐겨찾기에 추가하면{'\n'}여기에 표시됩니다.
                </Text>
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

              {/* 마지막 페이지에서만 퀴즈 풀기 버튼 표시 */}
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
                    {isQuizLoading ? '로딩중...' : `🎯 퀴즈 풀기 (${quizzes.length})`}
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
                  {(currentStory?.savedWords || []).map((wordData, index) => (
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
                          {wordFavorites[index] ? '⭐' : '☆'}
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
                  ))}
                </View>

                {/* 저장된 단어 표시 */}
                {currentStory?.savedWords && currentStory.savedWords.length > 0 && (
                  <View style={englishLearningStyles.savedWordsContainer}>
                    <Text style={englishLearningStyles.savedWordsTitle}>📚 학습 단어</Text>
                    {currentStory.savedWords.map((savedWord, index) => (
                      <View key={index} style={englishLearningStyles.savedWordItem}>
                        <Text style={englishLearningStyles.savedWordText}>{savedWord.word}</Text>
                        <Text style={englishLearningStyles.savedWordMeaning}>
                          {savedWord.meaning}
                        </Text>
                        <Text style={englishLearningStyles.savedWordExample}>
                          {savedWord.exampleEng}
                        </Text>
                        <Text style={englishLearningStyles.savedWordExampleKr}>
                          {savedWord.exampleKor}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={englishLearningStyles.vocabularyPanel}>
                <Text style={englishLearningStyles.vocabularyTitle}>즐겨찾기 단어</Text>
                <Text style={englishLearningStyles.vocabularyIcon}>⭐</Text>
                <Text style={englishLearningStyles.vocabularyDescription}>
                  영어 학습 화면에서 단어를 즐겨찾기에 추가하면{'\n'}여기에 표시됩니다.
                </Text>
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

              {/* 퀴즈 시작 버튼 */}
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
