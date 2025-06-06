import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SettingsScreenStyles } from '../../styles/SettingsScreen.styles';
import { router } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaView style={SettingsScreenStyles.container}>
      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity style={SettingsScreenStyles.backButton} onPress={() => router.back()}>
        <Text style={SettingsScreenStyles.backButtonText}>{'←'}</Text>
      </TouchableOpacity>
      <View style={SettingsScreenStyles.landscapeWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={SettingsScreenStyles.scrollContent}
        >
          <Text style={SettingsScreenStyles.sectionTitle}>설정</Text>
          {/* 계정 */}
          <Text style={SettingsScreenStyles.categoryTitle}>계정</Text>
          <View style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <MaterialIcons name="email" size={22} color="#222" />
            </View>
            <View style={SettingsScreenStyles.infoBox}>
              <Text style={SettingsScreenStyles.label}>이메일</Text>
              <Text style={SettingsScreenStyles.value}>test@example.com</Text>
            </View>
          </View>
          <TouchableOpacity style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <MaterialIcons name="logout" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>로그아웃</Text>
          </TouchableOpacity>
          {/* 알림 */}
          <Text style={SettingsScreenStyles.categoryTitle}>알림</Text>
          <View style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <Feather name="bell" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>푸시 알림</Text>
            <View style={{ flex: 1 }} />
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <MaterialIcons name="email" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>이메일 알림</Text>
            <View style={{ flex: 1 }} />
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
          {/* 언어 */}
          <Text style={SettingsScreenStyles.categoryTitle}>언어</Text>
          <View style={SettingsScreenStyles.row}>
            <Text style={SettingsScreenStyles.label}>언어</Text>
            <View style={{ flex: 1 }} />
            <Text style={SettingsScreenStyles.value}>한국어</Text>
          </View>
          {/* 아이 관리 */}
          <Text style={SettingsScreenStyles.categoryTitle}>아이 관리</Text>
          <TouchableOpacity style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <FontAwesome name="users" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>아이 관리하기</Text>
          </TouchableOpacity>
          {/* 앱 정보 */}
          <Text style={SettingsScreenStyles.categoryTitle}>앱 정보</Text>
          <View style={SettingsScreenStyles.row}>
            <Text style={SettingsScreenStyles.label}>버전</Text>
            <View style={{ flex: 1 }} />
            <Text style={SettingsScreenStyles.value}>1.2.3</Text>
          </View>
          {/* 지원 */}
          <Text style={SettingsScreenStyles.categoryTitle}>지원</Text>
          <TouchableOpacity style={SettingsScreenStyles.row}>
            <View style={SettingsScreenStyles.iconBox}>
              <Feather name="help-circle" size={22} color="#222" />
            </View>
            <Text style={SettingsScreenStyles.label}>문의하기</Text>
          </TouchableOpacity>

          {/* 회원 탈퇴 버튼 */}
          <TouchableOpacity
            style={SettingsScreenStyles.dangerButton}
            onPress={() => {
              /* TODO: 회원 탈퇴 로직 */
            }}
          >
            <Text style={SettingsScreenStyles.dangerButtonText}>회원 탈퇴</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
