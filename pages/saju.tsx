import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import { TERRAIN_LABELS } from '../lib/location/terrain';

const OHANG_ROWS = [
  { key: 'wood', label: '목', color: '#88c77c' },
  { key: 'fire', label: '화', color: '#f09aa0' },
  { key: 'earth', label: '토', color: '#f2d16b' },
  { key: 'metal', label: '금', color: '#c8c4be' },
  { key: 'water', label: '수', color: '#94bde8' },
] as const;

export default function SajuPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  const dominant = report.saju.dominantOhang[0];
  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const topTerrain = report.districts[0]?.district.terrain;
  const terrainLabel = topTerrain ? TERRAIN_LABELS[topTerrain] : '생활권';

  const energyCards = [
    { title: `${report.saju.bedDirection}향`, body: '시선이 열리고 햇빛이 부드럽게 드는 방향' },
    { title: terrainLabel, body: '자연과 생활 리듬이 어긋나지 않는 공간감' },
    { title: `${deficit} 보완`, body: '초록 식물과 소재, 색감으로 기운 보충' },
    { title: '우드 인테리어', body: '머무는 감각을 가볍게 잡아주는 재질' },
  ];

  return (
    <Layout showTabBar activeTab="saju" headerTitle="사주 오행 분석" showBackButton>
      <div className={styles.doodlePage}>
        <section className={styles.doodleHeroBlock}>
          <div>
            <h2 className={styles.doodleTitle}>사주 오행 분석</h2>
            <p className={styles.doodleEyebrow}>내 사주의 오행 균형을 확인해보세요.</p>
          </div>
          <span className={styles.doodleFloat}>☼</span>
        </section>

        <section className={styles.doodleSummaryCard}>
          <p>
            당신의 사주는 <strong>{dominant}</strong>과 <strong>{report.saju.yongsin}</strong>의 흐름이 또렷해요.
            {terrainLabel}와 가까운 공간에서 생활 리듬이 조금 더 편안해질 수 있어요.
          </p>
        </section>

        <section className={styles.doodleReasonPanel}>
          <h3>오행 균형</h3>
          <div className={styles.doodleOhangList}>
            {OHANG_ROWS.map((row) => {
              const value = report.saju.ohang[row.key];
              return (
                <div key={row.key} className={styles.doodleOhangRow}>
                  <span>{row.label}</span>
                  <div className={styles.doodleOhangTrack}>
                    <div
                      className={styles.doodleOhangFill}
                      style={{ width: `${Math.max(value, 12)}%`, background: row.color }}
                    ></div>
                  </div>
                  <strong>{value}%</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.doodleInfoBanner}>
          <strong>오행 균형 코멘트</strong>
          <p>
            {deficit} 기운이 조금 비어 있어서 {report.saju.bedDirection}향 채광, {terrainLabel} 감각,
            그리고 {deficit} 색감이 들어간 소품을 함께 쓰면 공간 만족도를 높이는 데 도움이 돼요.
          </p>
        </section>

        <section className={styles.doodleEnergySection}>
          <h3>추천 공간 에너지</h3>
          <div className={styles.doodleEnergyGrid}>
            {energyCards.map((item) => (
              <div key={item.title} className={styles.doodleEnergyCard}>
                <span className={styles.doodleEnergyIcon}>○</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
