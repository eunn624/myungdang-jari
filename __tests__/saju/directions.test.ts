import { getBedDirection, getGilbang } from '../../lib/saju/directions';

describe('침대 머리 방향 (반안살 기반)', () => {
  test('子년생 → 동남', () => {
    expect(getBedDirection('子')).toBe('동남');
  });

  test('午년생 → 서북', () => {
    expect(getBedDirection('午')).toBe('서북');
  });

  test('12지지 모두 방향 반환', () => {
    const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const;
    const directions = ['북','동북','동','동남','남','서남','서','서북'];
    branches.forEach(b => {
      expect(directions).toContain(getBedDirection(b));
    });
  });
});

describe('길방(吉方) 산출 (용신 오행 기반)', () => {
  test('木 용신 → 동', () => {
    expect(getGilbang('木')).toBe('동');
  });

  test('火 용신 → 남', () => {
    expect(getGilbang('火')).toBe('남');
  });

  test('土 용신 → 서남', () => {
    expect(getGilbang('土')).toBe('서남');
  });

  test('金 용신 → 서', () => {
    expect(getGilbang('金')).toBe('서');
  });

  test('水 용신 → 북', () => {
    expect(getGilbang('水')).toBe('북');
  });
});
