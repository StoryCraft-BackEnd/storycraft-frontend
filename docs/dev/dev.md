# 설치 및 실행

## 요구사항

- Node.js v16 이상, npm 또는 yarn, Expo CLI, 모바일 Expo Go 앱

## 빠른 시작

```bash
# 1) 저장소 클론
git clone [repository-url]
cd storycraft-frontend

# 2) 의존성 설치
npm install

# 3) 개발 서버 실행
npx expo start

# 4) 모바일에서 테스트
# Expo Go로 QR 코드 스캔
```

## 빌드

```bash
# 개발 빌드
npx expo build:android
npx expo build:ios

# 프로덕션 빌드 (예시)
npx expo build:android --release-channel production
npx expo build:ios --release-channel production
```

## 개발 스크립트

```bash
# 타입 체크
npm run type-check

# 린트
npm run lint

# 캐시 리셋
npm run reset-project
```
