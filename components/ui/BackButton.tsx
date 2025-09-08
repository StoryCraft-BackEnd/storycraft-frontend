/**
 * 뒤로가기 버튼 컴포넌트
 * 화면 상단에 표시되는 뒤로가기 버튼으로, 이전 화면으로 돌아가는 기능을 제공합니다.
 * 화살표 아이콘과 터치 이벤트를 통해 사용자가 직관적으로 이전 화면으로 이동할 수 있습니다.
 */

// Expo Router: 화면 이동을 위한 라우터 훅
import { useRouter } from 'expo-router';
// React Native: 터치 가능한 버튼 컴포넌트
import { TouchableOpacity } from 'react-native';
// Expo Vector Icons: 화살표 아이콘
import { Ionicons } from '@expo/vector-icons';
// 뒤로가기 버튼 전용 스타일
import styles from '../../styles/BackButton.styles';

/**
 * 뒤로가기 버튼 컴포넌트
 * 이전 화면으로 돌아가는 기능을 제공하는 재사용 가능한 버튼입니다.
 * @returns JSX.Element - 뒤로가기 버튼 컴포넌트
 */
export default function BackButton() {
  // 화면 이동을 위한 라우터 인스턴스
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.backBtn} // 뒤로가기 버튼 스타일 적용
      onPress={() => router.back()} // 버튼 클릭 시 이전 화면으로 이동
    >
      <Ionicons
        name="arrow-back" // 뒤로가기 화살표 아이콘
        size={24} // 아이콘 크기
        color="#fff" // 아이콘 색상 (흰색)
      />
    </TouchableOpacity>
  );
}
