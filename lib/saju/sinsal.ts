import type { FourPillars, HeavenlyStem, EarthlyBranch } from './types';

export interface SinsalResult {
  name: string;
  hanja: string;
  category: 'sal' | 'guiin';
  activePillar: string;
  description: string;
  spaceTag: string;
}

// 삼합 그룹: 0=寅午戌, 1=申子辰, 2=巳酉丑, 3=亥卯未
function samhabGroup(branch: EarthlyBranch): number {
  const groups: EarthlyBranch[][] = [
    ['寅', '午', '戌'],
    ['申', '子', '辰'],
    ['巳', '酉', '丑'],
    ['亥', '卯', '未'],
  ];
  return groups.findIndex(g => g.includes(branch));
}

const DOHWA_BRANCH: EarthlyBranch[] = ['卯', '酉', '午', '子'];
const YEOKMA_BRANCH: EarthlyBranch[] = ['申', '寅', '亥', '巳'];
const HWAGAE_BRANCH: EarthlyBranch[] = ['戌', '辰', '丑', '未'];

const CHEONUL_GUIIN: Record<HeavenlyStem, EarthlyBranch[]> = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
  乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
  辛: ['午', '寅'],
};

const MUNCHANG_GUIIN: Record<HeavenlyStem, EarthlyBranch> = {
  甲: '巳', 乙: '午', 丙: '申', 丁: '酉',
  戊: '申', 己: '酉', 庚: '亥', 辛: '子',
  壬: '寅', 癸: '卯',
};

function getAllBranches(pillars: FourPillars): EarthlyBranch[] {
  const bs: EarthlyBranch[] = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  if (pillars.hour) bs.push(pillars.hour.branch);
  return bs;
}

export function calcSinsal(pillars: FourPillars): SinsalResult[] {
  const result: SinsalResult[] = [];
  const branches = getAllBranches(pillars);
  const yearGroup = samhabGroup(pillars.year.branch);
  const dayStem = pillars.day.stem;

  if (yearGroup >= 0 && branches.includes(DOHWA_BRANCH[yearGroup])) {
    result.push({
      name: '도화살', hanja: '桃花殺', category: 'sal', activePillar: '년지 기준',
      description: '매력과 감수성이 드러나는 기운. 인간관계와 환경에 민감하게 반응합니다.',
      spaceTag: '동·남쪽 창가 정리, 거울·꽃 배치',
    });
  }

  if (yearGroup >= 0 && branches.includes(YEOKMA_BRANCH[yearGroup])) {
    result.push({
      name: '역마살', hanja: '驛馬殺', category: 'sal', activePillar: '년지 기준',
      description: '이동과 변화가 많은 기운. 정착보다 흐름이 중요한 삶의 패턴입니다.',
      spaceTag: '현관 동선 비우기, 이동 준비 공간 정리',
    });
  }

  if (yearGroup >= 0 && branches.includes(HWAGAE_BRANCH[yearGroup])) {
    result.push({
      name: '화개살', hanja: '華蓋殺', category: 'sal', activePillar: '년지 기준',
      description: '예술·학문적 기질과 독립적 성향. 혼자만의 시간으로 에너지를 회복합니다.',
      spaceTag: '독립 작업 공간 확보, 서재·창가 자리',
    });
  }

  const guiinBranches = CHEONUL_GUIIN[dayStem] ?? [];
  if (guiinBranches.some(b => branches.includes(b))) {
    result.push({
      name: '천을귀인', hanja: '天乙貴人', category: 'guiin', activePillar: '일간 기준',
      description: '귀인의 도움을 받기 쉬운 기운. 중요한 시점에 좋은 인연이 등장합니다.',
      spaceTag: '길방 방위 강화, 황금·베이지 귀인 소품',
    });
  }

  const munchangBranch = MUNCHANG_GUIIN[dayStem];
  if (branches.includes(munchangBranch)) {
    result.push({
      name: '문창귀인', hanja: '文昌貴人', category: 'guiin', activePillar: '일간 기준',
      description: '학문과 지혜의 기운. 공부·글쓰기·창작에서 두각을 나타냅니다.',
      spaceTag: '북동쪽 서재·책상 배치, 밝은 주광색 조명',
    });
  }

  return result;
}
