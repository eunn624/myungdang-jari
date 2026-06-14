import type { BirthInfo, SajuResult } from './types';
import { getFourPillars } from './manseryeok';
import { getOhangDistribution, getDeficitOhang, getYongsin } from './ohang';
import { getBedDirection, getGilbang } from './directions';

export function analyzeSaju(birth: BirthInfo): SajuResult {
  const pillars = getFourPillars(birth);
  const ohang = getOhangDistribution(pillars);
  const deficitOhang = getDeficitOhang(ohang);
  const yongsin = getYongsin(ohang);
  const bedDirection = getBedDirection(pillars.year.branch);
  const gilbang = getGilbang(yongsin);

  return { pillars, ohang, deficitOhang, bedDirection, gilbang, yongsin };
}

export type { BirthInfo, SajuResult, FourPillars, OhangDistribution, Ohang } from './types';
export { getFourPillars } from './manseryeok';
export { getOhangDistribution, getDeficitOhang, getYongsin } from './ohang';
export { getBedDirection, getGilbang } from './directions';
