import districtsData from '../../data/districts.json';

describe('전국 행정동 데이터셋', () => {
  test('모든 광역시도를 포함한다', () => {
    const siDos = new Set(districtsData.districts.map((item) => item.siDo));
    const expected = ['강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '울산', '인천', '전남', '전북', '제주'];
    expect(Array.from(siDos).sort()).toEqual(expected);
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

  test('대표 샘플이 완전한 데이터를 갖는다', () => {
    const gaepo1 = districtsData.districts.find((item) => item.code === '1168066000');
    const jeongja1Bundang = districtsData.districts.find((item) => item.code === '4113555000');
    const misa1 = districtsData.districts.find((item) => item.code === '4145061000');

    // 개포1동: 강남구 → 木 오행 할당됨
    expect(gaepo1).toMatchObject({
      name: '개포1동',
      terrain: 'flatland',
    });
    expect(gaepo1?.ohang.length).toBeGreaterThan(0);
    expect(gaepo1?.terrainTags).toEqual(['green']);

    // 정자1동: 성남시 분당구 → 木 오행 할당됨
    expect(jeongja1Bundang).toMatchObject({
      name: '정자1동',
      siGunGu: '성남시 분당구',
      terrain: 'flatland',
    });
    expect(jeongja1Bundang?.ohang.length).toBeGreaterThan(0);
    expect(jeongja1Bundang?.terrainTags).toEqual(['waterfront']);

    // 미사1동: 하남시 → 水 오행 할당됨
    expect(misa1).toMatchObject({
      name: '미사1동',
      terrain: 'waterfront',
    });
    expect(misa1?.ohang.length).toBeGreaterThan(0);
    expect(misa1?.terrainTags).toEqual(['flatland']);
  });

  test('한자 미확정 항목도 오행과 지형 정보를 갖는다', () => {
    const withoutHanja = districtsData.districts.find(
      (item) => item.code === '1168066000',
    );

    // 한자가 없어도 추론된 오행은 있음
    expect(withoutHanja?.hanja).toBe('');
    expect(withoutHanja?.ohang.length).toBeGreaterThan(0);
    expect(withoutHanja?.terrain).toBe('flatland');
  });
});
