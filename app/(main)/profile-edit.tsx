import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { ProfileEditScreenStyles } from '../../styles/ProfileEditScreen.styles';
import { getMyInfo, UserInfo } from '../../features/user/userApi';

const ProfileEditScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyInfo();
        setUserInfo(data);
      } catch (err: unknown) {
        let message = '정보를 불러오지 못했습니다.';
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === 'string') {
          message = err;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={ProfileEditScreenStyles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={ProfileEditScreenStyles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!userInfo) return null;

  return (
    <SafeAreaView style={ProfileEditScreenStyles.container}>
      <View style={ProfileEditScreenStyles.infoBox}>
        <Text style={ProfileEditScreenStyles.label}>이메일</Text>
        <Text style={ProfileEditScreenStyles.value}>{userInfo.email}</Text>
        <Text style={ProfileEditScreenStyles.label}>이름</Text>
        <Text style={ProfileEditScreenStyles.value}>{userInfo.name}</Text>
        <Text style={ProfileEditScreenStyles.label}>닉네임</Text>
        <Text style={ProfileEditScreenStyles.value}>{userInfo.nickname}</Text>
        <Text style={ProfileEditScreenStyles.label}>역할</Text>
        <Text style={ProfileEditScreenStyles.value}>{userInfo.role}</Text>
        <Text style={ProfileEditScreenStyles.label}>가입일</Text>
        <Text style={ProfileEditScreenStyles.value}>{userInfo.signup_date}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
