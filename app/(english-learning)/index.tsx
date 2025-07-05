import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { englishLearningStyles } from '../../styles/EnglishLearningScreen.styles';
import { useRouter } from 'expo-router';

export default function EnglishLearningScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(2);
  const [wordFavorites, setWordFavorites] = useState<boolean[]>([false, false, false]);
  const [wordClicked, setWordClicked] = useState<boolean[]>([false, false, false]);
  const [favoritePage, setFavoritePage] = useState(1);

  const storyData = {
    title: 'The Brave Little Rabbit',
    totalPages: 3,
    content: 'Ruby had a beautiful red cape that sparkled in the moonlight.',
    koreanTranslation: '루비는 달빛에 반짝이는 아름다운 빨간 망토를 가지고 있었습니다.',
    highlightedWords: [
      { word: 'beautiful', korean: '아름다운', pronunciation: '[ˈbjuːtɪfəl]' },
      { word: 'sparkled', korean: '반짝였다', pronunciation: '[ˈspɑːrkəld]' },
      { word: 'moonlight', korean: '달빛', pronunciation: '[ˈmuːnlaɪt]' },
    ],
  };

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
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < storyData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 즐겨찾기 페이지네이션 로직
  const wordsPerPage = 4; // 한 페이지당 단어 개수
  const favoriteWords = storyData.highlightedWords.filter((_, index) => wordFavorites[index]);
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

  return (
    <View style={englishLearningStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={englishLearningStyles.backgroundImage}>
        <View style={englishLearningStyles.overlay}>
          <TouchableOpacity style={englishLearningStyles.backButton} onPress={() => router.back()}>
            <Text style={englishLearningStyles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={englishLearningStyles.progressContainer}>
            <Text style={englishLearningStyles.progressText}>
              페이지 {currentPage} / {storyData.totalPages}
            </Text>
          </View>

          <TouchableOpacity
            style={englishLearningStyles.readAloudButton}
            onPress={handleTextToSpeech}
          >
            <Text style={englishLearningStyles.readAloudText}>🔊 읽어주기</Text>
          </TouchableOpacity>

          <View style={englishLearningStyles.titleSection}>
            <Text style={englishLearningStyles.storyTitle}>{storyData.title}</Text>
          </View>

          <View style={englishLearningStyles.mainContent}>
            <View style={englishLearningStyles.storyContentSection}>
              <Text style={englishLearningStyles.storyText}>
                Ruby had a <Text style={englishLearningStyles.highlightedWord}>beautiful</Text> red
                cape that <Text style={englishLearningStyles.highlightedWord}>sparkled</Text> in the{' '}
                <Text style={englishLearningStyles.highlightedWord}>moonlight</Text>.
              </Text>

              <Text style={englishLearningStyles.koreanTranslation}>
                {storyData.koreanTranslation}
              </Text>

              <View style={englishLearningStyles.keyWords}>
                {storyData.highlightedWords.map((wordData, index) => (
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
                        <Text style={englishLearningStyles.favoriteWordText}>{wordData.word}</Text>
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
              currentPage === storyData.totalPages && englishLearningStyles.disabledArrowButton,
            ]}
            onPress={() => handleNavigation('next')}
            disabled={currentPage === storyData.totalPages}
          >
            <Text
              style={[
                englishLearningStyles.arrowButtonText,
                currentPage === storyData.totalPages && englishLearningStyles.disabledArrowText,
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
