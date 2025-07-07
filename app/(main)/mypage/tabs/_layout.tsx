import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyInfoScreen from './mypage-index';
import StoryListScreen from './mypage-storylist';
import SubscriptionScreen from './mypage-subscription';
import StatsScreen from './mypage-stats';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
        options={{
          title: '내 정보',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
        component={MyInfoScreen}
      />
      <Tab.Screen
        name="mypage-storylist"
        options={{
          title: '동화 관리',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
        component={StoryListScreen}
      />
      <Tab.Screen
        name="mypage-subscription"
        options={{
          title: '구독/결제',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="payment" size={size} color={color} />
          ),
        }}
        component={SubscriptionScreen}
      />
      <Tab.Screen
        name="mypage-stats"
        options={{
          title: '학습 통계',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
        component={StatsScreen}
      />
    </Tab.Navigator>
  );
}
