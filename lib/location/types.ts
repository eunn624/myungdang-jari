import type { Ohang } from '../saju/types';

export type Terrain = 'highland' | 'waterfront' | 'flatland' | 'green';
export type HanjaStatus = 'confirmed' | 'manual_review';
export type TerrainConfidence = 'high' | 'medium' | 'low';

export interface District {
  code: string;
  name: string;
  hanja: string;
  siDo: string;
  siGunGu: string;
  ohangChars: string[];
  ohang: Ohang[];
  terrain: Terrain;
  terrainTags?: Terrain[];
  terrainNote: string;
  hanjaStatus: HanjaStatus;
  hanjaNote?: string;
  manualNote?: string;
}

export interface TerrainClassification {
  primary: Terrain;
  tags: Terrain[];
  label: string;
  note: string;
  confidence: TerrainConfidence;
}

export interface MatchResult {
  district: District;
  score: number;
  reasons: string[];  // "근거" 한 줄씩
}

export interface MatchOptions {
  deficitOhang: Ohang[];          // 부족 오행 순위 리스트
  terrainPreference?: Terrain;    // 용신 기반 지형 선호
  siDo?: string;                  // 시도 필터 (옵션)
  topN?: number;                  // 최대 결과 수 (기본 10)
}
