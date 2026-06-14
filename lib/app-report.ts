import type { ParsedUrlQuery } from 'querystring';
import { analyzeSaju, type BirthInfo, type SajuResult } from './saju';
import type { Ohang, DaeWoon, SeWoon } from './saju/types';
import { getTerrainPreference, matchDistricts } from './location/matcher';
import { getIljuContent, type IljuContent } from '../data/ilju-content';
import { getTodayGanji, getMonthGanji, getDayInfo, getMonthTip, getTodayKey, type DayInfo, type MonthTip } from './saju/daily';
import type { GanJi } from './saju/types';

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
  iljuContent: IljuContent | null;
  todayGanji: GanJi;
  todayDayInfo: DayInfo;
  monthGanji: GanJi;
  monthTip: MonthTip;
  todayKey: string;
  // Flat daily convenience fields
  todayOhang: Ohang;
  todayColorHex: string;
  todayColorName: string;
  todayDayMessage: string;
  monthOhang: Ohang;
  monthSpaceTip: string;
  daeWoonHomeReading: string;
  seWoonHomeReading: string;
}

const OHANG_LABELS: Record<Ohang, string> = {
  木: '나무처럼 자라는 흐름',
  火: '따뜻하게 확산되는 흐름',
  土: '안정적으로 받쳐주는 흐름',
  金: '정리하고 매듭짓는 흐름',
  水: '식히고 순환시키는 흐름',
};

// ─────────────────────────────────────────────
// 오행 관계 유틸
// ─────────────────────────────────────────────

type OhangRel = 'same' | 'sangsaeng' | 'sanggeuk' | 'pisaeng' | 'pigeuk' | 'neutral';

const SANGSAENG: [Ohang, Ohang][] = [['木','火'],['火','土'],['土','金'],['金','水'],['水','木']];
const SANGGEUK: [Ohang, Ohang][] = [['木','土'],['土','水'],['水','火'],['火','金'],['金','木']];

function ohangRelRaw(from: Ohang, to: Ohang): OhangRel {
  if (from === to) return 'same';
  if (SANGSAENG.some(([a,b]) => a===from && b===to)) return 'sangsaeng';
  if (SANGGEUK.some(([a,b]) => a===from && b===to)) return 'sanggeuk';
  if (SANGSAENG.some(([a,b]) => a===to && b===from)) return 'pisaeng';
  if (SANGGEUK.some(([a,b]) => a===to && b===from)) return 'pigeuk';
  return 'neutral';
}

function ohangRelLabel(rel: OhangRel): string {
  return ({
    same: '동류(同類) — 같은 기운',
    sangsaeng: '상생(相生) — 힘을 실어주는',
    sanggeuk: '상극(相剋) — 누르는',
    pisaeng: '피생(被生) — 도움받는',
    pigeuk: '피극(被剋) — 눌리는',
    neutral: '중립',
  } as Record<OhangRel, string>)[rel];
}

function ohangDir(ohang: Ohang): string {
  return ({ 木: '동쪽(東)', 火: '남쪽(南)', 土: '중앙', 金: '서쪽(西)', 水: '북쪽(北)' } as Record<Ohang, string>)[ohang];
}

function ohangSpace(ohang: Ohang): string {
  return ({
    木: '서재 또는 동쪽 창가',
    火: '거실 또는 남향 창가',
    土: '거실 중앙 또는 수납 공간',
    金: '현관 또는 서쪽 작업 공간',
    水: '침실 또는 북쪽 독서 코너',
  } as Record<Ohang, string>)[ohang];
}

function ohangBibo(ohang: Ohang): string {
  return ({
    木: '아레카야자·스킨답서스 같은 잎식물, 우드 프레임 소품, 초록·황록빛 러너나 쿠션',
    火: '붉은·코랄 패브릭 쿠션, 캔들 또는 아로마 디퓨저, 따뜻한 색온도 간접 조명, 주황빛 도자기',
    土: '베이지·황토색 쿠션·블랭킷, 낮은 채도의 도자기·도기 소품, 무게감 있는 수납 박스나 바구니',
    金: '화이트 선반, 메탈 프레임 사진액자, 크리스탈·유리 소품, 은빛 트레이',
    水: '투명 유리 화병이나 볼, 블루·그레이 쿠션이나 패브릭, 수채화·바다·강 사진, 소형 분수 또는 어항',
  } as Record<Ohang, string>)[ohang];
}

function ohangColorDesc(ohang: Ohang): string {
  return ({
    木: '초록·황록 계열(산록·올리브)',
    火: '붉은·주황 계열(코랄·테라코타)',
    土: '황토·베이지 계열(카멜·아이보리)',
    金: '흰색·은빛 계열(크림화이트·실버)',
    水: '블루·남색 계열(딥네이비·인디고)',
  } as Record<Ohang, string>)[ohang];
}

// ─────────────────────────────────────────────
// 오늘의 기운 메세지 (사주 전체 활용 · 풍수 중심)
// ─────────────────────────────────────────────

