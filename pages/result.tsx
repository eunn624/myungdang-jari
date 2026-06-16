import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';
import type { Ohang } from '../lib/saju/types';

type AppReport = ReturnType<typeof getReportFromQuery>;

type NeighborhoodRecommendation = {
  id: string;
  rank: number;
  name: string;
  city: string;
  district: string;
  hanjaName?: string;
  latitude?: number;
  longitude?: number;
  elementTags: Ohang[];
  terrainTags: string[];
  reasonTitle: string;
  reasonDescription: string;
  lifestyleHint: string;
  realityCheck: string;
};

const ELEMENT_COLOR: Record<Ohang, string> = {
  木: '#4f9f6f',
  火: '#f25f5c',
  土: '#d8a946',
  金: '#5c6670',
  水: '#3478f6',
};

const TERRAIN_LABELS: Record<string, string> = {
  highland: '고지대',
  waterfront: '수변형',
  flatland: '평지형',
  green: '녹지형',
};

const MAP_PIN_POSITIONS = [
  { x: 54, y: 44 },
  { x: 66, y: 56 },
  { x: 43, y: 61 },
];

function getLifestyleHint(name: string, terrainTags: string[]): string {
  if (terrainTags.includes('수변형')) {
    return `${name}은 물길과 가까운 생활 리듬을 상상해볼 수 있는 후보예요. 산책 동선과 주변 소음을 함께 확인해보세요.`;
  }
  if (terrainTags.includes('녹지형')) {
    return `${name}은 녹지와 휴식감을 함께 살펴보기 좋은 후보예요. 공원 접근성과 일상 동선을 같이 확인해보세요.`;
  }
  if (terrainTags.includes('고지대')) {
    return `${name}은 시야와 바람길을 함께 살펴볼 만한 후보예요. 경사, 교통, 야간 이동감을 같이 확인해보세요.`;
  }
  return `${name}은 생활 편의와 동선 균형을 살펴보기 좋은 후보예요. 출퇴근, 장보기, 산책 루트를 함께 확인해보세요.`;
}

function buildNeighborhoodRecommendations(report: AppReport): NeighborhoodRecommendation[] {
  const fallbackElement = report.saju.deficitOhang[0] || report.saju.yongsin;

  return report.districts.slice(0, 3).map((item, index) => {
    const district = item.district;
    const elementTags = district.ohang.length > 0 ? district.ohang : [fallbackElement];
    const terrainTags = [
      TERRAIN_LABELS[district.terrain] || district.terrain,
      ...(district.terrainTags || [])
        .filter((tag) => tag !== district.terrain)
        .map((tag) => TERRAIN_LABELS[tag] || tag),
    ].slice(0, 3);
    const primaryReason = item.reasons[0]?.replace(/\s*\(지명 한자:.*?\)/, '') || `${elementTags[0]} 흐름과 연결되는 후보`;

    return {
      id: district.code,
      rank: index + 1,
      name: district.name,
      city: district.siDo,
      district: district.siGunGu,
      hanjaName: district.hanja || undefined,
      elementTags,
      terrainTags: terrainTags.length > 0 ? terrainTags : ['생활권 참고'],
      reasonTitle: primaryReason,
      reasonDescription: `${report.profile.name}님에게 필요한 ${fallbackElement}의 흐름을 공간에서 보완하는 후보로 참고해볼 수 있어요.`,
      lifestyleHint: getLifestyleHint(district.name, terrainTags),
      realityCheck: '실제 거주 선택에는 예산, 출퇴근, 생활 편의, 안전 조건을 함께 확인해주세요.',
    };
  });
}

