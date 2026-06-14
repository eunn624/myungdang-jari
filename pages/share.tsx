import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

export default function SharePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: '명당자리',
        text: `${report.profile.name}님의 공간 가이드 카드`,
      });
    }
  };

  return (
    <Layout>
      <div className={styles.screen}>
        <h1 className={styles.sectionTitle}>공유 카드</h1>

        <div className={styles.shareWrap}>
          <div className={styles.shareCard}>
            <div className={`${styles.column} ${styles.center}`} style={{ gap: 10 }}>
              <span className={styles.caption}>{report.profile.name}님의 명당자리</span>
              <div className={styles.mascot}>🐱</div>
              <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>
                따뜻한 작은<br />불꽃 같은 사람
              </h2>
              <span className={styles.badgeSoft}>
                {report.saju.pillars.day.stem}{report.saju.pillars.day.branch} · {report.saju.deficitOhang[0] || report.saju.yongsin} 보완
              </span>
            </div>

            <div className={styles.card}>
              <p className={styles.label} style={{ textAlign: 'center' }}>추천 지역 · 수변 동네</p>
              <div className={`${styles.badgeWrap} ${styles.center}`} style={{ marginTop: 10 }}>
                <span className={styles.badge}>물컵 두기</span>
                <span className={styles.badge}>파란 소품</span>
                <span className={styles.badge}>침대 {report.saju.bedDirection}쪽</span>
              </div>
            </div>

            <div className={styles.footerNote}>
              명당자리 · @myungdangjari
            </div>
          </div>

          <div className={`${styles.shareCard} ${styles.shareCardBlue}`}>
            <div className={`${styles.column} ${styles.center}`} style={{ gap: 8 }}>
              <span className={styles.label}>{report.profile.name}님께 어울리는 동네</span>
              {report.districts.slice(0, 3).map((item, index) => (
                <div key={item.district.code} className={styles.card} style={{ width: '100%' }}>
                  <p className={styles.label}>{index + 1}. {item.district.name}</p>
                  <p className={styles.caption}>{item.district.hanja} · {item.district.terrainNote}</p>
                </div>
              ))}
              <span className={styles.badgeFill}>대표 개운 · {report.saju.bedDirection}쪽</span>
            </div>
          </div>
        </div>

        <button type="button" className={styles.primaryButton} onClick={handleShare}>
          공유하기
        </button>
      </div>
    </Layout>
  );
}
