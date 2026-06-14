import { BRANCHES, BRANCHES_KOR, STEMS, STEMS_KOR, STEM_OHANG, BRANCH_OHANG, BRANCH_DIRECTION } from '../lib/saju/constants';
import type { Direction, EarthlyBranch, HeavenlyStem, Ohang } from '../lib/saju/types';

export type TerrainType = '고지대' | '수변' | '평지' | '녹지';

export interface IljuContent {
  ganji: `${HeavenlyStem}${EarthlyBranch}`;
  korean: string;
  stemElement: Ohang;
  branchElement: Ohang;
  animal: string;
  identitySummary: string;
  interpretation: [string, string, string];
  longDescription: string;
  favorableTerrains: TerrainType[];
  favorableDirections: Direction[];
  spaceKeywords: string[];
  recommendedPlaces: string[];
  gaeunMethods: string[];
  caution: string;
}

interface StemProfile {
  title: string;
  metaphor: string;
  temperament: string;
  strength: string;
  relationship: string;
  space: string;
  balance: string;
  ritual: string;
}

interface BranchProfile {
  animal: string;
  scene: string;
  placeMood: string;
  terrain: TerrainType[];
  placeTypes: string[];
  spaceKeywords: string[];
  climate: string;
  caution: string;
}

const STEM_PROFILES: Record<HeavenlyStem, StemProfile> = {
  甲: {
    title: '곧게 자라는 큰 나무형',
    metaphor: '큰 줄기를 세우듯 기준과 방향을 먼저 세우는 힘',
    temperament: '생각보다 고집이 분명하고, 시작해야 할 때는 망설이기보다 앞으로 밀어붙이는 편',
    strength: '판을 넓게 보고 사람과 일의 큰 흐름을 붙잡는 추진력',
    relationship: '관계에서도 애매한 태도보다 분명한 신뢰와 오래 가는 약속을 중시',
    space: '천장이 답답하지 않고 동선이 곧게 뻗은 공간에서 집중력이 살아남',
    balance: '과하게 건조하거나 지나치게 복잡한 환경에서는 예민함과 피로가 쉽게 올라옴',
    ritual: '아침 햇빛, 나무 결, 초록 식물, 문을 열어 환기하는 루틴',
  },
  乙: {
    title: '유연하게 뻗는 덩굴형',
    metaphor: '부드럽게 감아 올라가며 관계와 분위기를 읽는 힘',
    temperament: '강하게 밀어붙이기보다 상황에 맞게 길을 바꾸는 감각이 좋고, 미세한 결을 잘 읽는 편',
    strength: '섬세한 취향, 관계 조율, 작은 차이를 알아보는 생활 감각',
    relationship: '사람과 공간의 온도를 세심하게 느끼며, 다정함과 정돈된 교류를 좋아함',
    space: '날카로운 직선보다 부드러운 곡선, 패브릭, 식물성 질감이 있는 공간에서 마음이 풀림',
    balance: '타인의 기분을 너무 오래 품으면 정작 자신의 리듬을 놓치기 쉬움',
    ritual: '커튼을 통한 빛 조절, 향기 정리, 작은 화분 돌보기, 부드러운 패브릭 사용',
  },
  丙: {
    title: '환하게 비추는 태양형',
    metaphor: '주위를 밝히고 존재감을 키우는 직선적인 발산력',
    temperament: '숨기기보다 드러내며, 에너지가 붙으면 주변까지 끌어올리는 편',
    strength: '표현력, 자신감, 사람을 모으는 추진력과 개방성',
    relationship: '좋고 싫음이 비교적 선명하며, 답답한 관계보다 시원한 소통을 선호',
    space: '채광이 좋고 시야가 열려 있으며, 기운이 정체되지 않는 공간에서 활력이 높아짐',
    balance: '열이 과해지면 조급함, 말의 속도, 감정의 고조가 같이 커질 수 있음',
    ritual: '밝은 조명, 햇볕 드는 자리, 산뜻한 레드 포인트, 몸을 움직이는 루틴',
  },
  丁: {
    title: '정교하게 타오르는 등불형',
    metaphor: '은은하지만 오래 가는 불빛처럼 섬세하게 분위기를 밝히는 힘',
    temperament: '겉으로는 차분해 보여도 안쪽에는 기준과 감수성이 또렷하게 살아 있는 편',
    strength: '집중력, 디테일, 감정의 온도를 읽는 능력, 미감',
    relationship: '사람을 천천히 보지만 한 번 마음을 주면 정성 깊게 관계를 다듬음',
    space: '직접광보다 간접광, 따뜻한 조명, 조용한 구석이 있는 공간에서 몰입이 커짐',
    balance: '지나친 자극과 소음 속에서는 에너지가 빨리 소모되고 감정 피로가 누적되기 쉬움',
    ritual: '스탠드 조명, 향초 대신 은은한 향, 침실 온도 정리, 작고 정교한 소품 배치',
  },
  戊: {
    title: '중심을 받치는 산형',
    metaphor: '무게를 견디며 중심을 지키는 큰 흙의 버팀목',
    temperament: '급하게 흔들리기보다 먼저 현실성과 구조를 보는 편이며 책임감이 강함',
    strength: '지속력, 판단의 중심, 안정감, 사람을 버티게 하는 신뢰',
    relationship: '말보다 행동으로 보여 주는 타입에 가깝고, 관계에서도 책임과 실질을 중시',
    space: '바닥이 안정적이고 수납 구조가 분명하며, 오래 머물러도 피로하지 않은 공간이 잘 맞음',
    balance: '고집이 굳어지면 변화 수용이 늦어지고, 답답한 공간에 오래 있으면 기운이 무거워질 수 있음',
    ritual: '흙빛 패브릭, 안정적인 책상, 묵직한 가구 한 점, 비우기와 정돈 루틴',
  },
  己: {
    title: '살림을 키우는 밭형',
    metaphor: '작은 것을 길러 내고 손으로 다듬어 현실화하는 흙의 힘',
    temperament: '생활 감각이 좋고, 눈에 잘 띄지 않는 부분까지 챙기는 실무형 성향이 강함',
    strength: '돌봄, 관리, 꾸준함, 환경을 쓸모 있게 바꾸는 능력',
    relationship: '감정을 크게 드러내지 않아도 상대를 세심하게 챙기며, 안정적인 일상을 중요하게 여김',
    space: '손이 잘 닿는 수납, 정리된 주방, 생활 동선이 부드러운 공간에서 만족도가 높음',
    balance: '걱정을 혼자 오래 쌓아 두거나, 지나친 책임감으로 피로를 안고 가기 쉬움',
    ritual: '침구 정리, 식물 물주기, 생활 소음 줄이기, 손에 익은 루틴 만들기',
  },
  庚: {
    title: '단단하게 벼린 쇠형',
    metaphor: '결단해야 할 때 망설임 없이 선을 긋는 강한 금속의 기질',
    temperament: '판단이 빠르고 직설적인 편이며, 기준이 맞지 않으면 단호하게 거리 두기를 하는 타입',
    strength: '결단력, 실행력, 구조화, 불필요한 것을 덜어내는 힘',
    relationship: '쓸데없는 감정 소모보다 분명한 규칙과 상호 존중을 중시',
    space: '정리된 선, 군더더기 없는 배치, 차분한 톤의 구조적인 공간이 잘 맞음',
    balance: '말이 너무 날카로워지거나 완벽 기준이 높아지면 주변과 긴장이 생길 수 있음',
    ritual: '책상 비우기, 메탈 소품, 화이트 정리함, 일정과 기준을 보이는 곳에 두기',
  },
  辛: {
    title: '정제된 보석형',
    metaphor: '섬세하게 다듬을수록 빛이 살아나는 세공된 금속의 감각',
    temperament: '취향과 기준이 미세하게 분명하고, 작은 어긋남도 예민하게 감지하는 편',
    strength: '미감, 정확성, 품질 판단, 디테일 관리',
    relationship: '겉으로 차분해 보여도 마음속으로는 예의와 태도를 꽤 중요하게 보는 타입',
    space: '깨끗한 표면, 작은 포인트가 살아 있는 단정한 공간에서 감각이 안정됨',
    balance: '예민함이 누적되면 피곤함이 커지고, 지나친 비교로 스스로를 압박할 수 있음',
    ritual: '유리나 메탈 소품 정리, 미니 조명, 향 정돈, 작은 사치 한 점 허용하기',
  },
  壬: {
    title: '크게 흐르는 바다형',
    metaphor: '넓은 물처럼 판을 크게 보고 경계를 넘나드는 흐름',
    temperament: '생각의 규모가 크고 변화 수용이 빠르며, 한곳에만 갇히는 것을 답답해하는 편',
    strength: '확장성, 정보 감각, 적응력, 큰 흐름을 읽는 시야',
    relationship: '사람을 폭넓게 만나고 경험을 통해 배우며, 틀에 갇힌 관계를 오래 견디지 못함',
    space: '시야가 열려 있고 이동이 자유로우며, 막힘보다 순환이 느껴지는 공간이 잘 맞음',
    balance: '흐름이 너무 많아지면 집중이 분산되고 생활 리듬이 흔들릴 수 있음',
    ritual: '물 마시기, 창가 정리, 여행 사진 두기, 환기와 이동 동선을 가볍게 만드는 습관',
  },
  癸: {
    title: '깊이 스미는 빗물형',
    metaphor: '작고 조용하게 스며들지만 필요한 곳을 적시는 물의 감수성',
    temperament: '겉으로는 부드럽지만 내면은 깊고, 눈에 보이지 않는 흐름과 감정을 잘 읽는 편',
    strength: '직관, 공감, 기억력, 정서적 해석 능력',
    relationship: '표현은 조용해도 마음은 깊게 움직이며, 안전한 관계 안에서 진가가 드러남',
    space: '소음이 낮고 은은한 톤이 유지되며, 자신만의 작은 코너가 있는 공간에서 안정됨',
    balance: '기분과 환경의 영향을 많이 받기 때문에 혼잡한 공간에서는 쉽게 지칠 수 있음',
    ritual: '물빛 컬러, 조용한 음악, 침실 습도 관리, 하루 끝 정리 메모',
  },
};

