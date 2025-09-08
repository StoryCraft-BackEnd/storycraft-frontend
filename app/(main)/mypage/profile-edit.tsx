/**
 * 프로필 편집 화면 컴포넌트
 * 사용자의 프로필 정보를 조회하고 표시하는 화면입니다.
 * 프로필 사진, 이름, 이메일, 닉네임, 역할, 가입일 등의 정보를 보여줍니다.
 * 현재는 읽기 전용으로 표시되며, 편집 기능은 포함되어 있지 않습니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useEffect, useState } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  ActivityIndicator, // 로딩 스피너 컴포넌트
  SafeAreaView, // 안전 영역을 고려한 컨테이너
  Image, // 이미지 표시 컴포넌트
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
} from 'react-native';
// 프로필 편집 화면 전용 스타일
import { ProfileEditScreenStyles } from '../../../styles/ProfileEditScreen.styles';
// 사용자 관련 API 함수들과 타입 정의
import { getMyInfo, UserInfo } from '../../../features/user/userApi';
// 기본 프로필 이미지
import defaultProfile from '../../../assets/images/profile/default_profile.png';
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router } from 'expo-router';

/**
 * 프로필 편집 화면 컴포넌트
 * 사용자의 프로필 정보를 조회하고 표시합니다.
 */
const ProfileEditScreen = () => {
  // 상태 관리
  // 사용자 정보 상태 (API에서 받아온 사용자 데이터)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // 로딩 상태 (API 호출 중 여부)
  const [loading, setLoading] = useState(true);
  // 오류 상태 (API 호출 실패 시 오류 메시지)
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 사용자 정보 조회 (화면 진입 시 한 번만 실행)
  useEffect(() => {
    /**
     * 사용자 정보 조회 함수
     * API에서 사용자 정보를 가져와서 상태에 저장합니다.
     */
    const fetchUserInfo = async () => {
      setLoading(true); // 로딩 상태 시작
      setError(null); // 이전 오류 상태 초기화
      try {
        const data = await getMyInfo(); // API 호출로 사용자 정보 조회
        setUserInfo(data); // 받아온 데이터를 상태에 저장
      } catch (err: unknown) {
        // 오류 타입에 따라 적절한 메시지 설정
        let message = '정보를 불러오지 못했습니다.'; // 기본 오류 메시지
        if (err instanceof Error)
          message = err.message; // Error 객체인 경우
        else if (typeof err === 'string') message = err; // 문자열인 경우
        setError(message); // 오류 상태 설정
      } finally {
        setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
      }
    };
    fetchUserInfo(); // 함수 실행
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 로딩 상태일 때 표시되는 화면 (API 호출 중)
  if (loading) {
    return (
      <SafeAreaView style={ProfileEditScreenStyles.centered}>
        <ActivityIndicator size="large" /> {/* 로딩 스피너 */}
      </SafeAreaView>
    );
  }

  // 오류 상태일 때 표시되는 화면 (API 호출 실패)
  if (error) {
    return (
      <SafeAreaView style={ProfileEditScreenStyles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text> {/* 오류 메시지 표시 */}
      </SafeAreaView>
    );
  }

  // 사용자 정보가 없을 때는 아무것도 렌더링하지 않음
  if (!userInfo) return null;

  // 메인 화면 렌더링 (사용자 정보가 정상적으로 로드된 상태)
  return (
    <SafeAreaView style={ProfileEditScreenStyles.container}>
      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity style={ProfileEditScreenStyles.backButton} onPress={() => router.back()}>
        <Text style={ProfileEditScreenStyles.backButtonText}>{'←'}</Text> {/* 뒤로가기 화살표 */}
      </TouchableOpacity>
      {/* 가로 레이아웃 컨테이너 (프로필 정보를 좌우로 배치) */}
      <View style={ProfileEditScreenStyles.landscapeWrapper}>
        {/* 왼쪽 영역: 프로필 사진, 이름, 이메일 */}
        <View style={ProfileEditScreenStyles.profileLeft}>
          <Image source={defaultProfile} style={ProfileEditScreenStyles.profileImage} />{' '}
          {/* 프로필 이미지 */}
          <Text style={ProfileEditScreenStyles.profileName}>{userInfo.name}</Text>{' '}
          {/* 사용자 이름 */}
          <Text style={ProfileEditScreenStyles.profileEmail}>{userInfo.email}</Text>{' '}
          {/* 사용자 이메일 */}
        </View>
        {/* 오른쪽 영역: 상세 정보 (이름, 닉네임, 역할, 가입일) */}
        <View style={ProfileEditScreenStyles.profileRight}>
          <Text style={ProfileEditScreenStyles.sectionTitle}>Profile</Text> {/* 섹션 제목 */}
          {/* 이름 정보 행 */}
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Name</Text> {/* 라벨 */}
            <Text style={ProfileEditScreenStyles.value}>{userInfo.name}</Text> {/* 값 */}
          </View>
          {/* 닉네임 정보 행 */}
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Nickname</Text> {/* 라벨 */}
            <Text style={ProfileEditScreenStyles.value}>{userInfo.nickname}</Text> {/* 값 */}
          </View>
          {/* 역할 정보 행 */}
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Role</Text> {/* 라벨 */}
            <Text style={ProfileEditScreenStyles.value}>{userInfo.role}</Text> {/* 값 */}
          </View>
          {/* 가입일 정보 행 */}
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Joined</Text> {/* 라벨 */}
            <Text style={ProfileEditScreenStyles.value}>{userInfo.signup_date}</Text> {/* 값 */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
