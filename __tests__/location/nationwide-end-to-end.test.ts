import { matchDistricts } from '../../lib/location/matcher';

describe('전국 매칭 E2E 검증', () => {
  test('경기도에서 이제 수도권 오행 할당으로 결과 반환', () => {
    const results = matchDistricts({
      deficitOhang: ['木'],
      siDo: '경기',
      topN: 5
    });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.district.siDo).toBe('경기');
      expect(r.score).toBeGreaterThan(0);
    });
  });

  test('서울에서 水 오행 지역 추천', () => {
    const results = matchDistricts({
      deficitOhang: ['水'],
      siDo: '서울',
      topN: 3
    });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => {
      expect(r.district.siDo).toBe('서울');
      // 강변·강일·암사 등이 물 오행 높게 스코어되어야 함
    });
  });

  test('특정 시나리오: 火 과다 사주 → 水 용신 추천', () => {
    // 화가 많은 사주 → 수극화로 수가 용신
    const results = matchDistricts({
      deficitOhang: ['水'], // 부족한 오행
      dominantOhang: '火',  // 과한 오행
      topN: 5
    });
    expect(results.length).toBeGreaterThan(0);
    // 수와 관련된 지역들이 상위에 나와야 함
    const hasWaterRelated = results.some(r => 
      r.district.ohang.includes('水') || r.district.terrain === 'waterfront'
    );
    expect(hasWaterRelated).toBe(true);
  });

  test('전국 어느 지역에서든 매칭 결과 반환', () => {
    // 각 지역에 실제 할당된 오행으로 검색 (제주는 水만 보유)
    const regionTests: Array<{ siDo: string; ohang: ('木'|'火'|'土'|'金'|'水')[] }> = [
      { siDo: '서울', ohang: ['木'] },
      { siDo: '경기', ohang: ['木'] },
      { siDo: '부산', ohang: ['水'] },
      { siDo: '대구', ohang: ['金'] },
      { siDo: '인천', ohang: ['水'] },
      { siDo: '광주', ohang: ['水'] },
      { siDo: '대전', ohang: ['金'] },
      { siDo: '울산', ohang: ['水'] },
      { siDo: '강원', ohang: ['水'] },
      { siDo: '전남', ohang: ['水'] },
      { siDo: '전북', ohang: ['木'] },
      { siDo: '경남', ohang: ['水'] },
      { siDo: '경북', ohang: ['水'] },
      { siDo: '제주', ohang: ['水'] },
    ];

    regionTests.forEach(({ siDo, ohang }) => {
      const results = matchDistricts({
        deficitOhang: ohang,
        siDo,
        topN: 1
      });
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
