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
      <div className={styles.doodlePage}>
        <section className={styles.doodleHeroBlock}>
          <div>
            <h2 className={styles.doodleTitle}>지도 보기</h2>
            <p className={styles.doodleEyebrow}>{selected.name} 주변 환경을 확인해보세요.</p>
          </div>
        </section>

        <div className={styles.doodleFilterRow}>
          {MAP_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? styles.doodleChipActive : styles.doodleChip}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className={styles.paperMapCard}>
          <div className={styles.paperMapCanvas}>
            <div className={styles.paperMapRiver}></div>
            <div className={styles.paperMapPark}></div>
            <span className={styles.paperMapLabel}>{selected.name}</span>
            <span
              className={`${styles.paperMapPin} ${styles.paperMapPinActive}`}
              style={{ left: selected.pinX, top: selected.pinY }}
            >
              {selected.rank}
            </span>
            {visibleFacilities.slice(0, 5).map((item, index) => (
              <span
                key={`${item.name}-${index}`}
                className={`${styles.paperFacilityPin} ${styles[`paperFacilityPin${index + 1}` as keyof typeof styles] || ''}`}
              >
                {item.icon}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.doodleReasonPanel}>
          <h3>주변 {activeFilter === '전체' ? '생활 정보' : activeFilter}</h3>
          <div className={styles.doodleFacilityList}>
            {visibleFacilities.map((item) => (
              <div key={`${item.type}-${item.name}`} className={styles.doodleFacilityRow}>
                <span className={styles.doodleFacilityIcon}>{item.icon}</span>
                <div className={styles.doodleFacilityMain}>
                  <strong>{item.name}</strong>
                  <span>{item.time}</span>
                </div>
                <span className={styles.doodleLocationArrow}>›</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
