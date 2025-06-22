import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { MyPageStyles } from '../../../styles/MyPageStyles';
import defaultProfile from '../../../assets/images/profile/default_profile.png';
import setting from '../../../assets/images/icons/setting.png';
import pencil from '../../../assets/images/icons/pencil.png';
import { updateNickname } from '../../../features/user/userApi';

const MyPageScreen = () => {
  const profileImage = defaultProfile;
  const [nickname, setNickname] = useState('사용자');
  const name = '홍길동';
  const [editing, setEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditStart = () => {
    setNicknameInput(nickname);
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setNicknameInput(nickname);
  };

  const handleEditConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const success = await updateNickname(nicknameInput);
      if (success) {
        setNickname(nicknameInput);
        setEditing(false);
      } else {
        setError('닉네임 수정에 실패했습니다.');
      }
    } catch (err: unknown) {
      let message = '닉네임 수정에 실패했습니다.';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={MyPageStyles.bg}>
      <TouchableOpacity style={MyPageStyles.backButton} onPress={() => router.back()}>
        <Text style={MyPageStyles.backIcon}>←</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={MyPageStyles.settingsButtonOutside}
        onPress={() => router.push('../settings')}
      >
        <Image source={setting} style={MyPageStyles.settingsIcon} />
      </TouchableOpacity>
      <View style={MyPageStyles.rowLayout}>
        <View style={MyPageStyles.leftSection}>
          <Image source={profileImage} style={MyPageStyles.profileImage} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            {editing ? (
              <>
                <TextInput
                  value={nicknameInput}
                  onChangeText={setNicknameInput}
                  style={MyPageStyles.nicknameInput}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleEditCancel}
                  style={{ marginLeft: 8 }}
                  disabled={loading}
                >
                  <Text style={{ color: '#888' }}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleEditConfirm}
                  style={{ marginLeft: 8 }}
                  disabled={loading}
                >
                  <Text style={{ color: loading ? '#aaa' : '#007AFF' }}>
                    {loading ? '...' : '확인'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={MyPageStyles.nickname}>{nickname}</Text>
                <TouchableOpacity onPress={handleEditStart} style={{ marginLeft: 8 }}>
                  <Image source={pencil} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={MyPageStyles.name}>{name}</Text>
          {error && <Text style={{ color: 'red', marginTop: 4 }}>{error}</Text>}
        </View>
        <View style={MyPageStyles.rightSection}>
          <View style={MyPageStyles.menuGrid}>
            <TouchableOpacity
              style={[MyPageStyles.menuButton, MyPageStyles.squareButton]}
              onPress={() => router.push('/(main)/mypage/profile-edit')}
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyPageScreen;
