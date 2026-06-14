import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import { OHANG_STORE_INFO } from '../data/store-items';

export default function SharePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const accentColor = OHANG_STORE_INFO[deficit]?.colorHex ?? '#c4a24a';
  const ilju = `${report.saju.pillars.day.stem}${report.saju.pillars.day.branch}`;

  const handleShare = async () => {
    const text =
      `${report.profile.name}님의 명당자리\n` +
      `일주: ${ilju} · 보완 오행: ${deficit}\n` +
      `추천 동네: ${report.districts.slice(0, 2).map(d => d.district.name).join(', ') || '분석 중'}\n` +
      `침대 방향: ${report.saju.bedDirection}쪽`;
    if (navigator.share) {
      await navigator.share({ title: '명당자리 — 내 공간 가이드', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('텍스트가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <Layout>
      <div className={styles.screen}>
        <h1 className={styles.sectionTitle}>공유 카드</h1>
        <p className={styles.caption}>인스타그램·카카오톡으로 보내기 좋은 카드예요.</p>

        {/* 카드 1 — 사주 요약 */}
        <div className={styles.shareCard} style={{ borderTop: `4px solid ${accentColor}` }}>
          <div className={styles.column} style={{ gap: 10, alignItems: 'center' }}>
            <span className={styles.caption}>{report.formattedToday}</span>
            <div className={styles.mascot} style={{ fontSize: 36 }}>🐱</div>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center', color: accentColor }}>
              {report.summaryTitle}
            </h2>
            <p className={styles.caption} style={{ textAlign: 'center', maxWidth: 240 }}>
              {report.summaryDescription}
            </p>
          </div>

          <div className={styles.softCard} style={{ marginTop: 12 }}>
            <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div className={styles.statCard}>
                <strong className={styles.statValue}>{ilju}</strong>
                <span className={styles.statLabel}>일주</span>
              </div>
              <div className={styles.statCard}>
                <strong className={styles.statValue}>{deficit}</strong>
                <span className={styles.statLabel}>보완 오행</span>
              </div>
              <div className={styles.statCard}>
                <strong className={styles.statValue}>{report.saju.gilbang}</strong>
                <span className={styles.statLabel}>길방</span>
              </div>
            </div>
          </div>

          <p className={styles.footerNote} style={{ textAlign: 'center', marginTop: 10 }}>
            명당자리 · 오락·참고 목적
          </p>
        </div>

        {/* 카드 2 — 명당 지역 */}
        <div className={styles.shareCard} style={{ background: '#f5f0eb' }}>
          <div className={styles.column} style={{ gap: 8 }}>
            <span className={styles.label}>{report.profile.name}님께 어울리는 동네</span>
            <span className={styles.caption}>{deficit} 오행 보완 · 수도권 기준</span>

            {report.districts.length > 0 ? (
              report.districts.slice(0, 3).map((item, index) => (
                <div key={item.district.code} className={styles.card} style={{ padding: '10px 12px' }}>
                  <div className={styles.row} style={{ gap: 8 }}>
                    <span
                      className={styles.badgeFill}
                      style={{ background: accentColor, minWidth: 24, textAlign: 'center' }}
                    >
                      {index + 1}
                    </span>
                    <div className={styles.column} style={{ gap: 2 }}>
                      <p className={styles.label}>{item.district.name}</p>
                      <p className={styles.caption}>
                        {item.district.hanja} · {item.district.terrainNote}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.card}>
                <p className={styles.caption}>사주 정보를 입력하면 추천 동네가 생성됩니다.</p>
              </div>
            )}

            <div className={styles.badgeWrap} style={{ marginTop: 4 }}>
              <span className={styles.badge}>침대 {report.saju.bedDirection}쪽</span>
              <span className={styles.badge}>길방 {report.saju.gilbang}</span>
              <span className={styles.badge}>{report.todayDayInfo.colorName}</span>
            </div>
          </div>
        </div>

        {/* 카드 3 — 오늘의 기운 */}
        <div
          className={styles.shareCard}
          style={{ background: report.todayColorHex + '18', borderLeft: `4px solid ${report.todayColorHex}` }}
        >
          <span className={styles.badgeFill} style={{ background: report.todayColorHex }}>
            {report.todayGanji.stem}{report.todayGanji.branch}일 · 오늘의 기운
          </span>
          <h3 className={styles.sectionTitle} style={{ marginTop: 8, color: report.todayColorHex }}>
            {report.todayDayInfo.title}
          </h3>
          <p className={styles.caption} style={{ marginTop: 4 }}>
            {report.todayDayInfo.moodKeyword} · {report.todayDayInfo.colorName}
          </p>
          <p className={styles.bodyText} style={{ marginTop: 6 }}>{report.todayDayInfo.message}</p>
        </div>

        {/* 공유 버튼 */}
        <button type="button" className={styles.primaryButton} onClick={handleShare}>
          카드 공유하기
        </button>

        <p className={styles.footerNote} style={{ textAlign: 'center' }}>
          본 카드는 오락·참고 목적이며 효능을 보장하지 않습니다.
        </p>
      </div>
    </Layout>
  );
}
