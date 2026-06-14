import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';

export default function HomePage() {
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

  const handleMissionComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`mission_${report.todayKey}`, 'true');
    }
    setMissionDone(true);
  };

  return (
    <Layout showTabBar activeTab="home">
      <div className={styles.screen}>
        <div className={`${styles.heroPanel} ${styles.heroPanelBlue}`}>
          <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
          <span className={`${styles.heroSpark} ${styles.heroSparkB}`}>✦</span>
          <div className={styles.heroPanelHeader}>
            <div className={styles.column} style={{ gap: 4 }}>
              <span className={styles.heroPanelLabel}>{report.formattedToday}</span>
              <h1 className={styles.heroTitle}>{report.profile.name}님,<br />오늘의 공간 흐름을 준비했어요</h1>
            </div>
            <div className={styles.visualPlaceholderSmall}></div>
          </div>

          <div className={styles.heroDeck}>
            <div className={styles.heroInfoCard}>
              <span className={styles.badgeFill}>오늘의 일진</span>
              <h2 className={styles.heroInfoTitle} style={{ marginTop: 10 }}>{report.todayDayInfo.title}</h2>
              <p className={styles.heroInfoBody}>{report.todayDayInfo.message}</p>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <strong>{report.todayDayInfo.ohang}</strong>
                <span>오늘의 오행</span>
              </div>
              <div className={styles.heroStat}>
                <strong>{report.todayDayInfo.colorName}</strong>
                <span>추천 컬러</span>
              </div>
              <div className={styles.heroStat}>
                <strong>{report.saju.gilbang}</strong>
                <span>길방</span>
              </div>
              <div className={styles.heroStat}>
                <strong>{report.saju.bedDirection}</strong>
                <span>침대 머리</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionGrid}>
          <div className={`${styles.actionCard} ${styles.actionCardYellow}`}>
            <h2 className={styles.actionTitle}>오늘의 한 가지</h2>
            <p className={styles.actionBody}>{report.todayMission}</p>
          </div>
          <div className={`${styles.actionCard} ${styles.actionCardPurple}`}>
            <h2 className={styles.actionTitle}>이번 달 흐름</h2>
            <p className={styles.actionBody}>{report.monthTip.headline}</p>
          </div>
          <Link href={{ pathname: '/place', query }} className={`${styles.actionCard} ${styles.actionCardBlue}`}>
            <h2 className={styles.actionTitle}>어울리는 지역 보기</h2>
            <p className={styles.actionBody}>
              {report.districts.length > 0
                ? report.districts.slice(0, 2).map((item) => item.district.name).join(', ')
                : '입력 후 확인할 수 있어요'}
            </p>
          </Link>
          <Link href={{ pathname: '/share', query }} className={`${styles.actionCard} ${styles.actionCardMint}`}>
            <h2 className={styles.actionTitle}>공유 카드 만들기</h2>
            <p className={styles.actionBody}>카카오톡이나 인스타그램에 올리기 좋은 한 장 요약</p>
          </Link>
        </div>

        <div className={styles.quickPair}>
          <button type="button" className={styles.secondaryButton} onClick={handleMissionComplete}>
            {missionDone ? '오늘 실천 완료 ✓' : '실천했어요'}
          </button>
          <Link href={{ pathname: '/result', query }} className={styles.ghostButton} style={{ minHeight: 46 }}>
            요약 카드 다시 보기
          </Link>
        </div>

        <div className={styles.storyScroller}>
          <div className={`${styles.storyCard} ${styles.storyCardPurple}`}>
            <div className={styles.storyShapeA}></div>
            <div className={styles.storyShapeB}></div>
            <h2 className={styles.storyTitle}>오늘의 나를<br />짧게 표현하면</h2>
            <p className={styles.storyCopy}>{report.summaryDescription}</p>
          </div>

          <div className={`${styles.storyCard} ${styles.storyCardMint}`}>
            <div className={styles.storyShapeA}></div>
            <div className={styles.storyShapeC}></div>
            <h2 className={styles.storyTitle}>이번 달 공간 팁</h2>
            <p className={styles.storyCopy}>{report.monthTip.spaceTip}</p>
          </div>

          <div className={`${styles.storyCard} ${styles.storyCardPeach} ${styles.storyCardDarkText}`}>
            <div className={styles.storyShapeB}></div>
            <div className={styles.storyShapeC}></div>
            <h2 className={styles.storyTitle}>오늘 잘 맞는 움직임</h2>
            <p className={styles.storyCopy}>{report.todayDayInfo.spaceAction}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <strong className={styles.statValue}>{report.saju.deficitOhang[0] || report.saju.yongsin}</strong>
            <span className={styles.statLabel}>보완 오행</span>
          </div>
          <div className={styles.statCard}>
            <strong className={styles.statValue}>{report.todayGanji.stem}{report.todayGanji.branch}</strong>
            <span className={styles.statLabel}>오늘 일진</span>
          </div>
          <div className={styles.statCard}>
            <strong className={styles.statValue}>{report.monthGanji.stem}{report.monthGanji.branch}</strong>
            <span className={styles.statLabel}>이번 달 흐름</span>
          </div>
        </div>

        <div className={styles.column} style={{ gap: 10 }}>
          <span className={styles.label}>바로 보기</span>
          <div className={styles.menuList}>
            <Link href={{ pathname: '/saju', query }} className={styles.menuItem}>
              <span>만세력과 오행 흐름 보기</span>
              <span>→</span>
            </Link>
            <Link href={{ pathname: '/read', query }} className={styles.menuItem}>
              <span>자세한 해석 읽기</span>
              <span>→</span>
            </Link>
            <Link href={{ pathname: '/place', query }} className={styles.menuItem}>
              <span>지역 추천과 공간 팁 보기</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
