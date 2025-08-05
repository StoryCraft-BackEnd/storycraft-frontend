/**
 * 공지사항 및 이벤트 API 모듈
 *
 * 공지사항과 이벤트 관련 API 통신을 담당하는 모듈입니다.
 * 공지사항 목록/상세 조회, 이벤트 목록/상세 조회 기능을 제공합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

import { apiClient } from './client';

// ===== 공지사항 관련 타입 정의 =====

export interface Notice {
  id: number;
  title: string;
  content: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
}

export interface NoticeListResponse {
  status: number;
  message: string;
  data: Notice[];
}

export interface NoticeDetailResponse {
  status: number;
  message: string;
  data: Notice;
}

// ===== 이벤트 관련 타입 정의 =====

export interface Event {
  id: number;
  title: string;
  summary: string;
  description?: string;
  eventPeriod: string;
  isOngoing: boolean;
  participantCount: string;
  reward?: string;
  createdAt?: string;
}

export interface EventListResponse {
  status: number;
  message: string;
  data: Event[];
}

export interface EventDetailResponse {
  status: number;
  message: string;
  data: Event;
}

// ===== 공지사항 API 함수들 =====

/**
 * 공지사항 목록 조회
 *
 * 활성화된 공지사항을 중요도 순으로 조회합니다.
 *
 * @returns Promise<NoticeListResponse> 공지사항 목록 응답
 */
export const getNotices = async (): Promise<NoticeListResponse> => {
  try {
    const response = await apiClient.get('/api/notices');
    return response.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 상세 조회
 *
 * 특정 공지사항의 상세 내용을 조회합니다.
 *
 * @param id 공지사항 ID
 * @returns Promise<NoticeDetailResponse> 공지사항 상세 응답
 */
export const getNoticeDetail = async (id: number): Promise<NoticeDetailResponse> => {
  try {
    const response = await apiClient.get(`/api/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 상세 조회 실패:', error);
    throw error;
  }
};

// ===== 이벤트 API 함수들 =====

/**
 * 진행중인 이벤트 목록 조회
 *
 * 현재 진행중인 이벤트 목록을 조회합니다.
 *
 * @returns Promise<EventListResponse> 진행중인 이벤트 목록 응답
 */
export const getOngoingEvents = async (): Promise<EventListResponse> => {
  try {
    const response = await apiClient.get('/api/events/ongoing');
    return response.data;
  } catch (error) {
    console.error('진행중인 이벤트 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 지난 이벤트 목록 조회
 *
 * 종료된 이벤트 목록을 조회합니다.
 *
 * @returns Promise<EventListResponse> 지난 이벤트 목록 응답
 */
export const getPastEvents = async (): Promise<EventListResponse> => {
  try {
    const response = await apiClient.get('/api/events/past');
    return response.data;
  } catch (error) {
    console.error('지난 이벤트 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 이벤트 상세 조회
 *
 * 특정 이벤트의 상세 내용을 조회합니다.
 *
 * @param id 이벤트 ID
 * @returns Promise<EventDetailResponse> 이벤트 상세 응답
 */
export const getEventDetail = async (id: number): Promise<EventDetailResponse> => {
  try {
    const response = await apiClient.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('이벤트 상세 조회 실패:', error);
    throw error;
  }
};
