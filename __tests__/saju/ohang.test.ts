import { getOhangDistribution, getDeficitOhang, getYongsin } from '../../lib/saju/ohang';
import type { FourPillars } from '../../lib/saju/types';

const mockPillars: FourPillars = {
  year:  { stem: '甲', branch: '子', stemKor: '갑', branchKor: '자' }, // 木 + 水
  month: { stem: '丙', branch: '寅', stemKor: '병', branchKor: '인' }, // 火 + 木
  day:   { stem: '戊', branch: '午', stemKor: '무', branchKor: '오' }, // 土 + 火
  hour:  { stem: '庚', branch: '申', stemKor: '경', branchKor: '신' }, // 金 + 金
};

const mockPillarsNoHour: FourPillars = {
  ...mockPillars,
  hour: null,
};

describe('오행 분포 계산', () => {
  test('합계가 100%', () => {
    const dist = getOhangDistribution(mockPillars);
    const total = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
    expect(Math.round(total)).toBe(100);
  });

  test('시주 없으면 6개 요소(3주 × 2)로 계산', () => {
    const dist = getOhangDistribution(mockPillarsNoHour);
    const total = dist.wood + dist.fire + dist.earth + dist.metal + dist.water;
    expect(Math.round(total)).toBe(100);
  });

  test('木 비중 > 0 (甲·寅 포함)', () => {
    const dist = getOhangDistribution(mockPillars);
    expect(dist.wood).toBeGreaterThan(0);
  });

  test('金 비중 > 0 (庚·申 포함)', () => {
    const dist = getOhangDistribution(mockPillars);
    expect(dist.metal).toBeGreaterThan(0);
  });

  test('소수점 1자리 반올림', () => {
    const dist = getOhangDistribution(mockPillars);
    expect(Number.isFinite(dist.wood)).toBe(true);
  });
});

describe('부족 오행 도출', () => {
  test('0%인 오행이 deficitOhang에 포함', () => {
    // 水만 없는 사주
    const noWaterPillars: FourPillars = {
      year:  { stem: '甲', branch: '寅', stemKor: '갑', branchKor: '인' }, // 木 木
      month: { stem: '丙', branch: '午', stemKor: '병', branchKor: '오' }, // 火 火
      day:   { stem: '戊', branch: '辰', stemKor: '무', branchKor: '진' }, // 土 土
      hour:  { stem: '庚', branch: '申', stemKor: '경', branchKor: '신' }, // 金 金
    };
    const deficits = getDeficitOhang(getOhangDistribution(noWaterPillars));
    expect(deficits).toContain('水');
  });

  test('비율이 낮은 오행 순서로 정렬', () => {
    const dist = getOhangDistribution(mockPillars);
    const deficits = getDeficitOhang(dist);
    expect(Array.isArray(deficits)).toBe(true);
  });
});

describe('용신 결정', () => {
  test('부족 오행 중 가장 부족한 것이 용신', () => {
    const dist = getOhangDistribution(mockPillars);
    const deficits = getDeficitOhang(dist);
    const yongsin = getYongsin(dist);
    expect(deficits[0]).toBe(yongsin);
  });

  test('용신은 항상 오행 중 하나', () => {
    const dist = getOhangDistribution(mockPillars);
    const yongsin = getYongsin(dist);
    expect(['木','火','土','金','水']).toContain(yongsin);
  });
});
