/**
 * StoryCraft 메인 화면 컴포넌트
 * 로그인 후 사용자가 보게 되는 메인 화면입니다.
 */
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
  BackHandler,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemedView } from '@/components/ui/ThemedView';
import { setStatusBarHidden } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { router, useFocusEffect } from 'expo-router';

import nightBg from '@/assets/images/background/night-bg.png';
import boxplus from '@/assets/images/icons/boxplus.png';
import bookmark from '@/assets/images/icons/bookmark.png';
import heart from '@/assets/images/icons/heart.png';
import dictionary from '@/assets/images/icons/dictionary.png';
import quiz from '@/assets/images/icons/quiz.png';
import donate from '@/assets/images/icons/donate.png';
import mypage from '@/assets/images/icons/mypage.png';
import setting from '@/assets/images/icons/setting.png';
import board from '@/assets/images/icons/board.png';
import story1 from '@/assets/images/illustrations/storycraft_cover_1.png';
import story2 from '@/assets/images/illustrations/storycraft_cover_2.png';
import story3 from '@/assets/images/illustrations/storycraft_cover_3.png';
import story4 from '@/assets/images/illustrations/storycraft_cover_4.png';
import story5 from '@/assets/images/illustrations/storycraft_cover_5.png';
import story6 from '@/assets/images/illustrations/storycraft_cover_6.png';
import story7 from '@/assets/images/illustrations/storycraft_cover_7.png';
import story8 from '@/assets/images/illustrations/storycraft_cover_8.png';
import storyCraftLogo from '@/assets/images/StoryCraft.png';
import pointImage from '@/assets/images/rewards/point_icon.png';
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';
import defaultProfile from '@/assets/images/profile/default_profile.png';
import { MainScreenStyles } from '@/styles/MainScreen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import { ChildProfile } from '@/features/profile/types';
import { loadStoriesFromStorage, addStoryToStorage } from '@/features/storyCreate/storyStorage';
import { Story } from '@/features/storyCreate/types';
import { getStoryIllustrationPathFromStory } from '@/features/storyCreate/storyUtils';
import {
  fetchUserStories,
  fetchIllustrations,
  downloadIllustration,
  syncMissingIllustrations,
} from '@/features/storyCreate/storyApi';
import * as FileSystem from 'expo-file-system';

// 기본 삽화 이미지들 (삽화가 없을 때 사용)
const defaultStoryImages = [story1, story2, story3, story4, story5, story6, story7, story8];

