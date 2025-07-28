import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import defaultProfile from '../../../../assets/images/profile/default_profile.png';
import styles from '../../../../styles/MyInfoScreen.styles';
import BackButton from '../../../../components/ui/BackButton';
import nightBg from '../../../../assets/images/background/night-bg.png';
import { getMyInfo, updateNickname, UserInfo } from '../../../../features/user/userApi';

export default function MyInfoScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [updating, setUpdating] = useState(false);

  // 사용자 정보 조회
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      console.log('사용자 정보 조회 시작...');
      const data = await getMyInfo();
      console.log('조회된 사용자 정보:', data);
      setUserInfo(data);
      setNicknameInput(data.nickname);
      console.log('상태 업데이트 완료');
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 수정
  const handleUpdateNickname = async () => {
    console.log('닉네임 수정 시작:', nicknameInput);

    if (!nicknameInput.trim()) {
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }

    try {
      setUpdating(true);
      console.log('API 호출 시작...');
      const success = await updateNickname(nicknameInput.trim());
      console.log('API 응답:', success);

      if (success) {
        Alert.alert('성공', '닉네임이 수정되었습니다.');
        setEditing(false);
        // 사용자 정보 다시 조회
        console.log('사용자 정보 재조회 시작...');
        await fetchUserInfo();
      } else {
        Alert.alert('오류', '닉네임 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('닉네임 수정 실패:', error);
      Alert.alert('오류', '닉네임 수정에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  // 편집 모드 토글
  const toggleEditing = () => {
    console.log('편집 모드 토글:', !editing);
    if (editing) {
      handleUpdateNickname();
    } else {
      setEditing(true);
    }
  };

  if (loading) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <BackButton />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={[styles.profileName, { marginTop: 16 }]}>로딩 중...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (!userInfo) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <BackButton />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.profileName}>사용자 정보를 불러올 수 없습니다.</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <BackButton />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {/* 프로필 정보 카드 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>프로필 정보</Text>
            <View style={styles.profileRow}>
              <Image source={defaultProfile} style={styles.profileImage} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.profileName}>{userInfo.name}</Text>
                <Text style={styles.profileNickname}>{userInfo.nickname}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn} onPress={toggleEditing} disabled={updating}>
                <Text style={styles.editBtnText}>
                  {updating ? '저장 중...' : editing ? '저장' : '수정'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.label}>이름</Text>
              <TextInput style={styles.input} value={userInfo.name} editable={false} />
            </View>
            <View style={styles.infoField}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={[styles.input, editing && { borderColor: '#4CAF50', borderWidth: 2 }]}
                value={editing ? nicknameInput : userInfo.nickname}
                editable={editing}
                onChangeText={setNicknameInput}
                placeholder={editing ? '새 닉네임을 입력하세요' : ''}
              />
            </View>
          </View>

          {/* 계정 정보 카드 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>계정 정보</Text>
            <View style={styles.infoField}>
              <Text style={styles.label}>이메일</Text>
              <TextInput style={styles.input} value={userInfo.email} editable={false} />
            </View>
            <View style={styles.infoField}>
              <Text style={styles.label}>가입일</Text>
              <TextInput
                style={styles.input}
                value={new Date(userInfo.signup_date).toLocaleDateString('ko-KR')}
                editable={false}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
