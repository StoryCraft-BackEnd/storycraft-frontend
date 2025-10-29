/**
 * 내 정보 화면 컴포넌트
 * 사용자의 프로필 정보를 조회하고 수정할 수 있는 화면입니다.
 * 프로필 이미지 변경, 닉네임 수정, 계정 정보 조회 기능을 제공합니다.
 * 로컬 저장소를 통해 프로필 이미지를 관리하며, API를 통해 사용자 정보를 동기화합니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  Image, // 이미지 표시 컴포넌트
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
  TextInput, // 텍스트 입력 컴포넌트
  ImageBackground, // 배경 이미지가 있는 컨테이너
  SafeAreaView, // 안전 영역을 고려한 컨테이너
  ScrollView, // 스크롤 가능한 컨테이너
  Alert, // 알림 팝업 표시용
  ActivityIndicator, // 로딩 스피너 컴포넌트
} from 'react-native';
// 내 정보 화면 전용 스타일
import styles from '../../../../styles/MyInfoScreen.styles';
// 뒤로가기 버튼 컴포넌트
import BackButton from '../../../../components/ui/BackButton';
// 배경 이미지 (밤하늘 배경)
import nightBg from '../../../../assets/images/background/night-bg.png';
// 사용자 관련 API 함수들과 타입 정의
import { getMyInfo, updateNickname, UserInfo } from '../../../../features/user/userApi';
// 프로필 이미지 선택 모달 컴포넌트
import ProfileImageSelector from '../../../../components/ui/ProfileImageSelector';
// 프로필 이미지 ID로 이미지 객체를 가져오는 함수
import { getProfileImageById } from '../../../../types/ProfileImageTypes';
// 프로필 이미지 로컬 저장소 관리 함수들
import { saveProfileImage, loadProfileImage } from '../../../../features/profile/profileStorage';

/**
 * 내 정보 화면 컴포넌트
 * 사용자의 프로필 정보를 표시하고 수정할 수 있는 기능을 제공합니다.
 */
