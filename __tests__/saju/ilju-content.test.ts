import { ILJU_CONTENT, getIljuContent } from '../../data/ilju-content';

describe('일주 콘텐츠 데이터', () => {
  test('60갑자 콘텐츠를 모두 생성한다', () => {
    expect(ILJU_CONTENT).toHaveLength(60);
  });

  test('모든 일주 키가 유일하다', () => {
    const keys = new Set(ILJU_CONTENT.map(item => item.ganji));
    expect(keys.size).toBe(60);
  });

  test('각 일주에 긴 해석과 개운법이 포함된다', () => {
    for (const item of ILJU_CONTENT) {
      expect(item.longDescription.length).toBeGreaterThan(700);
      expect(item.interpretation).toHaveLength(3);
      expect(item.gaeunMethods.length).toBeGreaterThanOrEqual(5);
      expect(item.favorableTerrains.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('정유 일주 조회가 가능하다', () => {
    const content = getIljuContent({ stem: '丁', branch: '酉' });
    expect(content).toBeDefined();
    expect(content?.korean).toBe('정유');
    expect(content?.animal).toBe('닭');
  });
});
