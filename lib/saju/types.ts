export type HeavenlyStem = '甲'|'乙'|'丙'|'丁'|'戊'|'己'|'庚'|'辛'|'壬'|'癸';
export type EarthlyBranch = '子'|'丑'|'寅'|'卯'|'辰'|'巳'|'午'|'未'|'申'|'酉'|'戌'|'亥';
export type Ohang = '木'|'火'|'土'|'金'|'水';
export type Direction = '북'|'동북'|'동'|'동남'|'남'|'서남'|'서'|'서북';
export type VibePref = 'lively' | 'balanced' | 'quiet';

export interface GanJi {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemKor: string;
  branchKor: string;
}

export interface FourPillars {
  year: GanJi;
  month: GanJi;
  day: GanJi;
  hour: GanJi | null;
}

export interface OhangDistribution {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour?: number;
}

export interface SinsalResult {
  name: string;
  hanja: string;
  category: 'sal' | 'guiin';
  activePillar: string;
  description: string;
  spaceTag: string;
  homeReading: string;
}

export interface DaeWoon {
  ganJi: GanJi;
  startAge: number;
  endAge: number;
  isCurrent: boolean;
  ohang: Ohang;
}

export interface SeWoon {
  ganJi: GanJi;
  year: number;
  ohang: Ohang;
}

export interface SajuResult {
  pillars: FourPillars;
  ohang: OhangDistribution;
  deficitOhang: Ohang[];
  bedDirection: Direction;
  gilbang: Direction;
  yongsin: Ohang;
  sinsal: SinsalResult[];
  daeWoon: DaeWoon[];
  currentDaeWoon: DaeWoon | null;
  seWoon: SeWoon;
}
