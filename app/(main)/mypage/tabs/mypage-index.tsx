import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import defaultProfile from '../../../../assets/images/profile/default_profile.png';
import styles from '../../../../styles/MyInfoScreen.styles';
import BackButton from '../../../../components/ui/BackButton';
import nightBg from '../../../../assets/images/background/night-bg.png';

export default function MyInfoScreen() {
  // 더미 데이터
  const [profile] = useState({
    name: '김민수',
    nickname: '스토리킹',
    email: 'minsu@example.com',
    age: 8,
  });
  const [editing, setEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [pw, setPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <BackButton />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            {/* 기본 정보 카드 */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>기본 정보</Text>
              <View style={styles.profileRow}>
                <Image source={defaultProfile} style={styles.profileImage} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileNickname}>{profile.nickname}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(!editing)}>
                  <Text style={styles.editBtnText}>수정</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.label}>이름</Text>
                <TextInput style={styles.input} value={profile.name} editable={false} />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.label}>이메일</Text>
                <TextInput style={styles.input} value={profile.email} editable={false} />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.label}>닉네임</Text>
                <TextInput
                  style={styles.input}
                  value={editing ? nicknameInput : profile.nickname}
                  editable={editing}
                  onChangeText={setNicknameInput}
                />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.label}>나이</Text>
                <TextInput style={styles.input} value={String(profile.age)} editable={false} />
              </View>
            </View>

            {/* 보안 설정 카드 */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>보안 설정</Text>
              <View style={styles.infoField}>
                <Text style={styles.label}>현재 비밀번호</Text>
                <TextInput
                  style={styles.input}
                  value={pw}
                  onChangeText={setPw}
                  placeholder="현재 비밀번호를 입력하세요"
                  secureTextEntry
                />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.label}>새 비밀번호</Text>
                <TextInput
                  style={styles.input}
                  value={newPw}
                  onChangeText={setNewPw}
                  placeholder="새 비밀번호를 입력하세요"
                  secureTextEntry
                />
              </View>
              <View style={styles.infoField}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  secureTextEntry
                />
              </View>
              <TouchableOpacity style={styles.pwBtn}>
                <Text style={styles.pwBtnText}>비밀번호 변경</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
