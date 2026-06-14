import type { HeavenlyStem, EarthlyBranch, Ohang, Direction } from './types';

export const STEMS: HeavenlyStem[] = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const STEMS_KOR = ['갑','을','병','정','무','기','경','신','임','계'];

export const BRANCHES: EarthlyBranch[] = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const BRANCHES_KOR = ['자','축','인','묘','진','사','오','미','신','유','술','해'];

// 천간 오행
export const STEM_OHANG: Record<HeavenlyStem, Ohang> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};

// 지지 오행 (주기/主氣 기준)
export const BRANCH_OHANG: Record<EarthlyBranch, Ohang> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
};

// 지지 방위 (8방위)
export const BRANCH_DIRECTION: Record<EarthlyBranch, Direction> = {
  子: '북',  丑: '동북', 寅: '동',  卯: '동',
  辰: '동남', 巳: '남',  午: '남',  未: '서남',
  申: '서',  酉: '서',  戌: '서북', 亥: '북',
};

// 오행 → 길방 (용신 기준)
export const OHANG_GILBANG: Record<Ohang, Direction> = {
  木: '동',
  火: '남',
  土: '서남',
  金: '서',
  水: '북',
};

// 반안살: 년지 → 침대 머리 방향 (전문가 자문 기반 단일 기준)
// ⚠️ R4 리스크: 학파별 차이 있음 — 출시 전 풍수 전문가 검증 필요
export const BANAN_SAL_DIRECTION: Record<EarthlyBranch, Direction> = {
  子: '동남', // 辰 방향
  丑: '남',   // 巳 방향
  寅: '남',   // 午 방향
  卯: '서남', // 未 방향
  辰: '서',   // 申 방향
  巳: '서',   // 酉 방향
  午: '서북', // 戌 방향
  未: '북',   // 亥 방향
  申: '북',   // 子 방향
  酉: '동북', // 丑 방향
  戌: '동',   // 寅 방향
  亥: '동',   // 卯 방향
};

// 년간 그룹별 寅월(2월) 월간 시작 index
// 甲己: 丙(2), 乙庚: 戊(4), 丙辛: 庚(6), 丁壬: 壬(8), 戊癸: 甲(0)
export const YEAR_STEM_TO_MONTH_STEM_BASE = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];

// 일간 그룹별 子시(23:00) 시간 시작 index
// 甲己: 甲(0), 乙庚: 丙(2), 丙辛: 戊(4), 丁壬: 庚(6), 戊癸: 壬(8)
export const DAY_STEM_TO_HOUR_STEM_BASE = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
