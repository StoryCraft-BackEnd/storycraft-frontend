import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 내부 모듈 및 스타일 ---
import englishLearningStyles from '@/styles/EnglishLearningScreen.styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import {
  loadStoriesByChildId,
  addStoryToStorage,
  saveStoryTTS,
  loadStoryTTSFromStorage,
} from '@/features/storyCreate/storyStorage';
import {
  fetchStorySections,
  fetchIllustrations,
  syncMissingIllustrations,
  generateTTSForStory,
} from '@/features/storyCreate/storyApi';
import * as FileSystem from 'expo-file-system';
import {
  convertStoryToLearningStoryWithPages,
  convertStoryToLearningStoryWithSections,
  getStoryIllustrationPathFromStory,
} from '@/features/storyCreate/storyUtils';
import { Story, LearningStoryWithSections } from '@/features/storyCreate/types';
import QuizModal from '@/components/ui/QuizModal';
import AnimatedToggleButton from '@/components/ui/AnimatedToggleButton';
import { Audio } from 'expo-av';
import { TTSAudioInfo } from '@/features/storyCreate/types';
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
import { VoiceBasedTTSInfo } from '@/features/storyCreate/types';
import {
  rewardStoryRead,
  rewardQuizCorrect,
  rewardWordClick,
  checkBadges,
} from '@/shared/utils/rewardUtils';

// --- 이미지 및 리소스 ---
import defaultBackgroundImage from '@/assets/images/background/night-bg.png';

// 캐릭터 이미지들
import penguinSad from '@/assets/images/character/penguin_sad_transparent.png';
import penguinQuestion from '@/assets/images/character/penguin_question_transparent.png';
import penguinCry from '@/assets/images/character/penguin_cry_transparent.png';
import penguinLollipop from '@/assets/images/character/penguin_lollipop_transparent.png';
import sleepCharacter from '@/assets/images/character/sleep.png';

// 단어 뜻 팝업 컴포넌트
import WordDefinitionPopup from '@/components/ui/WordDefinitionPopup';

// TTS 설정 메뉴 컴포넌트
import TTSSettingsMenu from '@/components/ui/TTSSettingsMenu';

// API 클라이언트
import { apiClient } from '@/shared/api/client';

