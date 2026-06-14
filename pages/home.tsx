import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';

export default function HomePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);

  return (
    <Layout showTabBar activeTab="home">
      <div className={styles.screen}>
        <div className={styles.headerBlock}>
          <div className={styles.column} style={{ gap: 4 }}>
            <span className={styles.caption}>{report.formattedToday}</span>
            <h1 className={styles.sectionTitle}>{report.profile.name}님,<br />좋은 아침이에요</h1>
          </div>
          <div className={`${styles.mascot} ${styles.mascotSmall}`}>🐱</div>
        </div>

        <div className={styles.softCard}>
          <span className={styles.badgeSoft}>오늘의 기운</span>
          <h2 className={styles.sectionTitle} style={{ color: '#8f7ce0', marginTop: 10 }}>{report.dailyEnergyTitle}</h2>
          <p className={styles.bodyText}>{report.dailyEnergyDescription}</p>
          <div className={styles.badgeWrap} style={{ marginTop: 10 }}>
            <span className={styles.badgeFill}>오늘 컬러 · 코랄</span>
            <span className={styles.badge}>물 마시기</span>
          </div>
        </div>

        <div className={styles.cardStrong}>
          <span className={styles.badgeFill}>오늘의 공간 미션</span>
          <p className={styles.bodyText} style={{ marginTop: 10, fontWeight: 700 }}>{report.todayMission}</p>
          <p className={styles.caption}>부족 오행 {report.saju.deficitOhang[0] || report.saju.yongsin} 보완 기준</p>
          <button type="button" className={styles.secondaryButton} style={{ marginTop: 10 }}>
            미션 완료 체크 ✓
          </button>
        </div>

        <div className={styles.column} style={{ gap: 8 }}>
          <span className={styles.label}>이어서 보기</span>
          <Link href={{ pathname: '/result', query }} className={styles.card}>
            <div className={styles.row} style={{ gap: 12 }}>
              <div className={`${styles.mascot} ${styles.mascotTiny}`}>🐱</div>
              <div className={styles.column} style={{ gap: 2 }}>
                <span className={styles.label}>내 사주 다시 보기</span>
                <span className={styles.caption}>{report.formattedBirth} · {report.saju.pillars.day.stem}{report.saju.pillars.day.branch}</span>
              </div>
            </div>
          </Link>
        </div>

        <span className={styles.label}>오늘 추천</span>
        <div className={styles.homeGrid}>
          <Link href={{ pathname: '/place', query }} className={styles.miniCard}>
            <span className={styles.badge}>명당 후보</span>
            <p className={styles.miniCardText}>{report.districts.slice(0, 2).map((item) => item.district.name).join(', ')}</p>
          </Link>
          <Link href={{ pathname: '/share', query }} className={styles.miniCard}>
            <span className={styles.badge}>공유 카드</span>
            <p className={styles.miniCardText}>귀여운 9:16 요약 카드로 저장하고 보내기</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
