import type { AppReport } from './app-report';
import { TERRAIN_LABELS } from './location/terrain';

const PIN_POSITIONS: Array<{ x: string; y: string }> = [
  { x: '28%', y: '34%' },
  { x: '76%', y: '22%' },
  { x: '54%', y: '52%' },
  { x: '18%', y: '58%' },
  { x: '84%', y: '66%' },
];

// 서울 시청 기준점 (지도 계산용)
const SEOUL_CENTER = { lat: 37.5665, lng: 126.9784 };

// 시도별 중심 좌표 (방위 계산 기준점)
const SIDO_CENTERS: Record<string, { lat: number; lng: number; label: string }> = {
  '서울': { lat: 37.5665, lng: 126.9784, label: '서울 도심' },
  '경기': { lat: 37.5665, lng: 126.9784, label: '서울 도심' },
  '인천': { lat: 37.5665, lng: 126.9784, label: '서울 도심' },
  '부산': { lat: 35.1796, lng: 129.0756, label: '부산 시청' },
  '대구': { lat: 35.8714, lng: 128.6014, label: '대구 시청' },
  '광주': { lat: 35.1595, lng: 126.8526, label: '광주 시청' },
  '대전': { lat: 36.3504, lng: 127.3845, label: '대전 시청' },
  '울산': { lat: 35.5394, lng: 129.3114, label: '울산 시청' },
  '강원': { lat: 37.8813, lng: 127.7300, label: '강원 도청' },
  '전남': { lat: 34.8160, lng: 126.4627, label: '전남 도청' },
  '전북': { lat: 35.7175, lng: 127.1540, label: '전북 도청' },
  '경남': { lat: 35.2374, lng: 128.6923, label: '경남 도청' },
  '경북': { lat: 36.4919, lng: 129.1075, label: '경북 도청' },
  '제주': { lat: 33.5033, lng: 126.5312, label: '제주 시청' },
};

export type NeighborhoodView = {
  code: string;
  rank: number;
  name: string;
  baseName: string;  // "역삼1동" → "역삼동"
  city: string;
  district: string;
  fullLabel: string;
  hanja?: string;
  suitability: number;
  terrain: string;
  terrainLabel: string;
  vibe?: 'lively' | 'balanced' | 'quiet';
  vibeLabel?: string;
  tags: string[];
  reasons: string[];
  summary: string;
  oneLine: string;
  realityCheck: string;
  pinX: string;  // 좌표 또는 사전 정의 위치 "28%", "35%" 등
  pinY: string;  // 좌표 또는 사전 정의 위치 "34%", "45%" 등
  directionFromCenter: string;  // "서울 도심에서 동쪽 9km"
  nearbyLandmark: string;       // "강남역 인근"
};

export type FacilityCategory = '전체' | '교통' | '자연' | '편의시설' | '학교' | '의료';

export type FacilityItem = {
  name: string;
  type: FacilityCategory;
  icon: string;
  time: string;
};

function getSuitability(score: number) {
  return Math.max(85, Math.min(97, 70 + Math.round(score / 2)));
}

// 두 좌표 간 거리 (km, Haversine)
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 방위각(도) → 8방위 한글
function bearingToDirKo(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const dLng = lng2 - lng1;
  const dLat = lat2 - lat1;
  let bearing = Math.atan2(dLng, dLat) * (180 / Math.PI);
  bearing = (bearing + 360) % 360;

  const dirs = ['북', '동북동', '동', '동남동', '남', '서남서', '서', '서북서'];
  const idx = Math.round(bearing / 45) % 8;
  return dirs[idx];
}