const BRANCH_PROFILES: Record<EarthlyBranch, BranchProfile> = {
  子: {
    animal: '쥐',
    scene: '한밤의 물길을 읽듯 조용히 흐름을 살피는 장면',
    placeMood: '차분한 수변, 북향의 서늘함, 밤에도 리듬이 끊기지 않는 생활권',
    terrain: ['수변', '평지'],
    placeTypes: ['강이나 하천과 가까운 생활권', '조용한 평지형 주거지', '야간 소음이 낮은 북향 공간'],
    spaceKeywords: ['차분한 조도', '수분감', '조용한 침실', '북쪽 정리'],
    climate: '열을 식히고 생각을 가라앉히는 서늘한 흐름',
    caution: '밤 리듬이 길어지면 생활 패턴이 뒤로 밀릴 수 있어 수면 환경 정리가 중요함',
  },
  丑: {
    animal: '소',
    scene: '겨울 흙 속에 힘을 저장하며 천천히 단단해지는 장면',
    placeMood: '낮고 안정적인 지대, 수납이 좋은 집, 느리지만 오래 가는 생활 구조',
    terrain: ['평지', '고지대'],
    placeTypes: ['완만한 언덕 아래의 안정된 주거지', '생활 편의가 가까운 평지형 단지', '수납과 구조가 분명한 아파트형 공간'],
    spaceKeywords: ['안정적 수납', '낮은 채도', '무게감 있는 가구', '정적인 동선'],
    climate: '서두르지 않고 체력을 비축하게 만드는 묵직한 흐름',
    caution: '지나치게 무거운 분위기에서는 게으름과 고민이 함께 쌓일 수 있음',
  },
  寅: {
    animal: '호랑이',
    scene: '새벽 숲을 뚫고 첫 기세를 여는 장면',
    placeMood: '동쪽의 시작감, 나무가 많은 길, 상승감이 있는 생활 동선',
    terrain: ['녹지', '고지대'],
    placeTypes: ['숲길이나 공원이 가까운 동네', '동향 채광이 좋은 집', '완만하게 올라가는 지형의 주거지'],
    spaceKeywords: ['동쪽 채광', '초록 식물', '시작을 돕는 책상', '가벼운 스트레칭 공간'],
    climate: '정체를 깨고 새 출발을 돕는 맑은 상승 흐름',
    caution: '기세가 과하면 성급한 결정과 관계의 직진성이 강해질 수 있음',
  },
  卯: {
    animal: '토끼',
    scene: '봄 정원에서 부드럽게 관계를 열어 가는 장면',
    placeMood: '산책 가능한 녹지, 생활감이 부드러운 주거지, 사람과 사람이 적당히 연결되는 분위기',
    terrain: ['녹지', '평지'],
    placeTypes: ['공원과 산책로가 가까운 동네', '카페와 생활 편의가 조화로운 주거지', '빛이 고르게 드는 평지형 공간'],
    spaceKeywords: ['부드러운 패브릭', '화분', '라운드 가구', '밝은 동선'],
    climate: '긴장을 누그러뜨리고 관계 감각을 회복시키는 부드러운 흐름',
    caution: '타인의 반응을 지나치게 신경 쓰면 본래 리듬을 잃기 쉬움',
  },
  辰: {
    animal: '용',
    scene: '물과 흙이 만나는 지점에서 큰 흐름을 움켜쥐는 장면',
    placeMood: '전환 지대, 복합적인 생활권, 물길과 육지가 만나는 완충 공간',
    terrain: ['수변', '평지'],
    placeTypes: ['하천과 도심이 함께 있는 생활권', '확장 중인 신도시형 지역', '수변 산책이 가능한 복합 주거지'],
    spaceKeywords: ['전환 공간', '넓은 수납', '거실 중심 구조', '동남 방향 정리'],
    climate: '기회를 모으고 판을 키우게 하는 확장 흐름',
    caution: '욕심이 커질 때 일의 범위를 필요 이상으로 넓히기 쉬움',
  },
  巳: {
    animal: '뱀',
    scene: '햇살이 오르기 시작하는 순간 민감하게 기류를 읽는 장면',
    placeMood: '따뜻하고 밝지만 과열되지 않은 집, 감각적인 정리와 집중이 가능한 환경',
    terrain: ['평지', '고지대'],
    placeTypes: ['남향 채광이 좋은 집', '조용한 언덕형 주거지', '집중용 방이 분리된 구조'],
    spaceKeywords: ['간접광', '정리된 선반', '따뜻한 색 포인트', '남쪽 관리'],
    climate: '감각을 깨우고 판단을 민첩하게 만드는 따뜻한 흐름',
    caution: '예민함이 과열되면 과한 경계심과 피로가 함께 올라올 수 있음',
  },
  午: {
    animal: '말',
    scene: '한낮의 빛 아래 기세와 존재감이 가장 선명해지는 장면',
    placeMood: '시야가 시원하게 열리고 활동 반경이 넓은 곳, 밝고 외향적인 생활 무드',
    terrain: ['고지대', '평지'],
    placeTypes: ['전망이 트인 언덕 주거지', '채광이 강한 남향 공간', '활동성과 이동성이 좋은 중심 생활권'],
    spaceKeywords: ['강한 채광', '열기 조절', '확 트인 창', '활동 공간'],
    climate: '표현력과 추진력을 키우는 뜨거운 상승 흐름',
    caution: '열이 지나치면 말이 빨라지고 선택이 성급해질 수 있음',
  },
  未: {
    animal: '양',
    scene: '한여름의 들판을 다듬으며 생활의 결을 정리하는 장면',
    placeMood: '부드럽고 따뜻한 흙 기운, 정착감 있는 동네, 오래 살수록 편해지는 구조',
    terrain: ['평지', '녹지'],
    placeTypes: ['공원과 주거가 잘 섞인 생활권', '가족 단위로 조용한 주거지', '수납과 휴식 공간이 안정된 집'],
    spaceKeywords: ['패브릭 레이어', '정돈된 침실', '온기 있는 베이지', '서남 관리'],
    climate: '몸과 마음을 천천히 안정시키는 생활형 흐름',
    caution: '너무 편한 환경에 머무르면 도전 의욕이 약해질 수 있음',
  },
  申: {
    animal: '원숭이',
    scene: '움직임이 많은 길목에서 상황을 빠르게 읽고 대응하는 장면',
    placeMood: '교통과 정보 접근이 좋은 곳, 속도는 있지만 정리는 유지되는 도시형 환경',
    terrain: ['평지', '고지대'],
    placeTypes: ['역세권이나 이동 편의가 좋은 동네', '상업과 주거가 적절히 섞인 지역', '작업과 외출이 편한 도심형 공간'],
    spaceKeywords: ['작업 효율', '가벼운 가구', '정리된 책상', '서쪽 루틴'],
    climate: '정보와 기회를 빨리 붙잡게 하는 민첩한 흐름',
    caution: '자극이 너무 많으면 집중이 분산되고 생활이 산만해질 수 있음',
  },
  酉: {
    animal: '닭',
    scene: '정돈된 빛 아래 디테일을 끝까지 다듬는 장면',
    placeMood: '깔끔한 도시감, 미감이 살아 있는 주거지, 단정함이 유지되는 환경',
    terrain: ['평지', '녹지'],
    placeTypes: ['정돈된 신축 주거지', '화이트 톤 인테리어가 잘 받는 집', '미감 좋은 상권과 가까운 생활권'],
    spaceKeywords: ['화이트 정리', '메탈 포인트', '정갈한 수납', '서쪽 채광'],
    climate: '기준을 세우고 마무리 완성도를 높이는 정제된 흐름',
    caution: '완벽 기준이 높아지면 작은 흠에도 쉽게 예민해질 수 있음',
  },
  戌: {
    animal: '개',
    scene: '경계를 지키며 안과 밖을 분명히 나누는 장면',
    placeMood: '외부 자극과 내부 휴식이 분명히 분리되는 주거 환경, 믿을 수 있는 생활권',
    terrain: ['고지대', '평지'],
    placeTypes: ['조용한 언덕형 주거지', '생활권 경계가 또렷한 단지', '현관과 침실 구분이 분명한 집'],
    spaceKeywords: ['경계 정리', '현관 관리', '묵직한 베이스', '서북 방향 점검'],
    climate: '불필요한 에너지를 막고 중심을 지키게 하는 방어형 흐름',
    caution: '경계심이 과해지면 사람과 기회를 동시에 멀리할 수 있음',
  },
  亥: {
    animal: '돼지',
    scene: '깊은 물결 아래 넓은 상상과 감정을 품고 움직이는 장면',
    placeMood: '수변과 녹지가 함께 있는 곳, 조용하지만 답답하지 않은 생활권',
    terrain: ['수변', '녹지'],
    placeTypes: ['호수나 강변 산책이 가능한 지역', '숲과 물이 가까운 주거지', '휴식과 몰입이 함께 되는 집'],
    spaceKeywords: ['깊은 블루', '조용한 코너', '독서 자리', '북쪽 환기'],
    climate: '감정과 직관을 회복시키는 깊은 순환 흐름',
    caution: '생각이 깊어질수록 현실 행동이 늦어질 수 있어 리듬 관리가 필요함',
  },
};

