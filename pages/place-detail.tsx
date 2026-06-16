import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';
import { getSelectedNeighborhood } from '../lib/neighborhood-view';

export default function PlaceDetailPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);
  const selected = getSelectedNeighborhood(report, router.query.districtCode);

  if (!selected) {
    return (
      <Layout showTabBar activeTab="place" headerTitle="추천 지역 상세" showBackButton>
        <div className={styles.doodlePage}>
          <section className={styles.doodleInfoBanner}>
            <strong>추천 지역을 불러오지 못했어요.</strong>
            <p>다시 분석한 뒤 명당 후보를 확인해주세요.</p>
          </section>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showTabBar activeTab="place" headerTitle={`${selected.name} 상세 리포트`} showBackButton>
      <div className={styles.doodlePage}>
        <section className={styles.doodleHeroBlock}>
          <div>
            <h2 className={styles.doodleTitle}>{selected.name} 상세 리포트</h2>
            <p className={styles.doodleEyebrow}>내 사주와 가장 잘 맞는 지역이에요.</p>
          </div>
          <div className={styles.doodleScoreStamp}>
            <span>적합도</span>
            <strong>{selected.suitability}%</strong>
          </div>
        </section>

        <section className={styles.paperMapCard}>
          <div className={styles.paperMapCanvas}>
            <div className={styles.paperMapRiver}></div>
            <div className={styles.paperMapPark}></div>
            <span
              className={`${styles.paperMapPin} ${styles.paperMapPinActive}`}
              style={{ left: selected.pinX, top: selected.pinY }}
            >
              {selected.rank}
            </span>
          </div>
        </section>

        <section className={styles.doodleReasonPanel}>
          <h3>이 지역이 좋은 이유</h3>
          <div className={styles.doodleReasonList}>
            {selected.reasons.slice(0, 3).map((reason) => (
              <div key={reason} className={styles.doodleReasonItem}>
                <span>●</span>
                <div>
                  <strong>{reason}</strong>
                  <p>{selected.terrainLabel} 생활권과 연결해 편하게 살펴볼 수 있어요.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.doodleInfoBanner}>
          <strong>한 줄 요약</strong>
          <p>{selected.oneLine}</p>
          <p>{selected.realityCheck}</p>
        </section>

        <div className={styles.doodleActionRow}>
          <Link
            href={{ pathname: '/map', query: { ...query, districtCode: selected.code } }}
            className={styles.doodleGhostButton}
          >
            지도에서 보기
          </Link>
          <Link
            href={{ pathname: '/place', query }}
            className={styles.doodlePrimaryButton}
          >
            추천 지역 다시 보기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