// 행정동별 주요 랜드마크 (시군구 + 방향)
const LANDMARK_MAP: Record<string, Record<string, string>> = {
  '강남구': { 남: '강남역', 북: '학현역', 동: '선릉역', 서: '신논현역' },
  '서초구': { 남: '서초역', 북: '교대역', 동: '강남역', 서: '사당역' },
  '송파구': { 남: '올림픽공원', 북: '잠실역', 동: '송파역', 서: '서울숲' },
  '광진구': { 남: '건대역', 북: '능동', 동: '자양동', 서: '동대문' },
  '용산구': { 남: '용산역', 북: '이태원', 동: '한남동', 서: '남영역' },
  '마포구': { 남: '홍대입구', 북: '당인리', 동: '신촌', 서: '합정역' },
  '강서구': { 남: '강서경찰서', 북: '여의도', 동: '등촌', 서: '발산' },
  '영등포구': { 남: '여의도공원', 북: '당산역', 동: '신길', 서: '영등포역' },
  '구로구': { 남: '신도림', 북: '가산', 동: '고리', 서: '구로역' },
  '금천구': { 남: '가산디지털단지', 북: '독산', 동: '시흥', 서: '독산역' },
  '동작구': { 남: '노량진', 북: '동작역', 동: '현충로', 서: '흑석' },
  '관악구': { 남: '봉천', 북: '서울대입구', 동: '신림', 서: '낙성대' },
  '종로구': { 남: '종로3가', 북: '북촌', 동: '동대문', 서: '서촌' },
  '중구': { 남: '서울역', 북: '을지로', 동: '명동', 서: '충정로' },
  '서대문구': { 남: '연세대', 북: '홍제', 동: '신촌', 서: '아현역' },
  '은평구': { 남: '불광', 북: '은평', 동: '증산', 서: '갈현' },
  '도봉구': { 남: '도봉산', 북: '월계', 동: '쌍문', 서: '초동' },
  '강북구': { 남: '미아', 북: '번동', 동: '수유', 서: '우이' },
  '노원구': { 남: '월계', 북: '하계', 동: '중계', 서: '공릉' },
  '양천구': { 남: '목동', 북: '신정', 동: '신월', 서: '목1동' },
  '중랑구': { 남: '상봉', 북: '신내', 동: '망우', 서: '면목' },
  '성북구': { 남: '성신여대입구', 북: '정릉', 동: '석관', 서: '안암' },
  '성동구': { 남: '상왕십리', 북: '성수', 동: '자성로', 서: '행당' },
  '동대문구': { 남: '동대문역사문화공원', 북: '제기', 동: '응봉', 서: '이문' },
};

function getNearbyLandmark(siGunGu: string, direction?: string): string {
  const dirs = direction ? [direction] : ['북', '동북', '동', '동남', '남', '서남', '서', '서북'];
  const landmarks = LANDMARK_MAP[siGunGu];
  if (!landmarks) return `${siGunGu} 생활권`;

  for (const dir of dirs) {
    if (landmarks[dir as keyof typeof landmarks]) {
      return `${landmarks[dir as keyof typeof landmarks]} 인근`;
    }
  }
  return `${siGunGu} 생활권`;
}

function getTerrainTags(terrainLabel: string, reasons: string[]) {
  const tags = [terrainLabel];

  if (reasons.some((reason) => reason.includes('한강') || reason.includes('수변') || reason.includes('물'))) {
    tags.push('수변 감각');
  }

  if (reasons.some((reason) => reason.includes('녹지') || reason.includes('공원') || reason.includes('산책'))) {
    tags.push('녹지 접근');
  }

  if (reasons.some((reason) => reason.includes('교통') || reason.includes('동선') || reason.includes('출퇴근'))) {
    tags.push('생활 동선');
  }

  return Array.from(new Set(tags)).slice(0, 3);
}

function getOneLine(name: string, terrainLabel: string, reasons: string[]) {
  const firstReason = reasons[0] || `${terrainLabel} 감각이 살아 있는 생활권이에요.`;
  return `${name}은 ${firstReason.replace(/\.$/, '')} 흐름과 연결돼요.`;
}

const VIBE_LABELS: Record<string, string> = {
  lively:   '활기찬 상권',
  balanced: '균형잡힌 동네',
  quiet:    '조용한 주거',
};

