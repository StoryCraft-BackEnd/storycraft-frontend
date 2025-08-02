import { Story, LearningStory, HighlightedWord } from './types';
import * as FileSystem from 'expo-file-system';

/**
 * 동화 내용에서 영어 단어들을 추출하고 강조 단어로 변환
 * 현재는 간단한 구현으로, 추후 AI 기반 단어 추출로 개선 예정
 */
export const extractHighlightedWords = (content: string): HighlightedWord[] => {
  // content가 없거나 빈 문자열인 경우 빈 배열 반환
  if (!content || typeof content !== 'string') {
    console.warn('동화 내용이 없거나 유효하지 않습니다:', content);
    return [];
  }

  // 영어 단어 패턴 (기본적인 영어 단어 추출)
  const englishWordPattern = /\b[a-zA-Z]{3,}\b/g;
  const words = content.match(englishWordPattern) || [];

  // 중복 제거 및 빈도순 정렬
  const uniqueWords = [...new Set(words)];

  // 임시로 하드코딩된 번역 데이터 (추후 AI 번역 API 연동 예정)
  const translationMap: { [key: string]: { korean: string; pronunciation: string } } = {
    Once: { korean: '한번', pronunciation: '[wʌns]' },
    upon: { korean: '위에', pronunciation: '[əˈpɒn]' },
    time: { korean: '시간', pronunciation: '[taɪm]' },
    land: { korean: '땅', pronunciation: '[lænd]' },
    full: { korean: '가득한', pronunciation: '[fʊl]' },
    wonder: { korean: '경이', pronunciation: '[ˈwʌndər]' },
    lived: { korean: '살았다', pronunciation: '[lɪvd]' },
    friendly: { korean: '친근한', pronunciation: '[ˈfrendli]' },
    dragon: { korean: '드래곤', pronunciation: '[ˈdræɡən]' },
    named: { korean: '이름의', pronunciation: '[neɪmd]' },
    Draco: { korean: '드라코', pronunciation: '[ˈdreɪkoʊ]' },
    loved: { korean: '좋아했다', pronunciation: '[lʌvd]' },
    flying: { korean: '날기', pronunciation: '[ˈflaɪɪŋ]' },
    over: { korean: '위에', pronunciation: '[ˈoʊvər]' },
    mountains: { korean: '산들', pronunciation: '[ˈmaʊntənz]' },
    dancing: { korean: '춤추기', pronunciation: '[ˈdænsɪŋ]' },
    clouds: { korean: '구름들', pronunciation: '[klaʊdz]' },
    brave: { korean: '용감한', pronunciation: '[breɪv]' },
    young: { korean: '젊은', pronunciation: '[jʌŋ]' },
    warrior: { korean: '전사', pronunciation: '[ˈwɔːriər]' },
    Lily: { korean: '릴리', pronunciation: '[ˈlɪli]' },
    wanted: { korean: '원했다', pronunciation: '[ˈwɒntɪd]' },
    adventure: { korean: '모험', pronunciation: '[ədˈventʃər]' },
    eagerly: { korean: '열망하여', pronunciation: '[ˈiːɡərli]' },
    offered: { korean: '제안했다', pronunciation: '[ˈɒfəd]' },
    help: { korean: '도움', pronunciation: '[help]' },
    together: { korean: '함께', pronunciation: '[təˈɡeðər]' },
    decided: { korean: '결정했다', pronunciation: '[dɪˈsaɪdɪd]' },
    search: { korean: '찾기', pronunciation: '[sɜːtʃ]' },
    legendary: { korean: '전설의', pronunciation: '[ˈledʒənderi]' },
    Golden: { korean: '황금의', pronunciation: '[ˈɡoʊldən]' },
    Tree: { korean: '나무', pronunciation: '[triː]' },
    journey: { korean: '여행', pronunciation: '[ˈdʒɜːni]' },
    surprises: { korean: '놀라움들', pronunciation: '[səˈpraɪzɪz]' },
    crossed: { korean: '건넜다', pronunciation: '[krɒst]' },
    sparkling: { korean: '반짝이는', pronunciation: '[ˈspɑːklɪŋ]' },
    rivers: { korean: '강들', pronunciation: '[ˈrɪvəz]' },
    climbed: { korean: '올랐다', pronunciation: '[klaɪmd]' },
    tallest: { korean: '가장 높은', pronunciation: '[ˈtɔːləst]' },
    hills: { korean: '언덕들', pronunciation: '[hɪlz]' },
    traveled: { korean: '여행했다', pronunciation: '[ˈtrævəld]' },
    met: { korean: '만났다', pronunciation: '[met]' },
    many: { korean: '많은', pronunciation: '[ˈmeni]' },
    animals: { korean: '동물들', pronunciation: '[ˈænɪməlz]' },
    joined: { korean: '참여했다', pronunciation: '[dʒɔɪnd]' },
  };

  // 상위 10개 단어만 선택 (가장 중요한 단어들)
  const topWords = uniqueWords.slice(0, 10);

  return topWords.map((word) => {
    const translation = translationMap[word] || {
      korean: word, // 번역이 없으면 원본 단어 사용
      pronunciation: `[${word.toLowerCase()}]`,
    };

    return {
      word,
      korean: translation.korean,
      pronunciation: translation.pronunciation,
    };
  });
};

