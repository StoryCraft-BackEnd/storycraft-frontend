import React, { useState } from "react";
import { TextInput, TouchableOpacity, Alert, View, Image } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "../../styles/ThemedView";
import { ThemedText } from "../../styles/ThemedText";
import { loginScreenStyles as styles } from "@/styles/LoginScreen.styles";

// 상태관리
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 버튼 클릭 시 실행
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
      {/* 입력 및 로그인 영역 */}
      <View style={styles.formContainer}>
        <ThemedText style={styles.title}>로그인</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ThemedText style={styles.loginButtonText}>로그인</ThemedText>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => Alert.alert("회원가입 버튼 눌림")}>
            <ThemedText style={styles.linkText}>회원가입</ThemedText>
          </TouchableOpacity>
          <ThemedText> | </ThemedText>
          <TouchableOpacity
            onPress={() => Alert.alert("비밀번호 찾기 버튼 눌림")}
          >
            <ThemedText style={styles.linkText}>비밀번호 찾기</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 소셜 로그인 + 안내 */}
      <View style={styles.footerContainer}>
        <View style={styles.socialButtonRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Alert.alert("페이스북 로그인 눌림")}
          >
            <Image
              source={require("../../assets/images/facebook.png")}
              style={styles.socialIcon}
            />
            <ThemedText style={styles.socialText}>Facebook</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Alert.alert("구글 로그인 눌림")}
          >
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.socialIcon}
            />
            <ThemedText style={styles.socialText}>Google</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.notice}>
          StoryCraft에 가입함으로써 StoryCraft의 이용 약관 및{"\n"}
          개인정보처리방침에 동의하게 됩니다.
        </ThemedText>
      </View>
    </ThemedView>
  );
}