function buildTodayDayMessage(
  saju: SajuResult,
  dayInfo: DayInfo,
  iljuContent: IljuContent | null,
  districts: ReturnType<typeof matchDistricts>,
  profile: AppProfile,
): string {
  const todayO = dayInfo.ohang;
  const dominant = getDominantOhang(saju.ohang);
  const deficit = saju.deficitOhang[0] || saju.yongsin;
  const relDeficit = ohangRelRaw(todayO, deficit);
  const relDominant = ohangRelRaw(todayO, dominant);
  const gilbang = saju.gilbang;
  const bedDir = saju.bedDirection;
  const sinsal = saju.sinsal;
  const currentDaeWoon = saju.currentDaeWoon;
  const seWoon = saju.seWoon;
  const dayPillar = saju.pillars.day;
  const districtNames = districts.slice(0, 3).map(d => d.district.name);
  const parts: string[] = [];

  // P1 — 오늘 일진·기운 소개
  parts.push(
    `오늘은 ${dayInfo.stem}(${todayO}) 기운의 날입니다. ` +
    `${dayInfo.title}라 할 수 있는 이 날은, ${dayInfo.message} ` +
    `오행론으로 보면 ${todayO}이 공간 전반에 흐르며, ` +
    `풍수적으로는 ${ohangDir(todayO)} 방향이 오늘의 기운 통로가 됩니다. ` +
    `${ohangDir(todayO)}에 위치한 창문을 열거나 그 방향의 공간을 정돈하는 것만으로도 ` +
    `오늘의 기운을 집 안에 자연스럽게 불러들일 수 있어요. ` +
    `오늘 추천 컬러는 ${dayInfo.colorName}(${dayInfo.colorHex})로, ` +
    `이 색감의 소품을 생활 공간 어딘가에 눈에 띄게 올려두면 ` +
    `하루 내내 오늘의 기운을 상기시키는 역할을 합니다.`
  );

  // P2 — 사주 오행과 오늘 기운 관계
  const defRelDesc = relDeficit === 'sangsaeng'
    ? `오늘의 ${todayO} 기운이 부족 오행인 ${deficit}을 자연스럽게 키워주는 상생(相生) 구도입니다. ` +
      `이런 날은 풍수에서 '기운이 들어오는 날'에 해당해요. ` +
      `${ohangDir(deficit)} 쪽 창문을 열어두고 ${ohangBibo(deficit)}을 눈에 잘 띄는 곳에 놓으면 ` +
      `기운의 흐름이 공간에 빠르게 정착됩니다.`
    : relDeficit === 'same'
    ? `오늘의 기운이 부족 오행 ${deficit}과 같은 방향이에요. ` +
      `외부에서 ${deficit} 기운이 자연스럽게 들어오는 날이므로 ` +
      `${ohangDir(deficit)} 창문을 오늘만큼은 꼭 열어두세요. 공기 흐름 자체가 기운을 실어 나릅니다.`
    : relDeficit === 'sanggeuk'
    ? `오늘의 기운이 부족 오행 ${deficit}을 일시적으로 누르는 상극(相剋) 구도입니다. ` +
      `이럴 때일수록 공간에서 능동적으로 ${deficit} 기운을 채워야 해요. ` +
      `${ohangBibo(deficit)} 소품을 오늘 하나 더 꺼내거나 위치를 눈에 잘 띄는 곳으로 옮겨보세요.`
    : `오늘의 기운과 부족 오행이 ${ohangRelLabel(relDeficit)} 관계입니다. ` +
      `공간에서 ${ohangBibo(deficit)}을 배치하면 충분히 균형을 잡을 수 있어요.`;

  const domRelDesc = (relDominant === 'sangsaeng' || relDominant === 'same')
    ? `강한 오행인 ${dominant}이 오늘 더 활성화될 수 있어, ${ohangDir(dominant)} 방향 공간은 오늘 절제하며 관리하세요.`
    : `오늘은 강한 ${dominant} 기운이 자연스럽게 다독여지는 흐름으로, 균형이 잡히기 좋은 날이에요.`;

  parts.push(
    `${profile.name}님의 사주는 ${dayPillar.stem}${dayPillar.branch}(${dayPillar.stemKor}${dayPillar.branchKor}) 일주를 중심으로, ` +
    `${dominant} 오행이 강하고 ${deficit} 오행이 부족한 구성입니다. ` +
    `오늘의 ${todayO} 기운과 부족 오행 ${deficit}의 관계를 보면, ${defRelDesc} ` +
    domRelDesc
  );

  // P3 — 풍수 방위: 길방 · 침대 · 오늘 일진
  parts.push(
    `풍수에서 방위는 단순한 방향이 아니라 기운이 드나드는 통로입니다. ` +
    `${profile.name}님의 사주에서 설정된 길방(吉方)은 ${gilbang} 방향이고, ` +
    `수면 중 기운을 받는 침대 머리 방향은 ${bedDir}입니다. ` +
    `오늘 일진의 에너지가 흐르는 방향은 ${ohangDir(todayO)}입니다. ` +
    `세 방위를 함께 관리하는 우선순위: ` +
    `① 길방(${gilbang}) — 사주 기반 상시 관리, ` +
    `② 오늘 일진 방위(${ohangDir(todayO)}) — 오늘 하루 환기·정돈, ` +
    `③ 침대 방향(${bedDir}) — 수면 중 기운 수렴. ` +
    `침실 풍수의 기본은 ${bedDir} 방향 벽면을 비우는 것입니다. ` +
    `침대 머리 쪽 물건 적재와 침대 아래 수납은 기운 흐름을 막는 대표 요인이에요. ` +
    `오늘 이 부분만 정리해도 수면의 질과 회복 에너지가 달라집니다.`
  );

  // P4 — 집중 공간 + 비보 소품
  parts.push(
    `오늘 집중 관리할 공간은 ${ohangSpace(todayO)}와 ${ohangSpace(deficit)}입니다. ` +
    `${ohangSpace(todayO)}은 오늘의 ${todayO} 기운을 담는 그릇 역할을 하고, ` +
    `${ohangSpace(deficit)}은 부족한 ${deficit} 오행을 채우는 보완 공간이 됩니다. ` +
    `비보(補) 소품을 구체적으로 정리하면:\n` +
    `• 오늘 기운(${todayO}) 소품: ${ohangBibo(todayO)}\n` +
    `• 부족 오행(${deficit}) 보완 소품: ${ohangBibo(deficit)}\n\n` +
    `소품은 반드시 고가일 필요가 없습니다. ` +
    `유리컵 하나, 화분 한 개, 쿠션 하나만으로도 공간의 오행 밀도는 충분히 달라집니다. ` +
    `단, 소품이 먼지에 덮이거나 관리되지 않으면 역효과가 나므로 ` +
    `주기적으로 닦고 상태를 확인하는 것이 풍수 소품 관리의 핵심입니다.`
  );

  // P5 — 신살 연계 (있을 때)
  if (sinsal.length > 0) {
    const sinsalSummary = sinsal.map(s => `${s.name}(${s.hanja})`).join('·');
    const sinsalDescs = sinsal.map(s => `${s.name}: ${s.description}`).join(' / ');
    const spaceTags = sinsal.map(s => s.spaceTag).join(', ');
    parts.push(
      `${profile.name}님의 사주에는 ${sinsalSummary}이(가) 있습니다. ` +
      `각각의 성격을 보면: ${sinsalDescs}. ` +
      `풍수에서 신살은 '강한 에너지가 흐르는 통로'로 해석합니다. ` +
      `부정적으로만 볼 것이 아니라, 그 방위와 공간을 정돈하면 길하게 전환되는 경우가 많아요. ` +
      `오늘은 특히 ${spaceTags} 공간을 신경 써서 관리하세요. ` +
      `신살 방위의 공간을 깔끔하게 비우고 ` +
      `${ohangBibo(deficit)} 소품을 한 점 놓아두면 ` +
      `과한 기운이 부드럽게 정돈되는 비보 효과를 얻을 수 있습니다.`
    );
  }

  // P6 — 현재 대운
  if (currentDaeWoon) {
    const daeO = currentDaeWoon.ohang;
    const daeRelToday = ohangRelRaw(daeO, todayO);
    parts.push(
      `${profile.name}님은 현재 ${currentDaeWoon.ganJi.stem}${currentDaeWoon.ganJi.branch}(${daeO}) 대운 ` +
      `(${currentDaeWoon.startAge}세~${currentDaeWoon.endAge}세) 흐름 안에 계십니다. ` +
      `대운은 10년 단위의 큰 기운의 층으로, 일진보다 훨씬 강력하게 삶 전반을 관통합니다. ` +
      `대운의 ${daeO}과 오늘의 ${todayO}은 ${ohangRelLabel(daeRelToday)} 관계입니다. ` +
      (daeRelToday === 'sangsaeng' || daeRelToday === 'same'
        ? `대운과 일진이 잘 맞물리는 날로, 오늘 시작하는 공간 개선이 대운 흐름과 함께 지속적으로 작동하기 쉽습니다. `
        : `대운과 일진이 다른 방향을 가리키는 만큼, 오늘은 대운의 큰 흐름을 기준으로 삼고 ` +
          `일진은 일회성 루틴 정도로 활용하세요. `) +
      `대운 기간 내내 ${ohangBibo(daeO)}을 거실이나 서재처럼 ` +
      `가장 오래 머무는 공간에 상시 배치해두면, ` +
      `일진이 바뀌어도 안정적인 기운 기반이 유지됩니다.`
    );
  }

  // P7 — 세운
  if (seWoon) {
    const seO = seWoon.ohang;
    const seRelToday = ohangRelRaw(seO, todayO);
    parts.push(
      `올해 ${seWoon.year}년은 ${seWoon.ganJi.stem}${seWoon.ganJi.branch}(${seO}) 세운의 해입니다. ` +
      `연간 기운으로 ${seO}이 1년 내내 깔려 있으며, ` +
      `오늘의 ${todayO} 기운과는 ${ohangRelLabel(seRelToday)} 관계를 이룹니다. ` +
      `세운 기반 소품으로 ${ohangBibo(seO)}을 ` +
      `현관이나 서재처럼 하루를 여닫는 공간에 연중 배치해두세요. ` +
      `일진은 하루짜리 기운이지만 세운은 1년 내내 누적되므로, ` +
      `세운 소품이 일진 소품보다 더 중요한 기반이 됩니다. ` +
      `두 가지를 레이어로 쌓는 방식이 가장 효과적인 공간 풍수입니다.`
    );
  }

  // P8 — 일주 성향과 오늘 기운의 조합
  if (iljuContent) {
    parts.push(
      `${dayPillar.stem}${dayPillar.branch} 일주인 ${profile.name}님은 ${iljuContent.identitySummary}. ` +
      `이 일주의 공간 키워드는 '${iljuContent.spaceKeywords.slice(0, 3).join(' · ')}'이며, ` +
      `${iljuContent.favorableTerrains[0] || '자연 감성이 있는'} 환경에서 기운이 특히 잘 살아납니다. ` +
      `오늘 ${todayO} 기운의 날에 일주 특성을 공간에 활용하려면, ` +
      `'${iljuContent.spaceKeywords[0]}'을 의식한 소품 배치나 공간 정돈을 해보세요. ` +
      `일주의 타고난 결과 오늘의 기운이 잘 맞물릴 때 하루 에너지가 가장 자연스럽게 흘러갑니다.`
    );
  }

  // P9 — 오늘 실천 행동 종합
  const districtText = districtNames.length > 0
    ? `${districtNames.join(', ')} 같은 동네`
    : '수변이나 녹지 인접 생활권';
  parts.push(
    `오늘 공간에서 바로 할 수 있는 개운 행동을 정리하면:\n` +
    `1. ${dayInfo.spaceAction}\n` +
    `2. ${ohangBibo(deficit)} 중 하나를 꺼내 눈에 잘 띄는 곳에 배치하기\n` +
    `3. ${gilbang} 방향 공간(창가·책상·현관 중 해당하는 곳) 가볍게 정리하고 물건 줄이기\n` +
    `4. ${bedDir} 방향 침대 주변 물건 치우고 침대 아래 비우기\n` +
    `5. 외출 동선을 ${districtText}으로 잡아보기\n\n` +
    `풍수에서 가장 강력한 개운법은 '기운의 장소에 몸을 직접 두는 것'입니다. ` +
    `사주가 제안하는 방향의 장소, 지형, 동네를 실제로 걷는 것 — ` +
    `그것이 어떤 소품보다 강한 개운이 되는 이유입니다.`
  );

  return parts.join('\n\n');
}

