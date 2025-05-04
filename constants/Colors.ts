/**
 * 앱의 색상 상수 정의
 * 
 * 이 파일은 앱에서 사용되는 모든 색상을 정의합니다.
 * 라이트 모드와 다크 모드에 대한 색상 매핑을 포함하며,
 * 타입 안정성을 보장하기 위해 const assertion을 사용합니다.
 * 
 * @author StoryCraft Team
 * @version 1.0.0
 */

/**
 * 앱의 색상 매핑 객체
 * 
 * 각 색상은 다음과 같은 용도로 사용됩니다:
 * - text: 기본 텍스트 색상
 * - background: 배경 색상
 * - primary: 주요 액션 버튼, 강조 요소
 * - secondary: 보조 액션, 덜 강조된 요소
 * - error: 오류 메시지, 경고
 * - success: 성공 메시지, 확인
 * - warning: 경고 메시지
 * - info: 정보 메시지
 */
export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#0096FF',
    secondary: '#6B7280',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    primary: '#3B82F6',
    secondary: '#9CA3AF',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#2563EB',
  },
} as const;

/**
 * 색상 스키마 타입 (라이트/다크)
 */
export type ColorScheme = keyof typeof Colors;

/**
 * 색상 이름 타입 (text, background 등)
 */
export type ColorName = keyof typeof Colors.light; 