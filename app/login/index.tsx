import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import { router } from "expo-router";
import { ThemedView } from "../../styles/ThemedView";
import { ThemedText } from "../../styles/ThemedText";

//상태관리
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //로그인 버튼 클릭시 실행
  const handleLogin = () => {
    if (email === "test@example.com" && password === "1234") {
      Alert.alert("로그인 성공");
      router.replace("/");
    } else {
      Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>로그인</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" //첫글자 자동 대문자 방지
        keyboardType="email-address" //이메일 키보드
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry //비밀번호 숨김 처리리
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <ThemedText style={styles.loginButtonText}>로그인</ThemedText>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => Alert.alert("회원가입 버튼 눌림")}>
          <ThemedText style={styles.linkText}>회원가입</ThemedText>
        </TouchableOpacity>
        <ThemedText> | </ThemedText>
        <TouchableOpacity onPress={() => Alert.alert("비번 찾기 버튼 눌림")}>
          <ThemedText style={styles.linkText}>비밀번호 찾기</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  linkText: {
    color: "#4a90e2",
    fontWeight: "500",
  },
});