function buildInterpretation(stem: HeavenlyStem, branch: EarthlyBranch, korean: string): [string, string, string] {
  const stemProfile = STEM_PROFILES[stem];
  const branchProfile = BRANCH_PROFILES[branch];
  const direction = BRANCH_DIRECTION[branch];

  const paragraph1 =
    `${korean} 일주는 ${stemProfile.title}의 결 위에 ${branchProfile.scene}이 겹쳐 있는 흐름으로 읽을 수 있어요. 이 일주는 ${stemProfile.metaphor}이 중심이 되기 때문에 기본적으로 ${stemProfile.temperament}이라는 특징이 잘 드러납니다. 동시에 ${branchProfile.placeMood} 같은 생활 무드가 더해져, 사람 자체의 기질도 한 방향으로만 단순하지 않고 상황과 공간의 분위기에 따라 다른 얼굴을 보여 주는 편이에요. 장점으로는 ${stemProfile.strength}이 두드러지고, 관계에서는 ${stemProfile.relationship}는 태도가 비교적 선명하게 나타납니다. 그래서 겉으로는 조용해 보여도 실제로는 자기 기준과 생활 리듬을 꽤 중요하게 지키는 사람으로 해석할 수 있습니다.`;

  const paragraph2 =
    `공간과 장소의 관점에서 보면 ${korean} 일주는 ${stemProfile.space} 같은 환경에서 힘을 잘 받는 편입니다. 특히 ${branchProfile.placeMood}이 맞아떨어질 때 집중력과 회복력이 함께 좋아지기 쉬워요. 지형으로는 ${branchProfile.terrain.join(', ')} 쪽의 상징을 참고하기 좋고, 실제 주거 선택에서는 ${branchProfile.placeTypes.join(', ')} 같은 조건이 잘 맞습니다. 집 안에서는 ${branchProfile.spaceKeywords.join(', ')}을 핵심 키워드로 두고, ${direction} 방향 영역을 어지럽히지 않게 관리하면 생활 리듬을 정돈하는 데 도움이 됩니다. 반대로 ${stemProfile.balance}는 점은 미리 알고 공간 자극을 조절해 두는 편이 좋아요. ${branchProfile.climate}을 의식한 배치가 이 일주의 장점을 부드럽게 끌어내는 방식에 가깝습니다.`;

  const paragraph3 =
    `개운법도 거창한 상징보다 일상 공간을 조율하는 방식이 더 잘 맞습니다. ${stemProfile.ritual}처럼 반복 가능한 습관을 두고, 여기에 ${branchProfile.spaceKeywords[0]}과 ${branchProfile.spaceKeywords[1]}을 보완하는 소품이나 생활 루틴을 더해 보세요. 예를 들어 침실은 쉬는 기능을 분명히 하고, 현관이나 창가처럼 기운이 드나드는 자리는 물건을 과하게 쌓아 두지 않는 편이 좋습니다. 주 생활권을 고를 때는 무조건 화려한 곳보다 내가 오래 머물러도 에너지가 덜 새는 곳인지 보는 것이 중요하고, 이 일주는 특히 공간의 결이 맞을 때 마음의 안정과 일의 몰입이 함께 올라오는 타입이에요. 다만 ${branchProfile.caution}는 점은 계속 점검해야 하므로, 주기적으로 쉬는 자리와 일하는 자리를 구분하고 빛, 온도, 소음, 수납 상태를 조절해 주는 것이 가장 현실적인 풍수형 보완법이 됩니다.`;

  return [paragraph1, paragraph2, paragraph3];
}

