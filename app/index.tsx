/**
 * StoryCraft 메인 홈 화면 컴포넌트
 *
 * 이 컴포넌트는 앱의 메인 화면을 담당하며, 다음과 같은 기능을 제공합니다:
 * 1. 서버 연결 상태 확인
 * 2. 로딩 화면 표시
 * 3. 404 화면으로의 네비게이션
 *
 * @author StoryCraft Team
 * @version 1.0.0
 */
import React, { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "../styles/ThemedText";
import { ThemedView } from "../styles/ThemedView";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { checkServerConnection } from "../shared/api/client";
import { homeScreenStyles as styles } from "../styles/HomeScreen.styles";

export default function HomeScreen() {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [showLoading, setShowLoading] = useState(false); // 로딩 화면 표시 여부
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // 서버 연결 상태

  /**
   * 서버 연결 상태를 확인하고 결과를 표시하는 핸들러
   *
   * @async
   * @function handlePress
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    setShowLoading(true);
    setIsLoading(true);

    try {
      const connected = await checkServerConnection();
      setIsConnected(connected);

      // 3초 후에 로딩 화면을 닫고 알림을 표시
      setTimeout(() => {
        setShowLoading(false);
        setIsLoading(false);
        Alert.alert(
          "서버 연결 상태",
          connected ? "서버에 연결되었습니다!" : "서버 연결에 실패했습니다."
        );
      }, 3000);
    } catch (error) {
      setIsConnected(false);
      setShowLoading(false);
      setIsLoading(false);
      Alert.alert("오류", "서버 연결 확인 중 오류가 발생했습니다.");
    }
  };

  /**
   * 404 화면으로 이동하는 핸들러
   *
   * @function handleNotFoundPress
   */
  const handleNotFoundPress = () => {
    console.log("404 화면으로 이동합니다!");
    router.push("/+not-found");
  };

  // 로딩 화면 표시
  if (showLoading) {
    return (
      <LoadingScreen
        message={
          isConnected === null
            ? "서버 연결 확인 중..."
            : isConnected
            ? "서버에 연결되었습니다!"
            : "서버 연결에 실패했습니다."
        }
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>StoryCraft</ThemedText>
      <ThemedText style={styles.subtitle}>
        당신의 이야기를 만들어보세요
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <ThemedText style={styles.buttonText}>눌러보기</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: "#FF6B6B" }]}
        onPress={handleNotFoundPress}
      >
        <ThemedText style={styles.buttonText}>404 화면으로 이동</ThemedText>
      </TouchableOpacity>

      {/* 로그인 화면으로 이동 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: "#4A90E2" }]}
        onPress={() => router.push("/login" as any)}
      >
        <ThemedText style={styles.buttonText}>로그인 화면으로 이동</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
