import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

export default function MyPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  return (
    <Layout showTabBar activeTab="my">
      <div className={styles.screen}>
        <div className={styles.profileCard}>
          <div className={styles.row} style={{ gap: 12 }}>
            <div className={styles.mascot}>🐱</div>
            <div className={styles.column} style={{ gap: 4 }}>
              <h1 className={styles.sectionTitle}>{report.profile.name}</h1>
              <span className={styles.sectionSubtitle}>
                {report.formattedBirth} · {report.profile.gender}
              </span>
              <span className={styles.caption}>
                {report.saju.pillars.year.stem}{report.saju.pillars.year.branch} · {report.saju.pillars.month.stem}{report.saju.pillars.month.branch} · {report.saju.pillars.day.stem}{report.saju.pillars.day.branch}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>완료한 미션</span>
          <div className={styles.column} style={{ gap: 8, marginTop: 10 }}>
            <span className={styles.bodyText}>✓ {report.todayMission}</span>
            <span className={styles.bodyText}>✓ 파란 포인트 소품 두기</span>
          </div>
        </div>

        <div className={styles.menuList}>
          <div className={styles.menuItem}><span>입력 정보 수정</span><span>›</span></div>
          <div className={styles.menuItem}><span>저장한 공유 카드</span><span>›</span></div>
          <div className={styles.menuItem}><span>이용 안내</span><span>›</span></div>
          <div className={styles.menuItem}><span>피드백 보내기</span><span>›</span></div>
        </div>
      </div>
    </Layout>
  );
}
