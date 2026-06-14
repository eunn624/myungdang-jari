import type { FourPillars, HeavenlyStem, EarthlyBranch } from './types';

export interface SinsalResult {
  name: string;
  hanja: string;
  category: 'sal' | 'guiin';
  activePillar: string;
  description: string;
  spaceTag: string;
  homeReading: string;
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
      description: '공간 감각과 인테리어 안목이 뛰어난 기운. 주거 환경 변화에 민감하게 반응하며, 이사 후 새 공간이 삶의 질에 큰 영향을 줍니다.',
      spaceTag: '동·남쪽 창가 정리, 거울·꽃 배치',
      homeReading: '도화살이 있으면 이사 후 인테리어 변화가 개운의 핵심이 됩니다. 매력적인 채광과 동선이 예쁜 집을 고르는 안목이 뛰어나며, 주거 환경이 달라질 때 삶 전체의 기운이 함께 바뀌는 경향이 강합니다. 이사를 고려한다면 창가가 밝고 공간 감각이 살아 있는 집을 우선으로 보세요. 집을 예쁘게 꾸미는 것 자체가 도화살의 기운을 길하게 전환하는 방법입니다.',
    });
  }

  if (yearGroup >= 0 && branches.includes(YEOKMA_BRANCH[yearGroup])) {
    result.push({
      name: '역마살', hanja: '驛馬殺', category: 'sal', activePillar: '년지 기준',
      description: '이동과 변화가 삶의 기본 흐름인 기운. 한 곳에 오래 정착하기보다 흐름에 따라 움직이는 삶의 패턴입니다.',
      spaceTag: '현관 동선 비우기, 이동 준비 공간 정리',
      homeReading: '역마살은 이사·이동과 가장 직접적으로 연결되는 신살입니다. 이사를 자주 하거나 직장·환경 변화로 이동이 잦은 경우가 많아요. 억지로 정착하려 할 때 오히려 막히고, 흐름에 맞게 이동할 때 기운이 살아납니다. 전세·월세로 유연하게 이동하는 것이 이 기운의 자연스러운 패턴이며, 이사 자체가 개운이 되는 경우가 많습니다. 현관 동선을 항상 비워두는 것이 역마살 기운을 길하게 활용하는 핵심 풍수입니다.',
    });
  }

  if (yearGroup >= 0 && branches.includes(HWAGAE_BRANCH[yearGroup])) {
    result.push({
      name: '화개살', hanja: '華蓋殺', category: 'sal', activePillar: '년지 기준',
      description: '예술적 기질과 독립 성향을 가진 기운. 혼자만의 공간에서 에너지를 회복하고 창조력이 살아납니다.',
      spaceTag: '독립 작업 공간 확보, 서재·창가 자리',
      homeReading: '화개살이 있으면 혼자만의 독립 공간이 반드시 필요합니다. 공유 주거나 분리되지 않은 원룸보다 독립적인 방 구조의 집이 훨씬 잘 맞고, 조용한 골목이나 외진 입지가 길한 경우가 많습니다. 이사 결정 시에는 독립성과 프라이버시를 최우선으로 보세요. 소음이 없고 혼자 집중할 수 있는 환경의 집에서 이 사주의 기운이 가장 잘 피어납니다. 서재나 독립 작업 공간이 있는 집이 화개살의 이상적인 주거입니다.',
    });
  }

  const guiinBranches = CHEONUL_GUIIN[dayStem] ?? [];
  if (guiinBranches.some(b => branches.includes(b))) {
    result.push({
      name: '천을귀인', hanja: '天乙貴人', category: 'guiin', activePillar: '일간 기준',
      description: '귀인의 도움이 자연스럽게 찾아오는 기운. 중요한 시점에 좋은 인연과 연결됩니다.',
      spaceTag: '길방 방위 강화, 황금·베이지 귀인 소품',
      homeReading: '천을귀인이 있으면 이사나 집을 구할 때 귀인의 도움이 들어오는 경향이 있습니다. 좋은 집을 소개받거나, 예상치 못한 조건의 좋은 매물을 만나는 경우가 많아요. 주택 계약 시 혼자 결정하기보다 신뢰할 수 있는 사람과 함께 움직이는 것이 유리합니다. 이사 타이밍을 놓쳤다는 생각이 들 때 오히려 더 좋은 인연이 등장하는 경우가 많으니, 서두르지 않는 것이 이 신살을 활용하는 방식입니다.',
    });
  }

  const munchangBranch = MUNCHANG_GUIIN[dayStem];
  if (branches.includes(munchangBranch)) {
    result.push({
      name: '문창귀인', hanja: '文昌貴人', category: 'guiin', activePillar: '일간 기준',
      description: '학문과 지혜의 기운이 돋보이는 귀인. 지식과 정보 수집에서 강점이 나타납니다.',
      spaceTag: '북동쪽 서재·책상 배치, 밝은 주광색 조명',
      homeReading: '문창귀인이 있으면 공부방·서재가 있는 집이 특히 잘 맞습니다. 학군이 좋거나 도서관·카페 등 지식 환경이 갖춰진 생활권이 길한 입지입니다. 이사 결정 시에는 주변 교육·문화 인프라를 우선 체크하세요. 집 안에서는 북동쪽 방향에 책상이나 서재를 두는 것이 문창귀인의 기운을 가장 잘 활용하는 배치입니다. 이사 전 정보 수집과 비교 분석을 충분히 하면 좋은 결과가 나오는 편입니다.',
    });
  }

  return result;
}
