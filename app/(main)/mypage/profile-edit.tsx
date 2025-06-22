import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { ProfileEditScreenStyles } from '../../../styles/ProfileEditScreen.styles';
import { getMyInfo, UserInfo } from '../../../features/user/userApi';
import defaultProfile from '../../../assets/images/profile/default_profile.png';
import { router } from 'expo-router';

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
        if (err instanceof Error) message = err.message;
        else if (typeof err === 'string') message = err;
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
      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity style={ProfileEditScreenStyles.backButton} onPress={() => router.back()}>
        <Text style={ProfileEditScreenStyles.backButtonText}>{'←'}</Text>
      </TouchableOpacity>
      <View style={ProfileEditScreenStyles.landscapeWrapper}>
        {/* 왼쪽: 프로필 사진, 이름, 이메일 */}
        <View style={ProfileEditScreenStyles.profileLeft}>
          <Image source={defaultProfile} style={ProfileEditScreenStyles.profileImage} />
          <Text style={ProfileEditScreenStyles.profileName}>{userInfo.name}</Text>
          <Text style={ProfileEditScreenStyles.profileEmail}>{userInfo.email}</Text>
        </View>
        {/* 오른쪽: 상세 정보 */}
        <View style={ProfileEditScreenStyles.profileRight}>
          <Text style={ProfileEditScreenStyles.sectionTitle}>Profile</Text>
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Name</Text>
            <Text style={ProfileEditScreenStyles.value}>{userInfo.name}</Text>
          </View>
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Nickname</Text>
            <Text style={ProfileEditScreenStyles.value}>{userInfo.nickname}</Text>
          </View>
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Role</Text>
            <Text style={ProfileEditScreenStyles.value}>{userInfo.role}</Text>
          </View>
          <View style={ProfileEditScreenStyles.infoRow}>
            <Text style={ProfileEditScreenStyles.label}>Joined</Text>
            <Text style={ProfileEditScreenStyles.value}>{userInfo.signup_date}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
