import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import {
  getNearbyFacilities,
  getSelectedNeighborhood,
  type FacilityCategory,
} from '../lib/neighborhood-view';

const MAP_FILTERS: FacilityCategory[] = ['교통', '자연', '편의시설', '학교', '의료', '전체'];

export default function MapPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const selected = getSelectedNeighborhood(report, router.query.districtCode);
  const [activeFilter, setActiveFilter] = useState<FacilityCategory>('편의시설');

  if (!selected) {
    return (
      <Layout showTabBar activeTab="place" headerTitle="지도 보기" showBackButton>
        <div className={styles.doodlePage}>
          <section className={styles.doodleInfoBanner}>
            <strong>지도를 불러오지 못했어요.</strong>
            <p>추천 지역을 다시 확인한 뒤 이동해주세요.</p>
          </section>
        </div>
      </Layout>
    );
  }

  const facilities = getNearbyFacilities(selected);
  const visibleFacilities = activeFilter === '전체'
    ? facilities
    : facilities.filter((item) => item.type === activeFilter);

  return (
    <Layout showTabBar activeTab="place" headerTitle="지도 보기" showBackButton>
      <div className={styles.referenceScreen}>
        <section className={styles.referenceHeaderBlock}>
          <div>
            <h2 className={styles.referenceTitle}>지도 보기</h2>
            <p className={styles.referenceSubtitle}>{selected.name} 주변 환경을 확인해보세요.</p>
          </div>
        </section>

        <div className={styles.referenceFilterBar}>
          {MAP_FILTERS.map((filter) => (
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

        <section className={styles.referenceMapShell}>
          <div className={styles.referenceMapCanvas}>
            <div className={styles.referenceMapRiver}></div>
            <div className={styles.referenceMapPark}></div>
            <span className={styles.referenceMapLabel}>{selected.name}</span>
            <span
              className={`${styles.referenceMapPin} ${styles.referenceMapPinActive}`}
              style={{ left: selected.pinX, top: selected.pinY }}
            >
              {selected.rank}
            </span>
            {visibleFacilities.slice(0, 5).map((item, index) => (
              <span
                key={`${item.name}-${index}`}
                className={`${styles.referenceFacilityPin} ${styles[`referenceFacilityPin${index + 1}` as keyof typeof styles] || ''}`}
              >
                {item.icon}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.referencePanel}>
          <h3 className={styles.referencePanelTitle}>주변 {activeFilter === '전체' ? '생활 정보' : activeFilter}</h3>
          <div className={styles.referenceFacilityList}>
            {visibleFacilities.map((item) => (
              <div key={`${item.type}-${item.name}`} className={styles.referenceFacilityRow}>
                <span className={styles.referenceFacilityListIcon}>{item.icon}</span>
                <div className={styles.referenceFacilityMain}>
                  <strong>{item.name}</strong>
                  <span>{item.time}</span>
                </div>
                <span className={styles.referenceRowArrow}>›</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