function buildGaeunMethods(stem: HeavenlyStem, branch: EarthlyBranch): string[] {
  const stemProfile = STEM_PROFILES[stem];
  const branchProfile = BRANCH_PROFILES[branch];
  const direction = BRANCH_DIRECTION[branch];

  return [
    `${direction} 방향 구역을 주 1회 정리하고 막힌 동선을 가볍게 비우기`,
    `${branchProfile.terrain[0]} 성향을 닮은 산책 루트를 생활권 안에 하나 정해 두기`,
    `${branchProfile.spaceKeywords[0]}을 살리는 소품이나 가구 한 점 배치하기`,
    `${branchProfile.spaceKeywords[1]}을 보완하는 색감이나 재질을 침실에 더하기`,
    `${stemProfile.ritual} 가운데 가장 쉬운 한 가지를 아침 또는 저녁 루틴으로 고정하기`,
    `일하는 자리와 쉬는 자리를 분리해 기운이 섞이지 않게 유지하기`,
  ];
}

function buildIdentitySummary(stem: HeavenlyStem, branch: EarthlyBranch): string {
  const stemProfile = STEM_PROFILES[stem];
  const branchProfile = BRANCH_PROFILES[branch];
  return `${stemProfile.title} 기질 위에 ${branchProfile.placeMood}이 겹쳐진 타입으로, 공간이 맞으면 장점이 크게 살아나는 일주`;
}