function RecommendedNeighborhoodMap({
  recommendations,
  selectedId,
  onSelect,
}: {
  recommendations: NeighborhoodRecommendation[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className={styles.neighborhoodMapSection}>
      <div className={styles.mockMap}>
        <svg viewBox="0 0 320 230" role="img" aria-label="수도권 추천 동네 지도" className={styles.mockMapSvg}>
          <rect x="0" y="0" width="320" height="230" rx="28" fill="#eef6f8" />
          <path d="M76 66 C112 28, 174 24, 215 54 C252 80, 270 126, 246 166 C222 206, 158 214, 107 190 C58 167, 38 105, 76 66 Z" fill="#f8fbf8" stroke="#d9e9e4" strokeWidth="2" />
          <path d="M40 156 C94 132, 124 132, 169 151 C208 168, 248 166, 286 136" fill="none" stroke="#9cc8e8" strokeWidth="14" strokeLinecap="round" opacity="0.68" />
          <path d="M44 154 C100 133, 129 135, 170 152 C207 168, 246 166, 284 138" fill="none" stroke="#f8fcff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <path d="M108 44 L126 70 L101 90 L72 78 Z" fill="#dff0dc" opacity="0.92" />
          <path d="M211 74 L246 98 L237 130 L201 121 Z" fill="#e7f1dc" opacity="0.92" />
          <circle cx="160" cy="114" r="42" fill="#ffffff" opacity="0.58" />
          <text x="30" y="35" className={styles.mockMapLabel}>수도권 미니맵</text>
        </svg>

        {recommendations.map((item, index) => {
          const position = MAP_PIN_POSITIONS[index] || MAP_PIN_POSITIONS[0];
          const isSelected = selectedId === item.id;
          const color = ELEMENT_COLOR[item.elementTags[0]] || '#3478f6';

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.mapPin} ${isSelected ? styles.mapPinActive : ''}`}
              style={{ left: `${position.x}%`, top: `${position.y}%`, background: color }}
              onClick={() => onSelect(item.id)}
              aria-label={`${item.rank}순위 ${item.name}`}
            >
              {item.rank}
            </button>
          );
        })}
      </div>
      <p className={styles.mapNote}>추천 후보는 오행·지형·지명 기준의 참고 정보입니다.</p>
    </section>
  );
}

function NeighborhoodRecommendationCard({
  item,
  selected,
  onSelect,
}: {
  item: NeighborhoodRecommendation;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.neighborhoodCard} ${selected ? styles.neighborhoodCardActive : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <div className={styles.neighborhoodCardTop}>
        <span className={styles.rankBadge}>{item.rank}순위</span>
        <div className={styles.elementBadgeGroup}>
          {item.elementTags.slice(0, 2).map((tag) => (
            <span key={tag} className={styles.elementBadge} style={{ background: ELEMENT_COLOR[tag] }}>
              {tag} 보완
            </span>
          ))}
        </div>
      </div>

      <div className={styles.neighborhoodNameBlock}>
        <h2>{item.name}</h2>
        <p>{item.city} {item.district} · {item.hanjaName || '지형 중심 추천'}</p>
      </div>

      <div className={styles.neighborhoodChipRow}>
        {item.terrainTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className={styles.neighborhoodReason}>
        <strong>{item.reasonTitle}</strong>
        <p>{item.reasonDescription}</p>
      </div>

      <p className={styles.neighborhoodHint}>{item.lifestyleHint}</p>
      <p className={styles.realityCheck}><strong>현실 체크</strong> {item.realityCheck}</p>
    </button>
  );
}

function NeighborhoodTop3CardList({
  recommendations,
  selectedId,
  onSelect,
}: {
  recommendations: NeighborhoodRecommendation[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (recommendations.length === 0) {
    return (
      <div className={styles.neighborhoodEmpty}>
        <h2>추천 동네를 준비하려면 정보가 조금 더 필요해요</h2>
        <p>생년월일시를 입력하면 수도권 기준으로 참고해볼 만한 생활권을 골라드릴게요.</p>
      </div>
    );
  }

  return (
    <section className={styles.neighborhoodList}>
      {recommendations.map((item) => (
        <NeighborhoodRecommendationCard
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

function ResultSummaryNavigation({ query }: { query: ReturnType<typeof createQueryFromProfile> }) {
  const items = [
    { title: '사주원국', body: '계산 근거 보기', href: '/saju' },
    { title: '오행 균형', body: '강한 기운과 부족한 기운', href: '/saju' },
    { title: '공간 성향', body: '잘 맞는 집과 동네 타입', href: '/place' },
    { title: '침대 방향', body: '방 구조에 맞춘 참고 방향', href: '/place' },
    { title: '오늘의 팁', body: '바로 해볼 수 있는 작은 행동', href: '/home' },
    { title: '공유 카드', body: '한 장 요약 만들기', href: '/share' },
  ];

  return (
    <section className={styles.detailNavSection}>
      <div className={styles.detailNavHeader}>
        <h2>세부 리딩 보기</h2>
        <p>자세한 사주 내용은 필요할 때만 열어볼 수 있어요.</p>
      </div>
      <div className={styles.detailNavScroller}>
        {items.map((item) => (
          <Link key={`${item.title}-${item.href}`} href={{ pathname: item.href, query }} className={styles.detailNavCard}>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ResultScreen() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);
  const recommendations = useMemo(() => buildNeighborhoodRecommendations(report), [report]);
  const [selectedId, setSelectedId] = useState(recommendations[0]?.id || '');

  const selectedExists = recommendations.some((item) => item.id === selectedId);
  const activeSelectedId = selectedExists ? selectedId : recommendations[0]?.id || '';

  return (
    <Layout headerTitle="명당 후보" showBackButton backHref="/input">
      <div className={`${styles.resultLandingScreen} ${styles.slideEnter}`}>
        <section className={styles.neighborhoodHero}>
          <span className={styles.resultEyebrow}>명당 추천 결과</span>
          <h1>
            {report.profile.name}님에게 맞는<br />
            수도권 명당 후보 3곳
          </h1>
          <p>
            사주 흐름을 공간 언어로 바꿔 수도권에서 참고해볼 만한 동네 후보를 골랐어요.
            실제 거주 결정 전에는 예산, 출퇴근, 생활권을 함께 확인해주세요.
          </p>
        </section>

        <RecommendedNeighborhoodMap
          recommendations={recommendations}
          selectedId={activeSelectedId}
          onSelect={setSelectedId}
        />

        <section className={styles.top3Section}>
          <div className={styles.top3Header}>
            <div>
              <span className={styles.resultEyebrow}>Top 3</span>
              <h2>먼저 살펴볼 동네</h2>
            </div>
            <span className={styles.top3Meta}>오행·지형·지명 기준</span>
          </div>
          <NeighborhoodTop3CardList
            recommendations={recommendations}
            selectedId={activeSelectedId}
            onSelect={setSelectedId}
          />
        </section>

        <ResultSummaryNavigation query={query} />

        <div className={styles.resultLandingCtas}>
          <Link href={{ pathname: '/home', query }} className={styles.primaryButton}>
            내 명당 홈으로 가기
          </Link>
          <div className={styles.resultSecondaryCtas}>
            <Link href={{ pathname: '/place', query }} className={styles.ghostButton}>
              자세히 보기
            </Link>
            <Link href={{ pathname: '/share', query }} className={styles.ghostButton}>
              공유 카드 만들기
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
