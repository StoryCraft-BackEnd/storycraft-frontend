import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { englishLearningStyles } from '../../styles/EnglishLearningScreen.styles';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QuizPopup from '../../components/ui/QuizPopup';
import { getQuizByWords } from '../../shared/utils/quizLoader';
import { QuizData } from '../../shared/types/quiz';
import { loadStoriesByChildId } from '../../features/storyCreate/storyStorage';
import {
  convertStoryToLearningStoryWithPages,
  getStoryIllustrationPath,
} from '../../features/storyCreate/storyUtils';
import { loadSelectedProfile } from '../../features/profile/profileStorage';
import { LearningStory, Story } from '../../features/storyCreate/types';

export default function EnglishLearningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [wordFavorites, setWordFavorites] = useState<boolean[]>([]);
  const [wordClicked, setWordClicked] = useState<boolean[]>([]);
  const [favoritePage, setFavoritePage] = useState(1);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [currentStory, setCurrentStory] = useState<(LearningStory & { pages: string[] }) | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // 컴포넌트 마운트 시 동화 데이터 로드
  useEffect(() => {
    const loadStoryData = async () => {
      try {
        setIsLoading(true);

        // URL 파라미터에서 동화 데이터 확인
        if (params.storyId && params.title && params.content) {
          // 동화 목록에서 전달받은 데이터 사용
          const storyData: Story = {
            storyId: parseInt(params.storyId as string),
            title: params.title as string,
            content: params.content as string,
            contentKr: (params.contentKr as string) || '', // 한국어 내용 (선택적)
            keywords: params.keywords ? (params.keywords as string).split(',') : [],
            createdAt: (params.createdAt as string) || new Date().toISOString(),
            updatedAt: (params.updatedAt as string) || new Date().toISOString(),
            thumbnailUrl: undefined, // 추후 삭제 예정
            childId: parseInt((params.childId as string) || '0'), // 프로필 ID
            isBookmarked: false,
            isLiked: false,
          };

          console.log('전달받은 동화 데이터:', {
            storyId: storyData.storyId,
            title: storyData.title,
            contentLength: storyData.content?.length || 0,
            hasContent: !!storyData.content,
            childId: storyData.childId,
          });

          const learningStory = convertStoryToLearningStoryWithPages(storyData);
          setCurrentStory(learningStory);

          // 단어 즐겨찾기 상태 초기화
          setWordFavorites(new Array(learningStory.highlightedWords.length).fill(false));
          setWordClicked(new Array(learningStory.highlightedWords.length).fill(false));

          // 삽화 이미지 로드 (로컬 저장된 이미지 확인)
          try {
            console.log(`동화 ${storyData.storyId} 삽화 이미지 로드 시작...`);

            // TODO: 추후 별도 API로 삽화 URL 받아오기
            // const illustrationUrl = await getStoryIllustrationUrl(storyData.storyId);
            // if (illustrationUrl) {
            //   const localPath = await downloadStoryIllustration(illustrationUrl, storyData.storyId);
            //   setBackgroundImage(localPath);
            //   console.log(`동화 ${storyData.storyId} 삽화 다운로드 및 배경 설정:`, localPath);
            // }

            // 현재는 로컬 저장된 삽화 이미지만 확인
            const illustrationPath = await getStoryIllustrationPath(storyData.storyId);
            if (illustrationPath) {
              setBackgroundImage(illustrationPath);
              console.log(`동화 ${storyData.storyId} 로컬 삽화 배경 설정:`, illustrationPath);
            } else {
              console.log(`동화 ${storyData.storyId} 삽화 이미지가 없습니다.`);
            }
          } catch (error) {
            console.error(`동화 ${storyData.storyId} 삽화 로드 실패:`, error);
          }

          console.log('동화 데이터 로드 완료:', {
            title: learningStory.title,
            contentLength: learningStory.content.length,
            highlightedWordsCount: learningStory.highlightedWords.length,
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

          const learningStory = convertStoryToLearningStoryWithPages(latestStory);
          setCurrentStory(learningStory);

          setWordFavorites(new Array(learningStory.highlightedWords.length).fill(false));
          setWordClicked(new Array(learningStory.highlightedWords.length).fill(false));

          // 삽화 이미지 로드
          try {
            console.log(`동화 ${latestStory.storyId} 삽화 이미지 로드 시작...`);
            const illustrationPath = await getStoryIllustrationPath(latestStory.storyId);
            if (illustrationPath) {
              setBackgroundImage(illustrationPath);
              console.log(`동화 ${latestStory.storyId} 삽화 배경 설정 완료:`, illustrationPath);
            } else {
              console.log(`동화 ${latestStory.storyId} 삽화 이미지가 없습니다.`);
            }
          } catch (error) {
            console.error(`동화 ${latestStory.storyId} 삽화 로드 실패:`, error);
          }

          console.log('동화 데이터 로드 완료:', {
            title: learningStory.title,
            contentLength: learningStory.content.length,
            highlightedWordsCount: learningStory.highlightedWords.length,
          });
        }
      } catch (error) {
        console.error('동화 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoryData();
  }, [params.storyId, params.title, params.content, params.keywords]);

  // 동화 데이터가 로드되면 퀴즈 데이터도 로드
  useEffect(() => {
    if (currentStory) {
      const words = currentStory.highlightedWords.map((item) => item.word);
      const loadedQuizData = getQuizByWords(words);
      setQuizData(loadedQuizData);
    }
  }, [currentStory]);

  const handleWordPress = (index: number) => {
    const newWordClicked = [...wordClicked];
    newWordClicked[index] = !newWordClicked[index];
    setWordClicked(newWordClicked);
  };

  const handleTextToSpeech = () => {
    console.log('Text to speech triggered');
    // 여기에 TTS 기능 구현
  };

  const handleToggleWordFavorite = (index: number) => {
    const newWordFavorites = [...wordFavorites];
    newWordFavorites[index] = !newWordFavorites[index];
    setWordFavorites(newWordFavorites);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!currentStory) return;

    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < currentStory.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleShowQuiz = () => {
    if (quizData.length > 0) {
      setQuizVisible(true);
      setCurrentQuizIndex(0);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizData.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setQuizVisible(false);
      setCurrentQuizIndex(0);
    }
  };

  const handleCloseQuiz = () => {
    setQuizVisible(false);
    setCurrentQuizIndex(0);
  };

  // 즐겨찾기 페이지네이션 로직
  const wordsPerPage = 4; // 한 페이지당 단어 개수
  const favoriteWords =
    currentStory?.highlightedWords.filter((_, index) => wordFavorites[index]) || [];
  const totalFavoritePages = Math.ceil(favoriteWords.length / wordsPerPage) || 1;
  const currentFavoriteWords = favoriteWords.slice(
    (favoritePage - 1) * wordsPerPage,
    favoritePage * wordsPerPage
  );

  const handleFavoritePageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && favoritePage > 1) {
      setFavoritePage(favoritePage - 1);
    } else if (direction === 'next' && favoritePage < totalFavoritePages) {
      setFavoritePage(favoritePage + 1);
    }
  };

  // 즐겨찾기 단어가 변경될 때 페이지 조정
  useEffect(() => {
    const newTotalPages = Math.ceil(favoriteWords.length / wordsPerPage) || 1;
    if (favoritePage > newTotalPages) {
      setFavoritePage(newTotalPages);
    }
  }, [wordFavorites, favoritePage, favoriteWords.length, wordsPerPage]);

  // 로딩 중이거나 동화가 없을 때 표시할 내용
  if (isLoading) {
    return (
      <View style={englishLearningStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={englishLearningStyles.backgroundImage}>
          <View style={englishLearningStyles.overlay}>
            <Text style={englishLearningStyles.storyTitle}>동화를 불러오는 중...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!currentStory) {
    return (
      <View style={englishLearningStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={englishLearningStyles.backgroundImage}>
          <View style={englishLearningStyles.overlay}>
            <TouchableOpacity
              style={englishLearningStyles.backButton}
              onPress={() => router.back()}
            >
              <Text style={englishLearningStyles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={englishLearningStyles.storyTitle}>동화가 없습니다.</Text>
            <Text style={englishLearningStyles.storyText}>먼저 동화를 생성해주세요.</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={englishLearningStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {backgroundImage ? (
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
                  {currentPage} / {currentStory.totalPages}
                </Text>
              </View>
            </View>

            <View style={englishLearningStyles.titleSection}>
              <Text style={englishLearningStyles.storyTitle}>{currentStory.title}</Text>
            </View>

            <View style={englishLearningStyles.mainContent}>
              <View style={englishLearningStyles.storyContentSection}>
                <Text style={englishLearningStyles.storyText}>
                  {currentStory.pages[currentPage - 1]}
                </Text>

                {currentStory.contentKr && (
                  <Text style={englishLearningStyles.koreanTranslation}>
                    {currentStory.contentKr}
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
                {wordFavorites.some((fav) => fav) ? (
                  <View style={englishLearningStyles.favoriteWordsContainer}>
                    <View style={englishLearningStyles.favoriteWordsPage}>
                      {currentFavoriteWords.map((wordData, index) => (
                        <View key={index} style={englishLearningStyles.favoriteWordItem}>
                          <Text style={englishLearningStyles.favoriteWordText}>
                            {wordData.word}
                          </Text>
                          <Text style={englishLearningStyles.favoriteWordKorean}>
                            {wordData.korean}
                          </Text>
                          <Text style={englishLearningStyles.favoriteWordPronunciation}>
                            {wordData.pronunciation}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {favoriteWords.length > wordsPerPage && (
                      <View style={englishLearningStyles.favoritePaginationContainer}>
                        <TouchableOpacity
                          style={[
                            englishLearningStyles.favoritePaginationButton,
                            favoritePage === 1 &&
                              englishLearningStyles.disabledFavoritePaginationButton,
                          ]}
                          onPress={() => handleFavoritePageNavigation('prev')}
                          disabled={favoritePage === 1}
                        >
                          <Text
                            style={[
                              englishLearningStyles.favoritePaginationButtonText,
                              favoritePage === 1 &&
                                englishLearningStyles.disabledFavoritePaginationText,
                            ]}
                          >
                            ‹
                          </Text>
                        </TouchableOpacity>
                        <Text style={englishLearningStyles.favoritePageInfo}>
                          {favoritePage} / {totalFavoritePages}
                        </Text>
                        <TouchableOpacity
                          style={[
                            englishLearningStyles.favoritePaginationButton,
                            favoritePage === totalFavoritePages &&
                              englishLearningStyles.disabledFavoritePaginationButton,
                          ]}
                          onPress={() => handleFavoritePageNavigation('next')}
                          disabled={favoritePage === totalFavoritePages}
                        >
                          <Text
                            style={[
                              englishLearningStyles.favoritePaginationButtonText,
                              favoritePage === totalFavoritePages &&
                                englishLearningStyles.disabledFavoritePaginationText,
                            ]}
                          >
                            ›
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={englishLearningStyles.vocabularyDescription}>
                    단어를 즐겨찾기에{'\n'}추가해보세요
                  </Text>
                )}
              </View>
            </View>

            {/* 좌측 화살표 버튼 */}
            <TouchableOpacity
              style={[
                englishLearningStyles.leftArrowButton,
                currentPage === 1 && englishLearningStyles.disabledArrowButton,
              ]}
              onPress={() => handleNavigation('prev')}
              disabled={currentPage === 1}
            >
              <Text
                style={[
                  englishLearningStyles.arrowButtonText,
                  currentPage === 1 && englishLearningStyles.disabledArrowText,
                ]}
              >
                ‹
              </Text>
            </TouchableOpacity>

            {/* 우측 화살표 버튼 */}
            <TouchableOpacity
              style={[
                englishLearningStyles.rightArrowButton,
                currentPage === currentStory.totalPages &&
                  englishLearningStyles.disabledArrowButton,
              ]}
              onPress={() => handleNavigation('next')}
              disabled={currentPage === currentStory.totalPages}
            >
              <Text
                style={[
                  englishLearningStyles.arrowButtonText,
                  currentPage === currentStory.totalPages &&
                    englishLearningStyles.disabledArrowText,
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <View style={englishLearningStyles.backgroundImage}>
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
                  {currentPage} / {currentStory.totalPages}
                </Text>
              </View>
            </View>

            <View style={englishLearningStyles.titleSection}>
              <Text style={englishLearningStyles.storyTitle}>{currentStory.title}</Text>
            </View>

            <View style={englishLearningStyles.mainContent}>
              <View style={englishLearningStyles.storyContentSection}>
                <Text style={englishLearningStyles.storyText}>
                  {currentStory.pages[currentPage - 1]}
                </Text>

                {currentStory.contentKr && (
                  <Text style={englishLearningStyles.koreanTranslation}>
                    {currentStory.contentKr}
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
                {wordFavorites.some((fav) => fav) ? (
                  <View style={englishLearningStyles.favoriteWordsContainer}>
                    <View style={englishLearningStyles.favoriteWordsPage}>
                      {currentFavoriteWords.map((wordData, index) => (
                        <View key={index} style={englishLearningStyles.favoriteWordItem}>
                          <Text style={englishLearningStyles.favoriteWordText}>
                            {wordData.word}
                          </Text>
                          <Text style={englishLearningStyles.favoriteWordKorean}>
                            {wordData.korean}
                          </Text>
                          <Text style={englishLearningStyles.favoriteWordPronunciation}>
                            {wordData.pronunciation}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {favoriteWords.length > wordsPerPage && (
                      <View style={englishLearningStyles.favoritePaginationContainer}>
                        <TouchableOpacity
                          style={[
                            englishLearningStyles.favoritePaginationButton,
                            favoritePage === 1 &&
                              englishLearningStyles.disabledFavoritePaginationButton,
                          ]}
                          onPress={() => handleFavoritePageNavigation('prev')}
                          disabled={favoritePage === 1}
                        >
                          <Text
                            style={[
                              englishLearningStyles.favoritePaginationButtonText,
                              favoritePage === 1 &&
                                englishLearningStyles.disabledFavoritePaginationText,
                            ]}
                          >
                            ‹
                          </Text>
                        </TouchableOpacity>
                        <Text style={englishLearningStyles.favoritePageInfo}>
                          {favoritePage} / {totalFavoritePages}
                        </Text>
                        <TouchableOpacity
                          style={[
                            englishLearningStyles.favoritePaginationButton,
                            favoritePage === totalFavoritePages &&
                              englishLearningStyles.disabledFavoritePaginationButton,
                          ]}
                          onPress={() => handleFavoritePageNavigation('next')}
                          disabled={favoritePage === totalFavoritePages}
                        >
                          <Text
                            style={[
                              englishLearningStyles.favoritePaginationButtonText,
                              favoritePage === totalFavoritePages &&
                                englishLearningStyles.disabledFavoritePaginationText,
                            ]}
                          >
                            ›
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={englishLearningStyles.vocabularyDescription}>
                    단어를 즐겨찾기에{'\n'}추가해보세요
                  </Text>
                )}
              </View>
            </View>

            {/* 좌측 화살표 버튼 */}
            <TouchableOpacity
              style={[
                englishLearningStyles.leftArrowButton,
                currentPage === 1 && englishLearningStyles.disabledArrowButton,
              ]}
              onPress={() => handleNavigation('prev')}
              disabled={currentPage === 1}
            >
              <Text
                style={[
                  englishLearningStyles.arrowButtonText,
                  currentPage === 1 && englishLearningStyles.disabledArrowText,
                ]}
              >
                ‹
              </Text>
            </TouchableOpacity>

            {/* 우측 화살표 버튼 */}
            <TouchableOpacity
              style={[
                englishLearningStyles.rightArrowButton,
                currentPage === currentStory.totalPages &&
                  englishLearningStyles.disabledArrowButton,
              ]}
              onPress={() => handleNavigation('next')}
              disabled={currentPage === currentStory.totalPages}
            >
              <Text
                style={[
                  englishLearningStyles.arrowButtonText,
                  currentPage === currentStory.totalPages &&
                    englishLearningStyles.disabledArrowText,
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 퀴즈 팝업 */}
      {quizVisible && quizData.length > 0 && (
        <QuizPopup
          visible={quizVisible}
          onClose={handleCloseQuiz}
          quizData={quizData[currentQuizIndex]}
          questionNumber={currentQuizIndex + 1}
          totalQuestions={quizData.length}
          onNext={handleNextQuiz}
        />
      )}
    </View>
  );
}