export default function MyInfoScreen() {
  // ===== 상태 변수 정의 =====
  // 사용자 정보 상태 (API에서 받아온 사용자 데이터)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // 로딩 상태 (API 호출 중 여부)
  const [loading, setLoading] = useState(true);
  // 편집 모드 상태 (닉네임 수정 모드 여부)
  const [editing, setEditing] = useState(false);
  // 닉네임 입력값 상태 (편집 중인 닉네임 텍스트)
  const [nicknameInput, setNicknameInput] = useState('');
  // 업데이트 진행 상태 (닉네임 수정 API 호출 중 여부)
  const [updating, setUpdating] = useState(false);
  // 프로필 이미지 선택 모달 표시 상태
  const [showImageSelector, setShowImageSelector] = useState(false);

  // ===== 함수 정의 부분 =====
  /**
   * 사용자 정보 조회 함수
   * API에서 사용자 정보를 가져오고, 로컬 저장소에서 프로필 이미지를 불러와서 적용합니다.
   */
  const fetchUserInfo = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      console.log('사용자 정보 조회 시작...');
      const data = await getMyInfo(); // API 호출로 사용자 정보 조회
      console.log('조회된 사용자 정보:', data);

      // 로컬 저장소에서 프로필 이미지 불러오기
      const localProfileImage = await loadProfileImage();
      if (localProfileImage) {
        data.profileImage = localProfileImage; // 로컬 프로필 이미지를 사용자 정보에 적용
        console.log('✅ 로컬 프로필 이미지 적용:', localProfileImage);
      }

      setUserInfo(data); // 사용자 정보 상태 업데이트
      setNicknameInput(data.nickname); // 닉네임 입력값 초기화
      console.log('상태 업데이트 완료');
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.'); // 사용자에게 오류 알림
    } finally {
      setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 닉네임 수정 함수
   * 사용자가 입력한 새 닉네임을 API를 통해 서버에 업데이트하고, 성공 시 사용자 정보를 다시 조회합니다.
   */
  const handleUpdateNickname = async () => {
    console.log('닉네임 수정 시작:', nicknameInput);

    // 닉네임 입력값 유효성 검사
    if (!nicknameInput.trim()) {
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }

    try {
      setUpdating(true); // 업데이트 진행 상태 시작
      console.log('API 호출 시작...');
      const success = await updateNickname(nicknameInput.trim()); // API 호출로 닉네임 업데이트
      console.log('API 응답:', success);

      if (success) {
        Alert.alert('성공', '닉네임이 수정되었습니다.'); // 성공 알림
        setEditing(false); // 편집 모드 종료
        // 사용자 정보 다시 조회 (최신 데이터로 동기화)
        console.log('사용자 정보 재조회 시작...');
        await fetchUserInfo();
      } else {
        Alert.alert('오류', '닉네임 수정에 실패했습니다.'); // 실패 알림
      }
    } catch (error) {
      console.error('닉네임 수정 실패:', error);
      Alert.alert('오류', '닉네임 수정에 실패했습니다.'); // 오류 알림
    } finally {
      setUpdating(false); // 업데이트 진행 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 프로필 이미지 선택 핸들러 함수
   * 사용자가 선택한 프로필 이미지를 로컬 상태와 저장소에 업데이트합니다.
   * @param {string} imageId - 선택된 프로필 이미지의 ID
   */
  const handleImageSelect = async (imageId: string) => {
    try {
      // 로컬 상태 업데이트 (즉시 UI에 반영)
      setUserInfo((prev) => (prev ? { ...prev, profileImage: imageId } : null));

      // 로컬 저장소에 프로필 이미지 저장 (앱 재시작 시에도 유지)
      await saveProfileImage(imageId);

      Alert.alert('성공', '프로필 이미지가 변경되었습니다.'); // 성공 알림
      console.log('✅ 프로필 이미지 변경 및 로컬 저장 완료:', imageId);
    } catch (error) {
      console.error('❌ 프로필 이미지 저장 실패:', error);
      Alert.alert('오류', '프로필 이미지 저장에 실패했습니다.'); // 오류 알림
    }
  };

  /**
   * 편집 모드 토글 함수
   * 닉네임 편집 모드를 켜거나 끄며, 편집 모드에서 호출 시 닉네임 수정을 실행합니다.
   */
  const toggleEditing = () => {
    console.log('편집 모드 토글:', !editing);
    if (editing) {
      handleUpdateNickname(); // 편집 모드에서 호출 시 닉네임 수정 실행
    } else {
      setEditing(true); // 편집 모드 활성화
    }
  };

  // ===== 실행 부분 =====
  // 컴포넌트 마운트 시 사용자 정보 조회 (화면 진입 시 한 번만 실행)
  useEffect(() => {
    fetchUserInfo();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 로딩 상태일 때 표시되는 화면 (API 호출 중)
  if (loading) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <BackButton /> {/* 뒤로가기 버튼 */}
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#fff" /> {/* 로딩 스피너 */}
            <Text style={[styles.profileName, { marginTop: 16 }]}>로딩 중...</Text>{' '}
            {/* 로딩 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 사용자 정보가 없을 때 표시되는 화면 (오류 상태)
  if (!userInfo) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <BackButton /> {/* 뒤로가기 버튼 */}
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.profileName}>사용자 정보를 불러올 수 없습니다.</Text>{' '}
            {/* 오류 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 메인 화면 렌더링 (사용자 정보가 정상적으로 로드된 상태)
  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <BackButton /> {/* 뒤로가기 버튼 */}
      <SafeAreaView style={styles.safeArea}>
        {/* 가로 스크롤 가능한 컨테이너 (프로필 정보와 계정 정보 카드들을 가로로 배치) */}
        <ScrollView
          horizontal // 가로 스크롤 설정
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
        >
          {/* 프로필 정보 카드 (프로필 이미지, 이름, 닉네임, 수정 기능) */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>프로필 정보</Text> {/* 카드 제목 */}
            <View style={styles.profileRow}>
              {/* 프로필 이미지 선택 버튼 */}
              <TouchableOpacity
                onPress={() => setShowImageSelector(true)} // 프로필 이미지 선택 모달 열기
                style={styles.profileImageContainer}
              >
                <Image
                  source={getProfileImageById(userInfo.profileImage || 'default_profile')} // 프로필 이미지 표시
                  style={styles.profileImage}
                />
                <View style={styles.editImageIndicator}>
                  <Text style={styles.editImageText}>📷</Text> {/* 편집 표시 아이콘 */}
                </View>
              </TouchableOpacity>
              {/* 사용자 이름과 닉네임 표시 영역 */}
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.profileName}>{userInfo.name}</Text> {/* 사용자 이름 */}
                <Text style={styles.profileNickname}>{userInfo.nickname}</Text>{' '}
                {/* 사용자 닉네임 */}
              </View>
              {/* 닉네임 수정 버튼 */}
              <TouchableOpacity style={styles.editBtn} onPress={toggleEditing} disabled={updating}>
                <Text style={styles.editBtnText}>
                  {updating ? '저장 중...' : editing ? '저장' : '수정'}{' '}
                  {/* 버튼 텍스트 (상태에 따라 변경) */}
                </Text>
              </TouchableOpacity>
            </View>
            {/* 이름 입력 필드 (읽기 전용) */}
            <View style={styles.infoField}>
              <Text style={styles.label}>이름</Text> {/* 필드 라벨 */}
              <TextInput style={styles.input} value={userInfo.name} editable={false} />{' '}
              {/* 이름 입력 (수정 불가) */}
            </View>
            {/* 닉네임 입력 필드 (편집 가능) */}
            <View style={styles.infoField}>
              <Text style={styles.label}>닉네임</Text> {/* 필드 라벨 */}
              <TextInput
                style={[styles.input, editing && { borderColor: '#4CAF50', borderWidth: 2 }]} // 편집 모드일 때 테두리 색상 변경
                value={editing ? nicknameInput : userInfo.nickname} // 편집 모드에 따라 표시할 값 변경
                editable={editing} // 편집 모드에 따라 수정 가능 여부 변경
                onChangeText={setNicknameInput} // 입력값 변경 핸들러
                placeholder={editing ? '새 닉네임을 입력하세요' : ''} // 편집 모드일 때 플레이스홀더 표시
              />
            </View>
          </View>

          {/* 계정 정보 카드 (이메일, 가입일 등 계정 관련 정보) */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>계정 정보</Text> {/* 카드 제목 */}
            {/* 이메일 입력 필드 (읽기 전용) */}
            <View style={styles.infoField}>
              <Text style={styles.label}>이메일</Text> {/* 필드 라벨 */}
              <TextInput style={styles.input} value={userInfo.email} editable={false} />{' '}
              {/* 이메일 입력 (수정 불가) */}
            </View>
            {/* 가입일 입력 필드 (읽기 전용) */}
            <View style={styles.infoField}>
              <Text style={styles.label}>가입일</Text> {/* 필드 라벨 */}
              <TextInput
                style={styles.input}
                value={new Date(userInfo.signup_date).toLocaleDateString('ko-KR')} // 가입일을 한국 형식으로 포맷팅
                editable={false} // 수정 불가
              />
            </View>
          </View>
        </ScrollView>

        {/* 프로필 이미지 선택 모달 (사용자가 프로필 이미지를 선택할 수 있는 팝업) */}
        <ProfileImageSelector
          visible={showImageSelector} // 모달 표시 여부
          onClose={() => setShowImageSelector(false)} // 모달 닫기 핸들러
          onSelectImage={handleImageSelect} // 이미지 선택 핸들러
          currentImageId={userInfo.profileImage || 'default_profile'} // 현재 선택된 이미지 ID
        />
      </SafeAreaView>
    </ImageBackground>
  );
}
