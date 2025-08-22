import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface TTSSettingsMenuProps {
  ttsVoiceId: string;
  ttsPlaybackRate: number;
  onVoiceChange: (voiceId: string) => void;
  onPlaybackRateChange: (rate: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TTSSettingsMenu: React.FC<TTSSettingsMenuProps> = ({
  ttsVoiceId,
  ttsPlaybackRate,
  onVoiceChange,
  onPlaybackRateChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempVoiceId, setTempVoiceId] = useState(ttsVoiceId);
  const [tempPlaybackRate, setTempPlaybackRate] = useState(ttsPlaybackRate);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const voices = [
    { id: '세연', name: '세연', image: require('@/assets/images/voiceactor/girl.png') },
    { id: 'Joanna', name: 'Joanna', image: require('@/assets/images/voiceactor/woman.png') },
  ];

  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const showMenu = () => {
    // 메뉴를 열 때 현재 설정값으로 임시 상태 초기화
    setTempVoiceId(ttsVoiceId);
    setTempPlaybackRate(ttsPlaybackRate);
    setIsVisible(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideMenu = () => {
    // 메뉴를 닫을 때만 실제 상태 업데이트
    onVoiceChange(tempVoiceId);
    onPlaybackRateChange(tempPlaybackRate);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const handleVoiceSelect = (voiceId: string) => {
    // 임시 상태만 업데이트 (메뉴는 닫히지 않음)
    setTempVoiceId(voiceId);
  };

  const handlePlaybackRateSelect = (rate: number) => {
    // 임시 상태만 업데이트 (메뉴는 닫히지 않음)
    setTempPlaybackRate(rate);
  };

  return (
    <>
      {/* 음성 설정 버튼 */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={showMenu}>
        <Image
          source={require('@/assets/images/icons/sound_setting.png')}
          style={styles.hamburgerIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* TTS 설정 메뉴 모달 */}
      <Modal visible={isVisible} transparent={true} animationType="none" onRequestClose={hideMenu}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={hideMenu}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🎭 음성 설정</Text>
              <TouchableOpacity style={styles.closeButton} onPress={hideMenu}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 메인 컨텐츠 - 좌우로 나누어 배치 */}
            <View style={styles.mainContent}>
              {/* 왼쪽: 성우 선택 */}
              <View style={styles.leftSection}>
                <Text style={styles.sectionTitle}>🎭 성우 선택</Text>
                <View style={styles.voiceOptions}>
                  {voices.map((voice) => (
                    <TouchableOpacity
                      key={voice.id}
                      style={[
                        styles.voiceOption,
                        tempVoiceId === voice.id && styles.selectedVoiceOption,
                      ]}
                      onPress={() => handleVoiceSelect(voice.id)}
                    >
                      <Image source={voice.image} style={styles.voiceImage} />
                      <Text
                        style={[
                          styles.voiceText,
                          tempVoiceId === voice.id && styles.selectedVoiceText,
                        ]}
                      >
                        {voice.name}
                      </Text>
                      {tempVoiceId === voice.id && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 오른쪽: 재생 속도 */}
              <View style={styles.rightSection}>
                <Text style={styles.sectionTitle}>⚡ 재생 속도</Text>
                <View style={styles.playbackRateOptions}>
                  {playbackRates.map((rate) => (
                    <TouchableOpacity
                      key={rate}
                      style={[
                        styles.playbackRateOption,
                        tempPlaybackRate === rate && styles.selectedPlaybackRateOption,
                      ]}
                      onPress={() => handlePlaybackRateSelect(rate)}
                    >
                      <Text
                        style={[
                          styles.playbackRateText,
                          tempPlaybackRate === rate && styles.selectedPlaybackRateText,
                        ]}
                      >
                        {rate}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: hp('0%'),
    right: wp('43%'),
    zIndex: 1000,
    backgroundColor: '#FFB6D9',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hamburgerIcon: {
    width: 24, // Adjust as needed for the new image size
    height: 24, // Adjust as needed for the new image size
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: Math.min(screenWidth * 0.9, 800), // 가로화면에서 더 넓게
    maxHeight: Math.min(screenHeight * 0.8, 600), // 세로 높이 제한
    shadowColor: '#FFB6D9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FFE6F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  closeButton: {
    backgroundColor: '#FFE6F0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB6D9',
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  mainContent: {
    flexDirection: 'row', // 좌우로 나누어 배치
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 20, // 섹션 간 간격
  },
  leftSection: {
    flex: 1, // 왼쪽 섹션
    alignItems: 'center',
  },
  rightSection: {
    flex: 1, // 오른쪽 섹션
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
    textAlign: 'center',
  },
  voiceOptions: {
    width: '100%',
    gap: 10,
  },
  voiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFE6F0',
    shadowColor: '#FFB6D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedVoiceOption: {
    backgroundColor: '#FFE6F0',
    borderColor: '#FF69B4',
    shadowColor: '#FF69B4',
  },
  voiceImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  voiceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF69B4',
  },
  selectedVoiceText: {
    color: '#FF1493',
    fontWeight: 'bold',
  },
  playbackRateOptions: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  playbackRateOption: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFE6F0',
    shadowColor: '#FFB6D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedPlaybackRateOption: {
    backgroundColor: '#FFE6F0',
    borderColor: '#FF69B4',
    shadowColor: '#FF69B4',
  },
  playbackRateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF69B4',
  },
  selectedPlaybackRateText: {
    color: '#FF1493',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginLeft: 8,
  },
});

export default TTSSettingsMenu;
