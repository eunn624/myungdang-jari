import type { FourPillars, HeavenlyStem, GanJi } from './types';
import type { Ohang } from './types';
import { STEMS, STEMS_KOR, BRANCHES, BRANCHES_KOR, STEM_OHANG } from './constants';

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

function isYangStem(stem: HeavenlyStem): boolean {
  return ['甲', '丙', '戊', '庚', '壬'].includes(stem);
}

// 절기 근사 날짜 (month, day)
const JEOLGI: [number, number][] = [
  [1, 6], [2, 4], [3, 6], [4, 5], [5, 6], [6, 6],
  [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7],
];

function approxDayOfYear(month: number, day: number): number {
  const cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return cum[month - 1] + day;
}

function calcStartAge(birthMonth: number, birthDay: number, forward: boolean): number {
  const birthDoy = approxDayOfYear(birthMonth, birthDay);
  let minDiff = 366;

  for (const [jm, jd] of JEOLGI) {
    const jDoy = approxDayOfYear(jm, jd);
    const diff = forward
      ? (jDoy > birthDoy ? jDoy - birthDoy : jDoy + 365 - birthDoy)
      : (birthDoy > jDoy ? birthDoy - jDoy : birthDoy + 365 - jDoy);
    if (diff > 0 && diff < minDiff) minDiff = diff;
  }

  return Math.max(1, Math.round(minDiff / 3));
}

export function calcDaeWoon(
  pillars: FourPillars,
  gender: '남성' | '여성',
  birthMonth: number,
  birthDay: number,
  currentAge: number,
): DaeWoon[] {
  const yearStem = pillars.year.stem;
  const forward = (isYangStem(yearStem) && gender === '남성') ||
                  (!isYangStem(yearStem) && gender === '여성');

  const startAge = calcStartAge(birthMonth, birthDay, forward);
  const mStemIdx = STEMS.indexOf(pillars.month.stem);
  const mBranchIdx = BRANCHES.indexOf(pillars.month.branch);

  return Array.from({ length: 9 }, (_, i) => {
    const delta = forward ? i + 1 : -(i + 1);
    const ganJi = makeGanJi(mStemIdx + delta, mBranchIdx + delta);
    const dStart = startAge + i * 10;
    const dEnd = dStart + 9;
    return {
      ganJi,
      startAge: dStart,
      endAge: dEnd,
      isCurrent: currentAge >= dStart && currentAge <= dEnd,
      ohang: STEM_OHANG[ganJi.stem],
    };
  });
}

// 甲子 = 1984년 기준 60갑자 순환
export function calcSeWoon(year: number): SeWoon {
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  const branchIdx = ((year - 4) % 12 + 12) % 12;
  const ganJi = makeGanJi(stemIdx, branchIdx);
  return { year, ganJi, ohang: STEM_OHANG[ganJi.stem] };
}
