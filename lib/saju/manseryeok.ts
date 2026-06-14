import type { GanJi, FourPillars, BirthInfo } from './types';
import {
  STEMS, STEMS_KOR,
  BRANCHES, BRANCHES_KOR,
  YEAR_STEM_TO_MONTH_STEM_BASE,
  DAY_STEM_TO_HOUR_STEM_BASE,
} from './constants';

// 율리우스 적일수(JDN) 계산 (그레고리력 기준)
function getJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function makeGanJi(stemIdx: number, branchIdx: number): GanJi {
  const si = ((stemIdx % 10) + 10) % 10;
  const bi = ((branchIdx % 12) + 12) % 12;
  return {
    stem: STEMS[si],
    branch: BRANCHES[bi],
    stemKor: STEMS_KOR[si],
    branchKor: BRANCHES_KOR[bi],
  };
}

export function getYearPillar(year: number): GanJi {
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  const branchIdx = ((year - 4) % 12 + 12) % 12;
  return makeGanJi(stemIdx, branchIdx);
}

// 월주: 절기(節氣) 근사치 — 소한·입춘 등 정확한 절기 날짜 미반영
// ⚠️ R1 리스크: 생일이 절기 전후 1~2일인 경우 월주가 달라질 수 있음
export function getMonthPillar(yearStemIdx: number, month: number): GanJi {
  // 월지: 1월→丑(1), 2월→寅(2), ..., 12월→子(0)
  const monthBranchIdxMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
  const branchIdx = monthBranchIdxMap[month - 1];

  // 寅월(2월, branchIdx=2) 기준 몇 번째 월인지
  const stepsFromYin = (branchIdx - 2 + 12) % 12;
  const monthStemBase = YEAR_STEM_TO_MONTH_STEM_BASE[yearStemIdx];
  const stemIdx = (monthStemBase + stepsFromYin) % 10;

  return makeGanJi(stemIdx, branchIdx);
}

// 일주: 1900-01-01 = 甲戌(index 10) 기준
// JDN(1900,1,1) = 2415021, offset = (10 - 2415021%60 + 60) % 60 = 49
const DAY_OFFSET = 49;

export function getDayPillar(year: number, month: number, day: number): GanJi {
  const jdn = getJDN(year, month, day);
  const sexIdx = (jdn + DAY_OFFSET) % 60;
  return makeGanJi(sexIdx % 10, sexIdx % 12);
}

// 시주: 子시 23:00~01:00
export function getHourPillar(dayStemIdx: number, hour: number | undefined): GanJi | null {
  if (hour === undefined) return null;

  // 시지 계산
  const branchIdx = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  // 시간 계산: 일간 기준
  const hourStemBase = DAY_STEM_TO_HOUR_STEM_BASE[dayStemIdx];
  const stemIdx = (hourStemBase + branchIdx) % 10;

  return makeGanJi(stemIdx, branchIdx);
}

export function getFourPillars(birth: BirthInfo): FourPillars {
  const year = getYearPillar(birth.year);
  const month = getMonthPillar(STEMS.indexOf(year.stem), birth.month);
  const day = getDayPillar(birth.year, birth.month, birth.day);
  const dayStemIdx = STEMS.indexOf(day.stem);
  const hour = getHourPillar(dayStemIdx, birth.hour);

  return { year, month, day, hour };
}
