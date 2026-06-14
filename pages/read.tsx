import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

export default function ReadPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  return (
    <Layout showTabBar activeTab="read">
      <div className={styles.screen}>
        <h1 className={styles.sectionTitle}>나는 어떤 사람인가</h1>

        <div className={styles.card}>
          <span className={styles.badgeFill}>성향 리딩</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            {report.longReading.map((paragraph) => (
              <p key={paragraph} className={styles.bodyText}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.column} style={{ gap: 8 }}>
          <span className={styles.label}>대운 · 세운 흐름</span>
          <div className={styles.card}>
            <div className={styles.timeline}>
              {['14', '24', '34', '44'].map((age, index) => (
                <div key={age} className={styles.timelineNode}>
                  <span className={`${styles.timelineCircle} ${index === 1 ? styles.timelineCircleActive : ''}`}>{age}</span>
                  <span className={styles.timelineLabel}>{index === 1 ? '현재' : `${age}세`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.homeGrid}>
          <div className={styles.miniCard}>
            <span className={styles.label}>⚠ 주의 흐름</span>
            <p className={styles.miniCardText}>{report.cautionReading}</p>
          </div>
          <div className={styles.miniCard}>
            <span className={styles.label}>✓ 좋은 흐름</span>
            <p className={styles.miniCardText}>{report.positiveReading}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
