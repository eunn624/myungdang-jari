import type { Ohang } from '../saju/types';
import type { District, MatchResult, MatchOptions, Terrain } from './types';
import districtsData from '../../data/districts.json';

const ALL_DISTRICTS: District[] = (districtsData as any).districts;

// 용신 오행 → 선호 지형
const OHANG_TERRAIN_MAP: Record<Ohang, Terrain> = {
  木: 'green',
  火: 'flatland',
  土: 'highland',
  金: 'flatland',
  水: 'waterfront',
};

export function getTerrainPreference(yongsin: Ohang): Terrain {
  return OHANG_TERRAIN_MAP[yongsin];
}

export function scoreDistrict(
  district: District,
  deficitOhang: Ohang[],
  terrainPreference?: Terrain,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 오행 매칭 (부족 오행 1순위 = 가중치 3, 2순위 = 2, 3순위 = 1)
  for (let i = 0; i < Math.min(deficitOhang.length, 3); i++) {
    const ohang = deficitOhang[i];
    const weight = 3 - i;
    if (district.ohang.includes(ohang)) {
      score += weight * 10;
      const matchedChars = district.ohangChars.filter(ch =>
        district.ohang[district.ohang.indexOf(ohang)] === ohang
      );
      reasons.push(
        `${ohang} 오행 보완 (지명 한자: ${district.hanja})`
      );
    }
  }

  // 지형 매칭
  if (terrainPreference && district.terrain === terrainPreference) {
    score += 15;
    const terrainLabel: Record<string, string> = {
      waterfront: '수변 근접 지형',
      highland: '고지대 지형',
      green: '녹지 풍부 지형',
      flatland: '평지 지형',
    };
    reasons.push(`${terrainLabel[district.terrain]} 부합`);
  }

  // 한자 확정 보너스
  if (district.hanjaStatus === 'confirmed') {
    score += 5;
  }

  // 오행 복수 매칭 보너스 (예: 金+水 둘 다 가진 경우)
  const matchCount = district.ohang.filter(o => deficitOhang.includes(o)).length;
  if (matchCount >= 2) {
    score += 10;
    reasons.push(`복수 오행 매칭 (${district.ohang.join('·')})`);
  }

  return { score, reasons };
}

export function matchDistricts(options: MatchOptions): MatchResult[] {
  const { deficitOhang, siDo, topN = 10 } = options;
  const terrainPreference = options.terrainPreference
    ?? (deficitOhang[0] ? OHANG_TERRAIN_MAP[deficitOhang[0]] : undefined);

  // 오행 매칭이 하나라도 되거나, 지형 매칭이 되는 동네만 포함
  const results: MatchResult[] = ALL_DISTRICTS
    .filter(d => {
      if (siDo && d.siDo !== siDo) return false;
      const hasOhangMatch = d.ohang.some(o => deficitOhang.includes(o));
      const hasTerrainMatch = terrainPreference && d.terrain === terrainPreference;
      return hasOhangMatch || hasTerrainMatch;
    })
    .map(d => {
      const { score, reasons } = scoreDistrict(d, deficitOhang, terrainPreference);
      return { district: d, score, reasons };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return results;
}

export function matchByOhangOnly(ohang: Ohang[]): District[] {
  return ALL_DISTRICTS.filter(d => d.ohang.some(o => ohang.includes(o)));
}

export function matchByTerrain(terrain: Terrain): District[] {
  return ALL_DISTRICTS.filter(d => d.terrain === terrain);
}

export function getDistrictsByHanjaChar(char: string): District[] {
  return ALL_DISTRICTS.filter(d => d.hanja.includes(char));
}
