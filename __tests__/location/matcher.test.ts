import { matchDistricts, matchByOhangOnly, matchByTerrain, getDistrictsByHanjaChar, getTerrainPreference } from '../../lib/location/matcher';

describe('용신-지형 선호 매핑', () => {
  test('木 용신 → green', () => expect(getTerrainPreference('木')).toBe('green'));
  test('水 용신 → waterfront', () => expect(getTerrainPreference('水')).toBe('waterfront'));
  test('土 용신 → highland', () => expect(getTerrainPreference('土')).toBe('highland'));
});

describe('matchDistricts — 오행 기반 매칭', () => {
  test('水 용신: 결과 있음', () => {
    const results = matchDistricts({ deficitOhang: ['水'] });
    expect(results.length).toBeGreaterThan(0);
  });

  test('水 용신: 상위 결과에 水 오행 동네 포함', () => {
    const results = matchDistricts({ deficitOhang: ['水'] });
    expect(results[0].district.ohang).toContain('水');
  });

  test('水 용신: score 내림차순 정렬', () => {
    const results = matchDistricts({ deficitOhang: ['水'] });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  test('木 용신: 林·松·草·木 포함 동네 반환', () => {
    const results = matchDistricts({ deficitOhang: ['木'] });
    const names = results.map(r => r.district.name);
    expect(names.some(n => ['신림동','서초동','목동','송파동','화곡동'].includes(n))).toBe(true);
  });

  test('topN 옵션 준수', () => {
    const results = matchDistricts({ deficitOhang: ['水'], topN: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  test('siDo 필터 동작', () => {
    const results = matchDistricts({ deficitOhang: ['水'], siDo: '부산' });
    results.forEach(r => expect(r.district.siDo).toBe('부산'));
  });

  test('각 결과에 reasons가 1개 이상', () => {
    const results = matchDistricts({ deficitOhang: ['水'] });
    results.forEach(r => expect(r.reasons.length).toBeGreaterThan(0));
  });
});

describe('matchByOhangOnly', () => {
  test('金 오행 동네 반환', () => {
    const districts = matchByOhangOnly(['金']);
    expect(districts.some(d => d.ohang.includes('金'))).toBe(true);
  });
});

describe('matchByTerrain', () => {
  test('waterfront 동네 반환', () => {
    const districts = matchByTerrain('waterfront');
    districts.forEach(d => expect(d.terrain).toBe('waterfront'));
  });

  test('highland 동네 반환', () => {
    const districts = matchByTerrain('highland');
    expect(districts.length).toBeGreaterThan(0);
  });
});

describe('getDistrictsByHanjaChar', () => {
  test('淸 포함 동네: 삼청동·청담동 등', () => {
    const districts = getDistrictsByHanjaChar('淸');
    expect(districts.some(d => d.name.includes('청'))).toBe(true);
  });

  test('松 포함 동네: 송파동 등', () => {
    const districts = getDistrictsByHanjaChar('松');
    expect(districts.some(d => d.hanja.includes('松'))).toBe(true);
  });
});
