export type HeavenlyStem = '甲'|'乙'|'丙'|'丁'|'戊'|'己'|'庚'|'辛'|'壬'|'癸';
export type EarthlyBranch = '子'|'丑'|'寅'|'卯'|'辰'|'巳'|'午'|'未'|'申'|'酉'|'戌'|'亥';
export type Ohang = '木'|'火'|'土'|'金'|'水';
export type Direction = '북'|'동북'|'동'|'동남'|'남'|'서남'|'서'|'서북';

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
  hour: GanJi | null; // null = 시 모름
}

export interface OhangDistribution {
  wood: number;  // 木 %
  fire: number;  // 火 %
  earth: number; // 土 %
  metal: number; // 金 %
  water: number; // 水 %
}

export interface BirthInfo {
  year: number;
  month: number;  // 1-12
  day: number;
  hour?: number;  // 0-23, undefined = 시 모름
}

export interface SajuResult {
  pillars: FourPillars;
  ohang: OhangDistribution;
  deficitOhang: Ohang[];
  bedDirection: Direction;
  gilbang: Direction;
  yongsin: Ohang;
}
