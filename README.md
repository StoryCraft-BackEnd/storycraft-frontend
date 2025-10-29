# StoryCraft - 영어 학습 앱 📚

## 🎯 프로젝트 소개

StoryCraft는 아이들이 AI 생성 영어 동화를 읽으며 영어를 학습할 수 있는 React Native 모바일 앱입니다.
개인화된 동화 생성, TTS 음성 재생, 퀴즈 시스템을 통해 재미있고 효과적인 영어 학습을 제공합니다.

## ✨ 주요 기능

### 📖 **동화 학습**

- AI 기반 개인화 영어 동화 생성
- 단락별 동화 읽기 및 한국어 번역
- TTS 음성 재생으로 발음 학습
- 삽화 이미지로 시각적 학습 지원

### 🎯 **퀴즈 시스템**

- 동화 내용 기반 퀴즈 자동 생성
- 객관식 문제로 이해도 확인
- 실시간 점수 및 정답률 제공

### 📊 **학습 통계**

- 총 학습 시간 측정 및 저장
- 생성한 동화 수, 완성한 동화 수
- 학습한 단어 수, 푼 퀴즈 수
- 자녀별 개별 통계 관리

### 🏆 **배지 시스템**

- 학습 성취도에 따른 배지 획득
- 연속 학습, 동화 완성, 퀴즈 정답 등 다양한 조건
- 시각적 동기부여 제공

### 👤 **프로필 관리**

- 다자녀 지원
- 개별 프로필 생성 및 관리
- 자녀별 학습 데이터 분리

## 🚀 설치 및 실행

### 필수 요구사항

- Node.js (v16 이상)
- npm 또는 yarn
- Expo CLI
- Expo Go 앱 (모바일 테스트용)

### 설치 방법

```bash
# 1. 저장소 클론
git clone [repository-url]
cd storycraft-frontend

# 2. 의존성 설치
npm install

# 3. Expo 개발 서버 시작
npx expo start

# 4. 모바일에서 테스트
# Expo Go 앱을 설치하고 QR 코드를 스캔하세요
```

### 개발 환경 설정

```bash
# TypeScript 타입 체크
npm run type-check

# 린터 실행
npm run lint

# 프로젝트 리셋 (필요시)
npm run reset-project
```

## 🛠 기술 스택

### Frontend

- **React Native** - 크로스 플랫폼 모바일 앱 개발
- **Expo** - 개발 도구 및 배포 플랫폼
- **TypeScript** - 타입 안전성
- **Expo Router** - 파일 기반 라우팅

### API & 통신

- **Axios** - HTTP 클라이언트
- **AsyncStorage** - 로컬 데이터 저장

### UI & 스타일링

- **React Native StyleSheet** - 스타일링
- **react-native-responsive-screen** - 반응형 디자인

### 오디오 & 파일

- **Expo AV** - 오디오 재생
- **Expo FileSystem** - 파일 시스템 관리

## 📁 프로젝트 구조

```
storycraft-frontend/
├── app/                          # 화면 컴포넌트 (Expo Router)
│   ├── (auth)/                   # 인증 관련 화면
│   ├── (main)/                   # 메인 기능 화면
│   └── (english-learning)/       # 영어 학습 화면
├── components/                   # 재사용 가능한 UI 컴포넌트
│   └── ui/                       # 기본 UI 컴포넌트
├── features/                     # 기능별 모듈
│   ├── auth/                     # 인증 관련
│   ├── profile/                  # 프로필 관리
│   ├── quiz/                     # 퀴즈 시스템
│   └── storyCreate/              # 동화 생성
├── shared/                       # 공통 리소스
│   ├── api/                      # API 관련
│   ├── config/                   # 설정 파일
│   ├── constants/                # 상수 정의
│   ├── contexts/                 # React Context
│   ├── types/                    # TypeScript 타입
│   └── utils/                    # 유틸리티 함수
├── styles/                       # 스타일 정의
├── assets/                       # 이미지, 폰트 등 정적 리소스
└── mock-server/                  # 개발용 목 서버
```

## 🔌 API 연동

### 주요 API 엔드포인트

- **인증**: `/auth/login`, `/auth/signup`
- **프로필**: `/profile`, `/profile/children`
- **동화**: `/stories`, `/stories/sections`
- **퀴즈**: `/quizzes`, `/quizzes/submit`
- **통계**: `/statistics/learning-time`
- **보상**: `/rewards/profile`, `/rewards/badges`

### API 테스트

개발 중 API 테스트를 위해 `app/(auth)/api-test.tsx` 화면을 제공합니다.

## 🎨 주요 화면

### 인증 화면

- 로그인, 회원가입
- 계정 찾기
- 약관 동의

### 메인 화면

- 홈 대시보드
- 동화 목록
- 즐겨찾기
- 설정

### 영어 학습 화면

- 동화 읽기
- TTS 음성 재생
- 단어 학습
- 퀴즈 풀기

### 마이페이지

- 프로필 관리
- 학습 통계
- 배지 확인
- 구독 관리

## 🔧 개발 가이드

### 새로운 화면 추가

1. `app/` 디렉토리에 새 파일 생성
2. Expo Router 규칙에 따라 파일명 지정
3. 필요한 스타일 파일 생성

### API 함수 추가

1. `shared/api/` 디렉토리에 새 파일 생성
2. TypeScript 타입 정의
3. Axios를 사용한 API 호출 함수 구현

### 컴포넌트 추가

1. `components/` 디렉토리에 새 컴포넌트 생성
2. TypeScript 인터페이스 정의
3. 재사용 가능한 형태로 설계

## 🐛 문제 해결

### 일반적인 문제들

- **Metro 번들러 오류**: `npx expo start --clear`
- **타입 오류**: `npm run type-check`
- **캐시 문제**: `npm run reset-project`

### 디버깅

- ESLint
- Prettier - Code formatter
- React Native Debugger 사용
- Expo DevTools 활용
- 콘솔 로그 확인

## 📱 배포

### 개발 빌드

```bash
npx expo build:android
npx expo build:ios
```

### 프로덕션 빌드

```bash
npx expo build:android --release-channel production
npx expo build:ios --release-channel production
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 팀원

- **개발자**: 임효준 조예령 김성준 류성민
- **디자이너**: 임효준 조예령 김성준 류성민
- **기획자**: 임효준 조예령 김성준 류성민

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**StoryCraft** - 아이들의 영어 학습을 더욱 재미있게! 🚀
