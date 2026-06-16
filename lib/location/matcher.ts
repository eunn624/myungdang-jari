import type { Ohang, Direction } from '../saju/types';
import type { District, MatchResult, MatchOptions, Terrain } from './types';
import districtsData from '../../data/districts.json';
import descData from '../../data/neighborhood-desc.json';
import {
  TERRAIN_LABELS,
  districtHasTerrain,
  getTerrainPreferenceByOhang,
} from './terrain';

const ALL_DISTRICTS: District[] = (districtsData as any).districts;
const DESCRIPTIONS: Record<string, { keywords: string[] }> = (descData as any)
  .descriptions;

export function getTerrainPreference(yongsin: Ohang): Terrain {
  return getTerrainPreferenceByOhang(yongsin);
}

// 용신별 길방(吉方) — 오행 기반 길한 방위
// 土는 중앙 의미하므로 특정 방위로 매핑하지 않음
const YONGSIN_DIRECTION: Record<Ohang, Direction | null> = {
  木: '동',
  火: '남',
  土: null,  // 중앙은 모든 방위에 동등
  金: '서',
  水: '북',
};

// 8방위 정규화 (중앙 제외)
const EIGHT_DIRECTIONS: Direction[] = ['북', '동북', '동', '동남', '남', '서남', '서', '서북'];

// 인접 방위 (45도 이내)
const ADJACENT_DIRECTIONS: Record<string, string[]> = {
  '북': ['동북', '서북'],
  '동북': ['북', '동'],
  '동': ['동북', '동남'],
  '동남': ['동', '남'],
  '남': ['동남', '서남'],
  '서남': ['남', '서'],
  '서': ['서남', '서북'],
  '서북': ['서', '북'],
};

const VIBE_LABEL_KO: Record<string, string> = {
  lively:   '활기찬 상권',
  balanced: '균형잡힌 동네',
  quiet:    '조용한 주거',
};

interface ScoreOptions {
  deficitOhang: Ohang[];
  yongsin?: Ohang;
  dominantOhang?: Ohang;
  terrainPreference?: Terrain;
  vibePref?: 'lively' | 'balanced' | 'quiet';
  sinsal?: string[];
  guiin?: string[];
  gilbang?: Direction;
}

interface ScoreBreakdown {
  direction: number;      // A. 방위
  ohang: number;          // B. 오행/용신
  sinsal_guiin: number;   // C. 신살/귀인
  terrain: number;        // D. 지형
  vibe: number;           // E. 분위기
  total: number;
}

