import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { checkServerConnection } from '../shared/api/client';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkServerConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error('서버 연결 확인 중 오류:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handlePress = () => {
    setShowLoading(true);
    // 3초 후에 로딩 화면 숨기기
    setTimeout(() => {
      setShowLoading(false);
      Alert.alert('환영합니다!', '지금 이 앱은 Stack 기반 단일 화면입니다.');
    }, 3000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isConnected) {
    return <LoadingScreen message="서버 연결에 실패했습니다. 다시 시도해주세요." />;
  }

  if (showLoading) {
    return <LoadingScreen message="데이터를 불러오는 중입니다..." />;
  }

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
