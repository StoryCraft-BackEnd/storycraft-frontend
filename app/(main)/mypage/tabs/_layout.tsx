/**
 * 마이페이지 탭 네비게이션 레이아웃 컴포넌트
 * 사용자의 개인정보, 동화 관리, 구독/결제, 학습 통계를 탭으로 구분하여 표시하는 하단 탭 네비게이터입니다.
 * 4개의 탭으로 구성되어 있으며, 각 탭은 독립적인 화면을 담당합니다.
 */

// React Navigation: 하단 탭 네비게이터 생성 함수
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 마이페이지 관련 화면 컴포넌트들
import MyInfoScreen from './mypage-index'; // 내 정보 화면 (프로필, 닉네임 수정 등)
import StoryListScreen from './mypage-storylist'; // 동화 관리 화면 (작성한 동화 목록)
import SubscriptionScreen from './mypage-subscription'; // 구독/결제 화면 (결제 내역, 구독 관리)
import StatsScreen from './mypage-stats'; // 학습 통계 화면 (학습 현황, 성취도)
// 아이콘 라이브러리들
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// 하단 탭 네비게이터 인스턴스 생성
const Tab = createBottomTabNavigator();

/**
 * 마이페이지 탭 레이아웃 컴포넌트
 * 4개의 탭으로 구성된 하단 탭 네비게이터를 렌더링합니다.
 * 각 탭은 사용자의 다른 기능 영역을 담당합니다.
 */
export default function MyPageTabsLayout() {
  return (
    <Tab.Navigator
      id={undefined} // 네비게이터 ID (기본값 사용)
      screenOptions={{
        headerShown: false, // 헤더 숨김 (각 화면에서 자체 헤더 사용)
        tabBarStyle: {
          backgroundColor: '#101c2c', // 탭바 배경색 (어두운 파란색)
          borderTopWidth: 0, // 상단 테두리 제거
          paddingBottom: 0, // 하단 패딩 제거
        },
        tabBarActiveTintColor: '#fff', // 활성 탭 아이콘/텍스트 색상 (흰색)
        tabBarInactiveTintColor: '#aaa', // 비활성 탭 아이콘/텍스트 색상 (회색)
      }}
    >
      {/* 내 정보 탭 - 사용자의 프로필 정보, 닉네임 수정 등 */}
      <Tab.Screen
        name="mypage-index" // 탭 화면 이름
        options={{
          title: '내 정보', // 탭바에 표시될 탭 제목
          headerShown: false, // 헤더 숨김
          tabBarIcon: (
            { color, size } // 탭 아이콘 렌더링 함수
          ) => (
            <Ionicons name="person-outline" size={size} color={color} /> // 사람 아이콘
          ),
        }}
        component={MyInfoScreen} // 연결될 화면 컴포넌트
      />

      {/* 동화 관리 탭 - 사용자가 작성한 동화 목록 및 관리 */}
      <Tab.Screen
        name="mypage-storylist" // 탭 화면 이름
        options={{
          title: '동화 관리', // 탭바에 표시될 탭 제목
          headerShown: false, // 헤더 숨김
          tabBarIcon: (
            { color, size } // 탭 아이콘 렌더링 함수
          ) => (
            <Ionicons name="book-outline" size={size} color={color} /> // 책 아이콘
          ),
        }}
        component={StoryListScreen} // 연결될 화면 컴포넌트
      />

      {/* 구독/결제 탭 - 결제 내역, 구독 관리, 결제 정보 */}
      <Tab.Screen
        name="mypage-subscription" // 탭 화면 이름
        options={{
          title: '구독/결제', // 탭바에 표시될 탭 제목
          headerShown: false, // 헤더 숨김
          tabBarIcon: (
            { color, size } // 탭 아이콘 렌더링 함수
          ) => (
            <MaterialIcons name="payment" size={size} color={color} /> // 결제 아이콘
          ),
        }}
        component={SubscriptionScreen} // 연결될 화면 컴포넌트
      />

      {/* 학습 통계 탭 - 사용자의 학습 현황, 성취도, 통계 정보 */}
      <Tab.Screen
        name="mypage-stats" // 탭 화면 이름
        options={{
          title: '학습 통계', // 탭바에 표시될 탭 제목
          headerShown: false, // 헤더 숨김
          tabBarIcon: (
            { color, size } // 탭 아이콘 렌더링 함수
          ) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} /> // 통계 차트 아이콘
          ),
        }}
        component={StatsScreen} // 연결될 화면 컴포넌트
      />
    </Tab.Navigator>
  );
}
