import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILES_FILE = path.join(__dirname, 'profiles.json');

// 초기 프로필 데이터
const initialProfiles = [
  {
    child_id: 1,
    name: '홍철이',
    age: 10,
    learning_level: '초급',
    created_at: '2024-01-01T00:00:00',
  },
  {
    child_id: 2,
    name: '영희',
    age: 8,
    learning_level: '중급',
    created_at: '2024-01-02T00:00:00',
  },
  {
    child_id: 3,
    name: '민수',
    age: 12,
    learning_level: '고급',
    created_at: '2024-01-03T00:00:00',
  },
];

// 파일이 없으면 초기 데이터로 생성
if (!fs.existsSync(PROFILES_FILE)) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(initialProfiles, null, 2));
}

// 프로필 데이터 읽기
const readProfiles = () => {
  try {
    const data = fs.readFileSync(PROFILES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('프로필 데이터 읽기 실패:', error);
    return initialProfiles;
  }
};

// 프로필 데이터 쓰기
const writeProfiles = (profiles) => {
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
  } catch (error) {
    console.error('프로필 데이터 쓰기 실패:', error);
  }
};

// 현재 프로필 데이터
let profiles = readProfiles();

export { profiles, writeProfiles };
