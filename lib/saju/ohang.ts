import type { FourPillars, OhangDistribution, Ohang } from './types';
import { STEM_OHANG, BRANCH_OHANG } from './constants';

const OHANG_KEYS: Ohang[] = ['木', '火', '土', '金', '水'];

// 억부용신(抑扶用神): 과다 오행을 克하는 오행
// 목극토, 화극금, 토극수, 금극목, 수극화
const OHANG_克神: Record<Ohang, Ohang> = {
  木: '金',
  火: '水',
  土: '木',
  金: '火',
  水: '土',
};

const DOMINANCE_THRESHOLD = 40; // 이 비율 이상이면 과다 판정

export function getOhangDistribution(pillars: FourPillars): OhangDistribution {
  const counts: Record<Ohang, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  const activePillars = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(Boolean);

  for (const p of activePillars) {
    if (!p) continue;
    counts[STEM_OHANG[p.stem]] += 1;
    counts[BRANCH_OHANG[p.branch]] += 1;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    wood:  Math.round((counts['木'] / total) * 1000) / 10,
    fire:  Math.round((counts['火'] / total) * 1000) / 10,
    earth: Math.round((counts['土'] / total) * 1000) / 10,
    metal: Math.round((counts['金'] / total) * 1000) / 10,
    water: Math.round((counts['水'] / total) * 1000) / 10,
  };
}

export function getDeficitOhang(dist: OhangDistribution): Ohang[] {
  const entries: [Ohang, number][] = [
    ['木', dist.wood],
    ['火', dist.fire],
    ['土', dist.earth],
    ['金', dist.metal],
    ['水', dist.water],
  ];
  return entries
    .sort((a, b) => a[1] - b[1])
    .map(([ohang]) => ohang);
}

export function getYongsin(dist: OhangDistribution): Ohang {
  const entries: [Ohang, number][] = [
    ['木', dist.wood], ['火', dist.fire], ['土', dist.earth],
    ['金', dist.metal], ['水', dist.water],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [dominant, dominantPct] = entries[0];

  // 한 오행이 과다(40% 이상)면 그 오행을 克하는 오행이 용신
  if (dominantPct >= DOMINANCE_THRESHOLD) {
    return OHANG_克神[dominant];
  }
  return getDeficitOhang(dist)[0];
}
