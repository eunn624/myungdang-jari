import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';
import { getNeighborhoodViews } from '../lib/neighborhood-view';

const REGION_FILTERS = [
  '전체',
  '서울', '경기', '인천',
  '부산', '대구', '광주', '대전', '울산',
  '강원', '전남', '전북', '경남', '경북', '제주',
] as const;
type RegionFilter = typeof REGION_FILTERS[number];

function matchesRegion(label: RegionFilter, city: string) {
  if (label === '전체') return true;
  return city === label;
}

export default function PlacePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);
  const [activeFilter, setActiveFilter] = useState<RegionFilter>('전체');

  const allNeighborhoods = useMemo(() => getNeighborhoodViews(report, 30), [report]);
  const neighborhoods = allNeighborhoods.filter((item) => matchesRegion(activeFilter, item.city));
  const highlighted = neighborhoods[0] || allNeighborhoods[0];

  return (
    <Layout showTabBar activeTab="place" headerTitle="추천 지역 더 보기" showBackButton>
      <div className={styles.referenceScreen}>
        <section className={styles.referenceHeaderBlock}>
          <div>
            <h2 className={styles.referenceTitle}>추천 지역 더 보기</h2>
            <p className={styles.referenceSubtitle}>내 사주에 잘 맞는 지역을 더 찾아봤어요.</p>
          </div>
          <span className={styles.referenceSpark}>✧</span>
        </section>

        <div className={styles.referenceFilterScroll}>
          {REGION_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? styles.referenceFilterActive : styles.referenceFilter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {highlighted ? (
          <section className={styles.referenceMapShell}>
            <div className={styles.referenceMapCanvas}>
              <div className={styles.referenceMapRiver}></div>
              <div className={styles.referenceMapPark}></div>
              {neighborhoods.slice(0, 5).map((item) => (
                <Link
                  key={item.code}
                  href={{ pathname: '/place-detail', query: { ...query, districtCode: item.code } }}
                  className={`${styles.referenceMapPin} ${item.code === highlighted.code ? styles.referenceMapPinActive : ''}`}
                  style={{ left: item.pinX, top: item.pinY }}
                >
                  {item.rank}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.referenceListPanel}>
          {neighborhoods.length > 0 ? neighborhoods.slice(0, 5).map((item) => (
            <Link
              key={item.code}
              href={{ pathname: '/place-detail', query: { ...query, districtCode: item.code } }}
              className={styles.referenceListRow}
            >
              <span className={`${styles.referenceRankBadge} ${styles[`referenceRankBadge${item.rank}` as keyof typeof styles] || ''}`}>
                {item.rank}
              </span>
              <div className={styles.referenceListMain}>
                <strong>{item.fullLabel}</strong>
                <p className={styles.referenceListLocation}>
                  {item.directionFromCenter} · {item.nearbyLandmark}
                </p>
                <div className={styles.referenceListMeta}>
                  {item.vibeLabel ? (
                    <span className={`${styles.vibeBadge} ${item.vibe ? styles[`vibeBadge_${item.vibe}`] : ''}`}>
                      {item.vibeLabel}
                    </span>
                  ) : null}
                  <span>{item.terrainLabel}</span>
                </div>
              </div>
              <div className={styles.referenceSuitability}>
                <em>적합도</em>
                <strong>{item.suitability}%</strong>
              </div>
            </Link>
          )) : (
            <div className={styles.referenceNoteCard}>
              <strong>이 필터의 추천 지역은 아직 없어요.</strong>
              <p>다른 권역으로 넓혀서 다시 살펴보면 좋아요.</p>
            </div>
          )}
        </section>

        {highlighted ? (
          <section className={styles.referenceInlineSummary}>
            <strong>{highlighted.name}</strong>
            <p>{highlighted.oneLine}</p>
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
