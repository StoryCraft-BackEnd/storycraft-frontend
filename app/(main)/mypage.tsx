import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { MyPageStyles } from '../../styles/MyPageStyles';
import defaultProfile from '../../assets/images/profile/default_profile.png';

const MyPageScreen = () => {
  const profileImage = defaultProfile;
  const nickname = '사용자';
  const name = '홍길동';

  return (
    <SafeAreaView style={MyPageStyles.container}>
      <ScrollView>
        <View style={MyPageStyles.profileSection}>
          <Image source={profileImage} style={MyPageStyles.profileImage} />
          <Text style={MyPageStyles.nickname}>{nickname}</Text>
          <Text style={MyPageStyles.name}>{name}</Text>
        </View>
        <View style={MyPageStyles.menuSection}>
          <TouchableOpacity
            style={MyPageStyles.menuButton}
            onPress={() => router.push('./profile-edit')}
          >
            <Text style={MyPageStyles.menuButtonText}>내 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MyPageStyles.menuButton}
            onPress={() => router.push('./my-stories')}
          >
            <Text style={MyPageStyles.menuButtonText}>내가 만든 동화</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MyPageStyles.menuButton}
            onPress={() => router.push('./learning-stats')}
          >
            <Text style={MyPageStyles.menuButtonText}>학습 통계</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPageScreen;
