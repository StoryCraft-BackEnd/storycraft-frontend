# StoryCraft API 사용 가이드

## 개요

StoryCraft 프로젝트의 API 요청을 관리하는 모듈입니다. 아이들 프로필 생성, 조회, 수정, 삭제 등의 기능을 제공합니다.

## 파일 구조

```
shared/api/
├── client.ts           # API 클라이언트 설정
├── childrenApi.ts      # 아이들 프로필 API 함수들
├── apiTest.ts          # API 테스트 함수들
└── README.md           # 이 파일
```

## 환경 설정

### 1. 서버 주소 설정

`shared/config/environment.ts` 파일에서 API 서버 주소를 설정하세요:

```typescript
const defaultConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://dev.childstorycraft.com', // API 서버 URL
    host: 'dev.childstorycraft.com', // API 서버 호스트
    port: 443, // API 서버 포트
    protocol: 'https', // HTTPS 프로토콜
    path: '', // API 기본 경로
    timeout: 10000, // 10초 타임아웃
  },
  app: {
    debugMode: true, // 디버그 모드 활성화
  },
};
```

### 2. 설정 사용

앱에서 환경 설정을 사용하려면:

```typescript
import { ENV_CONFIG } from '@/shared/config/environment';

console.log('API URL:', ENV_CONFIG.api.baseUrl);
console.log('Debug Mode:', ENV_CONFIG.app.debugMode);
```

## API 사용법

### 1. 기본 사용 예시

```typescript
import { createChild, getChildren, getChild } from '@/shared/api/childrenApi';

// 프로필 생성
const newChild = await createChild({
  name: '김철수',
  age: 7,
  learningLevel: '초급',
});
console.log('생성된 아이 ID:', newChild.data.childId);

// 프로필 목록 조회
const children = await getChildren();
console.log('전체 프로필:', children);

// 특정 프로필 조회
const child = await getChild(1);
console.log('프로필 정보:', child);
```

### 2. 에러 처리

```typescript
try {
  const result = await createChild({
    name: '김민수',
    age: 6,
    learningLevel: '초급',
  });
  console.log('성공:', result);
} catch (error) {
  console.error('실패:', error.message);
  // 에러 유형별 처리
  if (error.message.includes('서버 오류')) {
    // 서버 에러 처리
  } else if (error.message.includes('네트워크')) {
    // 네트워크 에러 처리
  }
}
```

## API 테스트

### 1. 빠른 테스트

```typescript
import { quickCreateTest } from '@/shared/api/apiTest';

// 간단한 프로필 생성 테스트
await quickCreateTest();
```

### 2. 전체 테스트 실행

```typescript
import { runAllApiTests } from '@/shared/api/apiTest';

// 모든 API 엔드포인트 테스트
await runAllApiTests();
```

### 3. 개별 테스트

```typescript
import {
  testServerConnection,
  testCreateChild,
  testGetChildren,
  testGetChild,
  testUpdateChild,
  testDeleteChild,
} from '@/shared/api/apiTest';

// 서버 연결 테스트
await testServerConnection();

// 프로필 생성 테스트
const createResult = await testCreateChild();
const childId = createResult.data.childId;

// 프로필 조회 테스트
await testGetChild(childId);

// 프로필 수정 테스트
await testUpdateChild(childId);

// 프로필 삭제 테스트
await testDeleteChild(childId);
```

## 실제 화면에서 사용하기

### React Native 컴포넌트에서 사용

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { createChild } from '@/shared/api/childrenApi';

const ProfileCreateScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    setLoading(true);

    try {
      const result = await createChild({
        name: "새로운 아이",
        age: 5,
        learningLevel: "초급"
      });

      Alert.alert("성공", `프로필이 생성되었습니다! ID: ${result.data.childId}`);
    } catch (error) {
      Alert.alert("오류", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button
        title={loading ? "생성 중..." : "프로필 생성"}
        onPress={handleCreateProfile}
        disabled={loading}
      />
    </View>
  );
};
```

## API 스펙

### POST /children

자녀 프로필 생성

**요청:**

```json
{
  "name": "string",
  "age": 1,
  "learningLevel": "초급"
}
```

**응답:**

```json
{
  "status": 200,
  "message": "요청 성공",
  "data": {
    "childId": 0
  }
}
```

### GET /children

자녀 프로필 목록 조회

**응답:**

```json
{
  "data": [
    {
      "childId": 1,
      "name": "김철수",
      "age": 7,
      "learningLevel": "초급",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### GET /children/{childId}

자녀 프로필 개별 조회

**매개변수:** childId (integer($int64)) - 필수

**응답:**

```json
{
  "data": {
    "childId": 1,
    "name": "김철수",
    "age": 7,
    "learningLevel": "초급",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### PUT /children/{childId}

자녀 프로필 수정

**매개변수:** childId (integer($int64)) - 필수

**요청:**

```json
{
  "name": "수정된 이름",
  "age": 8,
  "learningLevel": "중급"
}
```

### DELETE /children/{childId}

자녀 프로필 삭제

**매개변수:** childId (integer($int64)) - 필수

**응답:**

```json
{
  "status": 200,
  "message": "삭제 성공"
}
```

## 문제 해결

### 1. 서버 연결 실패

```
❌ 서버에 연결할 수 없습니다. 네트워크를 확인해주세요.
```

**해결 방법:**

- `shared/config/environment.ts` 파일의 `baseUrl` 주소 확인
- 서버가 실행 중인지 확인
- 네트워크 연결 상태 확인

### 2. 타임아웃 오류

```
❌ 서버 오류 (408): 요청 시간 초과
```

**해결 방법:**

- `shared/config/environment.ts` 파일의 `timeout` 값 증가
- 서버 응답 속도 확인

### 3. 401 인증 오류

```
❌ 서버 오류 (401): 인증이 필요합니다
```

**해결 방법:**

- 인증 토큰 확인
- 로그인 상태 확인

## 로그 확인

API 요청 시 콘솔에서 다음과 같은 로그를 확인할 수 있습니다:

```
🚀 프로필 생성 요청: { name: "김철수", age: 7, learningLevel: "초급" }
✅ 프로필 생성 성공: { status: 200, message: "요청 성공", data: { childId: 1 } }
```

## 추가 API 엔드포인트

더 많은 API 엔드포인트가 필요한 경우 `childrenApi.ts` 파일에 추가하고, 테스트 함수는 `apiTest.ts`에 추가하세요.
