/**
 * 설정 화면 컴포넌트
 * 사용자의 계정 정보, 알림 설정, 앱 정보, 개인정보 처리방침, 회원 탈퇴 등의 기능을 제공하는 설정 화면입니다.
 * 가로 스크롤을 통해 여러 설정 카테고리를 탐색할 수 있으며, 각 카테고리별로 관련 기능들을 제공합니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  SafeAreaView, // 안전 영역을 고려한 컨테이너
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
  Switch, // 토글 스위치 컴포넌트
  ScrollView, // 스크롤 가능한 컨테이너
  Platform, // 플랫폼별 기능 구분용
  Alert, // 알림 팝업 표시용
  ImageBackground, // 배경 이미지가 있는 컨테이너
} from 'react-native';
// 설정 화면 전용 스타일
import { SettingsScreenStyles } from '../../../styles/SettingsScreen.styles';
// Expo Router: 화면 이동용
import { router } from 'expo-router';
// 아이콘 라이브러리 (Material Design, Feather)
import { MaterialIcons, Feather } from '@expo/vector-icons';
// 로컬 스토리지 (토큰 저장/삭제용)
import AsyncStorage from '@react-native-async-storage/async-storage';
// 인증 관련 API 함수들 (로그아웃, 회원탈퇴)
import { logout, withdraw } from '@/features/auth/authApi';
// 푸시 알림 설정 저장/로드 유틸리티
import { savePushEnabled, loadPushEnabled } from '@/shared/utils/notificationStorage';
// Expo 알림 관련 기능
import * as Notifications from 'expo-notifications';
// 외부 링크 열기 (설정 앱으로 이동)
import * as Linking from 'expo-linking';
// 배경 이미지 (밤하늘 배경)
import nightBg from '../../../assets/images/background/night-bg.png';
// 뒤로가기 버튼 컴포넌트
import BackButton from '../../../components/ui/BackButton';
// 사용자 정보 관련 API와 타입 정의
import { getMyInfo, UserInfo } from '@/features/user/userApi';
// 정책 모달 컴포넌트 (개인정보처리방침, 이용약관)
import PolicyModal from '../../../components/ui/PolicyModal';

/**
 * 설정 화면 컴포넌트
 * 사용자의 다양한 설정을 관리할 수 있는 화면입니다.
 */
