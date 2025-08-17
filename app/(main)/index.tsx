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
  ActivityIndicator,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemedView } from '@/components/ui/ThemedView';
import { LoadingPopup } from '@/components/ui/LoadingPopup';
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
import { addStoryToStorage } from '@/features/storyCreate/storyStorage';
import { Story, LocalIllustration } from '@/features/storyCreate/types';
import { getStoryIllustrationPathFromStory } from '@/features/storyCreate/storyUtils';
import {
  fetchStoryList,
  fetchIllustrationList,
  downloadStoryIllustrations,
} from '@/features/storyCreate/storyApi';
import { getMyInfo } from '@/features/user/userApi';
import * as FileSystem from 'expo-file-system';
import { getStoriesLastUpdateTime } from '@/features/storyCreate/storyStorage';

// 기본 삽화 이미지들 (삽화가 없을 때 사용)
const defaultStoryImages = [story1, story2, story3, story4, story5, story6, story7, story8];

export default function MainScreen() {
  const [backgroundImage] = useState(nightBg);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [storyImages, setStoryImages] = useState<(string | number)[]>([]);
  const [isLoadingIllustrations, setIsLoadingIllustrations] = useState(false);
  const [illustrationLoadingProgress, setIllustrationLoadingProgress] = useState<string>('');
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('불러오는중...');
  const [illustrationsReady, setIllustrationsReady] = useState(false);
  const [lastStoriesUpdateTime, setLastStoriesUpdateTime] = useState<number | null>(null);

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

    // 사용자 정보 및 프로필 불러오기
    const loadUserData = async () => {
      try {
        // 현재 로그인한 사용자 정보 가져오기
        const userInfo = await getMyInfo();
        console.log('✅ 사용자 정보 로드 완료:', {
          userId: userInfo.id,
          nickname: userInfo.nickname,
        });

        // 선택된 프로필 불러오기
        const profile = await loadSelectedProfile();
        setSelectedProfile(profile);

        // 프로필이 있으면 초기 로딩 시작
        if (profile) {
          await loadStories(profile.childId, true);
        } else {
          // 프로필이 없으면 프로필 선택 화면으로 이동
          console.log('선택된 프로필이 없음 - 프로필 선택 화면으로 이동');
          router.replace('/(profile)');
        }
      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);

        // 에러 타입별로 다른 처리
        if (error instanceof Error) {
          if (
            error.message.includes('로그인이 필요합니다') ||
            error.message.includes('인증이 만료')
          ) {
            console.log('🔐 인증 문제 - 로그인 화면으로 이동');
            router.replace('/(auth)/login');
            return;
          } else if (error.message.includes('서버 오류')) {
            console.log('🌐 서버 오류 - 프로필 선택 화면으로 이동');
            // 서버 오류 시에도 프로필 선택 화면으로 이동 시도
          }
        }

        // 기본적으로 프로필 선택 화면으로 이동
        console.log('🔄 프로필 선택 화면으로 이동');
        router.replace('/(profile)');
      }
    };
    loadUserData();

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
        // 초기 로딩 중이거나 프로필이 없으면 새로고침 건너뛰기
        if (selectedProfile && isMounted && !isInitialLoading) {
          // 동화 목록 변경 감지: 마지막 업데이트 시간 확인
          const lastUpdateTime = await getStoriesLastUpdateTime(selectedProfile.childId);
          const needsRefresh = !lastUpdateTime || lastUpdateTime !== lastStoriesUpdateTime;

          // 삽화가 이미 준비된 상태에서도 동화 목록이 변경되었으면 새로고침
          if (illustrationsReady && userStories.length > 0 && !needsRefresh) {
            console.log(
              '메인 화면 포커스 - 삽화가 이미 준비되고 동화 목록 변경 없음, 새로고침 건너뛰기'
            );
            return;
          }

          if (needsRefresh) {
            console.log('메인 화면 포커스 - 동화 목록 변경 감지, 새로고침 필요');
          } else {
            console.log('메인 화면 포커스 - 동화 목록 새로고침');
          }

          // 동화 목록 새로고침
          await loadStories(selectedProfile.childId, false);
        }
      };

      refreshStories();

      return () => {
        isMounted = false;
      };
    }, [selectedProfile, isInitialLoading, illustrationsReady, userStories.length])
  );

  // 동화 목록 및 삽화 로드
  const loadStories = async (childId: number, isInitialLoad: boolean = false) => {
    try {
      console.log(`프로필 ${childId}의 동화 목록 로드 시작...`);

      if (isInitialLoad) {
        setIsInitialLoading(true);
        setLoadingMessage('동화 목록을 불러오는 중...');
      }

      let stories: Story[] = [];

      // 서버 우선 정책: 항상 서버에서 데이터 조회
      try {
        setLoadingMessage('서버에서 동화 목록을 조회하는 중...');

        const storyDataList = await fetchStoryList(childId);
        console.log(`서버에서 ${storyDataList.length}개의 동화 조회 완료`);

        // StoryData를 Story 타입으로 변환
        stories = storyDataList.map((storyData) => ({
          ...storyData,
          childId: childId,
          isBookmarked: false,
          isLiked: false,
        }));

        // 동화 목록을 로컬에 저장 (서버 데이터로 덮어쓰기)
        await Promise.all(stories.map((story) => addStoryToStorage(story)));
        console.log('동화 목록 로컬 저장 완료');

        // 동화 목록 업데이트 시간 저장 (무한 루프 방지)
        if (!lastStoriesUpdateTime) {
          const currentTime = Date.now();
          setLastStoriesUpdateTime(currentTime);
        }

        // 삽화 목록 조회 및 다운로드
        if (stories.length > 0 && selectedProfile?.childId) {
          try {
            console.log('✅ 서버에서 삽화 목록 조회 시작... - childId:', selectedProfile.childId);
            setIsLoadingIllustrations(true);
            setIllustrationLoadingProgress('삽화 목록을 조회하는 중...');
            setLoadingMessage('삽화 목록을 조회하는 중...');

            const illustrations = await fetchIllustrationList(selectedProfile.childId);
            console.log(`서버에서 ${illustrations.length}개의 삽화 조회 완료`);

            // 동화에 해당하는 삽화 정보를 동화 객체에 추가
            const storiesWithIllustrations = stories.map((story) => {
              const storyIllustrations = illustrations.filter(
                (illustration) => illustration.storyId === story.storyId
              );

              // Illustration을 LocalIllustration으로 변환
              const localIllustrations: LocalIllustration[] = storyIllustrations.map(
                (illustration) => ({
                  illustrationId: illustration.illustrationId,
                  storyId: illustration.storyId,
                  orderIndex: illustration.orderIndex, // orderIndex 추가
                  localPath: '', // 다운로드 후 설정됨
                  imageUrl: illustration.imageUrl,
                  description: illustration.description,
                  createdAt: illustration.createdAt,
                })
              );

              return {
                ...story,
                illustrations: localIllustrations,
              };
            });

            console.log(
              '동화별 삽화 정보 매핑 완료:',
              storiesWithIllustrations.map((s) => ({
                storyId: s.storyId,
                title: s.title,
                illustrationsCount: s.illustrations?.length || 0,
              }))
            );

            // 동화에 해당하는 삽화만 다운로드
            setIllustrationLoadingProgress('삽화를 다운로드하는 중...');
            setLoadingMessage('삽화를 다운로드하는 중...');

            await downloadStoryIllustrations(stories, illustrations, (message) => {
              setIllustrationLoadingProgress(message);
              setLoadingMessage(message);
            });

            console.log('동화 삽화 다운로드 완료');

            // 다운로드된 삽화의 localPath 업데이트
            const updatedStories = storiesWithIllustrations.map((story) => {
              if (story.illustrations && story.illustrations.length > 0) {
                const updatedIllustrations = story.illustrations.map((illustration) => ({
                  ...illustration,
                  localPath: `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`,
                }));
                return {
                  ...story,
                  illustrations: updatedIllustrations,
                };
              }
              return story;
            });

            console.log('삽화 localPath 업데이트 완료');
            stories = updatedStories;

            // 삽화 로딩 완료 상태 설정
            setIllustrationsReady(true);
          } catch (illustrationError) {
            console.error('삽화 처리 실패:', illustrationError);
            // 삽화 로딩 실패 시에도 준비 완료로 설정
            setIllustrationsReady(true);
          } finally {
            setIsLoadingIllustrations(false);
            setIllustrationLoadingProgress('');
          }
        }
      } catch (serverError) {
        console.error('서버 데이터 조회 실패:', serverError);

        // 서버 실패 시 빈 배열 반환 (서버 우선 정책)
        stories = [];
        console.log('서버 요청 실패 - 빈 동화 목록 반환');
      }

      // 동화 목록 설정
      setUserStories(stories);

      // 삽화 이미지 경로 설정
      console.log('동화 삽화 이미지 경로 설정 시작...');
      const images = await Promise.all(
        stories.map(async (story, index) => {
          try {
            // 삽화 경로 확인
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

      if (isInitialLoad) {
        setIsInitialLoading(false);
        setLoadingMessage('불러오는중...');
      }
    } catch (error) {
      console.error('동화 목록 로드 실패:', error);
      if (isInitialLoad) {
        setIsInitialLoading(false);
        setLoadingMessage('불러오는중...');
      }
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={MainScreenStyles.backgroundImage}
      resizeMode="cover"
    >
      <ThemedView style={MainScreenStyles.container}>
        {/* 초기 로딩 팝업 */}
        <LoadingPopup visible={isInitialLoading} title="불러오는중" message={loadingMessage} />

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
            ) : isLoadingIllustrations ? (
              <View style={MainScreenStyles.storyItem}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text
                    style={[MainScreenStyles.storyTitle, { marginTop: 10, textAlign: 'center' }]}
                  >
                    {illustrationLoadingProgress}
                  </Text>
                </View>
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
            onPress={() => router.push('/(main)/quiz')}
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