// ─────────────────────────────────────────────
// 이번달 공간 팁 (사주 전체 활용 · 풍수 중심)
// ─────────────────────────────────────────────

function buildMonthSpaceTip(
  saju: SajuResult,
  monthTip: MonthTip,
  iljuContent: IljuContent | null,
  districts: ReturnType<typeof matchDistricts>,
  profile: AppProfile,
): string {
  const mO = monthTip.ohang;
  const dominant = getDominantOhang(saju.ohang);
  const deficit = saju.deficitOhang[0] || saju.yongsin;
  const relDeficit = ohangRelRaw(mO, deficit);
  const relDominant = ohangRelRaw(mO, dominant);
  const gilbang = saju.gilbang;
  const bedDir = saju.bedDirection;
  const seWoon = saju.seWoon;
  const currentDaeWoon = saju.currentDaeWoon;
  const sinsal = saju.sinsal;
  const dayPillar = saju.pillars.day;
  const districtNames = districts.slice(0, 3).map(d => d.district.name);
  const parts: string[] = [];

  // P1 — 이번달 월운 소개
  parts.push(
    `이번달은 ${monthTip.branch}(${mO}) 월의 기운이 흐릅니다. ` +
    `${monthTip.seasonNote} 시기에 해당하며, ${monthTip.headline}. ` +
    `${monthTip.spaceTip} ` +
    `풍수적으로 이번달의 핵심 방위는 ${ohangDir(mO)}이며, ` +
    `이 방향에 위치한 창문·가구·공간이 이달의 기운 통로가 됩니다. ` +
    `${ohangDir(mO)} 쪽 공간을 이달 내내 정기적으로 비우고 환기하는 것만으로도 ` +
    `월운 기운을 자연스럽게 집 안으로 끌어들일 수 있어요.`
  );

  // P2 — 사용자 오행과 이번달 기운 관계
  const defRelDesc2 = relDeficit === 'sangsaeng'
    ? `이번달 월운이 ${deficit} 오행을 자연스럽게 북돋아주는 상생 구도입니다. ` +
      `${ohangDir(deficit)} 방향 공간을 열어두고 ${ohangBibo(deficit)}을 배치하면 이달의 보충 기운을 최대한 흡수할 수 있습니다.`
    : relDeficit === 'same'
    ? `이번달 월운이 부족 오행 ${deficit}과 같은 방향이에요. ` +
      `${ohangDir(deficit)} 창문을 자주 열고 환기 루틴을 강화하세요.`
    : relDeficit === 'sanggeuk'
    ? `이번달 월운이 부족 오행 ${deficit}을 누르는 상극 구도입니다. ` +
      `공간에서 더 적극적으로 ${deficit} 소품을 강화하세요. ` +
      `${ohangBibo(deficit)}을 두 개 이상 배치하고 ${ohangDir(deficit)} 방향을 특별히 관리하세요.`
    : `이번달 기운과 부족 오행이 ${ohangRelLabel(relDeficit)} 관계입니다. ` +
      `의식적인 공간 관리로 충분히 균형을 잡을 수 있어요.`;

  const domRelDesc2 = (relDominant === 'sangsaeng' || relDominant === 'same')
    ? `강한 오행인 ${dominant}이 이달 더 활성화될 수 있어, ${ohangDir(dominant)} 방향 공간은 절제하며 관리하세요.`
    : `이번달은 강한 ${dominant} 기운이 자연스럽게 균형을 잡아가는 달이에요.`;

  parts.push(
    `${profile.name}님의 사주는 ${dayPillar.stem}${dayPillar.branch} 일주 중심으로 ` +
    `${dominant} 오행이 강하고 ${deficit} 오행이 부족합니다. ` +
    `이번달 ${mO} 기운과의 관계를 분석하면:\n` +
    `• 부족 오행(${deficit})과의 관계: ${defRelDesc2}\n` +
    `• 강한 오행(${dominant})과의 관계: ${domRelDesc2}`
  );

  // P3 — 이달 풍수 핵심 방위 + 공간
  parts.push(
    `이번달 풍수 관리의 핵심은 ${ohangDir(mO)} 방위와 사주 길방인 ${gilbang} 방향, 두 곳을 함께 챙기는 것입니다. ` +
    `${monthTip.focusArea}을 이달의 중점 관리 구역으로 삼아 주 1회 이상 정리·청소·환기를 해주세요. ` +
    `풍수에서 공간 관리의 핵심은 '비우기'입니다: ` +
    `물건이 쌓이면 기운이 막히고, 비울수록 새로운 기운이 채워집니다. ` +
    `현관은 기운의 첫 관문이므로 이달 내내 신발장 주변을 깔끔하게 유지하고, ` +
    `문 앞에 작은 식물 한 점을 두면 기운의 입구가 열립니다. ` +
    `침실은 ${bedDir} 방향 머리를 유지한 채, ` +
    `이달의 ${mO} 오행 컬러인 ${ohangColorDesc(mO)} 계열 침구·패브릭으로 교체하면 ` +
    `수면 중에도 이달의 기운 보완이 지속적으로 이루어집니다.`
  );

  // P4 — 비보 소품 (층위별)
  const iljuSpaceKw = iljuContent?.spaceKeywords?.[0] || '';
  parts.push(
    `이번달 공간에 배치할 비보 소품을 층위별로 정리하면:\n\n` +
    `[월운 기운(${mO}) 소품]\n${ohangBibo(mO)}\n` +
    `→ ${ohangSpace(mO)}에 배치. 이달의 핵심 기운을 담는 소품이에요.\n\n` +
    `[부족 오행(${deficit}) 보완 소품]\n${ohangBibo(deficit)}\n` +
    `→ ${ohangSpace(deficit)}에 배치. 사주 기반 상시 비보 소품으로 매달 유지하세요.\n\n` +
    (iljuSpaceKw
      ? `[일주(${dayPillar.stem}${dayPillar.branch}) 공간 키워드: '${iljuSpaceKw}']\n` +
        `이 일주는 ${iljuSpaceKw}를 의식한 공간 배치가 타고난 에너지를 살려주므로, ` +
        `소품 선택 시 이 감성을 기준으로 고르면 실용성과 풍수 효과가 동시에 납니다.\n\n`
      : '') +
    `소품 관리의 원칙 세 가지: ` +
    `① 해당 오행의 방위에 가까운 곳에 놓는다. ` +
    `② 눈에 잘 띄는 위치(선반 위, 테이블 위)에 두어야 기운 인식이 생긴다. ` +
    `③ 먼지·시듦 없이 관리한다. ` +
    `조명은 ${(mO === '水' || mO === '金') ? '차갑고 높은 켈빈(4000K 이상)의 조명이 이달 기운과 어울립니다' : '따뜻한 색온도(2700K~3000K) 간접 조명이 이달 공간 에너지를 받쳐줍니다'}.`
  );

  // P5 — 세운과 이번달 관계
  if (seWoon) {
    const seO = seWoon.ohang;
    const seRelMonth = ohangRelRaw(seO, mO);
    const seRelDesc =
      seRelMonth === 'sangsaeng'
        ? `세운이 이번달 월운을 키워주는 달입니다. 공간 개선 효과가 평소보다 크게 나타날 수 있어, ` +
          `이달 시작한 공간 루틴을 올해 내내 유지할 기반으로 삼기 좋은 타이밍이에요.`
        : seRelMonth === 'sanggeuk'
        ? `세운과 월운이 부딪히는 달입니다. 에너지 층이 복잡해지는 시기이므로, ` +
          `공간은 오히려 단순하게 정리하고 소품을 줄이는 방향으로 관리하세요.`
        : `세운과 월운이 ${ohangRelLabel(seRelMonth)} 관계로, 무난하게 흐르는 달입니다. ` +
          `큰 변화보다 일상 루틴을 꾸준히 유지하는 것이 핵심이에요.`;
    parts.push(
      `올해 ${seWoon.year}년은 ${seWoon.ganJi.stem}${seWoon.ganJi.branch}(${seO}) 세운의 해입니다. ` +
      `연간 기운 ${seO}과 이번달 월운 ${mO}은 ${ohangRelLabel(seRelMonth)} 관계에 있어요. ` +
      seRelDesc + ' ' +
      `대운(10년) → 세운(1년) → 월운(1달) → 일진(하루)으로 기운이 쌓이는 구조이므로, ` +
      `큰 기운의 층을 먼저 잡고 작은 기운을 더하는 순서로 공간을 꾸미는 것이 올바른 풍수 방향입니다. ` +
      `세운 기반 소품으로 ${ohangBibo(seO)}을 서재나 거실에 연중 배치하고, ` +
      `이번달 월운 소품은 침실이나 현관에 추가해 층위를 나눠보세요.`
    );
  }

  // P6 — 대운과 이번달 관계
  if (currentDaeWoon) {
    const daeO = currentDaeWoon.ohang;
    const daeRelMonth = ohangRelRaw(daeO, mO);
    parts.push(
      `${profile.name}님은 현재 ${currentDaeWoon.ganJi.stem}${currentDaeWoon.ganJi.branch}(${daeO}) ` +
      `대운(${currentDaeWoon.startAge}세~${currentDaeWoon.endAge}세) 안에 계십니다. ` +
      `대운은 월운보다 훨씬 강력한 기반 기운이므로, ` +
      `공간 인테리어의 기본 층위는 대운 기준으로 설정하고 ` +
      `월운은 그 위에 계절적으로 더하는 방식이 효과적입니다. ` +
      `대운의 ${daeO}과 이번달 ${mO}은 ${ohangRelLabel(daeRelMonth)} 관계입니다. ` +
      (daeRelMonth === 'sangsaeng'
        ? `대운이 월운을 지지해주는 흐름이라, 이달 공간 루틴이 대운 에너지와 함께 잘 작동합니다. `
        : daeRelMonth === 'sanggeuk'
        ? `대운과 월운이 다른 방향으로 흘러 에너지가 복잡해질 수 있어요. ` +
          `이럴 때일수록 공간의 기본 기반(대운 소품)을 흔들리지 않게 유지하는 것이 중요합니다. `
        : `대운과 월운이 무난하게 공존하는 달입니다. `) +
      `대운 기반 소품인 ${ohangBibo(daeO)}을 거실이나 서재 중심 공간에 상시 두고, ` +
      `이번달은 ${ohangBibo(mO)}을 침실·현관에 월간 소품으로 더해보세요.`
    );
  }

  // P7 — 신살 공간 활용
  if (sinsal.length > 0) {
    const spaceTags = sinsal.map(s => s.spaceTag).join(', ');
    parts.push(
      `신살 측면에서 이달 공간 관리 포인트를 추가하면: ` +
      `${sinsal.map(s => s.name).join('·')}의 에너지가 있는 ${profile.name}님의 경우, ` +
      `${spaceTags} 공간을 이달 집중적으로 관리해야 합니다. ` +
      `신살이 있는 방위는 에너지 흐름이 강하게 발생하는 통로이므로, ` +
      `어질러진 상태를 방치하면 그 기운이 불안정하게 흐릅니다. ` +
      `이달 안에 그 공간을 한 번 깊이 청소하고 재배치하는 시간을 내보세요. ` +
      `정돈된 신살 방위의 공간은 오히려 강한 추진력·인연·집중력의 통로가 됩니다.`
    );
  }

  // P8 — 추천 생활권
  if (districtNames.length > 0) {
    parts.push(
      `사주와 이번달 기운을 함께 고려한 추천 생활권은 ${districtNames.join(', ')}입니다. ` +
      `이 동네들은 ${deficit} 오행을 지명·지형에서 보완해주는 곳들로, ` +
      `이달처럼 에너지 관리가 중요한 시기에 이 생활권을 중심으로 이동하거나 ` +
      `짧은 산책·카페 방문을 더하면 일상에서 자연스럽게 기운이 채워집니다. ` +
      `풍수에서 '어느 곳에 몸을 두는가'는 소품 배치만큼 중요한 개운의 방법입니다. ` +
      `이사나 직장 이전을 고려 중이라면, 이달 이 동네를 한 번 걷고 ` +
      `몸이 어떻게 반응하는지 직접 느껴보세요.`
    );
  }

  // P9 — 이달 실천 루틴 종합
  const actionNums = monthTip.spaceActions.length;
  parts.push(
    `이번달 공간 개운 실천 루틴을 종합하면:\n` +
    monthTip.spaceActions.map((a, i) => `${i+1}. ${a}`).join('\n') + '\n' +
    `${actionNums+1}. ${ohangBibo(deficit)} 소품 하나 새로 들이거나 눈에 잘 띄는 위치로 이동\n` +
    `${actionNums+2}. ${ohangDir(mO)} 방향 공간 주 1회 이상 정기 청소·환기\n` +
    `${actionNums+3}. 침대 주변 물건 줄이고 ${bedDir} 방향 벽면 비우기\n` +
    `${actionNums+4}. 현관 정기 정돈 — 신발 수 줄이고 식물 또는 향 한 점 놓기\n` +
    `${actionNums+5}. ${districtNames.length > 0 ? districtNames[0] + ' 등 추천 생활권 산책' : '수변·녹지 가까운 동네 산책 루틴 만들기'}\n\n` +
    `이 중 하나라도 꾸준히 이달 내내 실천한다면 공간의 에너지는 반드시 달라집니다. ` +
    `풍수는 완벽한 배치가 아니라 '꾸준한 관리'가 핵심입니다.`
  );

  return parts.join('\n\n');
}

