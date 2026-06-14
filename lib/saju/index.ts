import type { BirthInfo, SajuResult } from './types';
import { getFourPillars } from './manseryeok';
import { getOhangDistribution, getDeficitOhang, getYongsin } from './ohang';
import { getBedDirection, getGilbang } from './directions';
import { calcSinsal } from './sinsal';
import { calcDaeWoon, calcSeWoon } from './daewoon';

export function analyzeSaju(
  birth: BirthInfo,
  gender: '남성' | '여성' = '여성',
): SajuResult {
  const pillars = getFourPillars(birth);
  const ohang = getOhangDistribution(pillars);
  const deficitOhang = getDeficitOhang(ohang);
  const yongsin = getYongsin(ohang);
  const bedDirection = getBedDirection(pillars.year.branch);
  const gilbang = getGilbang(yongsin);
  const sinsal = calcSinsal(pillars);

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birth.year;
  const daeWoon = calcDaeWoon(pillars, gender, birth.month, birth.day, currentAge);
  const currentDaeWoon = daeWoon.find(d => d.isCurrent) ?? null;
  const seWoon = calcSeWoon(currentYear);

  return { pillars, ohang, deficitOhang, bedDirection, gilbang, yongsin, sinsal, daeWoon, currentDaeWoon, seWoon };
}

export type { BirthInfo, SajuResult, FourPillars, OhangDistribution, Ohang, SinsalResult, DaeWoon, SeWoon } from './types';
export { getFourPillars } from './manseryeok';
export { getOhangDistribution, getDeficitOhang, getYongsin } from './ohang';
export { getBedDirection, getGilbang } from './directions';
export { calcSinsal } from './sinsal';
export { calcDaeWoon, calcSeWoon } from './daewoon';
