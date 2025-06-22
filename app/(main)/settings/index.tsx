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
} from 'react-native';
import { SettingsScreenStyles } from '../../../styles/SettingsScreen.styles';
import { router } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, withdraw } from '@/features/auth/authApi';
import { savePushEnabled, loadPushEnabled } from '@/shared/utils/notificationStorage';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

const SettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // 앱 시작 시 저장된 값 불러오기
  useEffect(() => {
    loadPushEnabled().then(setPushEnabled);
  }, []);

  // 스위치 변경 시 저장 및 권한 요청
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

  // 로그아웃 핸들러 함수
  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      if (accessToken) {
        await logout(accessToken);
      }
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
    <SafeAreaView style={SettingsScreenStyles.container}>
      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity style={SettingsScreenStyles.backButton} onPress={() => router.back()}>
        <Text style={SettingsScreenStyles.backButtonText}>{'←'}</Text>
      </TouchableOpacity>
      <View style={SettingsScreenStyles.landscapeWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={SettingsScreenStyles.scrollContent}
        >
          <Text style={SettingsScreenStyles.sectionTitle}>설정</Text>
          {/* 계정 */}
          <Text style={SettingsScreenStyles.categoryTitle}>계정</Text>
          <View style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <MaterialIcons name="email" size={22} color="#222" />
            </View>
            <View style={SettingsScreenStyles.infoBox}>
              <Text style={SettingsScreenStyles.label}>이메일</Text>
              <Text style={SettingsScreenStyles.value}>test@example.com</Text>
            </View>
          </View>
          <TouchableOpacity style={SettingsScreenStyles.row} onPress={handleLogout}>
            <View style={SettingsScreenStyles.iconBox}>
              <MaterialIcons name="logout" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>로그아웃</Text>
          </TouchableOpacity>
          {/* 알림 */}
          <Text style={SettingsScreenStyles.categoryTitle}>알림</Text>
          <View style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <Feather name="bell" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>푸시 알림</Text>
            <View style={{ flex: 1 }} />
            <Switch value={pushEnabled} onValueChange={handlePushToggle} />
          </View>
          <View style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <MaterialIcons name="email" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>이메일 알림</Text>
            <View style={{ flex: 1 }} />
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
          {/* 언어 */}
          <Text style={SettingsScreenStyles.categoryTitle}>언어</Text>
          <View style={SettingsScreenStyles.row}>
            <Text style={SettingsScreenStyles.label}>언어</Text>
            <View style={{ flex: 1 }} />
            <Text style={SettingsScreenStyles.value}>한국어</Text>
          </View>
          {/* 아이 관리 */}
          <Text style={SettingsScreenStyles.categoryTitle}>아이 관리</Text>
          <TouchableOpacity style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <FontAwesome name="users" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>아이 관리하기</Text>
          </TouchableOpacity>
          {/* 앱 정보 */}
          <Text style={SettingsScreenStyles.categoryTitle}>앱 정보</Text>
          <View style={SettingsScreenStyles.row}>
            <Text style={SettingsScreenStyles.label}>버전</Text>
            <View style={{ flex: 1 }} />
            <Text style={SettingsScreenStyles.value}>1.2.3</Text>
          </View>
          {/* 지원 */}
          <Text style={SettingsScreenStyles.categoryTitle}>지원</Text>
          <TouchableOpacity style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <Feather name="help-circle" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>문의하기</Text>
          </TouchableOpacity>

          {/* 회원 탈퇴 버튼 */}
          <TouchableOpacity
            style={SettingsScreenStyles.dangerButton}
            onPress={async () => {
              try {
                const accessToken = await AsyncStorage.getItem('token');
                if (accessToken) {
                  await withdraw(accessToken);
                }
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
