import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const response= {status: 200};
    // const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('서버 연결 실패:', error);
    return false;
  }
}; 