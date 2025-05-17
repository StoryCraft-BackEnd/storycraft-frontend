/**
 * StoryCraft 메인 화면 컴포넌트
 * 로그인 후 사용자가 보게 되는 메인 화면입니다.
 */
import React, { useEffect, useState } from 'react';
import { ImageBackground, TouchableOpacity, View, Image, Text, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemedView } from '@/components/ui/ThemedView';
import { setStatusBarHidden } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import morningBg from '@/assets/images/background/sunrise-bg.png';
import sunsetBg from '@/assets/images/background/sunset-bg.png';
import nightBg from '@/assets/images/background/night-bg.png';
import sleepcharacter from '@/assets/images/character/sleep.png';
import story1 from '@/assets/images/illustrations/storycraft_cover_1.png';
import story2 from '@/assets/images/illustrations/storycraft_cover_2.png';
import story3 from '@/assets/images/illustrations/storycraft_cover_3.png';
import story4 from '@/assets/images/illustrations/storycraft_cover_4.png';
import story5 from '@/assets/images/illustrations/storycraft_cover_5.png';
import story6 from '@/assets/images/illustrations/storycraft_cover_6.png';
import story7 from '@/assets/images/illustrations/storycraft_cover_7.png';
import story8 from '@/assets/images/illustrations/storycraft_cover_8.png';
import { MainScreenStyles } from '@/styles/MainScreen';

// 임시 동화 데이터
const stories = [
  { id: 1, title: '동화 1', image: story1 },
  { id: 2, title: '동화 2', image: story2 },
  { id: 3, title: '동화 3', image: story3 },
  { id: 4, title: '동화 4', image: story4 },
  { id: 5, title: '동화 5', image: story5 },
  { id: 6, title: '동화 6', image: story6 },
  { id: 7, title: '동화 7', image: story7 },
  { id: 8, title: '동화 8', image: story8 },
];

export default function MainScreen() {
  const [backgroundImage, setBackgroundImage] = useState(morningBg);

  useEffect(() => {
    // 화면을 가로 모드로 고정
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // 시스템 UI 숨기기
    setStatusBarHidden(true);
    NavigationBar.setVisibilityAsync('hidden');

    // 시간대별 배경 이미지 설정
    const updateBackgroundImage = () => {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 5 && hour < 17) {
        setBackgroundImage(morningBg);
      } else if (hour >= 17 && hour < 19) {
        setBackgroundImage(sunsetBg);
      } else {
        setBackgroundImage(nightBg);
      }
    };

    // 초기 배경 설정
    updateBackgroundImage();

    // 1분마다 배경 업데이트
    const interval = setInterval(updateBackgroundImage, 60000);

    // 컴포넌트가 언마운트될 때 정리
    return () => {
      ScreenOrientation.unlockAsync();
      setStatusBarHidden(false);
      NavigationBar.setVisibilityAsync('visible');
      clearInterval(interval);
    };
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={MainScreenStyles.backgroundImage}
      resizeMode="cover"
    >
      <ThemedView style={MainScreenStyles.container}>
        <View style={MainScreenStyles.storyContainer}>
          <TouchableOpacity
            style={MainScreenStyles.viewAllButton}
            onPress={() => {
              router.push('/(main)/storylist');
            }}
          >
            <Text style={MainScreenStyles.viewAllText}>전체 목록 보기 {'>>'}</Text>
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={MainScreenStyles.storyScrollView}
            pagingEnabled={true}
            snapToInterval={170}
            decelerationRate="fast"
          >
            {stories.map((story) => (
              <View key={story.id} style={MainScreenStyles.storyItem}>
                <Image source={story.image} style={MainScreenStyles.storyImage} />
                <Text style={MainScreenStyles.storyTitle}>{story.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={MainScreenStyles.buttonContainer}>
          <TouchableOpacity style={MainScreenStyles.button}>
            <Image source={sleepcharacter} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>버튼 1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MainScreenStyles.button}>
            <Image source={sleepcharacter} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>버튼 2</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MainScreenStyles.button}>
            <Image source={sleepcharacter} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>버튼 3</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MainScreenStyles.button}>
            <Image source={sleepcharacter} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>버튼 4</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MainScreenStyles.button}>
            <Image source={sleepcharacter} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>버튼 5</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ImageBackground>
  );
}
