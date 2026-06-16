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

const TWELVE_SINSAL: Array<{
  name: string;
  hanja: string;
  branches: EarthlyBranch[];
  description: string;
  spaceTag: string;
  homeReading: string;
}> = [
  {
    name: '겁살',
    hanja: '劫殺',
    branches: ['亥', '巳', '寅', '申'],
    description: '갑작스러운 변화와 외부 변수에 민감한 기운. 공간에서는 안전감과 경계 정리가 중요합니다.',
    spaceTag: '현관·창문 잠금 점검, 위험 동선 정리',
    homeReading: '겁살은 외부 변수와 예기치 않은 변화에 민감한 기운으로 봅니다. 주거 공간에서는 현관, 창문, 계단, 날카로운 모서리처럼 갑작스러운 불편을 만들 수 있는 지점을 먼저 정리하는 것이 좋아요. 불안감을 키우기보다 안전한 동선을 확보하고, 자주 쓰는 물건의 위치를 고정해 생활의 예측 가능성을 높이는 방식이 잘 맞습니다.',
  },
  {
    name: '재살',
    hanja: '災殺',
    branches: ['子', '午', '卯', '酉'],
    description: '생활 리듬의 막힘과 자잘한 피로를 의식해야 하는 기운. 관리되지 않은 공간에서 스트레스가 커지기 쉽습니다.',
    spaceTag: '고장난 물건 수리, 배수·전기 점검',
    homeReading: '재살은 큰 사건을 단정하기보다 작은 불편이 쌓이는 흐름으로 해석하는 편이 안전합니다. 집 안에서는 고장난 조명, 막힌 배수구, 삐걱거리는 문처럼 사소하지만 반복해서 신경 쓰이는 부분을 먼저 고쳐보세요. 공간의 잔고장을 줄이면 생활 피로가 줄고, 마음도 덜 예민해지는 방향으로 정리됩니다.',
  },
  {
    name: '천살',
    hanja: '天殺',
    branches: ['丑', '未', '辰', '戌'],
    description: '큰 환경과 분위기의 영향을 크게 받는 기운. 채광, 날씨, 층고, 조망 같은 조건을 세심하게 봐야 합니다.',
    spaceTag: '채광·환기·층고 확인, 하늘이 보이는 자리',
    homeReading: '천살은 개인의 노력보다 주변 환경의 압력을 크게 느끼는 기운으로 봅니다. 주거 선택에서는 채광, 환기, 조망, 층고처럼 공간 전체의 분위기를 만드는 조건이 중요해요. 답답하고 눌린 느낌의 집보다 하늘이 보이고 공기가 흐르는 집에서 생활 리듬이 안정되기 쉽습니다.',
  },
  {
    name: '지살',
    hanja: '地殺',
    branches: ['寅', '申', '巳', '亥'],
    description: '터와 생활권의 영향을 강하게 받는 기운. 주변 지형과 출퇴근 동선이 삶의 질에 직접 연결됩니다.',
    spaceTag: '생활권 답사, 지형·도로 동선 확인',
    homeReading: '지살은 땅의 조건, 생활권의 결, 실제 이동 동선을 중요하게 보는 기운입니다. 지도로만 보기보다 직접 걸어보고, 밤낮의 분위기와 도로 소음, 경사, 상권의 밀도를 확인하는 편이 좋아요. 이 기운이 잡히면 집 자체만큼 주변 환경을 함께 보는 것이 명당 선택의 핵심입니다.',
  },
  {
    name: '도화살',
    hanja: '桃花殺',
    branches: ['卯', '酉', '午', '子'],
    description: '공간 감각과 인테리어 안목이 뛰어난 기운. 주거 환경 변화에 민감하게 반응하며, 이사 후 새 공간이 삶의 질에 큰 영향을 줍니다.',
    spaceTag: '동·남쪽 창가 정리, 거울·꽃 배치',
    homeReading: '도화살이 있으면 이사 후 인테리어 변화가 개운의 핵심이 됩니다. 매력적인 채광과 동선이 예쁜 집을 고르는 안목이 뛰어나며, 주거 환경이 달라질 때 삶 전체의 기운이 함께 바뀌는 경향이 강합니다. 이사를 고려한다면 창가가 밝고 공간 감각이 살아 있는 집을 우선으로 보세요. 집을 예쁘게 꾸미는 것 자체가 도화살의 기운을 길하게 전환하는 방법입니다.',
  },
  {
    name: '월살',
    hanja: '月殺',
    branches: ['辰', '戌', '未', '丑'],
    description: '감정과 수면 리듬이 공간 분위기의 영향을 받는 기운. 밤 시간대의 안정감이 중요합니다.',
    spaceTag: '침실 조도 낮추기, 밤 소음 차단',
    homeReading: '월살은 밤의 리듬, 감정의 파동, 수면 환경과 연결해 볼 수 있습니다. 침실 조도가 너무 밝거나 밤 소음이 큰 공간에서는 피로가 오래 남을 수 있어요. 커튼, 조명, 침구, 침대 주변 정리를 통해 하루 끝에 마음이 가라앉는 구조를 만들어주는 것이 좋습니다.',
  },
  {
    name: '망신살',
    hanja: '亡身殺',
    branches: ['巳', '亥', '申', '寅'],
    description: '노출과 말실수, 이미지 관리에 민감한 기운. 사적 공간과 공개 공간의 구분이 필요합니다.',
    spaceTag: '현관·거실 정돈, 사생활 보호',
    homeReading: '망신살은 나의 모습이 밖으로 드러나는 방식과 관련해 볼 수 있습니다. 집 안에서는 현관과 거실처럼 외부인이 처음 보는 공간을 단정하게 유지하고, 침실이나 개인 물건은 시야에서 분리하는 편이 좋아요. 정돈된 첫인상과 사생활 보호가 이 기운을 부드럽게 다루는 방법입니다.',
  },
  {
    name: '장성살',
    hanja: '將星殺',
    branches: ['午', '子', '酉', '卯'],
    description: '중심을 잡고 주도권을 세우는 기운. 일하는 자리와 대표 공간을 분명히 두면 장점이 살아납니다.',
    spaceTag: '책상 위치 고정, 거실 중심 정리',
    homeReading: '장성살은 리더십과 중심성의 기운으로 읽습니다. 집 안에서는 책상, 식탁, 거실 중심처럼 내가 주도적으로 사용하는 자리가 흔들리지 않는 것이 중요해요. 등 뒤가 안정되고 시야가 열리는 자리에 작업 공간을 두면 집중과 판단의 힘을 살리기 좋습니다.',
  },
  {
    name: '반안살',
    hanja: '攀鞍殺',
    branches: ['未', '丑', '戌', '辰'],
    description: '위치 상승과 안정된 기반을 상징하는 기운. 침대 머리 방향과 오래 머무는 자리 배치에 활용하기 좋습니다.',
    spaceTag: '침대 머리 방향 점검, 안정된 벽면 확보',
    homeReading: '반안살은 안정된 자리에 올라타는 의미로, 명당자리에서는 침대 머리 방향과 주요 좌석 배치에 중요하게 활용합니다. 침대 머리맡은 비워두되 벽의 안정감은 확보하고, 자주 앉는 자리는 문과 창의 흐름을 무리 없이 볼 수 있게 두는 편이 좋아요. 쉬는 자리가 안정되면 생활의 중심도 함께 잡힙니다.',
  },
  {
    name: '역마살',
    hanja: '驛馬殺',
    branches: ['申', '寅', '亥', '巳'],
    description: '이동과 변화가 삶의 기본 흐름인 기운. 한 곳에 오래 정착하기보다 흐름에 따라 움직이는 삶의 패턴입니다.',
    spaceTag: '현관 동선 비우기, 이동 준비 공간 정리',
    homeReading: '역마살은 이사·이동과 가장 직접적으로 연결되는 신살입니다. 이사를 자주 하거나 직장·환경 변화로 이동이 잦은 경우가 많아요. 억지로 정착하려 할 때 오히려 막히고, 흐름에 맞게 이동할 때 기운이 살아납니다. 전세·월세로 유연하게 이동하는 것이 이 기운의 자연스러운 패턴이며, 이사 자체가 개운이 되는 경우가 많습니다. 현관 동선을 항상 비워두는 것이 역마살 기운을 길하게 활용하는 핵심 풍수입니다.',
  },
  {
    name: '육해살',
    hanja: '六害殺',
    branches: ['酉', '卯', '子', '午'],
    description: '작은 마찰과 생활 스트레스가 누적되기 쉬운 기운. 반복 동선과 관계 공간을 부드럽게 정리해야 합니다.',
    spaceTag: '문 여닫힘, 통로 폭, 가족 공용 공간 점검',
    homeReading: '육해살은 아주 큰 문제보다 반복되는 작은 마찰에 주목하는 기운입니다. 문이 부딪히는 동선, 좁은 통로, 가족이 자주 마주치는 공용 공간처럼 사소한 불편을 줄이면 생활 스트레스도 줄어듭니다. 부드러운 패브릭과 충분한 수납으로 충돌감을 낮추는 방식이 잘 맞습니다.',
  },
  {
    name: '화개살',
    hanja: '華蓋殺',
    branches: ['戌', '辰', '丑', '未'],
    description: '예술적 기질과 독립 성향을 가진 기운. 혼자만의 공간에서 에너지를 회복하고 창조력이 살아납니다.',
    spaceTag: '독립 작업 공간 확보, 서재·창가 자리',
    homeReading: '화개살이 있으면 혼자만의 독립 공간이 반드시 필요합니다. 공유 주거나 분리되지 않은 원룸보다 독립적인 방 구조의 집이 훨씬 잘 맞고, 조용한 골목이나 외진 입지가 길한 경우가 많습니다. 이사 결정 시에는 독립성과 프라이버시를 최우선으로 보세요. 소음이 없고 혼자 집중할 수 있는 환경의 집에서 이 사주의 기운이 가장 잘 피어납니다. 서재나 독립 작업 공간이 있는 집이 화개살의 이상적인 주거입니다.',
  },
];

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

