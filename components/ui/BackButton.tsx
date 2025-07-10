import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/BackButton.styles';

export default function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(main)')}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
