import { getFourPillars, getYearPillar, getMonthPillar, getDayPillar, getHourPillar } from '../../lib/saju/manseryeok';

describe('년주(年柱) 계산', () => {
  test('1984년 = 甲子년', () => {
    const p = getYearPillar(1984);
    expect(p.stem).toBe('甲');
    expect(p.branch).toBe('子');
  });

  test('2024년 = 甲辰년', () => {
    const p = getYearPillar(2024);
    expect(p.stem).toBe('甲');
    expect(p.branch).toBe('辰');
  });

  test('1990년 = 庚午년', () => {
    const p = getYearPillar(1990);
    expect(p.stem).toBe('庚');
    expect(p.branch).toBe('午');
  });

  test('2000년 = 庚辰년', () => {
    const p = getYearPillar(2000);
    expect(p.stem).toBe('庚');
    expect(p.branch).toBe('辰');
  });
});

describe('월주(月柱) 계산 (절기 근사치)', () => {
  test('甲년 2월 = 丙寅월', () => {
    const yearStemIdx = 0; // 甲
    const p = getMonthPillar(yearStemIdx, 2);
    expect(p.stem).toBe('丙');
    expect(p.branch).toBe('寅');
  });

  test('甲년 3월 = 丁卯월', () => {
    const p = getMonthPillar(0, 3);
    expect(p.stem).toBe('丁');
    expect(p.branch).toBe('卯');
  });

  test('己년 2월 = 丙寅월 (甲己동일 기준)', () => {
    const p = getMonthPillar(5, 2); // 己 = index 5
    expect(p.stem).toBe('丙');
    expect(p.branch).toBe('寅');
  });

  test('월지: 1월=丑, 6월=午, 12월=子', () => {
    expect(getMonthPillar(0, 1).branch).toBe('丑');
    expect(getMonthPillar(0, 6).branch).toBe('午');
    expect(getMonthPillar(0, 12).branch).toBe('子');
  });
});

describe('일주(日柱) 계산', () => {
  test('결과가 GanJi 형태로 반환', () => {
    const p = getDayPillar(1990, 1, 1);
    expect(p.stem).toMatch(/^[甲乙丙丁戊己庚辛壬癸]$/);
    expect(p.branch).toMatch(/^[子丑寅卯辰巳午未申酉戌亥]$/);
  });

  test('같은 날은 같은 일주', () => {
    const p1 = getDayPillar(2000, 6, 15);
    const p2 = getDayPillar(2000, 6, 15);
    expect(p1.stem).toBe(p2.stem);
    expect(p1.branch).toBe(p2.branch);
  });

  test('하루 차이면 간지 index가 1 증가', () => {
    const { STEMS, BRANCHES } = require('../../lib/saju/constants');
    const p1 = getDayPillar(2000, 1, 1);
    const p2 = getDayPillar(2000, 1, 2);
    const idx1 = STEMS.indexOf(p1.stem);
    const idx2 = STEMS.indexOf(p2.stem);
    expect((idx2 - idx1 + 10) % 10).toBe(1);
  });
});

describe('시주(時柱) 계산', () => {
  test('시 모름이면 null 반환', () => {
    expect(getHourPillar(0, undefined)).toBeNull();
  });

  test('子시(23시)는 branch=子', () => {
    const p = getHourPillar(0, 23);
    expect(p?.branch).toBe('子');
  });

  test('子시(0시)는 branch=子', () => {
    const p = getHourPillar(0, 0);
    expect(p?.branch).toBe('子');
  });

  test('午시(11시)는 branch=午', () => {
    const p = getHourPillar(0, 11);
    expect(p?.branch).toBe('午');
  });

  test('甲일 子시 = 甲子시', () => {
    const p = getHourPillar(0, 23); // 甲 = stemIdx 0
    expect(p?.stem).toBe('甲');
    expect(p?.branch).toBe('子');
  });
});

describe('사주팔자 통합 출력', () => {
  test('시 있는 경우 4주 모두 반환', () => {
    const result = getFourPillars({ year: 1990, month: 5, day: 15, hour: 10 });
    expect(result.year).toBeDefined();
    expect(result.month).toBeDefined();
    expect(result.day).toBeDefined();
    expect(result.hour).not.toBeNull();
  });

  test('시 모름 경우 hour=null', () => {
    const result = getFourPillars({ year: 1990, month: 5, day: 15 });
    expect(result.hour).toBeNull();
  });

  test('한글 표기 포함', () => {
    const result = getFourPillars({ year: 1984, month: 1, day: 1, hour: 12 });
    expect(result.year.stemKor).toBe('갑');
    expect(result.year.branchKor).toBe('자');
  });
});
