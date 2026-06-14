import type { Ohang } from '../lib/saju/types';

export type StoreSource = '쿠팡' | '오늘의집' | '네이버쇼핑';
export type StoreTag = '식물' | '패브릭' | '조명' | '소품' | '수납' | '향·캔들' | '프레임' | '러그';

export interface StoreItem {
  id: string;
  ohang: Ohang;
  name: string;
  subtitle: string;
  description: string;
  url: string;
  source: StoreSource;
  tag: StoreTag;
  priceRange: string;
  recommended?: boolean;
}

// ─────────────────────────────────────────────
// 오행별 상품 (쿠팡/오늘의집 검색 링크)
// ─────────────────────────────────────────────

export const STORE_ITEMS: StoreItem[] = [

  // ── 木 오행 ── 동쪽·초록·성장
  {
    id: 'wood-1',
    ohang: '木',
    name: '아레카야자 화분',
    subtitle: '동쪽 창가 필수 식물',
    description: '木 기운을 가장 강하게 올려주는 대형 잎식물. 동쪽 창가나 서재에 두면 오행 균형에 효과적입니다.',
    url: 'https://www.coupang.com/np/search?q=아레카야자+화분',
    source: '쿠팡',
    tag: '식물',
    priceRange: '3~8만원',
    recommended: true,
  },
  {
    id: 'wood-2',
    ohang: '木',
    name: '스킨답서스 화분',
    subtitle: '관리 쉬운 초록 공기정화 식물',
    description: '반음지에서도 잘 자라 공간 어디에나 두기 좋습니다. 초록빛 기운을 꾸준히 내보내는 木 오행 소품입니다.',
    url: 'https://www.coupang.com/np/search?q=스킨답서스+화분',
    source: '쿠팡',
    tag: '식물',
    priceRange: '1~3만원',
  },
  {
    id: 'wood-3',
    ohang: '木',
    name: '우드 원형 트레이',
    subtitle: '자연 나무결 인테리어 소품',
    description: '테이블 위에 두면 木 기운이 자연스럽게 흐릅니다. 소품을 올려 정돈하는 기능도 겸합니다.',
    url: 'https://ohou.se/cards/search?query=우드+트레이',
    source: '오늘의집',
    tag: '소품',
    priceRange: '1~3만원',
  },
  {
    id: 'wood-4',
    ohang: '木',
    name: '초록 리넨 쿠션 커버',
    subtitle: '산록·올리브 컬러 패브릭',
    description: '木 오행 컬러인 초록 계열 쿠션으로 거실에 배치하면 균형 기운을 더할 수 있습니다.',
    url: 'https://ohou.se/cards/search?query=초록+쿠션커버',
    source: '오늘의집',
    tag: '패브릭',
    priceRange: '1~2만원',
  },
  {
    id: 'wood-5',
    ohang: '木',
    name: '우드 프레임 사진액자',
    subtitle: '자연 원목 프레임',
    description: '나무 결이 살아있는 원목 프레임. 서재나 침실 벽면에 세워두는 것만으로 木 기운을 담아냅니다.',
    url: 'https://www.coupang.com/np/search?q=원목+사진액자',
    source: '쿠팡',
    tag: '프레임',
    priceRange: '1~3만원',
  },

  // ── 火 오행 ── 남쪽·붉은·활력
  {
    id: 'fire-1',
    ohang: '火',
    name: '코랄 리넨 쿠션 커버',
    subtitle: '따뜻한 붉은 계열 패브릭',
    description: '火 오행을 상징하는 코랄·테라코타 컬러 쿠션. 거실 소파에 하나 더하면 활력 기운이 올라갑니다.',
    url: 'https://ohou.se/cards/search?query=코랄+쿠션커버',
    source: '오늘의집',
    tag: '패브릭',
    priceRange: '1~2만원',
    recommended: true,
  },
  {
    id: 'fire-2',
    ohang: '火',
    name: '우드윅 아로마 캔들',
    subtitle: '나무심지 소이캔들',
    description: '불꽃과 향이 동시에 火 기운을 채워줍니다. 저녁 시간 거실이나 서재에서 사용하면 집중과 활력 기운을 끌어올립니다.',
    url: 'https://www.coupang.com/np/search?q=우드윅+캔들',
    source: '쿠팡',
    tag: '향·캔들',
    priceRange: '2~5만원',
  },
  {
    id: 'fire-3',
    ohang: '火',
    name: '간접 조명 플로어 스탠드',
    subtitle: '따뜻한 색온도 2700K',
    description: '火 오행 활성화는 조명에서 가장 쉽게 시작됩니다. 따뜻한 노란빛 간접광이 공간의 활력을 높여줍니다.',
    url: 'https://ohou.se/cards/search?query=플로어+스탠드+인테리어',
    source: '오늘의집',
    tag: '조명',
    priceRange: '5~15만원',
  },
  {
    id: 'fire-4',
    ohang: '火',
    name: '주황빛 도자기 화병',
    subtitle: '테라코타 컬러 소품',
    description: '火 오행을 색으로 담아내는 소품. 건식 플라워를 꽂아 거실이나 현관에 두면 공간 온도가 올라갑니다.',
    url: 'https://www.coupang.com/np/search?q=테라코타+화병',
    source: '쿠팡',
    tag: '소품',
    priceRange: '1~3만원',
  },
  {
    id: 'fire-5',
    ohang: '火',
    name: '딥레드 러너 테이블보',
    subtitle: '식탁·콘솔 위 포인트',
    description: '테이블 위에 두면 식사 자리에 火 기운이 활성화됩니다. 가족 관계와 소통의 에너지를 높여주는 공간 선택입니다.',
    url: 'https://ohou.se/cards/search?query=테이블러너+레드',
    source: '오늘의집',
    tag: '패브릭',
    priceRange: '1~3만원',
  },

  // ── 土 오행 ── 중앙·황토·안정
  {
    id: 'earth-1',
    ohang: '土',
    name: '베이지 코튼 니트 블랭킷',
    subtitle: '낮은 채도의 포근한 패브릭',
    description: '土 오행 컬러인 베이지·카멜 계열 블랭킷. 소파나 침대에 두면 안정과 회복 기운이 흐릅니다.',
    url: 'https://ohou.se/cards/search?query=베이지+블랭킷+니트',
    source: '오늘의집',
    tag: '패브릭',
    priceRange: '2~5만원',
    recommended: true,
  },
  {
    id: 'earth-2',
    ohang: '土',
    name: '황토 도자기 오브제',
    subtitle: '흙빛 핸드메이드 도기',
    description: '土 기운을 직접적으로 담는 소품. 도기·도자 특유의 무게감이 공간의 안정 에너지를 잡아줍니다.',
    url: 'https://ohou.se/cards/search?query=도자기+오브제+황토',
    source: '오늘의집',
    tag: '소품',
    priceRange: '2~6만원',
  },
  {
    id: 'earth-3',
    ohang: '土',
    name: '수납 라탄 바구니 세트',
    subtitle: '천연 소재 정리 수납',
    description: '土 오행의 실무적 정리 기운을 살려주는 수납 소품. 거실 또는 침실 정리에 활용하면 안정 에너지가 높아집니다.',
    url: 'https://www.coupang.com/np/search?q=라탄+바구니+수납',
    source: '쿠팡',
    tag: '수납',
    priceRange: '2~4만원',
  },
  {
    id: 'earth-4',
    ohang: '土',
    name: '카멜 벨벳 쿠션',
    subtitle: '고급스러운 황토 컬러',
    description: '카멜·황토 컬러의 벨벳 쿠션은 土 기운을 고급스럽게 표현합니다. 소파 또는 침대 위에 두기 좋습니다.',
    url: 'https://www.coupang.com/np/search?q=카멜+벨벳+쿠션',
    source: '쿠팡',
    tag: '패브릭',
    priceRange: '1~3만원',
  },
  {
    id: 'earth-5',
    ohang: '土',
    name: '아이보리 면 러그',
    subtitle: '중앙 공간 안정 포인트',
    description: '거실 중앙에 두면 土 오행의 중심 안정 기운이 공간 전체를 받쳐줍니다. 낮은 채도 컬러로 시각적 안정도 생깁니다.',
    url: 'https://ohou.se/cards/search?query=아이보리+면러그',
    source: '오늘의집',
    tag: '러그',
    priceRange: '5~20만원',
  },

  // ── 金 오행 ── 서쪽·흰색·정리
  {
    id: 'metal-1',
    ohang: '金',
    name: '화이트 오픈 선반',
    subtitle: '깔끔한 정리 수납 선반',
    description: '金 오행의 정리·결단 기운을 공간에 담습니다. 화이트 선반으로 서쪽 벽면을 정리하면 기운의 흐름이 선명해집니다.',
    url: 'https://ohou.se/cards/search?query=화이트+선반+벽',
    source: '오늘의집',
    tag: '수납',
    priceRange: '3~10만원',
    recommended: true,
  },
  {
    id: 'metal-2',
    ohang: '金',
    name: '메탈 프레임 사진액자',
    subtitle: '실버·골드 메탈 프레임',
    description: '金 오행을 가장 직접적으로 표현하는 소품. 벽면에 세우거나 선반에 두는 것만으로 정리와 결단 기운이 생깁니다.',
    url: 'https://www.coupang.com/np/search?q=메탈프레임+액자',
    source: '쿠팡',
    tag: '프레임',
    priceRange: '1~3만원',
  },
  {
    id: 'metal-3',
    ohang: '金',
    name: '크리스탈 유리 오브제',
    subtitle: '투명·빛 반사 소품',
    description: '빛을 분산시키는 크리스탈 소품은 金 기운을 활성화합니다. 햇빛이 드는 창가에 두면 공간 기운이 가벼워집니다.',
    url: 'https://www.coupang.com/np/search?q=크리스탈+유리+오브제',
    source: '쿠팡',
    tag: '소품',
    priceRange: '1~4만원',
  },
  {
    id: 'metal-4',
    ohang: '金',
    name: '실버 트레이 정리함',
    subtitle: '메탈 소재 책상 정리',
    description: '책상 위나 선반 위의 잡동사니를 담아 정리하는 트레이. 金 기운의 정리·매듭 에너지를 생활에 적용합니다.',
    url: 'https://ohou.se/cards/search?query=실버트레이+정리함',
    source: '오늘의집',
    tag: '수납',
    priceRange: '1~3만원',
  },
  {
    id: 'metal-5',
    ohang: '金',
    name: '화이트 패브릭 쿠션',
    subtitle: '크림화이트·아이보리 패브릭',
    description: '金 오행 컬러인 흰색·크림 계열 쿠션. 소파 또는 침대에 두면 정제된 깔끔한 기운을 만들어냅니다.',
    url: 'https://www.coupang.com/np/search?q=화이트+쿠션커버',
    source: '쿠팡',
    tag: '패브릭',
    priceRange: '1~2만원',
  },

  // ── 水 오행 ── 북쪽·블루·순환
  {
    id: 'water-1',
    ohang: '水',
    name: '투명 유리 화병 세트',
    subtitle: '수분감 있는 공간 소품',
    description: '물성이 담긴 유리 화병은 水 기운을 가장 직접적으로 표현합니다. 북쪽 창가나 침실 협탁에 두면 좋습니다.',
    url: 'https://ohou.se/cards/search?query=유리+화병+투명',
    source: '오늘의집',
    tag: '소품',
    priceRange: '1~4만원',
    recommended: true,
  },
  {
    id: 'water-2',
    ohang: '水',
    name: '딥네이비 리넨 쿠션 커버',
    subtitle: '블루·네이비 패브릭',
    description: '水 오행 컬러인 딥네이비·블루 계열 쿠션. 침실이나 거실에 두면 차분하고 깊은 회복 기운이 흐릅니다.',
    url: 'https://ohou.se/cards/search?query=네이비+쿠션커버',
    source: '오늘의집',
    tag: '패브릭',
    priceRange: '1~2만원',
  },
  {
    id: 'water-3',
    ohang: '水',
    name: '수채화 바다 포스터',
    subtitle: '물·강·바다 풍경 그림',
    description: '수변 풍경이 담긴 아트 포스터는 水 기운을 시각으로 끌어들입니다. 북쪽 벽면에 두면 풍수 효과가 배가됩니다.',
    url: 'https://www.coupang.com/np/search?q=수채화+바다+포스터',
    source: '쿠팡',
    tag: '프레임',
    priceRange: '1~3만원',
  },
  {
    id: 'water-4',
    ohang: '水',
    name: '소형 실내 분수 오브제',
    subtitle: '흐르는 물소리 풍수 소품',
    description: '물이 실제로 흐르는 소형 분수는 水 기운 비보 소품 중 가장 강력합니다. 거실이나 현관에 두면 기운의 순환이 생깁니다.',
    url: 'https://www.coupang.com/np/search?q=실내+분수+오브제',
    source: '쿠팡',
    tag: '소품',
    priceRange: '3~10만원',
  },
  {
    id: 'water-5',
    ohang: '水',
    name: '블루그레이 면 러그',
    subtitle: '차분한 수변 컬러 러그',
    description: '블루그레이 러그는 거실 중앙에 깔면 水 기운이 공간 전체에 퍼집니다. 특히 침실에 두면 수면 회복 에너지가 강화됩니다.',
    url: 'https://ohou.se/cards/search?query=블루그레이+러그',
    source: '오늘의집',
    tag: '러그',
    priceRange: '5~20만원',
  },
];

export function getItemsByOhang(ohang: Ohang): StoreItem[] {
  return STORE_ITEMS.filter(item => item.ohang === ohang);
}

export function getRecommendedItems(deficitOhang: Ohang[]): StoreItem[] {
  if (deficitOhang.length === 0) return [];
  return STORE_ITEMS.filter(item => deficitOhang.includes(item.ohang));
}

export const OHANG_STORE_INFO: Record<Ohang, { label: string; subtitle: string; colorHex: string }> = {
  木: { label: '木 · 성장 기운', subtitle: '식물·우드·초록 소품', colorHex: '#2d7a2d' },
  火: { label: '火 · 활력 기운', subtitle: '조명·캔들·붉은 패브릭', colorHex: '#e85d3f' },
  土: { label: '土 · 안정 기운', subtitle: '도기·황토·베이지 패브릭', colorHex: '#c4a24a' },
  金: { label: '金 · 정리 기운', subtitle: '화이트·메탈·유리 소품', colorHex: '#a0a0a0' },
  水: { label: '水 · 순환 기운', subtitle: '유리·블루·물 소품', colorHex: '#1a3a6e' },
};