export default function MainScreen() {
  const [backgroundImage] = useState(nightBg);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [storyImages, setStoryImages] = useState<(string | number)[]>([]);

  useEffect(() => {
    // 화면을 가로 모드로 고정
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // 시스템 UI 숨기기
    setStatusBarHidden(true);
    NavigationBar.setVisibilityAsync('hidden');

    // 뒤로가기 버튼 비활성화
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // 뒤로가기 버튼을 눌렀을 때 아무것도 하지 않음 (true 반환으로 기본 동작 방지)
      return true;
    });

    // 선택된 프로필 불러오기
    const loadProfile = async () => {
      try {
        const profile = await loadSelectedProfile();
        setSelectedProfile(profile);
      } catch (error) {
        console.error('프로필 불러오기 실패:', error);
      }
    };
    loadProfile();

    // 시간대별 배경 이미지 설정 (추후 개발 예정)
    // const updateBackgroundImage = () => {
    //   const now = new Date();
    //   const hour = now.getHours();

    //   if (hour >= 5 && hour < 17) {
    //     setBackgroundImage(morningBg);
    //   } else if (hour >= 17 && hour < 19) {
    //     setBackgroundImage(sunsetBg);
    //   } else {
    //     setBackgroundImage(nightBg);
    //   }
    // };

    // updateBackgroundImage();

    return () => {
      // 화면을 세로 모드로 복원
      ScreenOrientation.unlockAsync();
      // 시스템 UI 복원
      setStatusBarHidden(false);
      NavigationBar.setVisibilityAsync('visible');
      // 뒤로가기 핸들러 제거
      backHandler.remove();
    };
  }, []);

  // 화면이 포커스될 때마다 동화 목록 새로고침 (중복 실행 방지)
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const refreshStories = async () => {
        if (selectedProfile && isMounted) {
          console.log('메인 화면 포커스 - 동화 목록 새로고침');
          await loadStories(selectedProfile.childId);
        }
      };

      refreshStories();

      return () => {
        isMounted = false;
      };
    }, [selectedProfile])
  );

  // 동화 목록 및 삽화 로드
  const loadStories = async (childId: number) => {
    try {
      console.log(`프로필 ${childId}의 동화 목록 로드 시작...`);

      // 먼저 서버에서 최신 데이터 가져오기
      try {
        console.log('서버에서 최신 동화 목록 동기화 시작...');
        await fetchUserStories(childId);
        console.log('서버 동기화 완료, 잠시 대기...');
        // 서버 저장 완료 후 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (serverError) {
        console.error('서버 동기화 실패, 로컬 데이터만 사용:', serverError);
      }

      // 로컬에서 동화 목록 로드
      let stories = await loadStoriesFromStorage(childId); // Use 'let' to allow re-assignment
      console.log(`로컬에서 ${stories.length}개의 동화 로드 완료`);

      // 사용자가 보유한 동화에 해당하는 삽화 동기화 및 Story 객체에 추가
      if (stories.length > 0) {
        try {
          console.log('사용자 동화에 해당하는 삽화 동기화 시작...');

          // 사용자가 보유한 동화 ID 목록
          const userStoryIds = stories.map((story) => story.storyId);
          console.log('사용자 동화 ID 목록:', userStoryIds);

          // 누락된 삽화 동기화 (서버 목록 확인 후 누락된 것만 다운로드)
          await syncMissingIllustrations(userStoryIds);

          // 서버에서 최신 삽화 목록 조회
          const illustrations = await fetchIllustrations();
          console.log(`서버에서 ${illustrations.length}개의 삽화 조회 완료`);

          // 사용자가 보유한 동화에 해당하는 삽화만 필터링
          const userIllustrations = illustrations.filter((illustration) =>
            userStoryIds.includes(illustration.storyId)
          );
          console.log(`사용자 동화에 해당하는 삽화 ${userIllustrations.length}개 필터링 완료`);

          // Story 객체에 illustrations 정보 추가
          const storiesWithIllustrations = stories.map((story) => {
            const storyIllustrations = userIllustrations.filter(
              (illustration) => illustration.storyId === story.storyId
            );
            return {
              ...story,
              illustrations: storyIllustrations.map((illustration) => ({
                illustrationId: illustration.illustrationId,
                storyId: illustration.storyId,
                localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`,
                imageUrl: illustration.imageUrl,
                description: illustration.description,
                createdAt: illustration.createdAt,
              })),
            };
          });

          // Story 객체를 illustrations 정보와 함께 다시 저장
          await Promise.all(storiesWithIllustrations.map((story) => addStoryToStorage(story)));
          console.log('Story 객체에 illustrations 정보 추가 완료');

          // Update the 'stories' variable to reflect the changes
          stories = storiesWithIllustrations; // Crucial update

          console.log('사용자 동화 삽화 동기화 완료');
        } catch (illustrationError) {
          console.error('삽화 동기화 실패:', illustrationError);
        }
      }

      console.log(
        `최종 로컬에서 ${stories.length}개의 동화 로드 완료:`,
        stories.map((s) => ({ id: s.storyId, title: s.title }))
      );
      setUserStories(stories); // Now 'stories' contains illustrations

      // 삽화 디렉토리 확인
      const illustrationsDir = `${FileSystem.documentDirectory}illustrations/`;
      const dirInfo = await FileSystem.getInfoAsync(illustrationsDir);
      console.log('삽화 디렉토리 존재 여부:', dirInfo.exists, '경로:', illustrationsDir);

      // 각 동화의 삽화 경로 확인
      console.log('동화 삽화 이미지 로드 시작...');
      const images = await Promise.all(
        stories.map(async (story, index) => {
          try {
            // 삽화 경로 확인 (새로운 illustrationId 기반 방식)
            const illustrationPath = await getStoryIllustrationPathFromStory(story);

            if (illustrationPath) {
              // 파일 실제 존재 여부 확인
              const fileInfo = await FileSystem.getInfoAsync(illustrationPath);
              if (fileInfo.exists) {
                console.log(`동화 ${story.storyId} 삽화 발견:`, illustrationPath);
                return illustrationPath;
              } else {
                console.log(
                  `동화 ${story.storyId} 삽화 경로는 있지만 파일이 없음:`,
                  illustrationPath
                );
              }
            }

            // 삽화가 없으면 기본 이미지 사용
            const defaultImageIndex = index % defaultStoryImages.length;
            console.log(
              `동화 ${story.storyId} 삽화 없음, 기본 이미지 사용 (인덱스: ${defaultImageIndex})`
            );
            return defaultStoryImages[defaultImageIndex];
          } catch (error) {
            console.error(`동화 ${story.storyId} 삽화 로드 실패:`, error);
            const defaultImageIndex = index % defaultStoryImages.length;
            return defaultStoryImages[defaultImageIndex];
          }
        })
      );
      console.log(`총 ${images.length}개의 이미지 설정 완료`);
      setStoryImages(images);
    } catch (error) {
      console.error('동화 목록 로드 실패:', error);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={MainScreenStyles.backgroundImage}
      resizeMode="cover"
    >
      <ThemedView style={MainScreenStyles.container}>
        <Image source={storyCraftLogo} style={MainScreenStyles.logoImage} resizeMode="stretch" />
        <View style={MainScreenStyles.userProfileContainer}>
          <Image source={defaultProfile} style={MainScreenStyles.userProfileImage} />
          <Text style={MainScreenStyles.userNameText}>
            {selectedProfile?.name || '프로필을 선택해주세요'}
          </Text>
        </View>
        <TouchableOpacity
          style={MainScreenStyles.pointContainer}
          onPress={() => router.push('./daily-mission')}
        >
          <View style={MainScreenStyles.achieveContainer}>
            <Image source={achieveIcon} style={MainScreenStyles.pointImage} />
            <Text style={MainScreenStyles.pointText}>5</Text>
          </View>
          <Image source={pointImage} style={MainScreenStyles.pointImage} />
          <Text style={MainScreenStyles.pointText}>1,000</Text>
        </TouchableOpacity>
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
            pagingEnabled={false}
            snapToInterval={wp('22%')}
            decelerationRate="normal"
            bounces={true}
          >
            {userStories.length === 0 ? (
              <View style={MainScreenStyles.storyItem}>
                <Text style={MainScreenStyles.storyTitle}>
                  현재 생성된 동화가 없습니다.{'\n'}동화를 생성해주세요!
                </Text>
              </View>
            ) : (
              userStories.map((story, index) => (
                <View key={story.storyId} style={MainScreenStyles.storyItem}>
                  <Image
                    source={
                      typeof storyImages[index] === 'string'
                        ? { uri: storyImages[index] as string }
                        : storyImages[index]
                    }
                    style={MainScreenStyles.storyImage}
                  />
                  <Text style={MainScreenStyles.storyTitle}>{story.title}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        <View style={MainScreenStyles.buttonContainer}>
          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button1]}
            onPress={() => router.push('./storylist')}
          >
            <Image source={bookmark} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>동화 목록</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button2]}
            onPress={() => router.push('/(main)/storylist/favorites')}
          >
            <Image source={heart} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>즐겨찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button3]}
            onPress={() => router.push('/(main)/english-dictionary')}
          >
            <Image source={dictionary} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>영어 사전</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button4]}
            onPress={() => router.push('/(main)/quiz-collection')}
          >
            <Image source={quiz} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>영어 퀴즈</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button5]}
            onPress={() => router.push('/(main)/subscription')}
          >
            <Image source={donate} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>결제/구독</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button6]}
            onPress={() => router.push('/(main)/mypage')}
          >
            <Image source={mypage} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>마이페이지</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button7]}
            onPress={() => router.push('./settings')}
          >
            <Image source={setting} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>설정</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[MainScreenStyles.button, MainScreenStyles.button8]}
            onPress={() => router.push('./notice-event-faq')}
          >
            <Image source={board} style={MainScreenStyles.buttonImage} />
            <Text style={MainScreenStyles.buttonText}>공지/이벤트</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={MainScreenStyles.createStoryButton}
          onPress={() => {
            router.push('/(main)/storycreate');
          }}
        >
          <Image source={boxplus} style={MainScreenStyles.createStoryButtonImage} />
        </TouchableOpacity>
      </ThemedView>
    </ImageBackground>
  );
}