function createIljuContent(index: number): IljuContent {
  const stem = STEMS[index % STEMS.length];
  const branch = BRANCHES[index % BRANCHES.length];
  const korean = `${STEMS_KOR[index % STEMS_KOR.length]}${BRANCHES_KOR[index % BRANCHES_KOR.length]}`;
  const ganji = `${stem}${branch}` as const;
  const interpretation = buildInterpretation(stem, branch, korean);
  const branchProfile = BRANCH_PROFILES[branch];

  return {
    ganji,
    korean,
    stemElement: STEM_OHANG[stem],
    branchElement: BRANCH_OHANG[branch],
    animal: branchProfile.animal,
    identitySummary: buildIdentitySummary(stem, branch),
    interpretation,
    longDescription: interpretation.join('\n\n'),
    favorableTerrains: branchProfile.terrain,
    favorableDirections: [BRANCH_DIRECTION[branch]],
    spaceKeywords: branchProfile.spaceKeywords,
    recommendedPlaces: branchProfile.placeTypes,
    gaeunMethods: buildGaeunMethods(stem, branch),
    caution: branchProfile.caution,
  };
}

export const ILJU_CONTENT: IljuContent[] = Array.from({ length: 60 }, (_, index) => createIljuContent(index));

export function getIljuContent(dayPillar: { stem: HeavenlyStem; branch: EarthlyBranch }): IljuContent | undefined {
  return ILJU_CONTENT.find(item => item.ganji === `${dayPillar.stem}${dayPillar.branch}`);
}
