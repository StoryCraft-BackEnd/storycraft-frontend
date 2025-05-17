import { ImageSourcePropType } from 'react-native';
import story1 from '@/assets/images/illustrations/storycraft_cover_1.png';
import story2 from '@/assets/images/illustrations/storycraft_cover_2.png';
import story3 from '@/assets/images/illustrations/storycraft_cover_3.png';
import story4 from '@/assets/images/illustrations/storycraft_cover_4.png';
import story5 from '@/assets/images/illustrations/storycraft_cover_5.png';
import story6 from '@/assets/images/illustrations/storycraft_cover_6.png';
import story7 from '@/assets/images/illustrations/storycraft_cover_7.png';
import story8 from '@/assets/images/illustrations/storycraft_cover_8.png';

// 이미지 매핑 객체
const imageMap: { [key: string]: ImageSourcePropType } = {
  storycraft_cover_1: story1,
  storycraft_cover_2: story2,
  storycraft_cover_3: story3,
  storycraft_cover_4: story4,
  storycraft_cover_5: story5,
  storycraft_cover_6: story6,
  storycraft_cover_7: story7,
  storycraft_cover_8: story8,
};

// 이미지 로더 함수
export const loadImage = (imageName: string): ImageSourcePropType => {
  return imageMap[imageName] || imageMap['storycraft_cover_1']; // 기본 이미지 반환
};

// 스토리 타입 정의
export interface Story {
  id: number;
  title: string;
  imageName: string;
  // 추가 필드들...
  description?: string;
  author?: string;
  createdAt?: string;
}

// 스토리 데이터 변환 함수
export const transformStoryData = (serverData: any[]): Story[] => {
  return serverData.map((item, index) => ({
    id: item.id || index + 1,
    title: item.title || `동화 ${index + 1}`,
    imageName: item.imageName || `storycraft_cover_${(index % 8) + 1}`,
    description: item.description,
    author: item.author,
    createdAt: item.createdAt,
  }));
};
