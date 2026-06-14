import type { Ohang } from '../saju/types';
import type { District, Terrain, TerrainClassification } from './types';

export const TERRAIN_LABELS: Record<Terrain, string> = {
  highland: '고지대',
  waterfront: '수변',
  flatland: '평지',
  green: '녹지',
};

export const TERRAIN_DESCRIPTIONS: Record<Terrain, string> = {
  highland: '산자락, 구릉, 경사지처럼 지대감이 있는 행정동',
  waterfront: '강, 천, 호수, 바다, 항만 등 물길과 가까운 행정동',
  flatland: '이동과 생활 동선이 비교적 평탄한 행정동',
  green: '공원, 산림, 국립공원 등 녹지 접근성이 두드러지는 행정동',
};

export const TERRAIN_OHANG_AFFINITY: Record<Ohang, Terrain> = {
  木: 'green',
  火: 'flatland',
  土: 'highland',
  金: 'flatland',
  水: 'waterfront',
};

const TERRAIN_NOTE_KEYWORDS: Record<Terrain, string[]> = {
  highland: ['고지대', '산 자락', '산자락', '기슭', '경사지', '구릉', '산 동편', '산 서편'],
  waterfront: ['수변', '한강', '강변', '강 인접', '천 인근', '천 수변', '호수', '바다', '해안', '항', '계곡'],
  flatland: ['평지', '도심', '대학로', '강남 평지'],
  green: ['녹지', '공원', '국립공원', '숲길', '산림'],
};

function uniqueTerrains(terrains: Terrain[]): Terrain[] {
  return Array.from(new Set(terrains));
}

export function inferTerrainTags(note: string): Terrain[] {
  const matched = Object.entries(TERRAIN_NOTE_KEYWORDS)
    .filter(([, keywords]) => keywords.some(keyword => note.includes(keyword)))
    .map(([terrain]) => terrain as Terrain);

  return uniqueTerrains(matched);
}

export function classifyDistrictTerrain(district: District): TerrainClassification {
  const inferredTags = inferTerrainTags(district.terrainNote);
  const tags = uniqueTerrains([
    district.terrain,
    ...(district.terrainTags ?? []),
    ...inferredTags,
  ]);

  const confidence = inferredTags.includes(district.terrain)
    ? 'high'
    : inferredTags.length > 0
      ? 'medium'
      : 'low';

  return {
    primary: district.terrain,
    tags,
    label: TERRAIN_LABELS[district.terrain],
    note: district.terrainNote,
    confidence,
  };
}

export function districtHasTerrain(district: District, terrain: Terrain): boolean {
  return classifyDistrictTerrain(district).tags.includes(terrain);
}

export function getTerrainPreferenceByOhang(yongsin: Ohang): Terrain {
  return TERRAIN_OHANG_AFFINITY[yongsin];
}
