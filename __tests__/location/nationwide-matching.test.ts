import { matchDistricts } from '../../lib/location/matcher';

describe('전국 매칭 검증', () => {
  test('전국에서 木 오행 지역 찾기', () => {
    const results = matchDistricts({ deficitOhang: ['木'] });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].district.ohang).toContain('木');
  });

  test('부산에서만 水 오행 지역 찾기', () => {
    const results = matchDistricts({ 
      deficitOhang: ['水'], 
      siDo: '부산'
    });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.district.siDo).toBe('부산');
    });
  });

  test('광역시 필터 (adminLevel: sgg)', () => {
    const results = matchDistricts({ 
      deficitOhang: ['水'],
      adminLevel: 'sgg',
      topN: 5
    });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.district.adminLevel).toBe('sgg');
    });
  });

  test('지형 기반 매칭 (waterfront 선호)', () => {
    const results = matchDistricts({
      deficitOhang: ['水'],
      terrainPreference: 'waterfront',
      topN: 5
    });
    expect(results.length).toBeGreaterThan(0);
  });

  test('강원도 시/군 필터', () => {
    const results = matchDistricts({
      deficitOhang: ['水'],
      siDo: '강원',
      adminLevel: 'all',
      topN: 3
    });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.district.siDo).toBe('강원');
    });
  });

  test('새로운 광역시도에서 결과 반환 (광역시)', () => {
    const siDos = ['부산', '대구', '인천', '광주', '대전', '울산'];
    siDos.forEach(siDo => {
      const results = matchDistricts({
        deficitOhang: ['水'],
        siDo,
        topN: 1
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].district.siDo).toBe(siDo);
    });
  });

  test('새로운 도 지역에서 결과 반환', () => {
    const siDos = ['강원', '전남', '전북', '경남', '경북', '제주'];
    siDos.forEach(siDo => {
      const results = matchDistricts({
        deficitOhang: ['水'],
        siDo,
        topN: 1
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].district.siDo).toBe(siDo);
    });
  });
});
