import type { Ohang, Direction } from '../saju/types';

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
  vibe?: 'lively' | 'balanced' | 'quiet';
  vibeScore?: number;
  vibeNote?: string;
  lat?: number;
  lng?: number;
  direction?: string;
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
  deficitOhang: Ohang[];
  yongsin?: Ohang;
  dominantOhang?: Ohang;
  terrainPreference?: Terrain;
  vibePref?: 'lively' | 'balanced' | 'quiet';
  sinsal?: string[];
  guiin?: string[];
  gilbang?: Direction;
  siDo?: string | string[];
  topN?: number;
}
