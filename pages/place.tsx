import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

export default function PlacePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const recommended = report.districts.slice(0, 3);

  return (
    <Layout showTabBar activeTab="place">
      <div className={styles.screen}>
        <h1 className={styles.sectionTitle}>명당</h1>
        <div className={styles.badgeWrap}>
          <span className={styles.badgeFill}>내 후보</span>
          <span className={styles.badge}>지형별</span>
          <span className={styles.badge}>침대 방향</span>
          <span className={styles.badge}>길방</span>
        </div>

        <div className={styles.column} style={{ gap: 10 }}>
          <span className={styles.label}>
            {report.saju.deficitOhang[0] || report.saju.yongsin}를 보완할 지역
          </span>
          {recommended.map((item, index) => (
            <div key={item.district.code} className={`${styles.placeCard} ${index === 0 ? styles.placeCardStrong : ''}`}>
              <div className={styles.placeHeader}>
                <h2 className={styles.placeName}>{index + 1}. {item.district.name}</h2>
                <span className={index === 0 ? styles.badgeFill : styles.badge}>추천</span>
              </div>
              <span className={styles.placeMeta}>
                {item.district.siDo} {item.district.siGunGu} · {item.district.hanja}
              </span>
              <div className={styles.badgeWrap}>
                {item.district.ohang.map((tag) => (
                  <span key={tag} className={styles.badge}>{tag} 보완</span>
                ))}
                <span className={styles.badge}>{item.district.terrainNote}</span>
              </div>
              <p className={styles.placeReason}>{item.reasons[0]} · {item.reasons[1] || '수변과 생활 동선의 순환감이 강한 편입니다.'}</p>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <span className={styles.label}>침대 머리 방향</span>
          <p className={styles.bodyText} style={{ marginTop: 8 }}>
            머리는 {report.saju.bedDirection}쪽을 참고해볼 수 있어요. 구조상 어렵다면 그 방향 벽면을 비우고, 물성 있는 색이나 소재로 분위기를 맞춰주세요.
          </p>
          <div className={styles.badgeWrap} style={{ marginTop: 10 }}>
            <span className={styles.badgeFill}>길방 {report.saju.gilbang}</span>
            <span className={styles.badge}>물결 패턴</span>
            <span className={styles.badge}>차분한 조명</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
