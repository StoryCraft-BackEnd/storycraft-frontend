import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

export default function HomeScreen() {
  const handlePress = () => {
    Alert.alert('환영합니다!', '지금 이 앱은 Stack 기반 단일 화면입니다.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StoryCraft</Text>
      <Text style={styles.subtitle}>AI 동화 생성 앱에 오신 걸 환영합니다.</Text>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>눌러보기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2F4F5',
  },    
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0096FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