const TAEGEUK_GUIIN: Record<HeavenlyStem, EarthlyBranch[]> = {
  甲: ['子', '午'], 乙: ['子', '午'],
  丙: ['卯', '酉'], 丁: ['卯', '酉'],
  戊: ['辰', '戌', '丑', '未'], 己: ['辰', '戌', '丑', '未'],
  庚: ['寅', '亥'], 辛: ['寅', '亥'],
  壬: ['巳', '申'], 癸: ['巳', '申'],
};

const HAKDANG_GUIIN: Record<HeavenlyStem, EarthlyBranch> = {
  甲: '亥', 乙: '午', 丙: '寅', 丁: '酉', 戊: '寅',
  己: '酉', 庚: '巳', 辛: '子', 壬: '申', 癸: '卯',
};

const AMROK: Record<HeavenlyStem, EarthlyBranch> = {
  甲: '亥', 乙: '戌', 丙: '申', 丁: '未', 戊: '申',
  己: '未', 庚: '巳', 辛: '辰', 壬: '寅', 癸: '丑',
};

const GEUMYEO: Record<HeavenlyStem, EarthlyBranch> = {
  甲: '辰', 乙: '巳', 丙: '未', 丁: '申', 戊: '未',
  己: '申', 庚: '戌', 辛: '亥', 壬: '丑', 癸: '寅',
};

