import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import { SettingsScreenStyles } from '../../../styles/SettingsScreen.styles';
import { router } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, withdraw } from '@/features/auth/authApi';
import { savePushEnabled, loadPushEnabled } from '@/shared/utils/notificationStorage';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import nightBg from '../../../assets/images/background/night-bg.png';
import BackButton from '../../../components/ui/BackButton';
import { getMyInfo, UserInfo } from '@/features/user/userApi';

const SettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pushSettings, userData] = await Promise.all([loadPushEnabled(), getMyInfo()]);
        setPushEnabled(pushSettings);
        setUserInfo(userData);
      } catch (error) {
        console.error('설정 데이터 로드 실패:', error);
      }
    };

    fetchData();
  }, []);

  const handlePushToggle = async (value: boolean) => {
    if (value) {
      let granted = false;
      let status = 'undetermined';
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const current = await Notifications.getPermissionsAsync();
        status = current.status;
        console.log('현재 권한 상태:', status);
        if (status === 'undetermined') {
          const req = await Notifications.requestPermissionsAsync();
          status = req.status;
          console.log('요청 후 권한 상태:', status);
        }
        granted = status === 'granted';
      }
      if (!granted) {
        Alert.alert('알림 권한 필요', '알림 권한이 허용되지 않았습니다. 설정에서 직접 켜주세요.', [
          {
            text: '설정으로 이동',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
          { text: '확인', style: 'cancel' },
        ]);
        setPushEnabled(false);
        await savePushEnabled(false);
        return;
      }
    }
    setPushEnabled(value);
    await savePushEnabled(value);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      router.replace('/login');
    } catch {
      // 실패해도 토큰 삭제 및 이동
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      router.replace('/login');
    }
  };

  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={SettingsScreenStyles.container}>
        <BackButton />
        <View style={SettingsScreenStyles.landscapeWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={SettingsScreenStyles.scrollContent}
          >
            {/* 계정 정보 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>계정 정보</Text>
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                계정 정보를 확인하고 관리할 수 있습니다.
              </Text>
              <View style={SettingsScreenStyles.row}>
                <View style={SettingsScreenStyles.iconBox}>
                  <MaterialIcons name="email" size={22} color="#b3b3ff" />
                </View>
                <View style={SettingsScreenStyles.infoBox}>
                  <Text style={SettingsScreenStyles.label}>계정 이메일</Text>
                  <Text style={SettingsScreenStyles.value}>{userInfo?.email || '로딩 중...'}</Text>
                </View>
              </View>
              <TouchableOpacity style={SettingsScreenStyles.row} onPress={handleLogout}>
                <View style={SettingsScreenStyles.iconBox}>
                  <MaterialIcons name="logout" size={22} color="#ff4d4f" />
                </View>
                <Text style={SettingsScreenStyles.label}>로그아웃</Text>
              </TouchableOpacity>
            </View>

            {/* 알림 설정 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>알림 설정</Text>
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                새로운 스토리와 학습 관련 알림을 받을 수 있습니다.
              </Text>
              <View style={SettingsScreenStyles.row}>
                <View style={SettingsScreenStyles.iconBox}>
                  <Feather name="bell" size={22} color="#b3b3ff" />
                </View>
                <Text style={SettingsScreenStyles.label}>푸시 알림</Text>
                <View style={{ flex: 1 }} />
                <Switch value={pushEnabled} onValueChange={handlePushToggle} />
              </View>
            </View>

            {/* 언어 설정 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>언어 설정</Text>
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                앱에서 사용할 언어를 선택합니다.
              </Text>
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>언어 선택</Text>
                <View style={{ flex: 1 }} />
                <Text style={SettingsScreenStyles.value}>한국어</Text>
              </View>
            </View>

            {/* 앱 정보 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>앱 정보</Text>
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>앱 버전</Text>
                <View style={{ flex: 1 }} />
                <Text
                  style={[
                    SettingsScreenStyles.value,
                    {
                      backgroundColor: '#6c63ff',
                      color: '#fff',
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  v1.2.0
                </Text>
              </View>
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>빌드 번호</Text>
                <View style={{ flex: 1 }} />
                <Text style={SettingsScreenStyles.value}>2025.07.07</Text>
              </View>
              <View style={SettingsScreenStyles.row}>
                <Text style={SettingsScreenStyles.label}>개발자</Text>
                <View style={{ flex: 1 }} />
                <Text style={SettingsScreenStyles.value}>Story Craft</Text>
              </View>
            </View>

            {/* 개인정보 처리방침 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>개인정보 처리방침</Text>
              <Text style={[SettingsScreenStyles.label, { marginBottom: 8 }]}>
                개인정보 보호 및 서비스 이용에 관한 정책을 확인할 수 있습니다.
              </Text>
              <TouchableOpacity
                style={[
                  SettingsScreenStyles.row,
                  { backgroundColor: '#23284a', justifyContent: 'center', marginBottom: 12 },
                ]}
              >
                <Text style={SettingsScreenStyles.label}>개인정보 처리방침</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  SettingsScreenStyles.row,
                  { backgroundColor: '#23284a', justifyContent: 'center' },
                ]}
              >
                <Text style={SettingsScreenStyles.label}>서비스 이용약관</Text>
              </TouchableOpacity>
            </View>

            {/* 회원 탈퇴 */}
            <View style={SettingsScreenStyles.settingsBox}>
              <Text style={SettingsScreenStyles.categoryTitle}>회원 탈퇴</Text>
              <View
                style={{
                  backgroundColor: 'rgba(255,77,79,0.08)',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#ff4d4f', fontWeight: 'bold', marginBottom: 4 }}>
                  위험 구역
                </Text>
                <Text style={{ color: '#ffb3b3', fontSize: 13, marginBottom: 4 }}>
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                </Text>
                <TouchableOpacity
                  style={SettingsScreenStyles.dangerButton}
                  onPress={async () => {
                    try {
                      await withdraw();
                      await AsyncStorage.removeItem('token');
                      await AsyncStorage.removeItem('refreshToken');
                      router.replace('/login');
                    } catch {
                      await AsyncStorage.removeItem('token');
                      await AsyncStorage.removeItem('refreshToken');
                      router.replace('/login');
                    }
                  }}
                >
                  <Text style={SettingsScreenStyles.dangerButtonText}>회원 탈퇴</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SettingsScreen;
