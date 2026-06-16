import type { SajuResult, VibePref } from './types';

export function getVibePref(saju: SajuResult): VibePref {
  const { sinsal, ohang, yongsin } = saju;

  const hasDoHwa  = sinsal.some(s => s.name === '도화살');
  const hasYeokma = sinsal.some(s => s.name === '역마살');
  const hasHwagae = sinsal.some(s => s.name === '화개살');

  const total = ohang.wood + ohang.fire + ohang.earth + ohang.metal + ohang.water;
  const firePct  = total > 0 ? (ohang.fire  / total) * 100 : 0;
  const waterPct = total > 0 ? (ohang.water / total) * 100 : 0;

  let livelyScore = 0;
  let quietScore  = 0;

  // 신살 기반
  if (hasDoHwa)  livelyScore += 2;  // 도화살: 활기찬 공간 자극 선호
  if (hasYeokma) livelyScore += 2;  // 역마살: 이동·번화 친화
  if (hasHwagae) quietScore  += 3;  // 화개살: 독립·조용한 골목

  // 오행 비율 기반
  if (firePct  >= 35) livelyScore += 2;  // 火 강함: 활기·인기 지향
  if (waterPct >= 35) quietScore  += 2;  // 水 강함: 조용·깊음 지향

  // 용신 기반
  if (yongsin === '火')             livelyScore += 1;
  if (yongsin === '水' || yongsin === '金') quietScore += 1;
  if (yongsin === '土')             quietScore  += 1;  // 土: 안정·정착
  if (yongsin === '木')             quietScore  += 1;  // 木: 자연·녹지 선호

  if (livelyScore > quietScore + 1) return 'lively';
  if (quietScore  > livelyScore + 1) return 'quiet';
  return 'balanced';
}

export const VIBE_LABEL: Record<VibePref, string> = {
  lively:   '활기찬 상권',
  balanced: '균형잡힌 동네',
  quiet:    '조용한 주거',
};

export const VIBE_REASON: Record<VibePref, string> = {
  lively:   '도화살·역마살·火 기운이 강해 활기찬 상권이 잘 맞아요',
  balanced: '오행 균형이 잡혀 있어 어떤 분위기의 동네도 무난해요',
  quiet:    '화개살·水·金 기운이 강해 조용하고 정착적인 동네가 잘 맞아요',
};
