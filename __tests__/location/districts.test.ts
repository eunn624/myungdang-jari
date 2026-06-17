import districtsData from '../../data/districts.json';

describe('전국 행정동 데이터셋', () => {
  test('모든 광역시도를 포함한다', () => {
    const siDos = new Set(districtsData.districts.map((item) => item.siDo));
    const expected = ['강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '울산', '인천', '전남', '전북', '제주'];
    expect(Array.from(siDos).sort()).toEqual(expected);
  });

  test('전체 건수가 구 단위 규모이다 (100~200개)', () => {
    expect(districtsData.districts.length).toBeGreaterThanOrEqual(100);
    expect(districtsData.districts.length).toBeLessThanOrEqual(200);
    expect(districtsData._meta.totalCount).toBe(districtsData.districts.length);
  });

  test('행정동 코드는 유일하다', () => {
    const codes = districtsData.districts.map((item) => item.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  test('대표 샘플 코드가 존재한다', () => {
    // 구 단위 집계 코드: 강남구, 성남시 분당구, 하남시
    const sampleCodes = ['11680000000', '41135000000', '41450000000'];
    for (const code of sampleCodes) {
      expect(districtsData.districts.some((item) => item.code === code)).toBe(true);
    }
  });

  test('대표 샘플이 완전한 데이터를 갖는다', () => {
    const gangnam = districtsData.districts.find((item) => item.code === '11680000000');
    const bundang = districtsData.districts.find((item) => item.code === '41135000000');
    const hanam = districtsData.districts.find((item) => item.code === '41450000000');

    // 강남구: 木 오행 포함 (22개 동 집계)
    expect(gangnam).toMatchObject({
      name: '강남구',
      siDo: '서울',
      siGunGu: '강남구',
      terrain: 'flatland',
      adminLevel: 'sgg',
    });
    expect(gangnam?.ohang.length).toBeGreaterThan(0);
    expect(gangnam?.dongCount).toBeGreaterThan(0);

    // 성남시 분당구: 木 오행 포함
    expect(bundang).toMatchObject({
      name: '성남시 분당구',
      siGunGu: '성남시 분당구',
      adminLevel: 'sgg',
    });
    expect(bundang?.ohang.length).toBeGreaterThan(0);

    // 하남시: 경기 시 단위
    expect(hanam).toMatchObject({
      name: '하남시',
      siDo: '경기',
      adminLevel: 'sgg',
    });
    expect(hanam?.ohang.length).toBeGreaterThan(0);
  });

  test('서울은 25개 구로 집계되어 있다', () => {
    const seoulDistricts = districtsData.districts.filter((item) => item.siDo === '서울');
    expect(seoulDistricts.length).toBe(25);
    seoulDistricts.forEach((d) => {
      expect(d.adminLevel).toBe('sgg');
      expect(d.ohang.length).toBeGreaterThan(0);
      expect(d.terrain).toBeDefined();
    });
  });

  test('구 단위 집계 항목은 dongCount와 sampleDongs를 갖는다', () => {
    const gangnam = districtsData.districts.find((item) => item.siDo === '서울');
    expect((gangnam as any)?.dongCount).toBeGreaterThan(0);
    expect(Array.isArray((gangnam as any)?.sampleDongs)).toBe(true);
  });

  test('오행 집계 결과: 강남구는 木 오행을 포함한다', () => {
    const gangnam = districtsData.districts.find((item) => item.siGunGu === '강남구' && item.siDo === '서울');
    expect(gangnam?.ohang).toContain('木');
  });
});
