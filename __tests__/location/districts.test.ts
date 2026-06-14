import districtsData from '../../data/districts.json';

describe('수도권 전체 행정동 데이터셋', () => {
  test('서울·경기만 포함한다', () => {
    const siDos = new Set(districtsData.districts.map((item) => item.siDo));
    expect(Array.from(siDos).sort()).toEqual(['경기', '서울']);
  });

  test('전체 건수가 1000개 이상이다', () => {
    expect(districtsData.districts.length).toBeGreaterThanOrEqual(1000);
    expect(districtsData._meta.totalCount).toBe(districtsData.districts.length);
  });

  test('행정동 코드는 유일하다', () => {
    const codes = districtsData.districts.map((item) => item.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  test('대표 샘플 코드가 존재한다', () => {
    const sampleCodes = ['1111051500', '4111156000', '4113554500', '4128151000'];
    for (const code of sampleCodes) {
      expect(districtsData.districts.some((item) => item.code === code)).toBe(true);
    }
  });
});
