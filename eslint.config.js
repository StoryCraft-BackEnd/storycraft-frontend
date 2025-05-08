// ESLint 9 버전의 새로운 설정 파일
// 기본 ESLint 설정과 TypeScript ESLint 설정을 가져옵니다
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  // 기본 ESLint 권장 규칙 적용
  eslint.configs.recommended,
  // TypeScript ESLint 권장 규칙 적용
  ...tseslint.configs.recommended,
  {
    // 사용할 플러그인 설정
    plugins: {
      react: reactPlugin, // React 관련 린팅 규칙
      prettier: prettierPlugin, // Prettier와의 통합
    },
    // 린팅 규칙 설정
    rules: {
      'prettier/prettier': 'error', // Prettier 규칙 위반 시 에러
      'react/react-in-jsx-scope': 'off', // React 17+ 에서는 import React 불필요
      '@typescript-eslint/no-unused-vars': 'error', // 사용하지 않는 변수 에러
      // 'no-console': 'warn', // console.log 사용 시 경고
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 시 경고
    },
    // React 버전 자동 감지
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