/**
 * Story 데이터를 LearningStory로 변환
 */
export const convertStoryToLearningStory = (story: Story): LearningStory => {
  // story 객체 검증
  if (!story) {
    console.error('Story 객체가 없습니다.');
    throw new Error('Story 객체가 필요합니다.');
  }

  // 필수 필드 검증
  if (!story.content) {
    console.warn('동화 내용이 없습니다. storyId:', story.storyId);
  }

  const highlightedWords = extractHighlightedWords(story.content || '');

  return {
    storyId: story.storyId,
    title: story.title || '제목 없음',
    content: story.content || '내용이 없습니다.',
    contentKr: story.contentKr || '한국어 내용이 없습니다.',
    thumbnailUrl: story.thumbnailUrl, // 선택적 필드
    childId: story.childId,
    keywords: story.keywords || [],
    totalPages: 1, // 현재는 1페이지로 설정 (추후 페이지 분할 기능 구현)
    highlightedWords: highlightedWords,
  };
};

/**
 * 동화 내용을 문장 단위로 분할하여 페이지 배열로 변환
 * @param content 동화 내용
 * @param maxLinesPerPage 페이지당 최대 줄 수 (기본값: 2)
 * @returns 페이지 배열
 */
export function splitContentIntoPages(content: string, maxLinesPerPage: number = 2): string[] {
  if (!content) return [];

  // 문장 단위로 분할 (마침표, 느낌표, 물음표 기준)
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  const pages: string[] = [];
  let currentPage = '';
  let currentLineCount = 0;

  for (const sentence of sentences) {
    // 문장이 너무 길면 줄바꿈으로 분할
    const words = sentence.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;

      // 한 줄에 약 50자 정도로 제한 (대략적인 기준)
      if (testLine.length > 50 && currentLine) {
        if (currentPage) currentPage += '\n';
        currentPage += currentLine;
        currentLine = word;
        currentLineCount++;
      } else {
        currentLine = testLine;
      }
    }

    // 마지막 줄 추가
    if (currentLine) {
      if (currentPage) currentPage += '\n';
      currentPage += currentLine;
      currentLineCount++;
    }

    // 페이지당 최대 줄 수에 도달하면 새 페이지 시작
    if (currentLineCount >= maxLinesPerPage) {
      pages.push(currentPage.trim());
      currentPage = '';
      currentLineCount = 0;
    }
  }

  // 마지막 페이지가 남아있으면 추가
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  // 페이지가 없으면 전체 내용을 하나의 페이지로
  if (pages.length === 0) {
    pages.push(content);
  }

  return pages;
}

/**
 * 동화 내용을 학습용으로 변환 (페이지네이션 포함)
 * @param story 원본 동화 데이터
 * @returns 학습용 동화 데이터
 */
export function convertStoryToLearningStoryWithPages(
  story: Story
): LearningStory & { pages: string[] } {
  const pages = splitContentIntoPages(story.content || '', 2);

  return {
    storyId: story.storyId,
    title: story.title,
    content: story.content || '',
    contentKr: story.contentKr || '',
    thumbnailUrl: story.thumbnailUrl, // 선택적 필드
    childId: story.childId,
    keywords: story.keywords || [],
    totalPages: pages.length,
    highlightedWords: [], // 아직 단어 기능 없음
    pages: pages,
  };
}

/**
 * 삽화 이미지를 다운로드하고 로컬에 저장
 * @param imageUrl 삽화 이미지 URL
 * @param storyId 동화 ID (파일명 생성용)
 * @returns 로컬 파일 경로
 */
export async function downloadStoryIllustration(
  imageUrl: string,
  storyId: number
): Promise<string> {
  try {
    // 파일 시스템 경로 생성
    const fileName = `story_illustration_${storyId}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}illustrations/${fileName}`;

    // 디렉토리가 없으면 생성
    const dirUri = `${FileSystem.documentDirectory}illustrations/`;
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    }

    // 이미지 다운로드
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (downloadResult.status === 200) {
      console.log('삽화 다운로드 완료:', fileUri);
      return fileUri;
    } else {
      throw new Error(`다운로드 실패: ${downloadResult.status}`);
    }
  } catch (error) {
    console.error('삽화 다운로드 실패:', error);
    throw error;
  }
}

/**
 * 저장된 삽화 이미지 경로 가져오기
 * @param storyId 동화 ID
 * @returns 로컬 파일 경로 또는 null
 */
export async function getStoryIllustrationPath(storyId: number): Promise<string | null> {
  try {
    const fileName = `story_illustration_${storyId}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}illustrations/${fileName}`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      return fileUri;
    }
    return null;
  } catch (error) {
    console.error('삽화 경로 확인 실패:', error);
    return null;
  }
}
