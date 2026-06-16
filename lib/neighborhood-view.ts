import type { AppReport } from './app-report';
import { TERRAIN_LABELS } from './location/terrain';

const PIN_POSITIONS = [
  { x: '28%', y: '34%' },
  { x: '76%', y: '22%' },
  { x: '54%', y: '52%' },
  { x: '18%', y: '58%' },
  { x: '84%', y: '66%' },
] as const;

export type NeighborhoodView = {
  code: string;
  rank: number;
  name: string;
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
  pinX: string;
  pinY: string;
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

    return {
      code: item.district.code,
      rank: index + 1,
      name: item.district.name,
      city: item.district.siDo,
      district: item.district.siGunGu,
      fullLabel: `${item.district.siDo} ${item.district.siGunGu} ${item.district.name}`,
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
      pinX: pin.x,
      pinY: pin.y,
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
