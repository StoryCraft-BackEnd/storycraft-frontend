# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# StoryCraft Frontend

## 개발 환경 설정

### 필수 확장 프로그램

VS Code에서 다음 확장 프로그램을 설치해주세요:

- ESLint
- Prettier - Code formatter

### 설치 방법

1. 저장소 클론

```bash
git clone [repository-url]
cd storycraft-frontend
```

2. 의존성 설치

```bash
npm install
```

### 코드 스타일

이 프로젝트는 ESLint와 Prettier를 사용하여 코드 스타일을 관리합니다.

- 파일 저장 시 자동으로 코드가 포맷팅됩니다.
- ESLint 규칙에 따라 코드가 자동으로 수정됩니다.

### VS Code 설정

프로젝트의 `.vscode/settings.json` 파일이 자동으로 적용됩니다. 다음 설정이 포함되어 있습니다:

- 파일 저장 시 자동 포맷팅
- ESLint 자동 수정
- TypeScript/JavaScript 파일 검증