export function scoreDistrict(
  district: District,
  options: ScoreOptions,
): { score: number; breakdown: ScoreBreakdown; reasons: string[] } {
  const breakdown: ScoreBreakdown = {
    direction: 0,
    ohang: 0,
    sinsal_guiin: 0,
    terrain: 0,
    vibe: 0,
    total: 0,
  };
  const reasons: string[] = [];

  const {
    deficitOhang,
    yongsin,
    dominantOhang,
    terrainPreference,
    vibePref,
    sinsal = [],
    guiin = [],
    gilbang,
  } = options;

  // ──────────────────────────────────────────────
  // A. 방위 (20점)
  // ──────────────────────────────────────────────
  if (gilbang && district.direction) {
    if (district.direction === gilbang) {
      breakdown.direction = 13;
      reasons.push(`길방(${gilbang}) 방위 완전 일치`);
    } else if (ADJACENT_DIRECTIONS[gilbang]?.includes(district.direction)) {
      breakdown.direction = 7;
      reasons.push(`길방(${gilbang}) 인접 방위 (${district.direction})`);
    } else if (isOppositeDirection(gilbang, district.direction)) {
      breakdown.direction = -5;
      reasons.push(`길방(${gilbang}) 반대 방위 패널티`);
    }
  }

  // ──────────────────────────────────────────────
  // B. 오행/용신 (25점)
  // ──────────────────────────────────────────────

  // 용신 직접 매칭
  if (yongsin && district.ohang.includes(yongsin)) {
    breakdown.ohang += 15;
    reasons.push(`용신(${yongsin}) 직접 매칭`);
  }

  // 부족 오행 순위별 (중복 제외)
  const importantOhang = Array.from(
    new Set([...(yongsin ? [yongsin] : []), ...deficitOhang])
  );
  const weights = [8, 4, 2] as const;
  for (let i = 0; i < Math.min(deficitOhang.length, 3); i++) {
    const ohang = deficitOhang[i];
    if (ohang === yongsin) continue;
    if (district.ohang.includes(ohang)) {
      breakdown.ohang += weights[i];
      reasons.push(`부족 오행 ${i + 1}순위(${ohang}) 보완`);
    }
  }

  // 복수 오행 매칭 보너스
  const matchCount = district.ohang.filter(o => importantOhang.includes(o))
    .length;
  if (matchCount >= 2) {
    breakdown.ohang += 3;
    reasons.push(`복수 오행 매칭 (${district.ohang.join('·')})`);
  }

  // 과다 오행 패널티 (단일 오행이며 dominant와 동일)
  if (
    dominantOhang &&
    district.ohang.length === 1 &&
    district.ohang[0] === dominantOhang
  ) {
    breakdown.ohang -= 7;
    reasons.push(`과다 오행(${dominantOhang}) 강화 지역 패널티`);
  }

  // ──────────────────────────────────────────────
  // C. 신살·귀인 (20점)
  // ──────────────────────────────────────────────

  // 도화살 → lively
  if (sinsal.includes('도화살') && district.vibe === 'lively') {
    breakdown.sinsal_guiin += 8;
    reasons.push('도화살 → 활기찬 채광 상권');
  }

  // 화개살 → quiet
  if (sinsal.includes('화개살') && district.vibe === 'quiet') {
    breakdown.sinsal_guiin += 8;
    reasons.push('화개살 → 조용한 독립 주거');
  }

  // 역마살 → 교통 활발 또는 평지
  if (sinsal.includes('역마살')) {
    if ((district.vibeScore ?? 50) >= 55) {
      breakdown.sinsal_guiin += 7;
      reasons.push('역마살 → 교통·동선 활발');
    } else if (district.terrain === 'flatland') {
      breakdown.sinsal_guiin += 4;
      reasons.push('역마살 → 평지 이동 동선');
    }
  }

  // 천을귀인 → balanced
  if (guiin.includes('천을귀인') && district.vibe === 'balanced') {
    breakdown.sinsal_guiin += 6;
    reasons.push('천을귀인 → 귀인 만남 생활권');
  }

  // 문창귀인 → 학군 지역 (강남·서초·양천·노원·성남·수원·용인)
  if (guiin.includes('문창귀인')) {
    const educationDistricts = new Set([
      '강남구', '서초구', '양천구', '노원구',
      '성남시', '수원시', '용인시',
    ]);
    if (educationDistricts.has(district.siGunGu)) {
      breakdown.sinsal_guiin += 6;
      reasons.push('문창귀인 → 학군·문화 인프라');
    }
  }

  // ──────────────────────────────────────────────
  // D. 지형 (20점)
  // ──────────────────────────────────────────────
  if (terrainPreference && districtHasTerrain(district, terrainPreference)) {
    if (district.terrain === terrainPreference) {
      breakdown.terrain = 20;
      reasons.push(`${TERRAIN_LABELS[terrainPreference]} 지형 완전 일치`);
    } else {
      breakdown.terrain = 10;
      reasons.push(`${TERRAIN_LABELS[terrainPreference]} 지형 태그 포함`);
    }
  }

  // ──────────────────────────────────────────────
  // E. 분위기 (15점)
  // ──────────────────────────────────────────────
  if (vibePref && district.vibe) {
    if (district.vibe === vibePref) {
      breakdown.vibe = 15;
      reasons.push(`${VIBE_LABEL_KO[vibePref]} 성향 일치`);
    } else if (vibePref === 'balanced') {
      breakdown.vibe = 4;
    }
  }

  // 한자 확정 신뢰도 (+3점)
  const hanja_bonus = district.hanjaStatus === 'confirmed' ? 3 : 0;

  // 동네 특성 키워드 매칭 (+최대 5점, 보너스)
  let neighborhood_bonus = 0;
  const districtDesc = DESCRIPTIONS[district.siGunGu];
  if (districtDesc?.keywords) {
    // 신살·귀인 특성과 동네 키워드 매칭
    const signalKeywords: string[] = [];
    if (sinsal.includes('도화살')) signalKeywords.push('상권', '거리');
    if (sinsal.includes('역마살')) signalKeywords.push('교통', '거리', '상권');
    if (sinsal.includes('화개살')) signalKeywords.push('주거', '자연');
    if (guiin.includes('천을귀인')) signalKeywords.push('주거', '균형');
    if (guiin.includes('문창귀인')) signalKeywords.push('학문', '교육', '문화');

    const matchCount = signalKeywords.filter(k =>
      districtDesc.keywords.some(dk => dk.includes(k) || k.includes(dk))
    ).length;
    neighborhood_bonus = Math.min(matchCount, 5);
    if (matchCount > 0) {
      reasons.push(`동네 특성 매칭 (+${neighborhood_bonus}점)`);
    }
  }

  // 총점 계산
  breakdown.total =
    breakdown.direction +
    breakdown.ohang +
    breakdown.sinsal_guiin +
    breakdown.terrain +
    breakdown.vibe +
    hanja_bonus +
    neighborhood_bonus;

  return { score: breakdown.total, breakdown, reasons };
}

