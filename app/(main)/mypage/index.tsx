/**
 * 마이페이지 인덱스 컴포넌트
 * 마이페이지 경로로 접근했을 때 기본적으로 내 정보 탭으로 리다이렉트하는 컴포넌트입니다.
 * 사용자가 마이페이지에 접근하면 자동으로 내 정보 화면으로 이동합니다.
 */

// Expo Router: 리다이렉트 컴포넌트
import { Redirect } from 'expo-router';

/**
 * 마이페이지 인덱스 컴포넌트
 * 마이페이지 메인 경로에서 내 정보 탭으로 자동 리다이렉트합니다.
 */
export default function MyPageIndex() {
  return <Redirect href="/(main)/mypage/tabs/mypage-index" />; // 내 정보 탭으로 리다이렉트
}
