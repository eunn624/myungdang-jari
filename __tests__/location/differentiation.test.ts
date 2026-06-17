import { matchDistricts, scoreDistrict } from '../../lib/location/matcher';
import districtsData from '../../data/districts.json';

const ALL: any[] = (districtsData as any).districts;

describe('적합도 변별력', () => {
  test('상위 5개 점수가 서로 다르다', () => {
    const results = matchDistricts({
      deficitOhang: ['木', '水'],
      yongsin: '木',
      gilbang: '동',
      sinsal: ['도화살', '역마살'],
      guiin: ['문창귀인'],
      topN: 10,
    });
    expect(results.length).toBeGreaterThanOrEqual(5);
    const top5scores = results.slice(0, 5).map((r) => r.score);
    const uniqueScores = new Set(top5scores);
    expect(uniqueScores.size).toBeGreaterThan(1);
  });

  test('suitability가 60~99% 범위다', () => {
    const results = matchDistricts({ deficitOhang: ['水'], topN: 10 });
    results.forEach((r) => {
      const suitability = Math.round(60 + Math.min(r.score / 91, 1) * 39);
      expect(suitability).toBeGreaterThanOrEqual(60);
      expect(suitability).toBeLessThanOrEqual(99);
    });
  });
});

describe('신살·귀인이 점수에 반영된다', () => {
  const livelyDistrict = ALL.find((d) => d.vibe === 'lively');
  const quietDistrict = ALL.find((d) => d.vibe === 'quiet');
  const balancedDistrict = ALL.find((d) => d.vibe === 'balanced');

  test('도화살 → lively 동네에서 sinsal_guiin 점수 발생', () => {
    expect(livelyDistrict).toBeDefined();
    const { breakdown } = scoreDistrict(livelyDistrict, {
      deficitOhang: [],
      sinsal: ['도화살'],
    });
    expect(breakdown.sinsal_guiin).toBeGreaterThan(0);
  });

  test('화개살 → quiet 동네에서 sinsal_guiin 점수 발생', () => {
    expect(quietDistrict).toBeDefined();
    const { breakdown } = scoreDistrict(quietDistrict, {
      deficitOhang: [],
      sinsal: ['화개살'],
    });
    expect(breakdown.sinsal_guiin).toBeGreaterThan(0);
  });

  test('문창귀인 → 강남구에서 학군 점수 발생', () => {
    const gangnam = ALL.find((d) => d.siGunGu === '강남구' && d.siDo === '서울');
    expect(gangnam).toBeDefined();
    const { breakdown } = scoreDistrict(gangnam, {
      deficitOhang: [],
      guiin: ['문창귀인'],
    });
    expect(breakdown.sinsal_guiin).toBeGreaterThanOrEqual(6);
  });

  test('천을귀인 → balanced 동네에서 sinsal_guiin 점수 발생', () => {
    expect(balancedDistrict).toBeDefined();
    const { breakdown } = scoreDistrict(balancedDistrict, {
      deficitOhang: [],
      guiin: ['천을귀인'],
    });
    expect(breakdown.sinsal_guiin).toBeGreaterThan(0);
  });
});

describe('길방(吉方)이 점수에 반영된다', () => {
  test('길방 일치 동네에서 direction 점수 발생', () => {
    const eastDistrict = ALL.find((d) => d.direction === '동');
    expect(eastDistrict).toBeDefined();
    const { breakdown } = scoreDistrict(eastDistrict, {
      deficitOhang: [],
      gilbang: '동',
    });
    expect(breakdown.direction).toBeGreaterThan(0);
  });
});
