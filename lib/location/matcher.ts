import type { Ohang } from '../saju/types';
import type { District, MatchResult, MatchOptions, Terrain } from './types';
import districtsData from '../../data/districts.json';
import {
  TERRAIN_LABELS,
  districtHasTerrain,
  getTerrainPreferenceByOhang,
} from './terrain';

const ALL_DISTRICTS: District[] = (districtsData as any).districts;

export function getTerrainPreference(yongsin: Ohang): Terrain {
  return getTerrainPreferenceByOhang(yongsin);
}

const VIBE_LABEL_KO: Record<string, string> = {
  lively:   '활기찬 상권',
  balanced: '균형잡힌 동네',
  quiet:    '조용한 주거',
};

export function scoreDistrict(
  district: District,
  deficitOhang: Ohang[],
  terrainPreference?: Terrain,
  vibePref?: 'lively' | 'balanced' | 'quiet',
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 오행 매칭 (부족 오행 1순위 = 가중치 3, 2순위 = 2, 3순위 = 1)
  for (let i = 0; i < Math.min(deficitOhang.length, 3); i++) {
    const ohang = deficitOhang[i];
    const weight = 3 - i;
    if (district.ohang.includes(ohang)) {
      score += weight * 10;
      reasons.push(
        `${ohang} 오행 보완 (지명 한자: ${district.hanja})`
      );
    }
  }

  // 지형 매칭
  if (terrainPreference && districtHasTerrain(district, terrainPreference)) {
    score += district.terrain === terrainPreference ? 15 : 10;
    reasons.push(`${TERRAIN_LABELS[terrainPreference]} 지형 부합`);
  }

  // 분위기 매칭
  if (vibePref && district.vibe) {
    if (district.vibe === vibePref) {
      score += 15;
      reasons.push(`${VIBE_LABEL_KO[vibePref]} 성향 부합`);
    } else if (vibePref === 'balanced') {
      score += 5;
    }
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
  const { deficitOhang, siDo, topN = 10, vibePref } = options;
  const terrainPreference = options.terrainPreference
    ?? (deficitOhang[0] ? getTerrainPreferenceByOhang(deficitOhang[0]) : undefined);
  const siDoList = Array.isArray(siDo) ? siDo : siDo ? [siDo] : undefined;

  // 오행·지형·분위기 중 하나라도 매칭되는 동네 포함
  const results: MatchResult[] = ALL_DISTRICTS
    .filter(d => {
      if (siDoList && !siDoList.includes(d.siDo)) return false;
      const hasOhangMatch = d.ohang.some(o => deficitOhang.includes(o));
      const hasTerrainMatch = terrainPreference && districtHasTerrain(d, terrainPreference);
      const hasVibeMatch = vibePref && d.vibe === vibePref;
      return hasOhangMatch || hasTerrainMatch || hasVibeMatch;
    })
    .map(d => {
      const { score, reasons } = scoreDistrict(d, deficitOhang, terrainPreference, vibePref);
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
  return ALL_DISTRICTS.filter(d => districtHasTerrain(d, terrain));
}

export function getDistrictsByHanjaChar(char: string): District[] {
  return ALL_DISTRICTS.filter(d => d.hanja.includes(char));
}
