/* 
    import 할때 타입 충돌 방지 위해 TypeScript 선언
*/
declare module '*.png' {
  const content: never;
  export default content;
}
