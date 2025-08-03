import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// --- 내부 모듈 및 스타일 ---
import englishLearningStyles from '@/styles/EnglishLearningScreen.styles';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import { loadStoriesByChildId, addStoryToStorage } from '@/features/storyCreate/storyStorage';
import {
  fetchStorySections,
  fetchIllustrations,
  downloadIllustration,
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
import { loadQuizData } from '@/shared/utils/quizLoader';
import { QuizData } from '@/shared/types/quiz';
import { Audio } from 'expo-av';
import { requestAllSectionsTTS, TTSAudioInfo } from '@/features/storyCreate/storyApi';

// --- 이미지 및 리소스 ---
import defaultBackgroundImage from '@/assets/images/background/night-bg.png';

export default function EnglishLearningScreen() {
  const params = useLocalSearchParams();
  const [currentStory, setCurrentStory] = useState<LearningStoryWithSections | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordFavorites, setWordFavorites] = useState<boolean[]>([]);
  const [wordClicked, setWordClicked] = useState<boolean[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [ttsAudioMap, setTtsAudioMap] = useState<{ [sectionId: number]: TTSAudioInfo }>({});
  const [ttsSound, setTtsSound] = useState<Audio.Sound | null>(null);

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
          if (selectedProfile) {
            storyData.childId = selectedProfile.childId;
          }

          // API에서 동화 단락 조회
          try {
            console.log(`동화 ${storyData.storyId} 단락 조회 시작...`);
            const sections = await fetchStorySections(storyData.storyId, storyData.childId);
            console.log(`동화 ${storyData.storyId} 단락 조회 완료:`, sections.length, '개 단락');

            const learningStory = convertStoryToLearningStoryWithSections(storyData, sections);
            setCurrentStory(learningStory);

            // 단어 즐겨찾기 상태 초기화
            setWordFavorites(new Array(learningStory.highlightedWords.length).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords.length).fill(false));
          } catch (sectionError) {
            console.error(`동화 ${storyData.storyId} 단락 조회 실패:`, sectionError);
            console.log('기존 방식으로 동화 로드 (프론트엔드 단락 분할)...');

            // API 실패 시 기존 방식 사용
            const learningStory = convertStoryToLearningStoryWithPages(storyData);
            setCurrentStory({
              ...learningStory,
              sections: [], // 빈 배열로 설정
            });

            setWordFavorites(new Array(learningStory.highlightedWords.length).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords.length).fill(false));
          }

          // 삽화 이미지 로드 (개선된 동기화 로직)
          try {
            console.log(`동화 ${storyData.storyId} 삽화 이미지 로드 시작...`);

            // 해당 동화의 삽화 동기화
            try {
              await syncMissingIllustrations([storyData.storyId]);

              // 서버에서 최신 삽화 목록 조회
              const illustrations = await fetchIllustrations();
              const storyIllustrations = illustrations.filter(
                (illustration) => illustration.storyId === storyData.storyId
              );

              if (storyIllustrations.length > 0) {
                // Story 객체에 illustrations 정보 추가
                const storyWithIllustrations = {
                  ...storyData,
                  illustrations: storyIllustrations.map((illustration) => ({
                    illustrationId: illustration.illustrationId,
                    storyId: illustration.storyId,
                    localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`,
                    imageUrl: illustration.imageUrl,
                    description: illustration.description,
                    createdAt: illustration.createdAt,
                  })),
                };

                // Story 객체를 illustrations 정보와 함께 저장
                await addStoryToStorage(storyWithIllustrations);

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
              console.error('삽화 정보 조회 실패:', illustrationError);
              setBackgroundImage(null);
            }
          } catch (error) {
            console.error(`동화 ${storyData.storyId} 삽화 로드 실패:`, error);
            setBackgroundImage(null);
          }

          console.log('동화 데이터 로드 완료:', {
            title: currentStory?.title,
            contentLength: currentStory?.content.length,
            highlightedWordsCount: currentStory?.highlightedWords.length,
            sectionsCount: currentStory?.sections.length,
            hasBackgroundImage: !!backgroundImage,
          });
        } else {
          // 기존 로직: 선택된 프로필의 최신 동화 사용
          const selectedProfile = await loadSelectedProfile();
          if (!selectedProfile) {
            console.log('선택된 프로필이 없습니다.');
            return;
          }

          const stories = await loadStoriesByChildId(selectedProfile.childId);
          if (stories.length === 0) {
            console.log('동화가 없습니다.');
            return;
          }

          const latestStory = stories[0];
          console.log('최신 동화 데이터:', {
            storyId: latestStory.storyId,
            title: latestStory.title,
            contentLength: latestStory.content?.length || 0,
            hasContent: !!latestStory.content,
          });

          // API에서 동화 단락 조회
          try {
            console.log(`동화 ${latestStory.storyId} 단락 조회 시작...`);
            const sections = await fetchStorySections(latestStory.storyId, latestStory.childId);
            console.log(`동화 ${latestStory.storyId} 단락 조회 완료:`, sections.length, '개 단락');

            const learningStory = convertStoryToLearningStoryWithSections(latestStory, sections);
            setCurrentStory(learningStory);

            setWordFavorites(new Array(learningStory.highlightedWords.length).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords.length).fill(false));
          } catch (sectionError) {
            console.error(`동화 ${latestStory.storyId} 단락 조회 실패:`, sectionError);
            console.log('기존 방식으로 동화 로드 (프론트엔드 단락 분할)...');

            // API 실패 시 기존 방식 사용
            const learningStory = convertStoryToLearningStoryWithPages(latestStory);
            setCurrentStory({
              ...learningStory,
              sections: [],
            });

            setWordFavorites(new Array(learningStory.highlightedWords.length).fill(false));
            setWordClicked(new Array(learningStory.highlightedWords.length).fill(false));
          }

          // 삽화 이미지 로드 (개선된 동기화 로직)
          try {
            console.log(`동화 ${latestStory.storyId} 삽화 이미지 로드 시작...`);

            // 해당 동화의 삽화 동기화
            try {
              await syncMissingIllustrations([latestStory.storyId]);

              // 서버에서 최신 삽화 목록 조회
              const illustrations = await fetchIllustrations();
              const storyIllustrations = illustrations.filter(
                (illustration) => illustration.storyId === latestStory.storyId
              );

              if (storyIllustrations.length > 0) {
                // Story 객체에 illustrations 정보 추가
                const storyWithIllustrations = {
                  ...latestStory,
                  illustrations: storyIllustrations.map((illustration) => ({
                    illustrationId: illustration.illustrationId,
                    storyId: illustration.storyId,
                    localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`,
                    imageUrl: illustration.imageUrl,
                    description: illustration.description,
                    createdAt: illustration.createdAt,
                  })),
                };

                // Story 객체를 illustrations 정보와 함께 저장
                await addStoryToStorage(storyWithIllustrations);

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
              console.error('삽화 정보 조회 실패:', illustrationError);
              setBackgroundImage(null);
            }
          } catch (error) {
            console.error(`동화 ${latestStory.storyId} 삽화 로드 실패:`, error);
            setBackgroundImage(null);
          }
        }
      } catch (error) {
        console.error('동화 데이터 로드 실패:', error);
      }
    };

    loadStoryData();
  }, [params.storyId, params.title, params.content, params.keywords]);

  // 기존 useEffect 내부, 동화 단락 조회 성공 후 추가
  useEffect(() => {
    if (currentStory && currentStory.sections && currentStory.sections.length > 0) {
      requestAllSectionsTTS(currentStory.storyId, currentStory.sections, 'Seoyeon', 0.8)
        .then((ttsList) => {
          const map: { [sectionId: number]: TTSAudioInfo } = {};
          ttsList.forEach((info) => {
            map[info.sectionId] = info;
          });
          setTtsAudioMap(map);
        })
        .catch(() => {
          // 무시
        });
    }
  }, [currentStory?.storyId]);

  // 현재 페이지의 영어 텍스트 가져오기
  const getCurrentPageText = () => {
    if (!currentStory) return '';

    // API에서 받아온 단락이 있으면 사용
    if (currentStory.sections && currentStory.sections.length > 0) {
      const currentSection = currentStory.sections[currentPage - 1];
      return currentSection ? currentSection.paragraphText : '';
    }

    // 기존 방식 (전체 내용을 현재 페이지로 표시)
    return currentStory.content || '';
  };

  // 현재 페이지의 한국어 번역 가져오기
  const getCurrentPageKoreanText = () => {
    if (!currentStory) return '';

    // API에서 받아온 단락이 있으면 사용
    if (currentStory.sections && currentStory.sections.length > 0) {
      const currentSection = currentStory.sections[currentPage - 1];
      return currentSection ? currentSection.paragraphTextKr : '';
    }

    // 기존 방식 (전체 한국어 내용)
    return currentStory.contentKr || '';
  };

  // 퀴즈 표시 핸들러
  const handleShowQuiz = async () => {
    try {
      const quizDataSet = await loadQuizData();
      // QuizDataSet을 QuizData[]로 변환
      const quizDataArray: QuizData[] = [];
      Object.values(quizDataSet).forEach((quizzes) => {
        quizDataArray.push(...quizzes);
      });
      // setQuizData(quizDataArray); // Removed as per edit hint
      // setCurrentQuizIndex(0); // Removed as per edit hint
      setShowQuiz(true);
    } catch (error) {
      console.error('퀴즈 데이터 로드 실패:', error);
      Alert.alert('오류', '퀴즈를 불러올 수 없습니다.');
    }
  };

  // 읽어주기 버튼 핸들러
  const handleTextToSpeech = async () => {
    if (!currentStory || !currentStory.sections || currentStory.sections.length === 0) return;
    const section = currentStory.sections[currentPage - 1];
    if (!section) return;
    const ttsInfo = ttsAudioMap[section.sectionId];
    if (!ttsInfo) {
      Alert.alert('TTS', '음성 파일이 아직 준비되지 않았습니다.');
      return;
    }
    try {
      if (ttsSound) {
        await ttsSound.unloadAsync();
        setTtsSound(null);
      }
      const { sound } = await Audio.Sound.createAsync({ uri: ttsInfo.audioPath });
      setTtsSound(sound);
      await sound.playAsync();
    } catch (error) {
      Alert.alert('TTS', '음성 재생에 실패했습니다.');
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

    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={englishLearningStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {!currentStory ? (
        // 로딩 상태 또는 데이터가 없을 때
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
              <TouchableOpacity style={englishLearningStyles.quizButton} onPress={handleShowQuiz}>
                <Text style={englishLearningStyles.quizButtonText}>📝 퀴즈</Text>
              </TouchableOpacity>

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
                  {currentStory.highlightedWords.map((wordData, index) => (
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
                          <Text style={englishLearningStyles.keyWordKorean}>{wordData.korean}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
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

              <TouchableOpacity
                style={[
                  englishLearningStyles.navButton,
                  currentPage ===
                    (currentStory.sections && currentStory.sections.length > 0
                      ? currentStory.sections.length
                      : 1) && englishLearningStyles.navButtonDisabled,
                ]}
                onPress={() => handleNavigation('next')}
                disabled={
                  currentPage ===
                  (currentStory.sections && currentStory.sections.length > 0
                    ? currentStory.sections.length
                    : 1)
                }
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
              <TouchableOpacity style={englishLearningStyles.quizButton} onPress={handleShowQuiz}>
                <Text style={englishLearningStyles.quizButtonText}>📝 퀴즈</Text>
              </TouchableOpacity>

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
                  {currentStory.highlightedWords.map((wordData, index) => (
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
                          <Text style={englishLearningStyles.keyWordKorean}>{wordData.korean}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
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

              <TouchableOpacity
                style={[
                  englishLearningStyles.navButton,
                  currentPage === currentStory.totalPages &&
                    englishLearningStyles.navButtonDisabled,
                ]}
                onPress={() => handleNavigation('next')}
                disabled={currentPage === currentStory.totalPages}
              >
                <Text style={englishLearningStyles.navButtonText}>다음 ▶</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}

      {/* 퀴즈 모달 */}
      <QuizModal
        visible={showQuiz}
        onClose={() => setShowQuiz(false)}
        quiz={{
          id: '1',
          question: '테스트 퀴즈',
          example: 'This is a test example.',
          options: ['옵션 1', '옵션 2', '옵션 3', '옵션 4'],
          correctAnswer: 0,
          category: 'vocabulary',
          difficulty: 'easy',
          source: '테스트',
        }}
        onComplete={(score) => {
          console.log('퀴즈 완료, 점수:', score);
        }}
      />
    </View>
  );
}
