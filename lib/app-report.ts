import type { ParsedUrlQuery } from 'querystring';
import { analyzeSaju, type BirthInfo, type SajuResult } from './saju';
import type { Ohang } from './saju/types';
import { getTerrainPreference, matchDistricts } from './location/matcher';

type Gender = '여성' | '남성';
type CalendarType = '양력' | '음력';

export interface AppProfile {
  name: string;
  gender: Gender;
  calendar: CalendarType;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
}

export interface AppReport {
  profile: AppProfile;
  saju: SajuResult;
  districts: ReturnType<typeof matchDistricts>;
  formattedBirth: string;
  formattedToday: string;
  todayMission: string;
  dailyEnergyTitle: string;
  dailyEnergyDescription: string;
  summaryTitle: string;
  summaryDescription: string;
  longReading: string[];
  cautionReading: string;
  positiveReading: string;
  sinsal: string[];
  flowCards: string[];
}

const OHANG_LABELS: Record<Ohang, string> = {
  木: '나무처럼 자라는 흐름',
  火: '따뜻하게 확산되는 흐름',
  土: '안정적으로 받쳐주는 흐름',
  金: '정리하고 매듭짓는 흐름',
  水: '식히고 순환시키는 흐름',
};

export function getProfileFromQuery(query: ParsedUrlQuery): AppProfile {
  return {
    name: getString(query.name) || '사용자',
    gender: normalizeGender(getString(query.gender)),
    calendar: normalizeCalendar(getString(query.calendar)),
    birthDate: getString(query.birthDate) || '',
    birthTime: getString(query.birthTime) || '',
    unknownTime: getString(query.unknownTime) === 'true',
  };
}

export function getReportFromQuery(query: ParsedUrlQuery): AppReport {
  const profile = getProfileFromQuery(query);
  
  if (!profile.birthDate) {
    return getEmptyReport(profile);
  }
  
  return buildReport(profile);
}

export function buildReport(profile: AppProfile): AppReport {
  const birth = getBirthInfo(profile);
  const saju = analyzeSaju(birth);
  const terrainPreference = saju.deficitOhang[0]
    ? getTerrainPreference(saju.deficitOhang[0])
    : undefined;
  const districts = matchDistricts({
    deficitOhang: saju.deficitOhang,
    siDo: '서울',
    terrainPreference,
    topN: 5,
  });

  const dominant = getDominantOhang(saju.ohang);
  const deficit = saju.deficitOhang[0] || saju.yongsin;
  const profileName = `${profile.name}님`;
  const dayAnimal = getDayAnimal(saju.pillars.day.branch);
  const tendency = getTendencyLabel(dominant);
  const roomTip = getRoomTip(deficit);

  return {
    profile,
    saju,
    districts,
    formattedBirth: formatBirth(profile),
    formattedToday: formatToday(),
    todayMission: getTodayMission(deficit),
    dailyEnergyTitle: `${dominant}가 잘 도는 날`,
    dailyEnergyDescription: `${OHANG_LABELS[dominant]}이 드러나고 ${deficit} 보완을 의식하면 더 편안한 흐름을 만들 수 있어요.`,
    summaryTitle: `${dominant} 기운이 먼저 보이고 ${deficit} 보완이 필요한 흐름`,
    summaryDescription: `${profileName}은 ${dayAnimal}처럼 자기 감각이 분명하고 ${tendency}이 살아 있는 편이에요. 다만 사주 안에서 ${deficit}의 여유가 부족하게 보이기 때문에, 생활 공간에서는 차분함과 순환감을 더해주는 선택이 균형에 도움이 됩니다.`,
    longReading: [
      `${profileName}은 자신의 감각과 기준이 분명한 사람이에요. 한번 마음이 움직이면 집중력이 붙고, 좋아하는 대상이나 일에는 정성을 오래 들이는 편입니다. ${saju.pillars.day.stem}${saju.pillars.day.branch} 일주를 중심으로 보면, 겉으로는 또렷하고 밝아 보여도 실제로는 분위기와 관계의 온도 차를 세심하게 느끼는 편에 가까워요. 그래서 사람보다 공간의 상태에 먼저 영향을 받는 날도 분명히 있습니다.`,
      `사주의 중심 흐름은 ${dominant} 쪽에 힘이 실려 있고, 보완 포인트는 ${deficit}에 있어요. 그래서 너무 뜨겁고 빠른 환경보다는 숨을 고를 수 있는 여백, 물성이나 바람, 정돈된 동선처럼 순환을 만들어주는 요소가 중요합니다. 지금 결과에서는 ${roomTip} 같은 선택이 특히 잘 맞는 편으로 읽혀요. 공간이 정리되어 있을수록 생각이 맑아지고 감정 기복도 부드러워지는 쪽으로 흘러갑니다.`,
      `${profileName}에게 잘 맞는 개운 방식은 무언가를 과하게 더하는 것보다, 생활의 결을 조금씩 바꾸는 방식이에요. 침대 방향을 정리하고, 자주 머무는 곳에 ${deficit} 계열 색과 소재를 두고, 산책 동선이나 창가 배치를 손보는 식의 작은 수정이 훨씬 오래 갑니다. 특히 ${saju.bedDirection} 방향 정리, ${districts[0]?.district.name || '수변 동네'} 같은 생활권 참고, ${getTodayMission(deficit)} 같은 루틴은 반복할수록 체감이 잘 오는 편입니다.`,
    ],
    cautionReading: `${dominant} 기운이 강하게 올라오는 시기에는 서두르거나 감정적으로 결론을 내리기 쉬워요. 중요한 선택은 하루 정도 텀을 두고, 공간의 열감과 소음을 낮춘 뒤 다시 보는 편이 좋습니다.`,
    positiveReading: `${deficit}를 보완하는 생활 습관을 붙이면 집중력과 관계 감각이 동시에 안정되기 쉬워요. 차분한 조명, 정돈된 침실, 물성 있는 소품처럼 작지만 반복 가능한 방식이 특히 잘 맞습니다.`,
    sinsal: ['도화살', '반안살', '천을귀인', '문창귀인'],
    flowCards: ['사주팔자', '일간 중심', '오행 균형', '신살·길성', '대운·세운', '명당 추천', '개운법'],
  };
}