function isOppositeDirection(dir1: string, dir2: string): boolean {
  const opposites: [string, string][] = [
    ['북', '남'],
    ['동북', '서남'],
    ['동', '서'],
    ['동남', '서북'],
  ];
  return opposites.some(
    ([a, b]) => (dir1 === a && dir2 === b) || (dir1 === b && dir2 === a)
  );
}

/**
 * adminLevel 기반 자동 결정
 * 서울 → emd, 경기 → sgg, 광역시 → sgg, 기타 → all
 */
function getDefaultAdminLevel(siDo: string): 'emd' | 'sgg' | 'si' | 'gun' | 'all' {
  if (siDo === '서울') return 'emd';
  if (siDo === '경기') return 'sgg';
  if (['부산', '대구', '인천', '광주', '대전', '울산'].includes(siDo)) return 'sgg';
  return 'all';  // 강원, 전남, 전북, 경남, 경북, 제주: 모두 추천
}

/**
 * adminLevel 필터 적용
 */
function matchesAdminLevel(district: District, targetLevel: 'emd' | 'sgg' | 'si' | 'gun' | 'all'): boolean {
  if (targetLevel === 'all') return true;
  const districtLevel = district.adminLevel ?? 'emd';
  return districtLevel === targetLevel;
}

export function matchDistricts(options: MatchOptions): MatchResult[] {
  const {
    deficitOhang,
    yongsin,
    dominantOhang,
    siDo,
    topN = 10,
    vibePref,
    sinsal = [],
    guiin = [],
    gilbang,
    adminLevel: explicitAdminLevel,
  } = options;
  const terrainPreference = options.terrainPreference
    ?? (deficitOhang[0] ? getTerrainPreferenceByOhang(deficitOhang[0]) : undefined);
  const siDoList = Array.isArray(siDo) ? siDo : siDo ? [siDo] : undefined;

  // adminLevel 결정: 명시적 지정 > siDo 기반 자동
  let adminLevel: 'emd' | 'sgg' | 'si' | 'gun' | 'all' = 'all';
  if (explicitAdminLevel) {
    adminLevel = explicitAdminLevel;
  } else if (siDoList && siDoList.length === 1) {
    adminLevel = getDefaultAdminLevel(siDoList[0]);
  }

  const scoreOptions: ScoreOptions = {
    deficitOhang,
    yongsin,
    dominantOhang,
    terrainPreference,
    vibePref,
    sinsal,
    guiin,
    gilbang,
  };

  // 필터링: 오행·지형·분위기·방위·행정단위 중 하나라도 매칭 가능한 동네
  const allOhang = Array.from(
    new Set([...(yongsin ? [yongsin] : []), ...deficitOhang])
  );
  const candidates = ALL_DISTRICTS.filter(d => {
    // 1. 시도 필터 (명시된 경우)
    if (siDoList && !siDoList.includes(d.siDo)) return false;

    // 2. 행정단위 필터 (자동 결정)
    if (!matchesAdminLevel(d, adminLevel)) return false;

    // 3. 사주·지형 매칭
    const hasOhangMatch = d.ohang.some(o => allOhang.includes(o));
    const hasTerrainMatch = terrainPreference && districtHasTerrain(d, terrainPreference);
    const hasVibeMatch = vibePref && d.vibe === vibePref;
    const hasDirectionMatch = !!gilbang && d.direction === gilbang;
    return hasOhangMatch || hasTerrainMatch || hasVibeMatch || hasDirectionMatch;
  });

  // 점수 계산 및 정렬
  const scored = candidates
    .map(d => {
      const { score, reasons } = scoreDistrict(d, scoreOptions);
      return { district: d, score, reasons };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // 1동/2동 중복 제거 (같은 기본명으로 그룹화 후 최고 점수만 유지)
  const seenBase = new Set<string>();
  const deduped = scored.filter(r => {
    const baseName = r.district.name.replace(/\d+동$/, '동');
    const key = `${r.district.siGunGu}_${baseName}`;
    if (seenBase.has(key)) return false;
    seenBase.add(key);
    return true;
  });

  return deduped.slice(0, topN);
}

export function matchByOhangOnly(ohang: Ohang[]): District[] {
  return ALL_DISTRICTS.filter(d => d.ohang.some(o => ohang.includes(o)));
}

export function matchByTerrain(terrain: Terrain): District[] {
  return ALL_DISTRICTS.filter(d => districtHasTerrain(d, terrain));
}

export function getDistrictsByHanjaChar(char: string): District[] {
  return ALL_DISTRICTS.filter(d => d.hanja.includes(char));
}
