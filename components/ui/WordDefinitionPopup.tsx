import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface WordDefinitionPopupProps {
  visible: boolean;
  word: string;
  meaning: string;
  onClose: () => void;
}

const WordDefinitionPopup: React.FC<WordDefinitionPopupProps> = ({
  visible,
  word,
  meaning,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 팝업이 나타날 때 애니메이션
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 팝업이 사라질 때 애니메이션
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            styles.popupContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.contentContainer}>
              {/* 귀여운 아이콘과 단어 */}
              <View style={styles.wordSection}>
                <Text style={styles.wordIcon}>📚</Text>
                <Text style={styles.wordText}>{word}</Text>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 뜻 섹션 */}
              <View style={styles.meaningSection}>
                <Text style={styles.meaningLabel}>의미</Text>
                <Text style={styles.meaningText}>{meaning}</Text>
              </View>

              {/* 닫기 버튼 */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: wp(6),
    margin: wp(5),
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    maxWidth: wp(85),
    borderWidth: 3,
    borderColor: '#FFE5F0',
  },
  contentContainer: {
    alignItems: 'center',
  },
  wordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  wordIcon: {
    fontSize: wp(8),
    marginHorizontal: wp(2),
  },
  wordText: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: '#FF6B9D',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 157, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  divider: {
    width: wp(60),
    height: 3,
    backgroundColor: '#FFE5F0',
    borderRadius: 2,
    marginVertical: hp(2),
  },
  meaningSection: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  meaningLabel: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#FF9ECD',
    marginBottom: hp(1),
    backgroundColor: '#FFF0F8',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 15,
    overflow: 'hidden',
  },
  meaningText: {
    fontSize: wp(5),
    color: '#666',
    textAlign: 'center',
    lineHeight: hp(3.5),
    backgroundColor: '#FFF9FC',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFE5F0',
    minWidth: wp(70),
  },
  closeButton: {
    backgroundColor: '#FF9ECD',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFB6D9',
    shadowColor: '#FF9ECD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WordDefinitionPopup;
