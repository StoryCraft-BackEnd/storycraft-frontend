# 환경 변수 설정 가이드

## 개요

StoryCraft 프로젝트에서는 환경별로 다른 API 서버 설정을 사용할 수 있도록 환경 변수를 지원합니다.

## 설정 방법

### 1. .env 파일 생성 (권장)

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# API 서버 설정
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_API_TIMEOUT=10000

# 환경 설정
EXPO_PUBLIC_ENVIRONMENT=development
```

### 2. 환경별 설정 예시

#### 개발 환경 (.env)

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_ENVIRONMENT=development
```

#### 스테이징 환경 (.env.staging)

```bash
EXPO_PUBLIC_API_BASE_URL=https://staging-api.storycraft.com/api
EXPO_PUBLIC_API_TIMEOUT=15000
EXPO_PUBLIC_ENVIRONMENT=staging
```

#### 프로덕션 환경 (.env.production)

```bash
EXPO_PUBLIC_API_BASE_URL=https://api.storycraft.com/api
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_ENVIRONMENT=production
```

## 사용 가능한 환경 변수

| 변수명                     | 설명                   | 기본값            | 예시                                   |
| -------------------------- | ---------------------- | ----------------- | -------------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL` | API 서버 기본 URL      | 자동 감지 IP:3000 | `http://localhost:3000/api`            |
| `EXPO_PUBLIC_API_TIMEOUT`  | API 요청 타임아웃 (ms) | 10000             | `15000`                                |
| `EXPO_PUBLIC_ENVIRONMENT`  | 현재 환경              | development       | `development`, `staging`, `production` |

## 주의사항

1. **Expo 환경 변수 규칙**: Expo에서는 클라이언트에서 접근 가능한 환경 변수는 `EXPO_PUBLIC_` 접두사가 필요합니다.

2. **보안**: API 키나 민감한 정보는 환경 변수에 저장하지 마세요. 클라이언트에서 접근 가능합니다.

3. **Git 관리**: `.env` 파일은 `.gitignore`에 추가하여 버전 관리에서 제외하는 것을 권장합니다.

## 설정 확인

앱을 실행하면 개발 환경에서 콘솔에 현재 API 설정이 출력됩니다:

```
🔧 API Configuration: {
  BASE_URL: "http://localhost:3000/api",
  TIMEOUT: 10000,
  ENVIRONMENT: "development"
}
```

## 문제 해결

### 환경 변수가 적용되지 않을 때

1. **앱 재시작**: 환경 변수 변경 후 Expo 개발 서버를 재시작하세요.

   ```bash
   npm start
   ```

2. **캐시 클리어**: Expo 캐시를 클리어하세요.

   ```bash
   expo start --clear
   ```

3. **파일 이름 확인**: 파일 이름이 정확히 `.env`인지 확인하세요.

4. **접두사 확인**: 변수명이 `EXPO_PUBLIC_`로 시작하는지 확인하세요.

## 기본 설정 (환경 변수 없을 때)

환경 변수가 설정되지 않은 경우, 다음 기본값이 사용됩니다:

- **개발 환경**: 자동으로 감지된 IP의 3000 포트
- **프로덕션 환경**: `https://api.storycraft.com/api`
- **타임아웃**: 10초