export default function EnglishLearningScreen() {
  const params = useLocalSearchParams();
  const [currentStory, setCurrentStory] = useState<LearningStoryWithSections | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordFavorites, setWordFavorites] = useState<boolean[]>([]);
  const [wordClicked, setWordClicked] = useState<boolean[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [ttsAudioMap, setTtsAudioMap] = useState<{ [sectionId: number]: TTSAudioInfo }>({});
  const [voiceBasedTTSMap, setVoiceBasedTTSMap] = useState<VoiceBasedTTSInfo>({});
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

  // TTS 설정 상태
  const [ttsVoiceId, setTtsVoiceId] = useState<string>('세연'); // 기본 성우
  const [ttsPlaybackRate, setTtsPlaybackRate] = useState<number>(1.0); // TTS 배속 (1.0 = 기본 속도)

  // 단어 뜻 저장 관련 상태
  const [wordDefinitions, setWordDefinitions] = useState<{ [word: string]: string }>({});
  const [showWordDefinitionPopup, setShowWordDefinitionPopup] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [selectedWordMeaning, setSelectedWordMeaning] = useState('');

  // 즐겨찾기 단어 페이지네이션 상태
  const [favoriteWordsPage, setFavoriteWordsPage] = useState(1);
  const [favoriteWordsPerPage] = useState(3); // 한 페이지당 표시할 단어 수 (3개 이상일 때 페이지네이션)

  // 동기화 화면 상태
  const [isSyncing, setIsSyncing] = useState(false);

  // 즐겨찾기 패널 표시 상태 (true: 보임, false: 숨김)
  const [showVocabularyPanel, setShowVocabularyPanel] = useState(false);

  // 랜덤 캐릭터 이미지 선택
  const characterImages = [
    penguinSad,
    penguinQuestion,
    penguinCry,
    penguinLollipop,
    sleepCharacter,
  ];
  const randomCharacterImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * characterImages.length);
    return characterImages[randomIndex];
  }, []);

  // 단어 뜻을 가져오는 함수
  const getWordDefinition = async (word: string): Promise<string> => {
    try {
      // 이미 저장된 뜻이 있으면 반환
      if (wordDefinitions[word]) {
        return wordDefinitions[word];
      }

      // 로컬 저장소에서 단어 뜻 확인
      const localMeaning = await getWordMeaningFromStorage(word);
      if (localMeaning) {
        // 로컬에 저장된 뜻을 상태에 추가
        setWordDefinitions((prev) => ({
          ...prev,
          [word]: localMeaning,
        }));
        return localMeaning;
      }

      // API로 단어 뜻 조회 (apiClient 사용)
      const response = await apiClient.get(`/dictionaries/words?word=${encodeURIComponent(word)}`);

      // API 응답 구조에 맞게 수정: response.data.data.meaning
      const meaning = response.data?.data?.meaning || '의미를 찾을 수 없습니다.';

      console.log(`🔍 단어 "${word}" API 응답:`, {
        word,
        meaning,
        fullResponse: response.data,
      });

      // 단어 뜻을 상태에 저장
      setWordDefinitions((prev) => ({
        ...prev,
        [word]: meaning,
      }));

      // 로컬 저장소에 단어 뜻 저장
      await saveWordMeaningToStorage(word, meaning);

      return meaning;
    } catch (error) {
      console.error(`단어 "${word}" 뜻 조회 실패:`, error);
      return '의미를 가져올 수 없습니다.';
    }
  };

  // 로컬 저장소에 단어 뜻 저장
  const saveWordMeaningToStorage = async (word: string, meaning: string) => {
    try {
      const key = `word_meaning_${word.toLowerCase()}`;
      const data = {
        word: word.toLowerCase(),
        meaning,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log(`💾 단어 "${word}" 뜻 로컬 저장 완료:`, meaning);
    } catch (error) {
      console.error(`❌ 단어 "${word}" 뜻 로컬 저장 실패:`, error);
    }
  };

  // 로컬 저장소에서 단어 뜻 불러오기
  const getWordMeaningFromStorage = async (word: string): Promise<string | null> => {
    try {
      const key = `word_meaning_${word.toLowerCase()}`;
      const storedData = await AsyncStorage.getItem(key);

      if (storedData) {
        const data = JSON.parse(storedData);
        const isExpired =
          new Date().getTime() - new Date(data.timestamp).getTime() > 7 * 24 * 60 * 60 * 1000; // 7일

        if (!isExpired && data.meaning) {
          console.log(`📖 로컬에서 단어 "${word}" 뜻 불러오기 성공:`, data.meaning);
          return data.meaning;
        } else if (isExpired) {
          console.log(`⏰ 단어 "${word}" 뜻이 만료되었습니다.`);
          await AsyncStorage.removeItem(key); // 만료된 데이터 삭제
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ 로컬에서 단어 "${word}" 뜻 불러오기 실패:`, error);
      return null;
    }
  };

  // 앱 시작 시 로컬 저장소에서 모든 단어 뜻 복원
  const restoreWordDefinitionsFromStorage = async () => {
    try {
      console.log('🔄 로컬 저장소에서 단어 뜻 복원 시작...');

      // AsyncStorage의 모든 키를 가져와서 word_meaning_으로 시작하는 것들만 필터링
      const keys = await AsyncStorage.getAllKeys();
      const wordMeaningKeys = keys.filter((key) => key.startsWith('word_meaning_'));

      if (wordMeaningKeys.length === 0) {
        console.log('📚 로컬에 저장된 단어 뜻이 없습니다.');
        return;
      }

      const restoredDefinitions: { [word: string]: string } = {};
      let restoredCount = 0;

      for (const key of wordMeaningKeys) {
        try {
          const storedData = await AsyncStorage.getItem(key);
          if (storedData) {
            const data = JSON.parse(storedData);
            const isExpired =
              new Date().getTime() - new Date(data.timestamp).getTime() > 7 * 24 * 60 * 60 * 1000; // 7일

            if (!isExpired && data.word && data.meaning) {
              restoredDefinitions[data.word] = data.meaning;
              restoredCount++;
            } else if (isExpired) {
              // 만료된 데이터 삭제
              await AsyncStorage.removeItem(key);
              console.log(`🗑️ 만료된 단어 "${data.word}" 뜻 삭제`);
            }
          }
        } catch (error) {
          console.error(`❌ 키 "${key}"에서 데이터 복원 실패:`, error);
        }
      }

      if (restoredCount > 0) {
        setWordDefinitions(restoredDefinitions);
        console.log(`✅ ${restoredCount}개 단어 뜻 복원 완료:`, Object.keys(restoredDefinitions));
      } else {
        console.log('📚 복원할 수 있는 단어 뜻이 없습니다.');
      }
    } catch (error) {
      console.error('❌ 단어 뜻 복원 실패:', error);
    }
  };

  // 동화 단락의 모든 단어를 추출하고 뜻을 저장하는 함수
  const processStoryWords = async (text: string) => {
    if (!text) return;

    try {
      // 띄어쓰기를 기준으로 단어들을 쪼개기
      const words = text.split(/\s+/).filter((word) => {
        // 빈 문자열과 특수문자만 있는 단어 제외
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        return cleanWord.length > 0;
      });

      console.log('🔍 동화 단락에서 추출된 단어들:', words);

      // 각 단어의 뜻을 병렬로 가져오기 (로컬에 이미 있으면 건너뛰기)
      const wordPromises = words.map(async (word) => {
        const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '');
        if (cleanWord.length > 0) {
          // 이미 로컬에 저장된 뜻이 있는지 확인
          const localMeaning = await getWordMeaningFromStorage(cleanWord);
          if (!localMeaning) {
            // 로컬에 없으면 API에서 가져오기
            await getWordDefinition(cleanWord);
          } else {
            // 로컬에 있으면 상태에만 추가
            setWordDefinitions((prev) => ({
              ...prev,
              [cleanWord]: localMeaning,
            }));
          }
        }
      });

      await Promise.all(wordPromises);
      console.log('✅ 모든 단어의 뜻 처리 완료 (로컬 우선, API는 필요시만)');
    } catch (error) {
      console.error('❌ 동화 단어 처리 실패:', error);
    }
  };

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
        const favoriteStates = words.map((word) => {
          const isFavorite = storyFavorites.some((fav) => fav.word === word.word);
          // console.log(
          //   `🔍 단어 "${word.word}": 즐겨찾기 ${isFavorite ? '✅' : '❌'}`
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

  // 컴포넌트 마운트 시 모든 로직을 한 번에 실행
  useEffect(() => {
    // 동기화 화면 표시 (새 동화: 5초, 기존 동화: 1초)
    if (params.isNewStory === 'true') {
      setIsSyncing(true);
      // 5초 후 동기화 화면 숨김
      setTimeout(() => setIsSyncing(false), 20000);
    } else {
      setIsSyncing(true);
      // 1초 후 동기화 화면 숨김
      setTimeout(() => setIsSyncing(false), 2000);
    }

    const initializeStoryAndTTS = async () => {
      try {
        // 로컬 저장소에서 단어 뜻 복원
        await restoreWordDefinitionsFromStorage();
      } catch (error) {
        console.error('❌ 단어 뜻 복원 실패:', error);
      }
      try {
        if (params.storyId && params.title && params.content) {
          // === 1. 동화 데이터 준비 ===
          const storyData: Story = {
            storyId: parseInt(params.storyId as string),
            title: params.title as string,
            content: params.content as string,
            contentKr: params.contentKr as string,
            keywords: params.keywords ? (params.keywords as string).split(',') : [],
            childId: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // === 2. 프로필 정보 로드 ===
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

          // === 3. TTS 요청 상태 설정 (중복 방지) ===
          if (ttsRequested.has(storyData.storyId)) {
            console.log('🎵 TTS 이미 요청됨, 동화 데이터 로드 건너뛰기:', storyData.storyId);
            return;
          }
          setTtsRequested((prev) => new Set(prev).add(storyData.storyId));

          try {
            // === 4. 동화 단락 조회 ===
            console.log(`동화 ${storyData.storyId} 단락 조회 시작...`);
            const sections = await fetchStorySections(storyData.storyId, storyData.childId);
            console.log(`동화 ${storyData.storyId} 단락 조회 완료:`, sections.length, '개 단락');

            if (sections.length === 0) {
              console.warn(`⚠️ 동화 ${storyData.storyId}의 단락이 0개입니다.`);
            }

            // === 5. 동화 데이터 변환 및 설정 ===
            const learningStory = convertStoryToLearningStoryWithSections(storyData, sections);
            console.log('✅ 동화 단락 변환 완료:', {
              title: learningStory.title,
              contentLength: learningStory.content?.length || 0,
              sectionsCount: learningStory.sections?.length || 0,
            });

            setCurrentStory(learningStory);
            setIsStoryLoaded(true);

            // === 6. 단어 상태 초기화 ===
            setWordFavorites(new Array(learningStory.savedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.savedWords?.length || 0).fill(false));

            // === 7. 단어 데이터 로드 ===
            await getWordsForStory(storyData.storyId, storyData.childId);

            // === 7.2. 동화 단락의 모든 단어 처리 ===
            if (learningStory.sections && learningStory.sections.length > 0) {
              // 모든 단락의 단어들을 처리
              for (const section of learningStory.sections) {
                if (section.paragraphText) {
                  await processStoryWords(section.paragraphText);
                }
              }
            } else if (learningStory.content) {
              // fallback: 전체 내용에서 단어 처리
              await processStoryWords(learningStory.content);
            }

            // === 7.5. 퀴즈 로드 ===
            console.log('🎯 동화 로드 완료, 퀴즈 준비');
            // console.log('🔍 퀴즈 로드 전 storyData 확인:', {
            //   storyId: storyData.storyId,
            //   childId: storyData.childId,
            //   hasStoryId: !!storyData.storyId,
            //   hasChildId: !!storyData.childId,
            //   storyDataType: typeof storyData.storyId,
            //   childIdType: typeof storyData.childId,
            //   storyDataKeys: Object.keys(storyData),
            //   storyDataFull: storyData,
            // });

            if (storyData.storyId && storyData.childId) {
              console.log('✅ 퀴즈 로드 시작 - 유효한 storyId와 childId 확인됨');
              loadQuizzes(storyData);
            } else {
              console.warn('⚠️ 퀴즈 로드 건너뛰기: storyId 또는 childId가 유효하지 않음', {
                storyId: storyData.storyId,
                childId: storyData.childId,
                storyIdValid: !!storyData.storyId,
                childIdValid: !!storyData.childId,
              });
            }

            // === 8. TTS 생성 ===
            try {
              // 로컬 TTS 정보 확인
              const localTTSInfo = await loadStoryTTSFromStorage(
                storyData.childId,
                storyData.storyId
              );
              const hasLocalTTS = localTTSInfo && Object.keys(localTTSInfo).length > 0;

              if (hasLocalTTS) {
                console.log('📱 로컬 TTS 정보 발견, 서버 요청 건너뛰기');

                // 로컬 TTS 정보를 상태에 설정 (타입 변환 필요)
                const convertedLocalTTS: VoiceBasedTTSInfo = {};
                Object.entries(localTTSInfo).forEach(([voiceId, sectionMap]) => {
                  convertedLocalTTS[voiceId] = Object.entries(sectionMap).map(
                    ([sectionId, ttsData]) => ({
                      storyId: storyData.storyId,
                      sectionId: parseInt(sectionId),
                      audioPath: ttsData.audioPath,
                      ttsUrl: ttsData.ttsUrl,
                    })
                  );
                });

                setVoiceBasedTTSMap(convertedLocalTTS);

                // 현재 선택된 음성에 맞는 TTS 정보를 ttsAudioMap에 설정
                const voiceMapping: { [key: string]: string } = {
                  세연: 'Seoyeon',
                  Joanna: 'Joanna',
                };
                const actualVoiceId = voiceMapping[ttsVoiceId];
                const currentVoiceTTS = convertedLocalTTS[actualVoiceId] || [];
                const newTtsAudioMap: { [sectionId: number]: TTSAudioInfo } = {};

                if (Array.isArray(currentVoiceTTS)) {
                  currentVoiceTTS.forEach((ttsInfo) => {
                    if (ttsInfo && ttsInfo.sectionId) {
                      newTtsAudioMap[ttsInfo.sectionId] = ttsInfo;
                    }
                  });
                }

                setTtsAudioMap(newTtsAudioMap);
                console.log('✅ 로컬 TTS 정보 로드 완료');
              } else {
                console.log('🔄 로컬 TTS 정보 없음, 서버에서 새로 생성');

                // TTS 요청 상태 추가
                setTtsRequested((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(storyData.storyId);
                  console.log('✅ TTS 요청 상태 추가됨:', {
                    storyId: storyData.storyId,
                    newSetSize: newSet.size,
                    newSetValues: Array.from(newSet),
                  });
                  return newSet;
                });

                await generateTTSFromServer();
              }

              // 서버에서 TTS 생성하는 함수
              async function generateTTSFromServer() {
                console.log('🎵 TTS 생성 시작 - 학습 화면에서 동화 조회 시 생성');

                const ttsResults = await generateTTSForStory(storyData.childId, storyData.storyId);
                console.log(`✅ 동화 ${storyData.storyId} TTS 생성 완료:`, {
                  Joanna: ttsResults['Joanna']?.length || 0,
                  Seoyeon: ttsResults['Seoyeon']?.length || 0,
                });

                // === 9. TTS 데이터 설정 ===
                if (ttsResults && Object.keys(ttsResults).length > 0) {
                  setVoiceBasedTTSMap(ttsResults);

                  // 현재 선택된 음성에 맞는 TTS 정보를 ttsAudioMap에 설정
                  const voiceMapping: { [key: string]: string } = {
                    세연: 'Seoyeon',
                    Joanna: 'Joanna',
                  };
                  const actualVoiceId = voiceMapping[ttsVoiceId];
                  const currentVoiceTTS = ttsResults[actualVoiceId] || [];
                  const newTtsAudioMap: { [sectionId: number]: TTSAudioInfo } = {};

                  currentVoiceTTS.forEach((ttsInfo) => {
                    if (ttsInfo && ttsInfo.sectionId) {
                      newTtsAudioMap[ttsInfo.sectionId] = ttsInfo;
                    }
                  });

                  setTtsAudioMap(newTtsAudioMap);

                  // === 10. TTS 정보 로컬 저장 (모든 음성) ===
                  try {
                    // 모든 음성의 TTS 정보를 voiceId를 키로 하여 저장
                    const allTTSInfoForStorage: {
                      [voiceId: string]: {
                        [sectionId: number]: { audioPath: string; ttsUrl: string };
                      };
                    } = {};

                    // Joanna와 Seoyeon 음성 모두 저장
                    Object.entries(ttsResults).forEach(([voiceId, ttsArray]) => {
                      allTTSInfoForStorage[voiceId] = {};
                      ttsArray.forEach((ttsInfo) => {
                        if (ttsInfo && ttsInfo.sectionId) {
                          allTTSInfoForStorage[voiceId][ttsInfo.sectionId] = {
                            audioPath: ttsInfo.audioPath,
                            ttsUrl: ttsInfo.ttsUrl,
                          };
                        }
                      });
                    });

                    await saveStoryTTS(storyData.childId, storyData.storyId, allTTSInfoForStorage);
                    console.log(
                      '💾 모든 음성 TTS 정보 로컬 저장 완료:',
                      Object.keys(allTTSInfoForStorage).length,
                      '개 음성'
                    );
                  } catch (storageError) {
                    console.warn('⚠️ TTS 정보 로컬 저장 실패:', storageError);
                  }
                } else {
                  console.warn(`⚠️ ${ttsVoiceId} 음성의 TTS 정보가 없습니다.`);
                }
              }
            } catch (ttsError) {
              console.warn(`⚠️ 동화 ${storyData.storyId} TTS 처리 중 오류:`, ttsError);
            }

            // === 11. 삽화 이미지 로드 ===
            if (storyData.childId && storyData.childId > 0) {
              try {
                console.log(`동화 ${storyData.storyId} 삽화 이미지 로드 시작...`);

                // 삽화 동기화 (새 동화인 경우 강제 다운로드)
                const isNewStory = params.isNewStory === 'true';
                const storyTitleMap = { [storyData.storyId]: storyData.title };
                await syncMissingIllustrations(
                  [storyData.storyId],
                  storyData.childId,
                  undefined,
                  isNewStory,
                  storyTitleMap
                );

                // 삽화 목록 조회
                const illustrations = await fetchIllustrations(storyData.childId);
                const storyIllustrations = illustrations.filter(
                  (illustration) => illustration.storyId === storyData.storyId
                );

                console.log(`동화 ${storyData.storyId} 삽화 정보:`, {
                  totalIllustrations: illustrations.length,
                  storyIllustrations: storyIllustrations.length,
                });

                if (storyIllustrations.length > 0) {
                  // Story 객체에 삽화 정보 추가
                  const storyWithIllustrations = {
                    ...storyData,
                    illustrations: storyIllustrations.map((illustration) => ({
                      illustrationId: illustration.illustrationId,
                      storyId: illustration.storyId,
                      orderIndex: illustration.orderIndex,
                      localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}_story${illustration.storyId}_${storyData.title
                        .replace(/[<>:"/\\|?*]/g, '')
                        .replace(/\s+/g, '_')
                        .substring(0, 50)}.jpg`,
                      imageUrl: illustration.imageUrl,
                      description: illustration.description,
                      createdAt: illustration.createdAt,
                    })),
                  };

                  // Story 객체 저장
                  await addStoryToStorage(storyWithIllustrations);

                  // currentStory에 삽화 정보 추가
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

                  // 삽화 경로 확인 및 배경 설정
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
                  console.log(
                    `동화 ${storyData.storyId}에 해당하는 삽화가 없습니다. 기본 배경 사용`
                  );
                }
              } catch (illustrationError) {
                console.error('삽화 정보 조회 실패:', illustrationError);
                setBackgroundImage(null);
              }
            } else {
              setBackgroundImage(null);
              console.log('삽화 로드 건너뛰기 - childId가 유효하지 않음');
            }

            // === 12. 동기화 화면 타이머는 useEffect에서 설정됨 ===
          } catch (sectionError) {
            console.error(`동화 ${storyData.storyId} 단락 조회 실패:`, sectionError);

            // === 13. Fallback: 기존 방식으로 동화 로드 ===
            console.log('기존 방식으로 동화 로드 (프론트엔드 단락 분할)...');

            const learningStory = convertStoryToLearningStoryWithPages(storyData);
            const fallbackStory = {
              ...learningStory,
              sections: [],
              highlightedWords: learningStory.highlightedWords || [],
            };

            setCurrentStory(fallbackStory);
            setIsStoryLoaded(true);
            setWordFavorites(new Array(learningStory.highlightedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords?.length || 0).fill(false));

            // fallback 케이스에서도 단어 처리
            if (learningStory.content) {
              await processStoryWords(learningStory.content);
            }

            console.log('🎵 TTS 생성 건너뛰기 - fallback 케이스');

            // 동기화 화면 타이머 설정
            if (params.isNewStory === 'true') {
              // 새 동화인 경우 5초 후 동기화 화면 숨김
              setTimeout(() => setIsSyncing(false), 20000);
            } else {
              // 기존 동화인 경우 1초 후 동기화 화면 숨김
              setTimeout(() => setIsSyncing(false), 2000);
            }
          }
        } else {
          // === 14. 기존 로직: 선택된 프로필의 최신 동화 사용 ===
          const selectedProfile = await loadSelectedProfile();
          if (!selectedProfile || !selectedProfile.childId || selectedProfile.childId <= 0) {
            console.warn('⚠️ 선택된 프로필이 없거나 childId가 유효하지 않음:', selectedProfile);
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
          });

          try {
            // 최신 동화 단락 조회
            const sections = await fetchStorySections(latestStory.storyId, latestStory.childId);
            const learningStory = convertStoryToLearningStoryWithSections(latestStory, sections);

            setCurrentStory(learningStory);
            setIsStoryLoaded(true);
            setWordFavorites(new Array(learningStory.highlightedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords?.length || 0).fill(false));

            await getWordsForStory(latestStory.storyId, latestStory.childId);

            // 최신 동화 단락의 단어들도 처리
            if (learningStory.sections && learningStory.sections.length > 0) {
              for (const section of learningStory.sections) {
                if (section.paragraphText) {
                  await processStoryWords(section.paragraphText);
                }
              }
            } else if (learningStory.content) {
              await processStoryWords(learningStory.content);
            }

            // 동기화 화면 타이머는 useEffect에서 설정됨
          } catch (sectionError) {
            console.error(`최신 동화 ${latestStory.storyId} 단락 조회 실패:`, sectionError);

            // Fallback 방식
            const learningStory = convertStoryToLearningStoryWithPages(latestStory);
            const fallbackStory = {
              ...learningStory,
              sections: [],
              highlightedWords: learningStory.highlightedWords || [],
            };

            setCurrentStory(fallbackStory);
            setIsStoryLoaded(true);
            setWordFavorites(new Array(learningStory.highlightedWords?.length || 0).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords?.length || 0).fill(false));
          }

          // 최신 동화 삽화 로드
          if (latestStory.childId && latestStory.childId > 0) {
            try {
              const isNewStory = params.isNewStory === 'true';
              const storyTitleMap = { [latestStory.storyId]: latestStory.title };
              await syncMissingIllustrations(
                [latestStory.storyId],
                latestStory.childId,
                undefined,
                isNewStory,
                storyTitleMap
              );
              const illustrations = await fetchIllustrations(latestStory.childId);
              const storyIllustrations = illustrations.filter(
                (illustration) => illustration.storyId === latestStory.storyId
              );

              if (storyIllustrations.length > 0) {
                const storyWithIllustrations = {
                  ...latestStory,
                  illustrations: storyIllustrations.map((illustration) => ({
                    illustrationId: illustration.illustrationId,
                    storyId: illustration.storyId,
                    orderIndex: illustration.orderIndex,
                    localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}_story${illustration.storyId}_${latestStory.title
                      .replace(/[<>:"/\\|?*]/g, '')
                      .replace(/\s+/g, '_')
                      .substring(0, 50)}.jpg`,
                    imageUrl: illustration.imageUrl,
                    description: illustration.description,
                    createdAt: illustration.createdAt,
                  })),
                };

                await addStoryToStorage(storyWithIllustrations);

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
                  return learningStoryWithIllustrations;
                });

                const illustrationPath =
                  await getStoryIllustrationPathFromStory(storyWithIllustrations);
                if (illustrationPath) {
                  setBackgroundImage(illustrationPath);
                } else {
                  setBackgroundImage(null);
                }
              } else {
                setBackgroundImage(null);
              }
            } catch (illustrationError) {
              console.error('최신 동화 삽화 정보 조회 실패:', illustrationError);
              setBackgroundImage(null);
            }
          }
        }

        console.log('🎯 동화 초기화 완료');
      } catch (error) {
        console.error('동화 초기화 실패:', error);
      }
    };

    initializeStoryAndTTS();
  }, []); // 빈 의존성 배열 - 마운트 시 한 번만 실행

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

  // API에서 TTS 요청하는 함수

  // 동화 내용을 클릭 가능한 단어들로 분리하는 함수
  const renderClickableText = (text: string) => {
    if (!text) return null;

    // 띄어쓰기를 기준으로 단어들을 분리
    const words = text.split(/(\s+)/);

    return words.map((word, index) => {
      // 실제 단어인지 확인 (특수문자 제거 후 길이 체크)
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      const isActualWord = cleanWord.length > 0;

      if (isActualWord) {
        return (
          <TouchableOpacity
            key={index}
            onLongPress={() => handleWordLongPress(cleanWord)}
            style={{ marginHorizontal: 1 }}
          >
            <Text style={englishLearningStyles.storyText}>{word}</Text>
          </TouchableOpacity>
        );
      } else {
        // 공백이나 특수문자는 그대로 표시
        return (
          <Text key={index} style={englishLearningStyles.storyText}>
            {word}
          </Text>
        );
      }
    });
  };

  // 단어 롱터치(더블클릭) 핸들러
  const handleWordLongPress = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '');
    if (cleanWord.length === 0) return;

    console.log('🔍 단어 롱터치:', cleanWord);

    // 저장된 뜻이 있으면 바로 표시, 없으면 API에서 가져오기
    if (wordDefinitions[cleanWord]) {
      setSelectedWord(cleanWord);
      setSelectedWordMeaning(wordDefinitions[cleanWord]);
      setShowWordDefinitionPopup(true);
    } else {
      // 뜻을 가져오는 중임을 표시
      setSelectedWord(cleanWord);
      setSelectedWordMeaning('의미를 불러오는 중...');
      setShowWordDefinitionPopup(true);

      // API에서 뜻 가져오기
      getWordDefinition(cleanWord)
        .then((meaning) => {
          setSelectedWordMeaning(meaning);
        })
        .catch((error) => {
          console.log('❌ 단어 뜻 조회 실패:', error);
          setSelectedWordMeaning('의미를 가져올 수 없습니다.');
        });
    }
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

  // 현재 페이지 단어 목록을 메모이제이션하여 중복 호출 방지
  const memoizedCurrentPageWords = useMemo(() => {
    return getCurrentPageWords();
  }, [currentStory?.savedWords, currentPage, wordFavorites]);

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

      // 배속 설정
      await sound.setRateAsync(ttsPlaybackRate, true);

      await sound.playAsync();

      console.log('✅ TTS 재생 성공');
    } catch (error) {
      console.error('❌ TTS 재생 실패:', error);
      Alert.alert('TTS', '음성 재생에 실패했습니다.\n파일이 손상되었거나 접근할 수 없습니다.');
    }
  };

  // 단어 클릭 핸들러
  const handleWordPress = useCallback(
    async (index: number) => {
      // 현재 페이지의 단어만 필터링하여 인덱스 매핑 (메모이제이션된 결과 사용)
      const currentPageWords = memoizedCurrentPageWords;

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

      // 단어 클릭 시 포인트 지급 및 배지 체크 (한글 뜻을 처음 표시할 때만)
      if (newWordClicked[index] && currentStory?.childId) {
        try {
          // 1. 단어 클릭 포인트 지급
          console.log('💰 단어 클릭 포인트 지급 시작');
          const rewardResponse = await rewardWordClick(currentStory.childId);
          console.log('✅ 단어 클릭 포인트 지급 완료:', rewardResponse);

          // 2. 배지 조건 판단 및 지급 여부 확인
          console.log('🏆 배지 조건 판단 시작');
          const badgeResponse = await checkBadges(currentStory.childId, 'WORD_CLICK');
          console.log('✅ 배지 조건 판단 완료:', badgeResponse);
        } catch (error) {
          console.error('❌ 단어 클릭 시 보상 처리 실패:', error);
        }
      }
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

      // 현재 페이지의 단어만 필터링 (메모이제이션된 결과 사용)
      const currentPageWords = memoizedCurrentPageWords;

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
  const handleNavigation = async (direction: 'prev' | 'next') => {
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

      // 마지막 페이지 진입 시 포인트 지급 및 배지 체크
      if (newPage === totalPages && currentStory?.childId) {
        console.log('🎯 마지막 페이지 진입 - 포인트 지급 및 배지 체크 시작');

        try {
          // 1. 동화 읽기 포인트 지급
          console.log('💰 동화 읽기 포인트 지급 시작');
          const rewardResponse = await rewardStoryRead(currentStory.childId, currentStory.storyId);
          console.log('✅ 동화 읽기 포인트 지급 완료:', rewardResponse);

          // 2. 배지 조건 판단 및 지급 여부 확인
          console.log('🏆 배지 조건 판단 시작');
          const badgeResponse = await checkBadges(currentStory.childId, 'STORY_READ');
          console.log('✅ 배지 조건 판단 완료:', badgeResponse);
        } catch (error) {
          console.error('❌ 마지막 페이지 진입 시 보상 처리 실패:', error);
        }
      }
    } else {
      console.log(`⚠️ 페이지 이동 불가: ${direction} (현재: ${currentPage}, 전체: ${totalPages})`);
    }
  };

  // 퀴즈 제출 후 자동으로 다음 페이지로 이동하는 함수
  const handleQuizSubmitAndContinue = async (selectedAnswer: string) => {
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

    // 퀴즈 답안 제출 시 포인트 지급 및 배지 체크
    if (currentStory?.childId) {
      try {
        // 1. 퀴즈 정답 포인트 지급
        console.log('💰 퀴즈 정답 포인트 지급 시작');
        const rewardResponse = await rewardQuizCorrect(currentStory.childId);
        console.log('✅ 퀴즈 정답 포인트 지급 완료:', rewardResponse);

        // 2. 배지 조건 판단 및 지급 여부 확인
        console.log('🏆 배지 조건 판단 시작');
        const badgeResponse = await checkBadges(currentStory.childId, 'QUIZ_CORRECT');
        console.log('✅ 배지 조건 판단 완료:', badgeResponse);
      } catch (error) {
        console.error('❌ 퀴즈 답안 제출 시 보상 처리 실패:', error);
      }
    }

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
  const loadQuizzes = async (storyData: Story) => {
    // storyData를 직접 사용하도록 수정
    if (!storyData?.storyId || !storyData?.childId) {
      console.warn('⚠️ 퀴즈 로드 실패: storyData에서 storyId 또는 childId가 없습니다', {
        storyData: storyData,
        storyId: storyData?.storyId,
        childId: storyData?.childId,
      });
      return;
    }

    try {
      setIsQuizLoading(true);
      console.log('🎯 퀴즈 로드 시작:', {
        storyId: storyData.storyId,
        childId: storyData.childId,
      });

      const quizList = await getQuizzesByStory(storyData.storyId, storyData.childId);

      // quizId가 없는 퀴즈는 필터링하여 제거
      const validQuizzes = quizList.filter((quiz) => {
        const hasValidId = quiz.quizId || (quiz as any).id;
        if (!hasValidId) {
          console.warn('⚠️ quizId가 없는 퀴즈 항목 제거:', quiz);
        }
        return hasValidId;
      });

      setQuizzes(validQuizzes);
      console.log(
        '✅ 퀴즈 로드 완료:',
        validQuizzes.length,
        '개 (전체:',
        quizList.length,
        '개에서 유효한 퀴즈만 필터링)'
      );
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

      {/* 동기화 화면 */}
      {isSyncing && (
        <View style={englishLearningStyles.syncContainer}>
          <Image source={randomCharacterImage} style={englishLearningStyles.syncIcon} />
          <Text style={englishLearningStyles.syncTitle}>동기화 중...</Text>
          <Text style={englishLearningStyles.syncDescription}>
            동화 데이터를 동기화하고 있습니다{'\n'}잠시만 기다려주세요
          </Text>
        </View>
      )}

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
      ) : (
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : defaultBackgroundImage}
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

              {/* TTS 설정 햄버거 메뉴 */}
              <TTSSettingsMenu
                ttsVoiceId={ttsVoiceId}
                ttsPlaybackRate={ttsPlaybackRate}
                onVoiceChange={(newVoiceId) => {
                  setTtsVoiceId(newVoiceId);
                  console.log('🎭 TTS 성우 변경:', { from: ttsVoiceId, to: newVoiceId });

                  // 음성 변경 시 해당 음성의 TTS 정보를 ttsAudioMap에 설정
                  const voiceMapping: { [key: string]: string } = {
                    세연: 'Seoyeon',
                    Joanna: 'Joanna',
                  };
                  const actualVoiceId = voiceMapping[newVoiceId];

                  console.log('🎭 음성 변경 디버깅:', {
                    newVoiceId,
                    actualVoiceId,
                    voiceBasedTTSMapKeys: Object.keys(voiceBasedTTSMap),
                    hasVoiceData: !!voiceBasedTTSMap[actualVoiceId],
                    voiceData: voiceBasedTTSMap[actualVoiceId],
                    voiceBasedTTSMapFull: voiceBasedTTSMap,
                  });

                  if (voiceBasedTTSMap[actualVoiceId]) {
                    const newTtsAudioMap: { [sectionId: number]: TTSAudioInfo } = {};

                    // voiceBasedTTSMap[actualVoiceId]는 배열 또는 객체 형태일 수 있음
                    const currentVoiceTTS = voiceBasedTTSMap[actualVoiceId];

                    console.log('🎵 현재 음성 TTS 데이터:', {
                      actualVoiceId,
                      currentVoiceTTS,
                      isArray: Array.isArray(currentVoiceTTS),
                      isObject:
                        typeof currentVoiceTTS === 'object' && !Array.isArray(currentVoiceTTS),
                      sectionCount: Array.isArray(currentVoiceTTS)
                        ? currentVoiceTTS.length
                        : Object.keys(currentVoiceTTS || {}).length,
                    });

                    if (Array.isArray(currentVoiceTTS)) {
                      // 배열 형태인 경우: [{sectionId, audioPath, ttsUrl}, ...]
                      currentVoiceTTS.forEach((ttsInfo) => {
                        if (ttsInfo && ttsInfo.sectionId) {
                          newTtsAudioMap[ttsInfo.sectionId] = ttsInfo;
                          console.log(`✅ 단락 ${ttsInfo.sectionId} TTS 정보 추가:`, ttsInfo);
                        }
                      });
                    } else if (
                      currentVoiceTTS &&
                      typeof currentVoiceTTS === 'object' &&
                      !Array.isArray(currentVoiceTTS)
                    ) {
                      // 객체 형태인 경우: {sectionId: TTSAudioInfo}
                      Object.entries(currentVoiceTTS).forEach(([sectionIdStr, ttsInfo]) => {
                        const sectionId = parseInt(sectionIdStr);
                        if (ttsInfo && ttsInfo.sectionId) {
                          newTtsAudioMap[sectionId] = ttsInfo;
                          console.log(`✅ 단락 ${sectionId} TTS 정보 추가:`, ttsInfo);
                        } else {
                          console.warn(`⚠️ 단락 ${sectionIdStr} TTS 정보 누락:`, ttsInfo);
                        }
                      });
                    } else {
                      console.warn(
                        `⚠️ ${newVoiceId} 음성의 TTS 데이터가 올바른 형태가 아닙니다:`,
                        typeof currentVoiceTTS,
                        currentVoiceTTS
                      );
                      return;
                    }

                    setTtsAudioMap(newTtsAudioMap);
                    console.log(
                      `🎵 ${newVoiceId} 음성 TTS 정보로 업데이트 완료:`,
                      Object.keys(newTtsAudioMap).length,
                      '개 단락'
                    );
                  } else {
                    console.warn(
                      `⚠️ ${newVoiceId} 음성의 TTS 정보가 없습니다. voiceBasedTTSMap:`,
                      voiceBasedTTSMap
                    );
                  }
                }}
                onPlaybackRateChange={(newRate) => {
                  setTtsPlaybackRate(newRate);

                  // 현재 재생 중인 음성에 배속 적용
                  if (ttsSound) {
                    ttsSound.setRateAsync(newRate, true);
                  }

                  console.log('🎵 TTS 배속 변경:', { from: ttsPlaybackRate, to: newRate });
                }}
              />

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
              <View
                style={[
                  englishLearningStyles.storyContentSection,
                  !showVocabularyPanel && { flex: 0.97, marginRight: wp(2) }, // 패널이 숨겨져 있을 때 크기 확장
                ]}
              >
                {/* 현재 페이지 정보 디버깅 */}
                {currentStory?.sections && currentStory.sections.length > 0 && (
                  <Text style={englishLearningStyles.storyText}>
                    📖 페이지 {currentPage} (총 {currentStory.sections.length}페이지)
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {renderClickableText(getCurrentPageText())}
                </View>

                {getCurrentPageKoreanText() && (
                  <Text style={englishLearningStyles.koreanTranslation}>
                    {getCurrentPageKoreanText()}
                  </Text>
                )}

                <View style={englishLearningStyles.keyWords}>
                  {!currentStory?.savedWords ? (
                    <Text style={englishLearningStyles.loadingText}>단어 로딩 중...</Text>
                  ) : memoizedCurrentPageWords.length === 0 ? (
                    <Text style={englishLearningStyles.loadingText}>
                      이 페이지에 단어가 없습니다.
                    </Text>
                  ) : (
                    memoizedCurrentPageWords.map((wordData, index) => (
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

              {/* 애니메이션 토글 버튼 - 패널 외부에 배치 (패널이 숨겨져 있을 때도 표시) */}
              <AnimatedToggleButton
                isActive={showVocabularyPanel}
                onPress={() => setShowVocabularyPanel(!showVocabularyPanel)}
                activeIcon="📖"
                style={[
                  englishLearningStyles.toggleButton,
                  !showVocabularyPanel && englishLearningStyles.toggleButtonHidden,
                ]}
              />

              {/* 즐겨찾기 단어 패널 - 토글 상태에 따라 표시/숨김 */}
              {showVocabularyPanel && (
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
                                favoriteWordsPage === 1 &&
                                  englishLearningStyles.disabledArrowButton,
                              ]}
                              onPress={() => handleFavoriteWordsPageChange('prev')}
                              disabled={favoriteWordsPage === 1}
                            >
                              <Text
                                style={[
                                  englishLearningStyles.arrowButtonText,
                                  favoriteWordsPage === 1 &&
                                    englishLearningStyles.disabledArrowButton,
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
                        {getCurrentFavoriteWordsPage().map(({ wordData, savedIndex }) => (
                          <View
                            key={`favorite-${wordData.word}-${savedIndex}`}
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
              )}
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

              <TouchableOpacity
                style={[
                  // 마지막 페이지면 퀴즈 버튼, 아니면 일반 다음 버튼
                  currentPage === (currentStory?.sections?.length || 1)
                    ? englishLearningStyles.quizStartButton
                    : englishLearningStyles.navButton,
                ]}
                onPress={() => {
                  // 마지막 페이지면 퀴즈 시작, 아니면 다음 페이지로
                  if (currentPage === (currentStory?.sections?.length || 1)) {
                    startQuiz();
                  } else {
                    handleNavigation('next');
                  }
                }}
                disabled={isQuizLoading}
              >
                <Text style={englishLearningStyles.navButtonText}>
                  {currentPage === (currentStory?.sections?.length || 1)
                    ? isQuizLoading
                      ? '🔄 퀴즈 로딩 중...'
                      : `🎯 퀴즈 (${quizzes.length})`
                    : '다음 ▶'}
                </Text>
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
        currentQuizIndex={currentQuizIndex}
        totalQuizzes={quizzes.length}
      />

      {/* 단어 뜻 팝업 */}
      <WordDefinitionPopup
        visible={showWordDefinitionPopup}
        word={selectedWord}
        meaning={selectedWordMeaning}
        onClose={() => setShowWordDefinitionPopup(false)}
      />
    </View>
  );
}
