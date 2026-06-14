import type { GanJi, HeavenlyStem, EarthlyBranch, Ohang } from './types';
import { STEMS, STEM_OHANG } from './constants';
import { getDayPillar, getYearPillar, getMonthPillar } from './manseryeok';

// ─────────────────────────────────────────────
// 인터페이스
// ─────────────────────────────────────────────

export interface DayInfo {
  stem: HeavenlyStem;
  ohang: Ohang;
  title: string;        // 오늘의 기운 제목 (한 줄)
  message: string;      // 오늘의 기운 메시지 (2~3문장, 실천형)
  colorHex: string;     // 대표 컬러 hex
  colorName: string;    // 컬러 이름 (2개)
  moodKeyword: string;  // 오늘의 분위기 키워드
  spaceAction: string;  // 오늘 할 수 있는 공간 행동 한 줄
}

export interface MonthTip {
  branch: EarthlyBranch;
  ohang: Ohang;
  headline: string;       // 월운 헤드라인
  seasonNote: string;     // 절기·계절 맥락
  spaceTip: string;       // 이번달 공간 팁 (3문장 내외)
  focusArea: string;      // 집중 관리 공간/방위
  spaceActions: string[]; // 이번달 실천 행동 3가지
}

// ─────────────────────────────────────────────
// 천간별 일진 정보 (10개)
// ─────────────────────────────────────────────

export const STEM_DAY_INFO: Record<HeavenlyStem, DayInfo> = {
  甲: {
    stem: '甲',
    ohang: '木',
    title: '기준을 세우고 밀어붙이는 날',
    message:
      '방향이 선명해지고 추진력이 살아나는 기운이에요. 오늘 하고 싶은 일 한 가지를 정해 바로 시작해보세요. 아침에 동쪽 창문을 열어 환기하면 기운이 더 잘 흐릅니다.',
    colorHex: '#2d7a2d',
    colorName: '짙은 초록·산록',
    moodKeyword: '추진·시작',
    spaceAction: '동쪽 창문 열어 환기 + 책상 위 정리',
  },
  乙: {
    stem: '乙',
    ohang: '木',
    title: '감각이 살아나는 부드러운 날',
    message:
      '관계와 분위기를 섬세하게 읽는 기운이 올라오는 날이에요. 화분을 돌보거나 공간의 질감을 부드럽게 정리하는 것만으로도 하루 리듬이 잡힙니다. 억지로 밀어붙이기보다 흐름을 따라가는 날이에요.',
    colorHex: '#7bc67e',
    colorName: '연초록·민트',
    moodKeyword: '조율·감각',
    spaceAction: '식물 물 주기 + 패브릭 소품 정돈',
  },
  丙: {
    stem: '丙',
    ohang: '火',
    title: '밝고 활발하게 드러나는 날',
    message:
      '표현력과 존재감이 자연스럽게 올라오는 날이에요. 밝은 공간에서 일하고, 창가 자리를 비워 햇빛을 충분히 들여보세요. 사람을 만나거나 무언가를 공유하기에도 좋은 기운입니다.',
    colorHex: '#e85d3f',
    colorName: '코랄레드·버밀리온',
    moodKeyword: '발산·활력',
    spaceAction: '남향 공간 조명 켜기 + 창가 자리 정돈',
  },
  丁: {
    stem: '丁',
    ohang: '火',
    title: '집중과 몰입이 깊어지는 날',
    message:
      '디테일과 감정의 온도를 잘 읽는 날이에요. 간접 조명 아래 한 가지 일에 오래 집중해보세요. 과한 자극보다 조용한 환경에서 힘이 잘 발휘되는 날입니다.',
    colorHex: '#d4703f',
    colorName: '웜오렌지·테라',
    moodKeyword: '집중·섬세',
    spaceAction: '간접 조명 켜기 + 소음 차단 (이어플러그·문 닫기)',
  },
  戊: {
    stem: '戊',
    ohang: '土',
    title: '묵직하게 버티고 쌓는 날',
    message:
      '급하게 움직이기보다 오늘 해야 할 것을 구조적으로 쌓아가는 날이에요. 책상을 정돈하고, 오래 해오던 루틴이 잘 돌아가고 있는지 점검해보세요. 안정이 힘이 되는 기운입니다.',
    colorHex: '#c4a24a',
    colorName: '황토·머스터드',
    moodKeyword: '안정·지속',
    spaceAction: '책상·작업 공간 정돈 + 오래된 루틴 점검',
  },
  己: {
    stem: '己',
    ohang: '土',
    title: '꼼꼼하게 돌보고 채우는 날',
    message:
      '눈에 잘 띄지 않는 부분을 챙기는 실무 기운이 강한 날이에요. 수납을 정리하거나 생활 동선의 불편한 부분을 하나 고쳐보세요. 작게 완성하는 것이 이 날의 최고 개운법입니다.',
    colorHex: '#d4a574',
    colorName: '카멜·베이지',
    moodKeyword: '돌봄·관리',
    spaceAction: '수납 서랍 하나 정리 + 생활 불편 포인트 하나 해결',
  },
  庚: {
    stem: '庚',
    ohang: '金',
    title: '선을 긋고 결단하는 날',
    message:
      '불필요한 것을 덜어내기 좋은 날이에요. 안 쓰는 물건을 처분하거나, 미뤄둔 결정을 하나 매듭지어보세요. 기준이 분명해질수록 공간도 사람도 관계도 시원해집니다.',
    colorHex: '#a0a0a0',
    colorName: '실버·쿨그레이',
    moodKeyword: '결단·정리',
    spaceAction: '안 쓰는 물건 처분 또는 정리함 하나 비우기',
  },
  辛: {
    stem: '辛',
    ohang: '金',
    title: '디테일이 살아나는 정제된 날',
    message:
      '미감과 정확성이 높아지는 날이에요. 공간의 작은 소품을 정돈하거나, 마음에 걸렸던 디테일을 완성해보세요. 표면이 깔끔해질수록 감각이 안정되는 기운입니다.',
    colorHex: '#e8e8e8',
    colorName: '크림화이트·아이보리',
    moodKeyword: '정제·미감',
    spaceAction: '선반·테이블 표면 닦기 + 작은 소품 하나 정돈',
  },
  壬: {
    stem: '壬',
    ohang: '水',
    title: '큰 흐름을 읽는 확장의 날',
    message:
      '생각의 규모가 커지고 시야가 넓어지는 기운이에요. 창가 자리를 비우고 환기하며 오늘은 세세한 것보다 큰 방향을 바라보세요. 이동하거나 새로운 정보를 접하기에도 좋은 날입니다.',
    colorHex: '#1a3a6e',
    colorName: '딥네이비·오션블루',
    moodKeyword: '확장·순환',
    spaceAction: '창가 공간 비우기 + 환기 (공기 순환)',
  },
  癸: {
    stem: '癸',
    ohang: '水',
    title: '내면을 채우는 조용한 날',
    message:
      '감각과 직관이 깊어지는 날이에요. 조용한 공간에서 무리하지 말고, 물 한 잔 마시며 하루 리듬을 가볍게 점검해보세요. 스스로를 쉬게 하는 것 자체가 이 날의 최고 개운법입니다.',
    colorHex: '#4a6fa5',
    colorName: '인디고·스틸블루',
    moodKeyword: '회복·직관',
    spaceAction: '북쪽 공간 비우기 + 물 마시기 루틴',
  },
};

