import type { EarthlyBranch, Ohang, Direction } from './types';
import { BANAN_SAL_DIRECTION, OHANG_GILBANG } from './constants';

export function getBedDirection(yearBranch: EarthlyBranch): Direction {
  return BANAN_SAL_DIRECTION[yearBranch];
}

export function getGilbang(yongsin: Ohang): Direction {
  return OHANG_GILBANG[yongsin];
}
