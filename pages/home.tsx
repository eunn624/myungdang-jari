import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';
import { TERRAIN_LABELS } from '../lib/location/terrain';

function getSpaceTraits(report: ReturnType<typeof getReportFromQuery>) {
  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const terrain = report.districts[0]?.district.terrain;
  const terrainLabel = terrain ? TERRAIN_LABELS[terrain] : '생활권';

  return [
    {
      title: `${terrainLabel} 선호`,
      body: `${terrainLabel}와 가까운 공간에서 생활 리듬이 조금 더 안정되기 쉬워요.`,
      icon: '◌',
    },
    {
      title: `${report.saju.bedDirection}향 선호`,
      body: `${report.saju.bedDirection} 쪽 채광이나 시선이 열리는 구조에서 편안함을 느끼는 편이에요.`,
      icon: '☼',
    },
    {
      title: `${deficit} 보완 루틴`,
      body: `${deficit} 기운을 채우는 소품과 동선 정리가 공간 만족도를 올리는 데 도움이 됩니다.`,
      icon: '⌂',
    },
  ];
}

function getTopTips(report: ReturnType<typeof getReportFromQuery>) {
  return [
    { title: `침대 머리는 ${report.saju.bedDirection}쪽`, tone: 'mint' },
    { title: `${report.saju.deficitOhang[0] || report.saju.yongsin} 기운 식물 두기`, tone: 'yellow' },
    { title: `${report.todayDayInfo.colorName} 포인트 소품 더하기`, tone: 'blue' },
  ];
}

export default function HomePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);

  const topDistricts = report.districts.slice(0, 3);
  const featured = topDistricts[0];
  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const spaceTraits = getSpaceTraits(report);
  const topTips = getTopTips(report);
  const spaceScore = featured ? Math.max(82, Math.min(97, 70 + Math.round(featured.score / 2))) : 84;

  return (
    <Layout showTabBar activeTab="home">
      <div className={styles.homeDashboard}>
        <section className={styles.homeReportHero}>
          <div className={styles.homeReportHeader}>
            <div>
              <span className={styles.homeReportEyebrow}>{report.formattedToday}</span>
              <h1>{report.profile.name}님 공간 리포트</h1>
            </div>
            <button type="button" className={styles.homeBellButton} aria-label="알림">
              °
            </button>
          </div>
          <div className={styles.homeReportSummary}>
            <div className={styles.homeReportLead}>
              <p>{report.profile.name}님과 가장 잘 맞는 공간은</p>
              <strong>{report.saju.bedDirection}향처럼 시선이 열리고 차분한 생활 리듬이에요.</strong>
            </div>
            <div className={styles.homeScoreCard}>
              <span>오늘의 공간 점수</span>
              <strong>{spaceScore}</strong>
              <em>점</em>
            </div>
          </div>
        </section>

        {featured ? (
          <section className={styles.featuredNeighborhoodCard}>
            <div className={styles.featuredNeighborhoodInfo}>
              <span className={styles.featuredBadge}>가장 잘 맞는 명당</span>
              <h2>{featured.district.name}</h2>
              <p>{featured.district.siDo} {featured.district.siGunGu}{featured.district.hanja ? ` · ${featured.district.hanja}` : ''}</p>
              <div className={styles.featuredScoreRow}>
                <span>적합도</span>
                <strong>{Math.max(82, Math.min(97, 70 + Math.round(featured.score / 2)))}%</strong>
              </div>
              <div className={styles.featuredReasonList}>
                {featured.reasons.slice(0, 3).map((reason) => (
                  <span key={reason}>• {reason}</span>
                ))}
              </div>
              <Link href={{ pathname: '/place', query }} className={styles.featuredMapButton}>
                지도에서 보기
              </Link>
            </div>
            <div className={styles.featuredMapPreview}>
              <div className={styles.featuredMapGrid}></div>
              <div className={styles.featuredMapPark}></div>
              <span className={styles.featuredMapPin}></span>
            </div>
          </section>
        ) : null}

        <section className={styles.homeTop3Section}>
          <div className={styles.homeSectionHeader}>
            <h2>TOP 3 추천 지역</h2>
            <span>{deficit} 보완 기준</span>
          </div>
          <div className={styles.homeTop3Grid}>
            {topDistricts.map((item, index) => (
              <Link key={item.district.code} href={{ pathname: '/place', query }} className={styles.top3NeighborhoodCard}>
                <span className={styles.top3Rank}>{index + 1}</span>
                <strong>{item.district.name}</strong>
                <p>{item.district.siGunGu}</p>
                <em>적합도 {Math.max(82, Math.min(97, 70 + Math.round(item.score / 2)))}%</em>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.homeInsightGrid}>
          <div className={styles.homeInsightCard}>
            <div className={styles.homeSectionHeader}>
              <h2>내 공간 성향</h2>
            </div>
            <div className={styles.homeTraitList}>
              {spaceTraits.map((trait) => (
                <div key={trait.title} className={styles.homeTraitItem}>
                  <span>{trait.icon}</span>
                  <div>
                    <strong>{trait.title}</strong>
                    <p>{trait.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.homeInsightCard}>
            <div className={styles.homeSectionHeader}>
              <h2>사주 오행 분석</h2>
            </div>
            <div className={styles.homeOhangList}>
              {[
                ['목', report.saju.ohang.wood, '#74b67a'],
                ['화', report.saju.ohang.fire, '#ef8f92'],
                ['토', report.saju.ohang.earth, '#edcf66'],
                ['금', report.saju.ohang.metal, '#c2c0bb'],
                ['수', report.saju.ohang.water, '#8ebee8'],
              ].map(([label, value, color]) => (
                <div key={label} className={styles.homeOhangRow}>
                  <span>{label}</span>
                  <div className={styles.homeOhangTrack}>
                    <div className={styles.homeOhangFill} style={{ width: `${Math.max(Number(value), 10)}%`, background: String(color) }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.homeTipsSection}>
          <div className={styles.homeSectionHeader}>
            <h2>공간 꿀팁</h2>
            <span>오늘 바로 적용</span>
          </div>
          <div className={styles.homeTipsGrid}>
            {topTips.map((tip) => (
              <div key={tip.title} className={`${styles.homeTipCard} ${styles[`homeTipCard${tip.tone.charAt(0).toUpperCase()}${tip.tone.slice(1)}`]}`}>
                <p>{tip.title}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.homeActionRow}>
          <Link href={{ pathname: '/place', query }} className={styles.primaryButton}>
            다른 지역 더 보기
          </Link>
          <Link href={{ pathname: '/input', query }} className={styles.homeResetButton}>
            다시 분석하기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
