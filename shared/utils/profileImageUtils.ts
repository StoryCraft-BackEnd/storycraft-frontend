// 동물 캐릭터 이미지 관리 유틸리티

// 사용 가능한 동물 이미지 목록
export const ANIMAL_IMAGES = [
  'african_elephant9',
  'african_wild_dog',
  'axolotl',
  'black_footed_ferret',
  'black_rhino',
  'black_spider_monkey',
  'dugong',
  'galapagos_penguin',
  'giant_panda',
  'gorilla',
  'gray_wolf',
  'hippopotamus',
  'iguana',
  'jaguar',
  'javan_rhino',
  'macaw',
  'mountain_plover',
  'narwhal',
  'plains_bison',
  'pronghorn',
  'red_panda',
  'saola',
  'sea_lion',
  'sharke',
  'sloth',
  'snow_leopard',
  'tiger',
  'tree_kangaroo',
  'yangtze_porpoise',
] as const;

export type AnimalImageType = (typeof ANIMAL_IMAGES)[number];

// 이미 사용된 이미지들을 추적하는 Set
let usedImages = new Set<AnimalImageType>();

// 사용 가능한 이미지 목록을 가져오는 함수
export const getAvailableImages = (): AnimalImageType[] => {
  return ANIMAL_IMAGES.filter((image) => !usedImages.has(image));
};

// 랜덤으로 이미지를 선택하는 함수 (중복 방지)
export const getRandomAnimalImage = (): AnimalImageType => {
  const availableImages = getAvailableImages();

  if (availableImages.length === 0) {
    // 모든 이미지가 사용된 경우, 사용된 이미지 목록을 초기화
    usedImages.clear();
    console.log('모든 동물 이미지가 사용되었습니다. 이미지 목록을 초기화합니다.');
  }

  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];

  // 선택된 이미지를 사용된 이미지 목록에 추가
  usedImages.add(selectedImage);

  return selectedImage;
};

// 특정 이미지를 사용된 이미지 목록에 추가하는 함수
export const markImageAsUsed = (image: AnimalImageType): void => {
  usedImages.add(image);
};

// 사용된 이미지 목록을 초기화하는 함수
export const resetUsedImages = (): void => {
  usedImages.clear();
};

// 현재 사용된 이미지 개수를 반환하는 함수
export const getUsedImageCount = (): number => {
  return usedImages.size;
};

// 전체 이미지 개수를 반환하는 함수
export const getTotalImageCount = (): number => {
  return ANIMAL_IMAGES.length;
};
