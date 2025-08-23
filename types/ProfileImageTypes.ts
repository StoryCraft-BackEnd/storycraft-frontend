// 프로필 이미지 타입 정의
export interface ProfileImageOption {
  id: string;
  name: string;
  source: any; // require로 가져온 이미지
}

// 프로필 이미지 옵션들
export const PROFILE_IMAGE_OPTIONS: ProfileImageOption[] = [
  {
    id: 'default_profile',
    name: '기본 프로필',
    source: require('../assets/images/profile/default_profile.png'),
  },
  {
    id: 'anonymous',
    name: '익명',
    source: require('../assets/images/profile/anonymous.png'),
  },
  {
    id: 'artist',
    name: '아티스트',
    source: require('../assets/images/profile/artist.png'),
  },
  {
    id: 'artist2',
    name: '아티스트 2',
    source: require('../assets/images/profile/artist2.png'),
  },
  {
    id: 'clown',
    name: '광대',
    source: require('../assets/images/profile/clown.png'),
  },
  {
    id: 'hacker',
    name: '해커',
    source: require('../assets/images/profile/hacker.png'),
  },
  {
    id: 'host',
    name: '호스트',
    source: require('../assets/images/profile/host.png'),
  },
];

// 프로필 이미지 ID로 이미지 소스 찾기
export const getProfileImageById = (imageId: string) => {
  const option = PROFILE_IMAGE_OPTIONS.find((option) => option.id === imageId);
  return option ? option.source : PROFILE_IMAGE_OPTIONS[0].source; // 기본값
};