export function getNeighborhoodViews(report: AppReport, limit = 5): NeighborhoodView[] {
  return report.districts.slice(0, limit).map((item, index) => {
    const terrainLabel = TERRAIN_LABELS[item.district.terrain];
    const vibeTag = item.district.vibe ? VIBE_LABELS[item.district.vibe] : undefined;
    const tags = [
      ...item.district.ohang.map((ohang) => `${ohang} 보완`),
      ...(vibeTag ? [vibeTag] : []),
      ...getTerrainTags(terrainLabel, item.reasons),
    ].slice(0, 4);
    const pin = PIN_POSITIONS[index] || PIN_POSITIONS[PIN_POSITIONS.length - 1];
    const suitability = getSuitability(item.score);

    // 위치 인지 개선 데이터
    const baseName = item.district.name.replace(/\d+동$/, '동');
    let directionFromCenter = `${item.district.siDo} 생활권`;
    let pinX = pin.x;
    let pinY = pin.y;

    if (item.district.lat && item.district.lng) {
      const center = SIDO_CENTERS[item.district.siDo] ?? SIDO_CENTERS['서울'];
      const distKm = getDistanceKm(
        center.lat,
        center.lng,
        item.district.lat,
        item.district.lng
      );
      const dirKo = bearingToDirKo(
        center.lat,
        center.lng,
        item.district.lat,
        item.district.lng
      );
      const distStr = distKm < 3 ? '인근' : `${Math.round(distKm)}km`;
      directionFromCenter = `${center.label}에서 ${dirKo} ${distStr}`;

      // 좌표 기반 지도 핀 위치 (정규화, 서울권에서만 정밀)
      const latMin = 37.43, latMax = 37.70;
      const lngMin = 126.76, lngMax = 127.18;
      if (item.district.siDo === '서울' || item.district.siDo === '경기' || item.district.siDo === '인천') {
        pinX = `${Math.max(2, Math.min(95, ((item.district.lng - lngMin) / (lngMax - lngMin)) * 100))}%`;
        pinY = `${Math.max(2, Math.min(95, ((latMax - item.district.lat) / (latMax - latMin)) * 100))}%`;
      }
    }

    const nearbyLandmark = getNearbyLandmark(item.district.siGunGu, item.district.direction);

    // 광역시·도 단위는 siGunGu == name 이므로 레이블 중복 방지
    const fullLabel = item.district.name === item.district.siGunGu
      ? `${item.district.siDo} ${item.district.siGunGu}`
      : `${item.district.siDo} ${item.district.siGunGu} ${item.district.name}`;

    return {
      code: item.district.code,
      rank: index + 1,
      name: item.district.name,
      baseName,
      city: item.district.siDo,
      district: item.district.siGunGu,
      fullLabel,
      hanja: item.district.hanja,
      suitability,
      terrain: item.district.terrain,
      terrainLabel,
      vibe: item.district.vibe,
      vibeLabel: vibeTag,
      tags,
      reasons: item.reasons,
      summary: item.reasons.slice(0, 2).join(' · '),
      oneLine: getOneLine(item.district.name, terrainLabel, item.reasons),
      realityCheck: '실제 거주 선택에는 예산, 출퇴근, 생활권을 함께 확인해주세요.',
      pinX,
      pinY,
      directionFromCenter,
      nearbyLandmark,
    };
  });
}

export function getSelectedNeighborhood(report: AppReport, districtCode?: string | string[]) {
  const items = getNeighborhoodViews(report);
  const code = Array.isArray(districtCode) ? districtCode[0] : districtCode;
  return items.find((item) => item.code === code) || items[0] || null;
}

export function getNearbyFacilities(item: NeighborhoodView): FacilityItem[] {
  const base: FacilityItem[] = [
    { name: `${item.name.replace(/동$/, '')}역`, type: '교통', icon: '●', time: '도보 8분' },
    { name: `${item.district} 중심상권`, type: '편의시설', icon: '■', time: '차량 5분' },
    { name: `${item.name.replace(/동$/, '')}공원`, type: '자연', icon: '▲', time: '도보 6분' },
    { name: `${item.district} 생활권 학교`, type: '학교', icon: '▣', time: '도보 10분' },
    { name: `${item.district} 의료 인프라`, type: '의료', icon: '✚', time: '차량 7분' },
  ];

  if (item.terrain === 'waterfront') {
    return [
      { name: '수변 산책 동선', type: '자연', icon: '▲', time: '도보 5분' },
      ...base,
    ];
  }

  if (item.terrain === 'green') {
    return [
      { name: '근린 녹지와 산책로', type: '자연', icon: '▲', time: '도보 4분' },
      ...base,
    ];
  }

  return base;
}