// ─────────────────────────────────────────────
// 이사 · 주거 리딩 (대운 / 세운)
// ─────────────────────────────────────────────

function buildDaeWoonHomeReading(currentDaeWoon: DaeWoon | null): string {
  if (!currentDaeWoon) return '생년월일을 입력하면 대운 기반 이사·주거 해석을 볼 수 있습니다.';
  const dw = currentDaeWoon;
  const range = `${dw.startAge}~${dw.endAge}세`;
  const ganjiStr = `${dw.ganJi.stem}${dw.ganJi.branch}`;
  const map: Record<Ohang, string> = {
    木: `${ganjiStr}(木) 대운(${range})은 시작과 확장의 기운입니다. 이 시기에는 독립·이사·새 출발이 자연스럽게 따라오는 경우가 많아요. 동쪽 방향으로의 이동이나 동향·동남향 주택이 길한 선택지가 됩니다. 신축 건물이나 리모델링을 처음 시작하기에도 좋은 대운이며, 이 시기에 이사를 결심했다면 흐름에 맞게 움직이는 것이 맞습니다.`,
    火: `${ganjiStr}(火) 대운(${range})은 활동과 표현의 기운입니다. 사회적 활동이 활발해지면서 입지 좋은 생활권으로 이동하려는 욕구가 강해지는 시기예요. 남향 주택이나 일조량이 풍부한 집이 이 대운과 잘 맞으며, 전세→매매 전환이나 규모 업그레이드를 고려하기 적합한 흐름입니다. 집 안 리모델링·인테리어 개선이 이 기운을 공간으로 끌어오는 방법이에요.`,
    土: `${ganjiStr}(土) 대운(${range})은 정착과 안정의 기운입니다. 내 집 마련, 주택 매매, 거주지 확정처럼 뿌리를 내리는 결정이 이 대운에 가장 잘 맞습니다. 사주 전체에서 집을 사기 가장 좋은 시기가 土 대운이에요. 오래 살 집, 생애 첫 내 집 마련을 이 시기에 결정하면 안정적인 기반이 됩니다. 평지·구릉 지형의 조용한 주거지가 이 대운의 길한 입지입니다.`,
    金: `${ganjiStr}(金) 대운(${range})은 정리와 결단의 기운입니다. 집 처분, 이사 결단, 불필요한 공간 축소처럼 기존의 것을 재편하는 흐름이 강하게 옵니다. 다운사이징이나 이사를 통해 삶의 짐을 줄이는 방향이 이 대운에 어울리는 선택이에요. 서쪽 방향이나 서향·북서향 입지가 金 대운과 맞으며, 불필요한 부동산을 정리하는 타이밍으로 활용하기 좋습니다.`,
    水: `${ganjiStr}(水) 대운(${range})은 순환과 흐름의 기운입니다. 한 곳에 오래 정착하기보다 이동하고 순환하는 주거 패턴이 자연스러운 시기예요. 전세·월세 형태로 유연하게 이동하거나, 수변(한강·지천·저수지 인접) 생활권이 이 대운의 길한 입지입니다. 이사를 고려한다면 충분한 정보 수집과 비교 분석 후 결정하세요. 水 대운에는 흐르는 방향에 몸을 맡기는 것이 거스르는 것보다 훨씬 잘 맞습니다.`,
  };
  return map[dw.ohang];
}

