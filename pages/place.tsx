import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';
import { getNeighborhoodViews } from '../lib/neighborhood-view';

const REGION_FILTERS = ['전체', '서울', '경기', '인천', '기타'] as const;
type RegionFilter = typeof REGION_FILTERS[number];

function matchesRegion(label: RegionFilter, city: string) {
  if (label === '전체') return true;
  if (label === '기타') {
    return !city.includes('서울') && !city.includes('경기') && !city.includes('인천');
  }
  return city.includes(label);
}

export default function PlacePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);
  const [activeFilter, setActiveFilter] = useState<RegionFilter>('전체');

  const allNeighborhoods = useMemo(() => getNeighborhoodViews(report), [report]);
  const neighborhoods = allNeighborhoods.filter((item) => matchesRegion(activeFilter, item.city));
  const highlighted = neighborhoods[0] || allNeighborhoods[0];

  return (
    <Layout showTabBar activeTab="place" headerTitle="추천 지역 더 보기" showBackButton>
      <div className={styles.doodlePage}>
        <section className={styles.doodleHeroBlock}>
          <div>
            <p className={styles.doodleEyebrow}>내 사주와 잘 맞는 지역을 더 찾아봤어요.</p>
            <h2 className={styles.doodleTitle}>추천 지역 더 보기</h2>
          </div>
          <span className={styles.doodleFloat}>✦</span>
        </section>

        <div className={styles.doodleFilterRow}>
          {REGION_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? styles.doodleChipActive : styles.doodleChip}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
          <span className={styles.doodleFilterIcon}>⌕</span>
        </div>

        {highlighted ? (
          <section className={styles.paperMapCard}>
            <div className={styles.paperMapCanvas}>
              <div className={styles.paperMapRiver}></div>
              <div className={styles.paperMapPark}></div>
              {neighborhoods.slice(0, 5).map((item) => (
                <Link
                  key={item.code}
                  href={{ pathname: '/place-detail', query: { ...query, districtCode: item.code } }}
                  className={`${styles.paperMapPin} ${item.code === highlighted.code ? styles.paperMapPinActive : ''}`}
                  style={{ left: item.pinX, top: item.pinY }}
                >
                  {item.rank}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.doodleListCard}>
          {neighborhoods.length > 0 ? neighborhoods.slice(0, 5).map((item) => (
            <Link
              key={item.code}
              href={{ pathname: '/place-detail', query: { ...query, districtCode: item.code } }}
              className={styles.doodleLocationRow}
            >
              <span className={`${styles.doodleRankBadge} ${styles[`doodleRankBadge${item.rank}` as keyof typeof styles] || ''}`}>
                {item.rank}
              </span>
              <div className={styles.doodleLocationMain}>
                <strong>{item.fullLabel}</strong>
                <span>적합도 {item.suitability}%</span>
              </div>
              <span className={styles.doodleLocationArrow}>›</span>
            </Link>
          )) : (
            <div className={styles.doodleInfoBanner}>
              <strong>이 필터의 추천 지역은 아직 없어요.</strong>
              <p>다른 권역으로 넓혀서 다시 살펴보면 좋아요.</p>
            </div>
          )}
        </section>

        {highlighted ? (
          <section className={styles.doodleInfoBanner}>
            <strong>{highlighted.name}</strong>
            <p>{highlighted.oneLine}</p>
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
