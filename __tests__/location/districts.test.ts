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

  test('대표 오분류 보정 케이스가 기대값으로 정리되어 있다', () => {
    const gaepo1 = districtsData.districts.find((item) => item.code === '1168066000');
    const jeongja1Bundang = districtsData.districts.find((item) => item.code === '4113555000');
    const misa1 = districtsData.districts.find((item) => item.code === '4145061000');

    expect(gaepo1).toMatchObject({
      name: '개포1동',
      terrain: 'flatland',
      ohang: [],
    });
    expect(gaepo1?.terrainTags).toEqual(['green']);

    expect(jeongja1Bundang).toMatchObject({
      name: '정자1동',
      siGunGu: '성남시 분당구',
      terrain: 'flatland',
      ohang: [],
    });
    expect(jeongja1Bundang?.terrainTags).toEqual(['waterfront']);

    expect(misa1).toMatchObject({
      name: '미사1동',
      terrain: 'waterfront',
      ohang: [],
    });
    expect(misa1?.terrainTags).toEqual(['flatland']);
  });

  test('오행이 비어 있는 항목은 지형 중심 안내 문구를 사용한다', () => {
    const emptyOhang = districtsData.districts.find(
      (item) => item.code === '1168066000',
    );

    expect(emptyOhang?.ohang).toEqual([]);
    expect(emptyOhang?.manualNote).toContain('오행 미확정으로 지형 중심 추천을 사용');
  });
});
