import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Agreements {
  termsOfService: boolean;
  privacyPolicy: boolean;
  marketingConsent: boolean;
}

/**
 * 약관 동의 상태를 확인합니다.
 * @returns 약관 동의 여부
 */
export const checkTermsAgreement = async (): Promise<boolean> => {
  try {
    console.log('🔍 AsyncStorage에서 약관 동의 상태 확인 중...');
    const termsAgreed = await AsyncStorage.getItem('termsAgreed');
    console.log('📋 AsyncStorage에서 읽은 값:', termsAgreed);
    const result = termsAgreed === 'true';
    console.log('✅ 약관 동의 상태 결과:', result);
    return result;
  } catch (error) {
    console.error('❌ 약관 동의 상태 확인 중 오류:', error);
    return false;
  }
};

/**
 * 약관 동의 상태를 동기적으로 확인합니다 (캐시된 값 사용).
 * @returns 약관 동의 여부 (캐시된 값)
 */
let cachedTermsAgreement: boolean | null = null;

export const getCachedTermsAgreement = (): boolean | null => {
  return cachedTermsAgreement;
};

export const setCachedTermsAgreement = (value: boolean): void => {
  cachedTermsAgreement = value;
};

/**
 * 약관 동의 세부사항을 가져옵니다.
 * @returns 약관 동의 세부사항
 */
export const getAgreements = async (): Promise<Agreements | null> => {
  try {
    const agreementsString = await AsyncStorage.getItem('agreements');
    if (agreementsString) {
      return JSON.parse(agreementsString) as Agreements;
    }
    return null;
  } catch (error) {
    console.error('약관 동의 세부사항 가져오기 중 오류:', error);
    return null;
  }
};

/**
 * 약관 동의 상태를 저장합니다.
 * @param agreements 약관 동의 세부사항
 */
export const saveAgreements = async (agreements: Agreements): Promise<void> => {
  try {
    console.log('💾 AsyncStorage에 약관 동의 상태 저장 중...');
    console.log('📋 저장할 데이터:', { termsAgreed: 'true', agreements });

    await AsyncStorage.setItem('termsAgreed', 'true');
    await AsyncStorage.setItem('agreements', JSON.stringify(agreements));

    console.log('✅ 약관 동의 상태 저장 완료');
  } catch (error) {
    console.error('❌ 약관 동의 저장 중 오류:', error);
    throw error;
  }
};

/**
 * 약관 동의 상태를 초기화합니다.
 */
export const clearTermsAgreement = async (): Promise<void> => {
  try {
    console.log('🧹 약관 동의 상태 초기화 중...');

    await AsyncStorage.removeItem('termsAgreed');
    await AsyncStorage.removeItem('agreements');
    // 캐시도 초기화
    cachedTermsAgreement = null;

    console.log('✅ 약관 동의 상태 초기화 완료');
  } catch (error) {
    console.error('❌ 약관 동의 초기화 중 오류:', error);
    throw error;
  }
};

/**
 * 마케팅 동의 여부를 확인합니다.
 * @returns 마케팅 동의 여부
 */
export const checkMarketingConsent = async (): Promise<boolean> => {
  try {
    const agreements = await getAgreements();
    return agreements?.marketingConsent ?? false;
  } catch (error) {
    console.error('마케팅 동의 확인 중 오류:', error);
    return false;
  }
};
