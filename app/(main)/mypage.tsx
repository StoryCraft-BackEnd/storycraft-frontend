import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MyPageStyles } from '../../styles/MyPageStyles';
import defaultProfile from '../../assets/images/profile/default_profile.png';
import setting from '../../assets/images/icons/setting.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyPageScreen = () => {
  const profileImage = defaultProfile;
  const nickname = '사용자';
  const name = '홍길동';
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={MyPageStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={MyPageStyles.profileSection}>
          <Image source={profileImage} style={MyPageStyles.profileImage} />
          <Text style={MyPageStyles.nickname}>{nickname}</Text>
          <Text style={MyPageStyles.name}>{name}</Text>
        </View>
        <View style={MyPageStyles.menuSection}>
          <TouchableOpacity
            style={[MyPageStyles.menuButton, MyPageStyles.squareButton]}
            onPress={() => router.push('./profile-edit')}
          >
            <Text style={MyPageStyles.menuButtonText}>내 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[MyPageStyles.menuButton, MyPageStyles.squareButton]}
            onPress={() => router.push('./my-stories')}
          >
            <Text style={MyPageStyles.menuButtonText}>내가 만든 동화</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[MyPageStyles.menuButton, MyPageStyles.squareButton]}
            onPress={() => router.push('./learning-stats')}
          >
            <Text style={MyPageStyles.menuButtonText}>학습 통계</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[MyPageStyles.settingsButton, { top: insets.top + 10, right: insets.right + 10 }]}
        onPress={() => router.push('./settings')}
      >
        <Image source={setting} style={MyPageStyles.settingsIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyPageScreen;
