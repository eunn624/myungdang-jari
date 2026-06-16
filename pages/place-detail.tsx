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
      <div className={styles.referenceScreen}>
        <section className={styles.referenceHeaderBlock}>
          <div>
            <h2 className={styles.referenceTitle}>{selected.name} 상세 리포트</h2>
            <p className={styles.referenceSubtitle}>내 사주와 가장 잘 맞는 지역이에요.</p>
          </div>
          <span className={styles.referenceSpark}>✧</span>
        </section>

        <section className={styles.referenceDetailScore}>
          <span>적합도</span>
          <strong>{selected.suitability}%</strong>
        </section>

        <section className={styles.referenceMapShell}>
          <div className={styles.referenceMapCanvas}>
            <div className={styles.referenceMapRiver}></div>
            <div className={styles.referenceMapPark}></div>
            <span
              className={`${styles.referenceMapPin} ${styles.referenceMapPinActive}`}
              style={{ left: selected.pinX, top: selected.pinY }}
            >
              {selected.rank}
            </span>
          </div>
        </section>

        <section className={styles.referencePanel}>
          <h3 className={styles.referencePanelTitle}>이 지역이 좋은 이유</h3>
          <div className={styles.referenceReasonList}>
            {selected.reasons.slice(0, 3).map((reason) => (
              <div key={reason} className={styles.referenceReasonRow}>
                <span className={styles.referenceReasonBullet}>●</span>
                <div>
                  <strong>{reason}</strong>
                  <p>{selected.terrainLabel} 생활권과 연결해 편하게 살펴볼 수 있어요.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.referenceSummaryCard}>
          <strong>한 줄 요약</strong>
          <p>{selected.oneLine}</p>
          <span>{selected.realityCheck}</span>
        </section>

        <div className={styles.referenceButtonRow}>
          <Link
            href={{ pathname: '/map', query: { ...query, districtCode: selected.code } }}
            className={styles.referenceGhostButton}
          >
            지도에서 보기
          </Link>
          <Link
            href={{ pathname: '/place', query }}
            className={styles.referencePrimaryButton}
          >
            이 지역 분석 더 보기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
