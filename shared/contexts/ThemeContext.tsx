/**
 * 테마 관리를 위한 Context API
 * 
 * 이 모듈은 앱 전체에서 사용되는 테마(라이트/다크) 상태를 관리합니다.
 * AsyncStorage를 사용하여 사용자의 테마 선택을 저장하고,
 * 시스템 테마 설정을 감지하여 자동으로 적용합니다.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// 사용할 테마 타입 정의
type ThemeType = 'light' | 'dark' | 'system';

// ThemeContext에서 제공할 값의 타입 정의
interface ThemeContextType {
  theme: ThemeType;                     // 현재 선택된 테마 (light/dark/system)
  setTheme: (theme: ThemeType) => void; // 테마 변경 함수
  isDarkMode: boolean;                  // 실제로 다크 모드인지 여부
}

// Context 생성 (초기값 undefined → 반드시 ThemeProvider 안에서만 사용 가능)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 앱 전체에 테마 상태를 제공
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 시스템 설정된 테마 가져오기 ('light' | 'dark')
  const [theme, setTheme] = useState<ThemeType>('system'); // 기본 테마는 'system'
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark'); // 현재 실제 다크 모드인지 여부

  // 앱 시작 시 AsyncStorage에서 저장된 테마 설정을 불러옴
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme'); // 저장된 테마 가져오기
        if (savedTheme) {
          setTheme(savedTheme as ThemeType); // 테마 설정 반영
        }
      } catch (error) {
        console.error('테마 설정을 불러오는데 실패했습니다:', error);
      }
    };

    loadTheme(); // 실행
  }, []);

  // theme 값이 변경되면 AsyncStorage에 저장하고, isDarkMode 상태도 업데이트
  useEffect(() => {
    const updateTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme); // 테마 설정 저장
        // 실제 적용되는 다크모드 여부 계산
        setIsDarkMode(theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark'));
      } catch (error) {
        console.error('테마 설정을 저장하는데 실패했습니다:', error);
      }
    };

    updateTheme(); // 실행
  }, [theme, systemColorScheme]); // theme 또는 시스템 테마가 변경될 때마다 실행

  // Context Provider로 자식 컴포넌트에게 값 전달
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme 훅: ThemeContext를 쉽게 사용할 수 있게 함
export const useTheme = () => {
  const context = useContext(ThemeContext); // Context 값 불러오기
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider'); // ThemeProvider 외부에서 사용 시 오류
  }
  return context;
}; 