import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyInfoScreen from './mypage-index';
import StoryListScreen from './mypage-storylist';
import SubscriptionScreen from './mypage-subscription';
import StatsScreen from './mypage-stats';

const Tab = createBottomTabNavigator();

export default function MyPageTabsLayout() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#101c2c', borderTopWidth: 0, paddingBottom: 0 },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tab.Screen
        name="mypage-index"
        options={{ title: '내 정보', headerShown: false }}
        component={MyInfoScreen}
      />
      <Tab.Screen
        name="mypage-storylist"
        options={{ title: '동화 관리', headerShown: false }}
        component={StoryListScreen}
      />
      <Tab.Screen
        name="mypage-subscription"
        options={{ title: '구독/결제', headerShown: false }}
        component={SubscriptionScreen}
      />
      <Tab.Screen
        name="mypage-stats"
        options={{ title: '학습 통계', headerShown: false }}
        component={StatsScreen}
      />
    </Tab.Navigator>
  );
}