function buildSeWoonHomeReading(seWoon: SeWoon): string {
  const year = seWoon.year;
  const ganjiStr = `${seWoon.ganJi.stem}${seWoon.ganJi.branch}`;
  const map: Record<Ohang, string> = {
    木: `올해 ${year}년 ${ganjiStr}(木) 세운은 이사·독립·시작의 기운이 강한 해입니다. 새 공간으로 이동하거나 독립을 결심하기 좋은 시점이에요. 이사를 고려 중이라면 상반기 안에 물건을 보기 시작하는 것이 흐름과 맞습니다. 동쪽 방향이나 동향 주택, 녹지 인접 생활권이 올해의 길한 이사 방향입니다.`,
    火: `올해 ${year}년 ${ganjiStr}(火) 세운은 활동과 변화가 커지는 해입니다. 집에 변화를 주거나(리모델링·인테리어 개선), 생활권을 업그레이드하고 싶은 욕구가 강해지는 시기예요. 남향이나 일조 좋은 집으로의 이사가 올해 길한 방향이며, 집 안 조명을 따뜻하고 밝게 바꾸는 것만으로도 세운 에너지를 공간으로 끌어올 수 있습니다.`,
    土: `올해 ${year}년 ${ganjiStr}(土) 세운은 정착과 안정의 기운이 강한 해입니다. 주택 매매, 계약 갱신, 장기 거주 결정처럼 뿌리를 내리는 선택이 올해 가장 잘 맞습니다. 집을 살 계획이 있다면 올해 계약을 진행하는 것이 세운과 맞는 타이밍이에요. 평지·중심 생활권의 안정적인 주거지가 올해의 길한 선택입니다.`,
    金: `올해 ${year}년 ${ganjiStr}(金) 세운은 정리와 결단의 기운이 강한 해입니다. 불필요한 부동산 처분, 이사 결단, 주거 다운사이징처럼 '줄이고 정리하는' 방향이 올해의 자연스러운 흐름입니다. 임대·전세 계약을 재편하기 좋은 타이밍이에요. 서쪽 또는 북서쪽 방향 이동이 올해의 길한 방위입니다.`,
    水: `올해 ${year}년 ${ganjiStr}(水) 세운은 순환과 이동의 기운이 강한 해입니다. 이사나 거처 변경이 생길 가능성이 높고, 임대·전세 이동이 자연스럽게 따라오는 시기예요. 수변(강·하천·저수지 인접) 생활권이나 북쪽 방향 이동이 올해의 길한 이사 방향입니다. 주거 결정 전 충분한 정보 수집과 전문가 상담을 거치는 것이 좋습니다.`,
  };
  return map[seWoon.ohang];
}

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
  const saju = analyzeSaju(birth, profile.gender);
  const terrainPreference = saju.deficitOhang[0]
    ? getTerrainPreference(saju.deficitOhang[0])
    : undefined;
  const districts = matchDistricts({
    deficitOhang: saju.deficitOhang,
    siDo: ['서울', '경기'],
    terrainPreference,
    topN: 5,
  });

  const dominant = getDominantOhang(saju.ohang);
  const deficit = saju.deficitOhang[0] || saju.yongsin;
  const profileName = `${profile.name}님`;
  const dayAnimal = getDayAnimal(saju.pillars.day.branch);
  const tendency = getTendencyLabel(dominant);
  const roomTip = getRoomTip(deficit);
  const iljuContent = getIljuContent(saju.pillars.day);
  const iljuParagraphs = iljuContent?.interpretation;
  const iljuSummary = iljuContent?.identitySummary;
  const daily = getDailyFields();
  const dayInfo = daily.todayDayInfo;
  const monthInfo = daily.monthTip;

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
    summaryDescription: iljuSummary
      ? `${profileName}은 ${iljuSummary}로 볼 수 있어요. 다만 사주 안에서 ${deficit}의 여유가 부족하게 보이기 때문에, 생활 공간에서는 차분함과 순환감을 더해주는 선택이 균형에 도움이 됩니다.`
      : `${profileName}은 ${dayAnimal}처럼 자기 감각이 분명하고 ${tendency}이 살아 있는 편이에요. 다만 사주 안에서 ${deficit}의 여유가 부족하게 보이기 때문에, 생활 공간에서는 차분함과 순환감을 더해주는 선택이 균형에 도움이 됩니다.`,
    longReading: [
      iljuParagraphs?.[0] || `${profileName}은 자신의 감각과 기준이 분명한 사람이에요. 한번 마음이 움직이면 집중력이 붙고, 좋아하는 대상이나 일에는 정성을 오래 들이는 편입니다. ${saju.pillars.day.stem}${saju.pillars.day.branch} 일주를 중심으로 보면, 겉으로는 또렷하고 밝아 보여도 실제로는 분위기와 관계의 온도 차를 세심하게 느끼는 편에 가까워요.`,
      iljuParagraphs?.[1] || `사주의 중심 흐름은 ${dominant} 쪽에 힘이 실려 있고, 보완 포인트는 ${deficit}에 있어요. ${roomTip} 같은 선택이 특히 잘 맞는 편으로 읽혀요. 공간이 정리되어 있을수록 생각이 맑아지고 감정 기복도 부드러워지는 쪽으로 흘러갑니다.`,
      iljuParagraphs?.[2]
        ? `${iljuParagraphs[2]} 또한 ${saju.bedDirection} 방향 정리와 ${districts[0]?.district.name || '수변 동네'} 같은 생활권 참고를 함께 보면 실사용 가이드로 연결하기 좋습니다.`
        : `${profileName}에게 잘 맞는 개운 방식은 생활의 결을 조금씩 바꾸는 방식이에요. 특히 ${saju.bedDirection} 방향 정리, ${districts[0]?.district.name || '수변 동네'} 같은 생활권 참고, ${getTodayMission(deficit)} 같은 루틴은 반복할수록 체감이 잘 오는 편입니다.`,
    ],
    cautionReading: `${dominant} 기운이 강하게 올라오는 시기에는 서두르거나 감정적으로 결론을 내리기 쉬워요. 중요한 선택은 하루 정도 텀을 두고, 공간의 열감과 소음을 낮춘 뒤 다시 보는 편이 좋습니다.`,
    positiveReading: `${deficit}를 보완하는 생활 습관을 붙이면 집중력과 관계 감각이 동시에 안정되기 쉬워요. 차분한 조명, 정돈된 침실, 물성 있는 소품처럼 작지만 반복 가능한 방식이 특히 잘 맞습니다.`,
    sinsal: saju.sinsal.map(s => s.name),
    flowCards: ['사주팔자', '일간 중심', '오행 균형', '신살·길성', '대운·세운', '명당 추천', '개운법'],
    iljuContent: iljuContent ?? null,
    ...daily,
    todayOhang: dayInfo.ohang,
    todayColorHex: dayInfo.colorHex,
    todayColorName: dayInfo.colorName,
    todayDayMessage: buildTodayDayMessage(saju, dayInfo, iljuContent ?? null, districts, profile),
    monthOhang: monthInfo.ohang,
    monthSpaceTip: buildMonthSpaceTip(saju, monthInfo, iljuContent ?? null, districts, profile),
    daeWoonHomeReading: buildDaeWoonHomeReading(saju.currentDaeWoon),
    seWoonHomeReading: buildSeWoonHomeReading(saju.seWoon),
  };
}

