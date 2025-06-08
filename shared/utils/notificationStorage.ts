import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_ENABLED_KEY = 'pushEnabled';

export const savePushEnabled = async (enabled: boolean) => {
  await AsyncStorage.setItem(PUSH_ENABLED_KEY, JSON.stringify(enabled));
};

export const loadPushEnabled = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(PUSH_ENABLED_KEY);
  return value ? JSON.parse(value) : false;
};