const SettingsScreen = () => {
  // 푸시 알림 활성화 상태 (토글 스위치용)
  const [pushEnabled, setPushEnabled] = useState(false);
  // 사용자 정보 (이메일 등 계정 정보 표시용)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // 정책 모달 표시 여부 (개인정보처리방침, 이용약관 모달)
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  // 정책 모달 타입 ('privacy': 개인정보처리방침, 'terms': 이용약관)
  const [policyType, setPolicyType] = useState<'privacy' | 'terms'>('privacy');

  // 컴포넌트 마운트 시 초기 데이터 로드 (푸시 알림 설정, 사용자 정보)
  useEffect(() => {
    /**
     * 초기 데이터 로드 함수
     * 푸시 알림 설정과 사용자 정보를 병렬로 로드합니다.
     */
    const fetchData = async () => {
      try {
        // 푸시 알림 설정과 사용자 정보를 동시에 로드
        const [pushSettings, userData] = await Promise.all([loadPushEnabled(), getMyInfo()]);
        setPushEnabled(pushSettings); // 푸시 알림 설정 상태 업데이트
        setUserInfo(userData); // 사용자 정보 상태 업데이트
      } catch (error) {
        console.error('설정 데이터 로드 실패:', error);
      }
    };

    fetchData(); // 컴포넌트 마운트 시 실행
  }, []); // 의존성 배열이 비어있어 한 번만 실행

  /**
   * 푸시 알림 토글 처리 함수
   * 알림을 켜려고 할 때 권한을 확인하고, 권한이 없으면 설정 앱으로 이동할 수 있도록 안내합니다.
   * @param value - 푸시 알림 활성화 여부
   */
  const handlePushToggle = async (value: boolean) => {
    if (value) {
      // 알림을 켜려고 할 때 권한 확인
      let granted = false;
      let status = 'undetermined';
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const current = await Notifications.getPermissionsAsync(); // 현재 권한 상태 확인
        status = current.status;
        console.log('현재 권한 상태:', status);
        if (status === 'undetermined') {
          const req = await Notifications.requestPermissionsAsync(); // 권한 요청
          status = req.status;
          console.log('요청 후 권한 상태:', status);
        }
        granted = status === 'granted'; // 권한이 허용되었는지 확인
      }
      if (!granted) {
        // 권한이 허용되지 않은 경우 설정 앱으로 이동 안내
        Alert.alert('알림 권한 필요', '알림 권한이 허용되지 않았습니다. 설정에서 직접 켜주세요.', [
          {
            text: '설정으로 이동',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:'); // iOS 설정 앱으로 이동
              } else {
                Linking.openSettings(); // Android 설정 앱으로 이동
              }
            },
          },
          { text: '확인', style: 'cancel' },
        ]);
        setPushEnabled(false); // 상태를 false로 유지
        await savePushEnabled(false); // 로컬 스토리지에도 false 저장
        return;
      }
    }
    setPushEnabled(value); // 상태 업데이트
    await savePushEnabled(value); // 로컬 스토리지에 저장
  };

  /**
   * 로그아웃 처리 함수
   * 서버에 로그아웃 요청을 보내고, 로컬 토큰을 삭제한 후 로그인 화면으로 이동합니다.
   * 서버 요청이 실패해도 토큰은 삭제하고 로그인 화면으로 이동합니다.
   */
  const handleLogout = async () => {
    try {
      await logout(); // 서버에 로그아웃 요청
      await AsyncStorage.removeItem('token'); // 액세스 토큰 삭제
      await AsyncStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
      router.replace('/(auth)'); // 로그인 화면으로 이동
    } catch {
      // 서버 요청이 실패해도 토큰 삭제 및 로그인 화면으로 이동
      await AsyncStorage.removeItem('token'); // 액세스 토큰 삭제
      await AsyncStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
      router.replace('/(auth)'); // 로그인 화면으로 이동
    }
  };

  /**
   * 정책 모달 열기 함수
   * 개인정보처리방침 또는 이용약관 모달을 엽니다.
   * @param type - 정책 타입 ('privacy': 개인정보처리방침, 'terms': 이용약관)
   */
  const handlePolicyPress = (type: 'privacy' | 'terms') => {
    setPolicyType(type); // 정책 타입 설정
    setPolicyModalVisible(true); // 모달 표시
  };

  /**
   * 정책 모달 닫기 함수
   * 정책 모달을 닫습니다.
   */
  const handleClosePolicyModal = () => {
    setPolicyModalVisible(false); // 모달 숨김
  };

  // 메인 화면 렌더링
  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={SettingsScreenStyles.container}>
        <BackButton /> {/* 뒤로가기 버튼 */}
        {/* 가로 스크롤을 위한 래퍼 */}
        <View style={SettingsScreenStyles.landscapeWrapper}>
          {/* 가로 스크롤 가능한 설정 카테고리들 */}
          <ScrollView
            horizontal // 가로 스크롤 활성화
            showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
            style={{ flex: 1 }}
            contentContainerStyle={SettingsScreenStyles.scrollContent}
          >
            {/* 계정 정보 카테고리 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>계정 정보</Text>{' '}
              {/* 카테고리 제목 */}
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                계정 정보를 확인하고 관리합니다. {/* 카테고리 설명 */}
              </Text>
              {/* 계정 이메일 표시 */}
              <View style={SettingsScreenStyles.row}>
                <View style={SettingsScreenStyles.iconBox}>
                  <MaterialIcons name="email" size={22} color="#b3b3ff" /> {/* 이메일 아이콘 */}
                </View>
                <View style={SettingsScreenStyles.infoBox}>
                  <Text style={SettingsScreenStyles.label}>계정 이메일</Text> {/* 라벨 */}
                  <Text style={SettingsScreenStyles.value}>
                    {userInfo?.email || '로딩 중...'}
                  </Text>{' '}
                  {/* 이메일 주소 또는 로딩 메시지 */}
                </View>
              </View>
              {/* 로그아웃 버튼 */}
              <TouchableOpacity style={SettingsScreenStyles.row} onPress={handleLogout}>
                <View style={SettingsScreenStyles.iconBox}>
                  <MaterialIcons name="logout" size={22} color="#ff4d4f" /> {/* 로그아웃 아이콘 */}
                </View>
                <Text style={SettingsScreenStyles.label}>로그아웃</Text> {/* 로그아웃 텍스트 */}
              </TouchableOpacity>
            </View>

            {/* 알림 설정 카테고리 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>알림 설정</Text>{' '}
              {/* 카테고리 제목 */}
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                새로운 스토리와 학습 관련 알림을 받을 수 있습니다. {/* 카테고리 설명 */}
              </Text>
              {/* 푸시 알림 토글 */}
              <View style={SettingsScreenStyles.row}>
                <View style={SettingsScreenStyles.iconBox}>
                  <Feather name="bell" size={22} color="#b3b3ff" /> {/* 알림 아이콘 */}
                </View>
                <Text style={SettingsScreenStyles.label}>푸시 알림</Text> {/* 라벨 */}
                <View style={{ flex: 1 }} /> {/* 공간 채우기 */}
                <Switch value={pushEnabled} onValueChange={handlePushToggle} /> {/* 토글 스위치 */}
              </View>
            </View>

            {/* 앱 정보 카테고리 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>앱 정보</Text> {/* 카테고리 제목 */}
              {/* 앱 버전 정보 */}
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>앱 버전</Text> {/* 라벨 */}
                <View style={{ flex: 1 }} /> {/* 공간 채우기 */}
                <Text
                  style={[
                    SettingsScreenStyles.value,
                    {
                      backgroundColor: '#6c63ff', // 배경색
                      color: '#fff', // 텍스트 색상
                      borderRadius: 8, // 모서리 둥글게
                      paddingHorizontal: 10, // 좌우 패딩
                      paddingVertical: 2, // 상하 패딩
                      fontWeight: 'bold', // 굵은 글씨
                    },
                  ]}
                >
                  v1.2.0 {/* 앱 버전 번호 */}
                </Text>
              </View>
              {/* 빌드 번호 정보 */}
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>빌드 번호</Text> {/* 라벨 */}
                <View style={{ flex: 1 }} /> {/* 공간 채우기 */}
                <Text style={SettingsScreenStyles.value}>2025.07.07</Text> {/* 빌드 날짜 */}
              </View>
              {/* 개발자 정보 */}
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>개발자</Text> {/* 라벨 */}
                <View style={{ flex: 1 }} /> {/* 공간 채우기 */}
                <Text style={SettingsScreenStyles.value}>Story Craft</Text> {/* 개발자명 */}
              </View>
            </View>

            {/* 개인정보 처리방침 카테고리 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>개인정보 처리방침</Text>{' '}
              {/* 카테고리 제목 */}
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                개인정보 보호 및 서비스 이용에 관한 정책을 확인할 수 있습니다. {/* 카테고리 설명 */}
              </Text>
              {/* 개인정보 처리방침 버튼 */}
              <TouchableOpacity
                style={[
                  SettingsScreenStyles.row,
                  { backgroundColor: '#23284a', justifyContent: 'center', marginBottom: 12 }, // 버튼 스타일
                ]}
                onPress={() => handlePolicyPress('privacy')} // 개인정보처리방침 모달 열기
              >
                <Text style={SettingsScreenStyles.label}>개인정보 처리방침</Text>{' '}
                {/* 버튼 텍스트 */}
              </TouchableOpacity>
              {/* 서비스 이용약관 버튼 */}
              <TouchableOpacity
                style={[
                  SettingsScreenStyles.row,
                  { backgroundColor: '#23284a', justifyContent: 'center' }, // 버튼 스타일
                ]}
                onPress={() => handlePolicyPress('terms')} // 이용약관 모달 열기
              >
                <Text style={SettingsScreenStyles.label}>서비스 이용약관</Text> {/* 버튼 텍스트 */}
              </TouchableOpacity>
            </View>

            {/* 회원 탈퇴 카테고리 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>회원 탈퇴</Text>{' '}
              {/* 카테고리 제목 */}
              {/* 위험 구역 경고 박스 */}
              <View
                style={{
                  backgroundColor: 'rgba(255,77,79,0.08)', // 빨간색 반투명 배경
                  borderRadius: 12, // 모서리 둥글게
                  padding: 12, // 내부 패딩
                  marginBottom: 8, // 하단 마진
                }}
              >
                <Text style={{ color: '#ff4d4f', fontWeight: 'bold', marginBottom: 4 }}>
                  위험 구역 {/* 위험 경고 제목 */}
                </Text>
                <Text style={{ color: '#ffb3b3', fontSize: 13, marginBottom: 4 }}>
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.{' '}
                  {/* 경고 메시지 */}
                </Text>
                {/* 회원 탈퇴 버튼 */}
                <TouchableOpacity
                  style={SettingsScreenStyles.dangerButton} // 위험 버튼 스타일
                  onPress={async () => {
                    try {
                      await withdraw(); // 서버에 회원탈퇴 요청
                      await AsyncStorage.removeItem('token'); // 액세스 토큰 삭제
                      await AsyncStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
                      router.replace('/(auth)'); // 로그인 화면으로 이동
                    } catch {
                      // 서버 요청이 실패해도 토큰 삭제 및 로그인 화면으로 이동
                      await AsyncStorage.removeItem('token'); // 액세스 토큰 삭제
                      await AsyncStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
                      router.replace('/(auth)'); // 로그인 화면으로 이동
                    }
                  }}
                >
                  <Text style={SettingsScreenStyles.dangerButtonText}>회원 탈퇴</Text>{' '}
                  {/* 버튼 텍스트 */}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* 정책 모달 (개인정보처리방침, 이용약관) */}
      <PolicyModal
        visible={policyModalVisible} // 모달 표시 여부
        onClose={handleClosePolicyModal} // 모달 닫기 함수
        type={policyType} // 정책 타입 ('privacy' 또는 'terms')
      />
    </ImageBackground>
  );
};

export default SettingsScreen;
