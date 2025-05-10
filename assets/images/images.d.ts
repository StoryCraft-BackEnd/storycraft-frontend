//이미지 타입 선언 파일

declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}
