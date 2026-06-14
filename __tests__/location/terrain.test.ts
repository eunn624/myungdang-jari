import {
  classifyDistrictTerrain,
  districtHasTerrain,
  getTerrainPreferenceByOhang,
  inferTerrainTags,
  TERRAIN_LABELS,
} from '../../lib/location/terrain';
import type { District } from '../../lib/location/types';

const baseDistrict: District = {
  code: '0000000000',
  name: '테스트동',
  hanja: '測試洞',
  siDo: '서울',
  siGunGu: '테스트구',
  ohangChars: [],
  ohang: [],
  terrain: 'waterfront',
  terrainNote: '한강변 수변, 국사봉 기슭',
  hanjaStatus: 'manual_review',
};

describe('지형 특성 분류', () => {
  test('지형 라벨은 한국어로 제공', () => {
    expect(TERRAIN_LABELS.highland).toBe('고지대');
    expect(TERRAIN_LABELS.waterfront).toBe('수변');
    expect(TERRAIN_LABELS.flatland).toBe('평지');
    expect(TERRAIN_LABELS.green).toBe('녹지');
  });

  test('terrainNote에서 수변·고지대 태그를 추론', () => {
    const tags = inferTerrainTags('한강변 수변, 국사봉 기슭');
    expect(tags).toContain('waterfront');
    expect(tags).toContain('highland');
  });

  test('대표 지형과 보조 태그를 함께 반환', () => {
    const result = classifyDistrictTerrain(baseDistrict);
    expect(result.primary).toBe('waterfront');
    expect(result.tags).toContain('waterfront');
    expect(result.tags).toContain('highland');
    expect(result.label).toBe('수변');
  });

  test('명시 terrainTags가 있으면 분류 태그에 포함', () => {
    const result = classifyDistrictTerrain({
      ...baseDistrict,
      terrain: 'flatland',
      terrainTags: ['green'],
      terrainNote: '경의선숲길 인근 평지',
    });
    expect(result.tags).toContain('flatland');
    expect(result.tags).toContain('green');
  });

  test('districtHasTerrain은 보조 태그까지 포함해 판정', () => {
    expect(districtHasTerrain(baseDistrict, 'highland')).toBe(true);
    expect(districtHasTerrain(baseDistrict, 'waterfront')).toBe(true);
    expect(districtHasTerrain(baseDistrict, 'green')).toBe(false);
  });
});

describe('오행별 선호 지형', () => {
  test('木 → 녹지', () => expect(getTerrainPreferenceByOhang('木')).toBe('green'));
  test('水 → 수변', () => expect(getTerrainPreferenceByOhang('水')).toBe('waterfront'));
  test('土 → 고지대', () => expect(getTerrainPreferenceByOhang('土')).toBe('highland'));
  test('火 → 평지', () => expect(getTerrainPreferenceByOhang('火')).toBe('flatland'));
  test('金 → 평지', () => expect(getTerrainPreferenceByOhang('金')).toBe('flatland'));
});