const CHEONJU_GUIIN: Record<HeavenlyStem, EarthlyBranch> = {
  甲: '未', 乙: '辰', 丙: '巳', 丁: '酉', 戊: '戌',
  己: '卯', 庚: '亥', 辛: '申', 壬: '寅', 癸: '午',
};

const WOLDEOK_GUIIN: Partial<Record<number, HeavenlyStem>> = {
  0: '丙',
  1: '壬',
  2: '庚',
  3: '甲',
};

const CHEONDEOK_GUIIN: Record<EarthlyBranch, { stem?: HeavenlyStem; branch?: EarthlyBranch }> = {
  寅: { stem: '丁' },
  卯: { branch: '申' },
  辰: { stem: '壬' },
  巳: { stem: '辛' },
  午: { branch: '亥' },
  未: { stem: '甲' },
  申: { stem: '癸' },
  酉: { branch: '寅' },
  戌: { stem: '丙' },
  亥: { stem: '乙' },
  子: { branch: '巳' },
  丑: { stem: '庚' },
};

const BOKSEONG_GUIIN: Partial<Record<HeavenlyStem, EarthlyBranch[]>> = {
  甲: ['寅', '子'],
  丙: ['寅', '子'],
  乙: ['卯', '丑'],
  癸: ['卯', '丑'],
  戊: ['申'],
  己: ['未'],
  丁: ['亥'],
  庚: ['午'],
  辛: ['巳'],
  壬: ['辰'],
};