// ─────────────────────────────────────────────
// 지지별 월운 공간 팁 (12개)
// ─────────────────────────────────────────────

const BRANCH_OHANG: Record<EarthlyBranch, Ohang> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
};

export const BRANCH_MONTH_TIP: Record<EarthlyBranch, MonthTip> = {
  子: {
    branch: '子',
    ohang: '水',
    headline: '子月 · 水 기운 · 깊어지는 겨울',
    seasonNote: '소설(小雪)부터 동지(冬至) 전후 · 11월 하순 ~ 12월 중순',
    spaceTip:
      '수분감과 차분한 기운이 강해지는 달이에요. 북쪽 공간을 정돈하고 침실 습도를 올려 건조함을 막아보세요. 소음을 차단하고 조명을 낮게 유지하는 것이 이달의 핵심 공간 관리입니다.',
    focusArea: '북쪽 · 침실',
    spaceActions: [
      '북쪽 공간 비우고 정돈하기',
      '침실 가습기 또는 물 소품 배치',
      '간접 조명으로 조도 낮추기',
    ],
  },
  丑: {
    branch: '丑',
    ohang: '土',
    headline: '丑月 · 土 기운 · 힘을 비축하는 겨울',
    seasonNote: '동지(冬至)부터 소한(小寒) 전후 · 12월 하순 ~ 1월 중순',
    spaceTip:
      '힘을 안으로 모아두는 시기예요. 연말에 쌓인 물건을 정리하고 공간을 비워 새해를 맞을 준비를 해보세요. 무게감 있는 수납 가구 한 점이 이달 공간에 잘 어울리고, 낮은 채도의 베이지 패브릭으로 안정감을 더하는 것이 좋습니다.',
    focusArea: '수납 · 중앙 공간',
    spaceActions: [
      '연말 안 쓰는 물건 정리 및 처분',
      '낮은 채도 패브릭(베이지·카멜)으로 교체',
      '수납 구조 재점검 및 박스 정리',
    ],
  },
  寅: {
    branch: '寅',
    ohang: '木',
    headline: '寅月 · 木 기운 · 기세가 시작되는 달',
    seasonNote: '대한(大寒)부터 우수(雨水) 전후 · 1월 하순 ~ 2월 중순',
    spaceTip:
      '새 출발을 돕는 기운이 강하게 올라오는 달이에요. 동쪽 공간을 열고 식물을 하나 들여보세요. 책상과 작업 공간을 정리하면 이달의 시작 기운을 더 잘 받을 수 있습니다. 서랍 속 오래된 것을 덜어내는 것도 이달 초에 하기 좋은 공간 루틴이에요.',
    focusArea: '동쪽 · 서재',
    spaceActions: [
      '동쪽 창가 비우고 빛 들이기',
      '초록 식물(아레카야자·스킨답서스) 하나 들이기',
      '책상·작업 공간 재정비',
    ],
  },
  卯: {
    branch: '卯',
    ohang: '木',
    headline: '卯月 · 木 기운 · 부드럽게 열리는 봄',
    seasonNote: '경칩(驚蟄)부터 청명(淸明) 전후 · 2월 하순 ~ 3월 중순',
    spaceTip:
      '관계와 생활의 결이 부드러워지는 달이에요. 딱딱한 소품보다 패브릭, 화분처럼 부드러운 질감을 하나 더해보세요. 산책 동선을 확보하고 생활권을 가볍게 점검하는 것도 이달의 좋은 공간 루틴입니다.',
    focusArea: '거실 · 창가',
    spaceActions: [
      '부드러운 패브릭 쿠션·러그 추가',
      '봄꽃 또는 잎식물 화분 배치',
      '생활 동선(산책 루트) 점검',
    ],
  },
  辰: {
    branch: '辰',
    ohang: '土',
    headline: '辰月 · 土 기운 · 전환과 확장의 달',
    seasonNote: '청명(淸明)부터 입하(立夏) 전후 · 3월 하순 ~ 4월 중순',
    spaceTip:
      '봄과 여름 사이 에너지가 크게 바뀌는 달이에요. 거실 중심을 재정비하고 오래된 소품을 하나 교체해보세요. 동남쪽 공간을 특히 비우면 이달의 확장 기운이 잘 흐르고, 수납 구조를 새로 잡는 타이밍으로도 좋습니다.',
    focusArea: '동남쪽 · 거실',
    spaceActions: [
      '거실 소품 하나 교체 또는 재배치',
      '동남 방향 공간 비우기',
      '수납 박스·선반 구조 새로 잡기',
    ],
  },
  巳: {
    branch: '巳',
    ohang: '火',
    headline: '巳月 · 火 기운 · 감각이 깨어나는 달',
    seasonNote: '입하(立夏)부터 하지(夏至) 전후 · 4월 하순 ~ 5월 중순',
    spaceTip:
      '집중력과 감각이 예리해지는 달이에요. 남향 공간을 활성화하고 집중용 작업 공간을 분리해보세요. 간접광을 활용해 과한 열기를 차단하는 것이 이달의 공간 포인트이며, 정리된 선반이 집중력 유지에 도움이 됩니다.',
    focusArea: '남쪽 · 서재',
    spaceActions: [
      '서재·작업 공간 독립적으로 분리',
      '남향 채광 공간 활성화',
      '직접광을 간접 조명으로 전환',
    ],
  },
  午: {
    branch: '午',
    ohang: '火',
    headline: '午月 · 火 기운 · 열기가 가득한 달',
    seasonNote: '망종(芒種)부터 대서(大暑) 전후 · 5월 하순 ~ 6월 중순',
    spaceTip:
      '표현력과 활력이 최고조에 달하는 달이에요. 채광이 강해지는 만큼 열기 조절이 핵심입니다. 밝은 공간에 식물을 배치해 열기를 분산하고, 환기 루틴을 아침·저녁 두 번으로 늘려보세요. 붉은 계열 포인트 소품이 이달 공간 에너지를 올려줍니다.',
    focusArea: '남쪽 · 창가',
    spaceActions: [
      '아침·저녁 이중 환기 루틴 만들기',
      '채광 강한 공간에 식물 배치',
      '붉은·코랄 포인트 소품 하나 더하기',
    ],
  },
  未: {
    branch: '未',
    ohang: '土',
    headline: '未月 · 土 기운 · 생활을 다듬는 달',
    seasonNote: '소서(小暑)부터 입추(立秋) 전후 · 6월 하순 ~ 7월 중순',
    spaceTip:
      '여름의 생활 감각을 정돈하는 달이에요. 서남쪽 공간을 정리하고 침실 패브릭을 여름용으로 교체해보세요. 온기 소품은 수납하고 가볍고 서늘한 소재로 전환하는 것이 이달의 개운법입니다. 오래된 패브릭이나 카펫을 세탁하기에도 좋은 시기예요.',
    focusArea: '서남쪽 · 침실',
    spaceActions: [
      '침실 패브릭 여름용 린넨·면으로 교체',
      '서남 공간 정리 및 에어컨 주변 정돈',
      '겨울 온기 소품 수납 처리',
    ],
  },
  申: {
    branch: '申',
    ohang: '金',
    headline: '申月 · 金 기운 · 가을을 준비하는 달',
    seasonNote: '입추(立秋)부터 백로(白露) 전후 · 7월 하순 ~ 8월 중순',
    spaceTip:
      '이동과 정리의 기운이 강해지는 달이에요. 가벼운 가구 재배치와 서쪽 작업 공간 효율화가 이달의 핵심입니다. 필요 없는 물건을 빠르게 처분하면 가을 기운이 잘 흐르고, 현관 동선을 가볍게 정리하는 것도 이달에 잘 맞는 루틴이에요.',
    focusArea: '서쪽 · 현관',
    spaceActions: [
      '서쪽 작업 공간 효율 재배치',
      '불필요한 가구·소품 처분',
      '현관 동선 가볍게 비우기',
    ],
  },
  酉: {
    branch: '酉',
    ohang: '金',
    headline: '酉月 · 金 기운 · 완성과 정제의 달',
    seasonNote: '백로(白露)부터 한로(寒露) 전후 · 8월 하순 ~ 9월 중순',
    spaceTip:
      '마감과 완성도를 높이는 달이에요. 미뤄둔 수납 정리를 마무리하고 화이트·메탈 소품으로 공간의 단정함을 살려보세요. 서쪽 채광 공간을 깨끗하게 유지하는 것이 이달의 포인트이며, 작은 것을 완성하는 데서 가장 큰 만족이 옵니다.',
    focusArea: '서쪽 · 수납',
    spaceActions: [
      '미뤄둔 수납 서랍 마무리 정리',
      '화이트·메탈 소품으로 단정함 강화',
      '서쪽 창가 및 채광 공간 청소',
    ],
  },
  戌: {
    branch: '戌',
    ohang: '土',
    headline: '戌月 · 土 기운 · 경계를 지키는 달',
    seasonNote: '한로(寒露)부터 소설(小雪) 전후 · 9월 하순 ~ 10월 중순',
    spaceTip:
      '내부와 외부를 분명히 나누는 기운이 강한 달이에요. 현관 정리로 기운 차단막을 만들고, 침실처럼 쉬는 공간을 더 분명하게 구분해보세요. 서북쪽 공간을 점검하고 창고나 다용도실을 정리하기에도 좋은 달입니다.',
    focusArea: '현관 · 서북쪽',
    spaceActions: [
      '현관 신발장 비우고 정돈',
      '침실 프라이버시 강화 (커튼·파티션)',
      '서북 공간·창고 점검 및 정리',
    ],
  },
  亥: {
    branch: '亥',
    ohang: '水',
    headline: '亥月 · 水 기운 · 깊이 스미는 달',
    seasonNote: '입동(立冬)부터 대설(大雪) 전후 · 10월 하순 ~ 11월 중순',
    spaceTip:
      '감정과 직관이 깊어지는 달이에요. 북쪽 환기를 신경 쓰고, 독서나 혼자 있는 시간을 위한 코너를 하나 만들어보세요. 수변이나 숲 근처 산책을 생활 루틴에 넣으면 이달 기운을 잘 받을 수 있습니다. 조용한 공간에서 회복 감각을 키워가는 달이에요.',
    focusArea: '북쪽 · 독서 코너',
    spaceActions: [
      '북쪽 환기 루틴 추가 (아침·밤)',
      '독서·혼자 있는 공간 코너 만들기',
      '수변·숲 산책 생활 루틴화',
    ],
  },
};

// ─────────────────────────────────────────────
// 유틸 함수
// ─────────────────────────────────────────────

export function getTodayGanji(): GanJi {
  const now = new Date();
  return getDayPillar(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function getMonthGanji(year?: number, month?: number): GanJi {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  const yearPillar = getYearPillar(y);
  const yearStemIdx = STEMS.indexOf(yearPillar.stem);
  return getMonthPillar(yearStemIdx, m);
}

export function getDayInfo(stem: HeavenlyStem): DayInfo {
  return STEM_DAY_INFO[stem];
}

export function getMonthTip(branch: EarthlyBranch): MonthTip {
  return BRANCH_MONTH_TIP[branch];
}

export function getTodayOhang(): Ohang {
  const ganJi = getTodayGanji();
  return STEM_OHANG[ganJi.stem];
}

export function getMonthOhang(year?: number, month?: number): Ohang {
  const ganJi = getMonthGanji(year, month);
  return STEM_OHANG[ganJi.stem];
}

// 오늘 날짜 문자열 (localStorage key 용도)
export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