// 입력값 없을 때 — 타입에 맞는 유효한 값으로 채움
function getEmptyReport(profile: AppProfile): AppReport {
  const currentYear = new Date().getFullYear();
  const emptySaju: SajuResult = {
    pillars: {
      year: { stem: '甲', branch: '子', stemKor: '-', branchKor: '-' },
      month: { stem: '甲', branch: '子', stemKor: '-', branchKor: '-' },
      day: { stem: '甲', branch: '子', stemKor: '-', branchKor: '-' },
      hour: null,
    },
    ohang: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 },
    deficitOhang: [],
    bedDirection: '북',
    gilbang: '북',
    yongsin: '木',
    sinsal: [],
    daeWoon: [],
    currentDaeWoon: null,
    seWoon: { year: currentYear, ganJi: { stem: '甲', branch: '子', stemKor: '갑', branchKor: '자' }, ohang: '木' },
  };

  const daily = getDailyFields();
  const dayInfo = daily.todayDayInfo;
  const monthInfo = daily.monthTip;

  return {
    profile,
    saju: emptySaju,
    districts: [],
    formattedBirth: '생년월일시를 입력하면 분석됩니다',
    formattedToday: formatToday(),
    todayMission: '생년월일을 입력하면 오늘의 미션이 생성됩니다',
    dailyEnergyTitle: '개발 중...',
    dailyEnergyDescription: '생년월일시를 입력하면 당신의 기운을 분석합니다.',
    summaryTitle: '개발 중...',
    summaryDescription: '개발 중...',
    longReading: ['개발 중...', '개발 중...', '개발 중...'],
    cautionReading: '개발 중...',
    positiveReading: '개발 중...',
    sinsal: [],
    flowCards: [],
    iljuContent: null,
    ...daily,
    // Flat fields — 날짜 기반은 항상 실계산, 메세지는 일반형
    todayOhang: dayInfo.ohang,
    todayColorHex: dayInfo.colorHex,
    todayColorName: dayInfo.colorName,
    todayDayMessage: dayInfo.message,
    monthOhang: monthInfo.ohang,
    monthSpaceTip: monthInfo.spaceTip,
    daeWoonHomeReading: '생년월일을 입력하면 대운 기반 이사·주거 해석을 볼 수 있습니다.',
    seWoonHomeReading: '생년월일을 입력하면 세운 기반 이사·주거 해석을 볼 수 있습니다.',
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
  const map: Record<Ohang, string> = {
    水: '창가에 물컵이나 작은 화병을 올려두기',
    木: '동쪽에 식물이나 우드 소품 두기',
    火: '따뜻한 조명과 붉은 포인트 한 가지 더하기',
    土: '침실 주변을 비우고 베이지 톤 패브릭 정리하기',
    金: '금속 프레임이나 화이트 정리 수납 추가하기',
  };
  return map[deficit];
}