function getEmptyReport(profile: AppProfile): AppReport {
  return {
    profile,
    saju: {
      pillars: {
        year: { stem: '개', branch: '발', stemKor: '개발', branchKor: '중' },
        month: { stem: '.', branch: '.', stemKor: '..', branchKor: '..' },
        day: { stem: '.', branch: '.', stemKor: '..', branchKor: '..' },
        hour: null,
      },
      ohang: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 },
      deficitOhang: [],
      bedDirection: '북',
      gilbang: '북',
      yongsin: '木',
    },
    districts: [],
    formattedBirth: '생년월일시를 입력하면 분석됩니다',
    formattedToday: formatToday(),
    todayMission: '개발 중...',
    dailyEnergyTitle: '개발 중...',
    dailyEnergyDescription: '생년월일시를 입력하면 당신의 기운을 분석합니다.',
    summaryTitle: '개발 중...',
    summaryDescription: '개발 중...',
    longReading: ['개발 중...', '개발 중...', '개발 중...'],
    cautionReading: '개발 중...',
    positiveReading: '개발 중...',
    sinsal: [],
    flowCards: [],
  };
}

export function createQueryFromProfile(profile: AppProfile): Record<string, string> {
  return {
    name: profile.name,
    gender: profile.gender,
    calendar: profile.calendar,
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    unknownTime: String(profile.unknownTime),
  };
}

function getBirthInfo(profile: AppProfile): BirthInfo {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const hour = profile.unknownTime ? undefined : Number(profile.birthTime.split(':')[0] || '0');

  return { year, month, day, hour };
}

function getDominantOhang(ohang: SajuResult['ohang']): Ohang {
  const entries: Array<[Ohang, number]> = [
    ['木', ohang.wood],
    ['火', ohang.fire],
    ['土', ohang.earth],
    ['金', ohang.metal],
    ['水', ohang.water],
  ];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function getTodayMission(deficit: Ohang): string {
  switch (deficit) {
    case '水':
      return '창가에 물컵이나 작은 화병을 올려두기';
    case '木':
      return '동쪽에 식물이나 우드 소품 두기';
    case '火':
      return '따뜻한 조명과 붉은 포인트 한 가지 더하기';
    case '土':
      return '침실 주변을 비우고 베이지 톤 패브릭 정리하기';
    case '金':
      return '금속 프레임이나 화이트 정리 수납 추가하기';
    default:
      return '자주 머무는 공간을 차분하게 정리하기';
  }
}

function formatBirth(profile: AppProfile): string {
  if (!profile.birthDate) return '';
  const date = profile.birthDate.replaceAll('-', '. ');
  return `${date}${profile.unknownTime ? ' (시 모름)' : ` (${profile.birthTime})`}`;
}

function formatToday(): string {
  const now = new Date();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${now.getFullYear()} · ${String(now.getMonth() + 1).padStart(2, '0')} · ${String(now.getDate()).padStart(2, '0')} · ${weekdays[now.getDay()]}`;
}

function getDayAnimal(branch: string): string {
  const map: Record<string, string> = {
    子: '밤공기를 잘 읽는 쥐',
    丑: '천천히 힘을 모으는 소',
    寅: '시작을 두려워하지 않는 호랑이',
    卯: '관계를 부드럽게 여는 토끼',
    辰: '큰 흐름을 보는 용',
    巳: '감각이 빠른 뱀',
    午: '열기가 선명한 말',
    未: '생활 결을 다듬는 양',
    申: '상황 판단이 빠른 원숭이',
    酉: '디테일에 강한 닭',
    戌: '기준을 지키는 개',
    亥: '깊이를 보는 돼지',
  };
  return map[branch] || '감각이 분명한 사람';
}

function getTendencyLabel(ohang: Ohang): string {
  switch (ohang) {
    case '木':
      return '성장하려는 기세';
    case '火':
      return '표현력과 존재감';
    case '土':
      return '안정감과 실무 감각';
    case '金':
      return '판단력과 정리력';
    case '水':
      return '관찰력과 순환 감각';
    default:
      return '또렷한 중심감';
  }
}

function getRoomTip(deficit: Ohang): string {
  switch (deficit) {
    case '木':
      return '식물, 우드 소품, 동쪽 포인트';
    case '火':
      return '따뜻한 조명, 붉은 패브릭, 체온감 있는 공간';
    case '土':
      return '낮은 채도의 베이지, 비우기, 안정적인 수납';
    case '金':
      return '화이트, 메탈 프레임, 직선적인 정리';
    case '水':
      return '물성 있는 블루톤, 유리, 차분한 수변 감각';
    default:
      return '정리된 동선과 편안한 휴식 공간';
  }
}

function getString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function normalizeGender(value: string): Gender {
  return value === '남성' ? '남성' : '여성';
}

function normalizeCalendar(value: string): CalendarType {
  return value === '음력' ? '음력' : '양력';
}
