/**
 * StoryCraft 앱의 테마 색상 정의
 * 라이트 모드와 다크 모드의 색상 팔레트를 정의합니다.
 * React Navigation의 기본 테마를 확장하여 앱 전용 색상을 추가했습니다.
 */

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// 라이트 모드 테마 정의
// DefaultTheme 객체 전체를 복사해서 lightTheme에 넣고,
// 그 중 colors 속성만 덮어쓰기
export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // 메인 브랜드 색상 - 주요 버튼, 강조 요소, 링크 등에 사용
    primary: '#4A90E2', // 파란색 (메인 버튼, 강조 색)

    // 배경 색상 - 화면의 기본 배경색
    background: '#FFFFFF', // 흰색 (기본 배경)

    // 카드 배경 색상 - 카드, 모달, 팝업 등의 배경
    card: '#F5F5F5', // 아주 연한 회색 (카드 배경)

    // 텍스트 색상 - 기본 텍스트, 제목, 본문 등
    text: '#000000', // 검정 (기본 텍스트 색)

    // 경계선 색상 - 구분선, 테두리, 구분자 등
    border: '#E0E0E0', // 연한 회색 (선/구분선)

    // 알림 색상 - 경고, 오류, 삭제 버튼 등
    notification: '#FF3B30', // 빨간색 (알림, 경고용)

    // 보조 텍스트 색상 - 설명, 부제목, 비활성화된 텍스트 등
    secondary: '#aaaaaa', // 중간 회색 (보조 텍스트)

    // 프로필 이름 전용 색상 - 프로필 카드의 이름 텍스트
    profileName: '#000000', // 프로필 이름용 검정색
  },
};

// 다크 모드 테마 정의
// DarkTheme 객체 전체를 복사해서 darkTheme에 넣고,
// 그 중 colors 속성만 덮어쓰기
export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    // 메인 브랜드 색상 - 라이트 모드와 동일한 색상 유지 (소문자로 통일)
    primary: '#4a90e2', // 파란색 (같은 색상, 소문자)

    // 배경 색상 - 어두운 환경에 적합한 짙은 색상
    background: '#0d1b1e', // 아주 짙은 남청색 (배경)

    // 카드 배경 색상 - 어두운 배경에서 강조되도록 밝게 설정
    card: '#ffffff', // 흰색 (카드는 강조되게 밝게)

    // 텍스트 색상 - 어두운 배경에서 잘 보이도록 흰색
    text: '#ffffff', // 흰색 (기본 텍스트)

    // 경계선 색상 - 어두운 배경에서 잘 보이도록 밝게 설정
    border: '#cccccc', // 밝은 회색 (구분선)

    // 알림 색상 - iOS 다크 모드에 적합한 밝은 빨간색
    notification: '#ff453a', // 밝은 빨간색 (iOS 알림 색 계열)

    // 보조 텍스트 색상 - 라이트 모드와 동일한 색상 유지
    secondary: '#aaaaaa', // 중간 회색 (보조 텍스트)

    // 프로필 이름 전용 색상 - 다크 모드에서도 검정색 유지 (카드 배경이 흰색이므로)
    profileName: '#000000', // 프로필 이름용 검정색
  },
};

// 테마 색상 타입 정의 - TypeScript에서 색상 타입 안전성 보장
export type ThemeColors = typeof lightTheme.colors;
