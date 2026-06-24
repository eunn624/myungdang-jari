import { matchDistricts, matchByOhangOnly, matchByTerrain, getDistrictsByHanjaChar, getTerrainPreference } from '../../lib/location/matcher';
import { classifyDistrictTerrain } from '../../lib/location/terrain';

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

  test('木 용신: 결과에 木 오행 동네 포함', () => {
    const results = matchDistricts({ deficitOhang: ['木'] });
    expect(results.some(r => r.district.ohang.includes('木'))).toBe(true);
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
    expect(districts.length).toBeGreaterThan(0);
    // 모든 반환된 동네가 waterfront 관련이어야 함 (주지형, 태그, 또는 추론)
    districts.forEach(d => {
      const classified = classifyDistrictTerrain(d);
      expect(classified.tags.includes('waterfront')).toBe(true);
    });
  });

  test('highland 동네 반환', () => {
    const districts = matchByTerrain('highland');
    expect(districts.length).toBeGreaterThan(0);
  });
});

describe('getDistrictsByHanjaChar', () => {
  test('한자 검색 함수 동작 (구 단위 데이터에서는 한자 미확정)', () => {
    // 구 단위 집계 후 gu records have no hanja — function still works (returns empty array)
    const districts = getDistrictsByHanjaChar('淸');
    expect(Array.isArray(districts)).toBe(true);
  });

  test('한자 검색 함수 동작', () => {
    const districts = getDistrictsByHanjaChar('金');
    expect(Array.isArray(districts)).toBe(true);
  });
});