function getAllBranches(pillars: FourPillars): EarthlyBranch[] {
  const bs: EarthlyBranch[] = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  if (pillars.hour) bs.push(pillars.hour.branch);
  return bs;
}

function getAllStems(pillars: FourPillars): HeavenlyStem[] {
  const ss: HeavenlyStem[] = [pillars.year.stem, pillars.month.stem, pillars.day.stem];
  if (pillars.hour) ss.push(pillars.hour.stem);
  return ss;
}

function hasBranch(branches: EarthlyBranch[], target: EarthlyBranch | undefined): boolean {
  return Boolean(target && branches.includes(target));
}

function pushResult(result: SinsalResult[], item: SinsalResult): void {
  if (!result.some(existing => existing.name === item.name)) {
    result.push(item);
  }
}

export function calcSinsal(pillars: FourPillars): SinsalResult[] {
  const result: SinsalResult[] = [];
  const branches = getAllBranches(pillars);
  const stems = getAllStems(pillars);
  const yearGroup = samhabGroup(pillars.year.branch);
  const dayStem = pillars.day.stem;

  if (yearGroup >= 0) {
    for (const sinsal of TWELVE_SINSAL) {
      if (branches.includes(sinsal.branches[yearGroup])) {
        const { branches: _branches, ...sinsalContent } = sinsal;
        pushResult(result, {
          ...sinsalContent,
          category: 'sal',
          activePillar: '년지 기준 12신살',
        });
      }
    }
  }

  const guiinBranches = CHEONUL_GUIIN[dayStem] ?? [];
  if (guiinBranches.some(b => branches.includes(b))) {
    pushResult(result, {
      name: '천을귀인', hanja: '天乙貴人', category: 'guiin', activePillar: '일간 기준',
      description: '귀인의 도움이 자연스럽게 찾아오는 기운. 중요한 시점에 좋은 인연과 연결됩니다.',
      spaceTag: '길방 방위 강화, 황금·베이지 귀인 소품',
      homeReading: '천을귀인이 있으면 이사나 집을 구할 때 귀인의 도움이 들어오는 경향이 있습니다. 좋은 집을 소개받거나, 예상치 못한 조건의 좋은 매물을 만나는 경우가 많아요. 주택 계약 시 혼자 결정하기보다 신뢰할 수 있는 사람과 함께 움직이는 것이 유리합니다. 이사 타이밍을 놓쳤다는 생각이 들 때 오히려 더 좋은 인연이 등장하는 경우가 많으니, 서두르지 않는 것이 이 신살을 활용하는 방식입니다.',
    });
  }

  const munchangBranch = MUNCHANG_GUIIN[dayStem];
  if (branches.includes(munchangBranch)) {
    pushResult(result, {
      name: '문창귀인', hanja: '文昌貴人', category: 'guiin', activePillar: '일간 기준',
      description: '학문과 지혜의 기운이 돋보이는 귀인. 지식과 정보 수집에서 강점이 나타납니다.',
      spaceTag: '북동쪽 서재·책상 배치, 밝은 주광색 조명',
      homeReading: '문창귀인이 있으면 공부방·서재가 있는 집이 특히 잘 맞습니다. 학군이 좋거나 도서관·카페 등 지식 환경이 갖춰진 생활권이 길한 입지입니다. 이사 결정 시에는 주변 교육·문화 인프라를 우선 체크하세요. 집 안에서는 북동쪽 방향에 책상이나 서재를 두는 것이 문창귀인의 기운을 가장 잘 활용하는 배치입니다. 이사 전 정보 수집과 비교 분석을 충분히 하면 좋은 결과가 나오는 편입니다.',
    });
  }

  if ((TAEGEUK_GUIIN[dayStem] ?? []).some(b => branches.includes(b))) {
    pushResult(result, {
      name: '태극귀인', hanja: '太極貴人', category: 'guiin', activePillar: '일간 기준',
      description: '큰 흐름 속에서 균형과 회복점을 찾는 길성. 공간에서는 중심을 잃지 않는 배치가 중요합니다.',
      spaceTag: '집 중심부 정돈, 거실·식탁 균형감',
      homeReading: '태극귀인은 복잡한 상황에서도 중심을 회복하는 힘으로 봅니다. 집 안에서는 거실 중앙, 식탁, 가족이 모이는 자리처럼 생활의 중심이 되는 공간을 어지럽히지 않는 것이 좋아요. 중심 공간이 정돈되면 하루의 흐름도 안정적으로 잡히기 쉽습니다.',
    });
  }

  if (hasBranch(branches, HAKDANG_GUIIN[dayStem])) {
    pushResult(result, {
      name: '학당귀인', hanja: '學堂貴人', category: 'guiin', activePillar: '일간 기준',
      description: '배움과 자격, 훈련의 기운이 살아나는 길성. 꾸준히 공부할 수 있는 자리가 필요합니다.',
      spaceTag: '책상 고정, 공부 루틴 공간',
      homeReading: '학당귀인은 배움의 루틴과 연결되는 길성입니다. 집 안에 작더라도 공부하거나 기록하는 자리를 고정해두면 좋아요. 조용한 책상, 눈높이에 맞는 조명, 정돈된 책장이 이 기운을 현실적으로 살리는 방법입니다.',
    });
  }

  if (hasBranch(branches, AMROK[dayStem])) {
    pushResult(result, {
      name: '암록', hanja: '暗祿', category: 'guiin', activePillar: '일간 기준',
      description: '겉으로 크게 드러나지 않는 도움과 저장된 자원을 뜻하는 길성. 보이지 않는 수납과 기반 관리가 중요합니다.',
      spaceTag: '수납장·문서·비상금 자리 정리',
      homeReading: '암록은 숨어 있는 자원과 조용한 도움을 상징합니다. 집 안에서는 서랍, 문서함, 수납장, 비상용 물건처럼 보이지 않는 기반을 정리해두는 것이 좋아요. 드러나는 장식보다 필요할 때 꺼내 쓸 수 있는 준비성이 이 기운과 잘 맞습니다.',
    });
  }

  if (hasBranch(branches, GEUMYEO[dayStem])) {
    pushResult(result, {
      name: '금여', hanja: '金輿', category: 'guiin', activePillar: '일간 기준',
      description: '품위와 생활의 질을 높이는 길성. 이동 수단, 의자, 침구처럼 몸을 받치는 물건을 잘 고르면 좋습니다.',
      spaceTag: '의자·침구·이동 가방 관리',
      homeReading: '금여는 생활의 품위와 편안함을 높이는 길성으로 봅니다. 비싼 물건보다 몸을 직접 받쳐주는 의자, 침대, 신발, 가방의 질을 챙기는 것이 좋아요. 오래 머무는 자리의 편안함을 높이면 생활 만족도가 자연스럽게 올라갑니다.',
    });
  }

  if (hasBranch(branches, CHEONJU_GUIIN[dayStem])) {
    pushResult(result, {
      name: '천주귀인', hanja: '天廚貴人', category: 'guiin', activePillar: '일간 기준',
      description: '먹고 사는 안정감과 돌봄의 기운을 뜻하는 길성. 주방과 식탁의 상태가 중요합니다.',
      spaceTag: '주방 정돈, 식탁 위 비우기',
      homeReading: '천주귀인은 음식, 돌봄, 생활의 안정감과 연결해 볼 수 있습니다. 주방과 식탁이 깨끗하면 기운이 편안하게 흐르고, 먹는 리듬도 안정되기 쉬워요. 냉장고 정리와 식탁 위 비우기처럼 생활감 있는 관리가 가장 잘 맞습니다.',
    });
  }

  const monthGroup = samhabGroup(pillars.month.branch);
  const woldeokStem = WOLDEOK_GUIIN[monthGroup];
  if (woldeokStem && stems.includes(woldeokStem)) {
    pushResult(result, {
      name: '월덕귀인', hanja: '月德貴人', category: 'guiin', activePillar: '월지 기준',
      description: '월의 덕을 받아 관계와 생활 흐름이 부드러워지는 길성. 매달 반복되는 루틴을 잘 만들면 좋습니다.',
      spaceTag: '월간 루틴 보드, 침실·거실 정기 정돈',
      homeReading: '월덕귀인은 매달 반복되는 생활 루틴 속에서 도움을 받는 기운으로 볼 수 있습니다. 달력, 일정표, 정기 정리 루틴을 눈에 보이게 두면 좋아요. 한 달에 한 번 침구와 수납을 정돈하는 식의 반복 관리가 이 길성을 현실적으로 살립니다.',
    });
  }

  const cheondeok = CHEONDEOK_GUIIN[pillars.month.branch];
  if ((cheondeok.stem && stems.includes(cheondeok.stem)) || (cheondeok.branch && branches.includes(cheondeok.branch))) {
    pushResult(result, {
      name: '천덕귀인', hanja: '天德貴人', category: 'guiin', activePillar: '월지 기준',
      description: '큰 무리 없이 보호받는 흐름을 뜻하는 길성. 집 안에서는 위험 요소를 줄이고 밝은 기운을 유지하는 것이 좋습니다.',
      spaceTag: '조명·안전·밝은 통로 관리',
      homeReading: '천덕귀인은 과한 긴장을 덜고 보호감을 만드는 길성으로 봅니다. 집 안 통로를 밝게 유지하고, 미끄러운 곳이나 어두운 코너를 줄이면 좋아요. 밝고 안전한 동선은 이 기운을 일상에서 체감하기 쉬운 방식입니다.',
    });
  }

  if ((BOKSEONG_GUIIN[dayStem] ?? []).some(b => branches.includes(b))) {
    pushResult(result, {
      name: '복성귀인', hanja: '福星貴人', category: 'guiin', activePillar: '일간 기준',
      description: '작은 복과 생활 만족을 쌓는 길성. 과시보다 나에게 맞는 편안함을 고르는 것이 중요합니다.',
      spaceTag: '휴식 코너, 작은 만족 소품',
      homeReading: '복성귀인은 거창한 행운보다 일상 속 작은 만족과 연결해 볼 수 있습니다. 좋아하는 컵, 편한 조명, 쉬는 의자처럼 매일 기분을 조금 좋게 만드는 물건을 챙겨보세요. 작지만 반복되는 만족이 생활의 안정감을 키워줍니다.',
    });
  }

  return result;
}
