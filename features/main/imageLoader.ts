import { ImageSourcePropType } from 'react-native';

// 동물 캐릭터 이미지들
import african_elephant9 from '@/assets/images/character/animal/african_elephant9.png';
import african_wild_dog from '@/assets/images/character/animal/african_wild_dog.png';
import axolotl from '@/assets/images/character/animal/axolotl.png';
import black_footed_ferret from '@/assets/images/character/animal/black_footed_ferret.png';
import black_rhino from '@/assets/images/character/animal/black_rhino.png';
import black_spider_monkey from '@/assets/images/character/animal/black_spider_monkey.png';
import dugong from '@/assets/images/character/animal/dugong.png';
import galapagos_penguin from '@/assets/images/character/animal/galapagos_penguin.png';
import giant_panda from '@/assets/images/character/animal/giant_panda.png';
import gorilla from '@/assets/images/character/animal/gorilla.png';
import gray_wolf from '@/assets/images/character/animal/gray_wolf.png';
import hippopotamus from '@/assets/images/character/animal/hippopotamus.png';
import iguana from '@/assets/images/character/animal/iguana.png';
import jaguar from '@/assets/images/character/animal/jaguar.png';
import javan_rhino from '@/assets/images/character/animal/javan_rhino.png';
import macaw from '@/assets/images/character/animal/macaw.png';
import mountain_plover from '@/assets/images/character/animal/mountain_plover.png';
import narwhal from '@/assets/images/character/animal/narwhal.png';
import plains_bison from '@/assets/images/character/animal/plains_bison.png';
import pronghorn from '@/assets/images/character/animal/pronghorn.png';
import red_panda from '@/assets/images/character/animal/red_panda.png';
import saola from '@/assets/images/character/animal/saola.png';
import sea_lion from '@/assets/images/character/animal/sea_lion.png';
import sharke from '@/assets/images/character/animal/sharke.png';
import sloth from '@/assets/images/character/animal/sloth.png';
import snow_leopard from '@/assets/images/character/animal/snow_leopard.png';
import tiger from '@/assets/images/character/animal/tiger.png';
import tree_kangaroo from '@/assets/images/character/animal/tree_kangaroo.png';
import yangtze_porpoise from '@/assets/images/character/animal/yangtze_porpoise.png';

// 기본 프로필 이미지
import default_profile from '@/assets/images/profile/default_profile.png';

// 이미지 매핑 객체
const imageMap: { [key: string]: ImageSourcePropType } = {
  // 동물 캐릭터 이미지들
  african_elephant9,
  african_wild_dog,
  axolotl,
  black_footed_ferret,
  black_rhino,
  black_spider_monkey,
  dugong,
  galapagos_penguin,
  giant_panda,
  gorilla,
  gray_wolf,
  hippopotamus,
  iguana,
  jaguar,
  javan_rhino,
  macaw,
  mountain_plover,
  narwhal,
  plains_bison,
  pronghorn,
  red_panda,
  saola,
  sea_lion,
  sharke,
  sloth,
  snow_leopard,
  tiger,
  tree_kangaroo,
  yangtze_porpoise,
  
  // 기본 프로필 이미지
  default_profile,
};

// 이미지 로더 함수
export const loadImage = (imageName: string): ImageSourcePropType => {
  return imageMap[imageName] || default_profile; // 기본 프로필 이미지 반환
};