function getTendencyLabel(ohang: Ohang): string {
  const map: Record<Ohang, string> = {
    木: '성장하려는 기세',
    火: '표현력과 존재감',
    土: '안정감과 실무 감각',
    金: '판단력과 정리력',
    水: '관찰력과 순환 감각',
  };
  return map[ohang];
}

function getRoomTip(deficit: Ohang): string {
  const map: Record<Ohang, string> = {
    木: '식물, 우드 소품, 동쪽 포인트',
    火: '따뜻한 조명, 붉은 패브릭, 체온감 있는 공간',
    土: '낮은 채도의 베이지, 비우기, 안정적인 수납',
    金: '화이트, 메탈 프레임, 직선적인 정리',
    水: '물성 있는 블루톤, 유리, 차분한 수변 감각',
  };
  return map[deficit];
}

function getDayAnimal(branch: string): string {
  const map: Record<string, string> = {
    子: '밤공기를 잘 읽는 쥐', 丑: '천천히 힘을 모으는 소',
    寅: '시작을 두려워하지 않는 호랑이', 卯: '관계를 부드럽게 여는 토끼',
    辰: '큰 흐름을 보는 용', 巳: '감각이 빠른 뱀',
    午: '열기가 선명한 말', 未: '생활 결을 다듬는 양',
    申: '상황 판단이 빠른 원숭이', 酉: '디테일에 강한 닭',
    戌: '기준을 지키는 개', 亥: '깊이를 보는 돼지',
  };
  return map[branch] || '감각이 분명한 사람';
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

function getString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function normalizeGender(value: string): Gender {
  return value === '남성' ? '남성' : '여성';
}

function normalizeCalendar(value: string): CalendarType {
  return value === '음력' ? '음력' : '양력';
}

function getDailyFields() {
  const todayGanji = getTodayGanji();
  const monthGanji = getMonthGanji();
  return {
    todayGanji,
    todayDayInfo: getDayInfo(todayGanji.stem),
    monthGanji,
    monthTip: getMonthTip(monthGanji.branch),
    todayKey: getTodayKey(),
  };
}
