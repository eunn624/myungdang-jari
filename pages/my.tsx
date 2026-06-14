import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';

export default function MyPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);
  const [missionDone, setMissionDone] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(`mission_${report.todayKey}`)
      : null;
    setMissionDone(stored === 'true');
  }, [report.todayKey]);

  return (
    <Layout showTabBar activeTab="my" headerTitle="마이" showBackButton>
      <div className={styles.screen}>
        <div className={styles.profileCard}>
          <div className={styles.row} style={{ gap: 12 }}>
            <div className={styles.visualPlaceholderSmall}></div>
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
          <span className={styles.label}>오늘의 한 가지</span>
          <div className={styles.column} style={{ gap: 6, marginTop: 10 }}>
            <span className={styles.bodyText}>
              {missionDone ? '✓ ' : '○ '}{report.todayMission}
            </span>
            <span className={styles.caption} style={{ color: missionDone ? '#5cb85c' : '#8c7a6e' }}>
              {missionDone ? '오늘 할 일까지 잘 마쳤어요.' : '홈에서 완료 버튼을 누르면 체크돼요.'}
            </span>
          </div>
        </div>

        <div className={styles.menuList}>
          <Link href={{ pathname: '/input', query }} className={styles.menuItem}>
            <span>입력 정보 수정</span><span>›</span>
          </Link>
          <Link href={{ pathname: '/share', query }} className={styles.menuItem}>
            <span>공유 카드 보기</span><span>›</span>
          </Link>
          <Link href={{ pathname: '/store', query }} className={styles.menuItem}>
            <span>추천 소품 보기</span><span>›</span>
          </Link>
          <Link href={{ pathname: '/place', query }} className={styles.menuItem}>
            <span>지역과 방향 가이드</span><span>›</span>
          </Link>
        </div>

        <p className={styles.footerNote} style={{ textAlign: 'center' }}>
          이 앱의 내용은 재미와 참고를 위한 안내예요.
        </p>
      </div>
    </Layout>
  );
}
