import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

const OHANG_COLOR: Record<string, string> = {
  木: '#5cb85c', 火: '#e85d3f', 土: '#d4a574', 金: '#b8a88a', 水: '#4a90e2',
};

export default function ReadPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const ilju = report.iljuContent;
  const daeWoonList = report.saju.daeWoon.slice(0, 7);
  const seWoon = report.saju.seWoon;

  return (
    <Layout showTabBar activeTab="read">
      <div className={styles.screen}>
        <h1 className={styles.sectionTitle}>사주 풀이</h1>
        <p className={styles.sectionSubtitle}>
          {report.saju.pillars.day.stem}{report.saju.pillars.day.branch} 일주 · {report.profile.name}
        </p>

        {/* 섹션 1: 기질·관계 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>성향 · 관계 리딩</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            <p className={styles.bodyText}>{report.longReading[0]}</p>
          </div>
        </div>

        {/* 섹션 2: 공간·지형 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>공간 · 장소 리딩</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            <p className={styles.bodyText}>{report.longReading[1]}</p>
          </div>
        </div>

        {/* 섹션 3: 개운 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>개운법 · 생활 루틴</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            <p className={styles.bodyText}>{report.longReading[2]}</p>
          </div>
        </div>

        {/* 섹션 4: 개운법 6개 */}
        {ilju && ilju.gaeunMethods.length > 0 && (
          <div className={styles.card}>
            <span className={styles.label}>실천 개운법 6가지</span>
            <div className={styles.column} style={{ gap: 8, marginTop: 10 }}>
              {ilju.gaeunMethods.map((method, i) => (
                <div key={i} className={styles.softCard} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span className={styles.badgeFill} style={{ minWidth: 24, textAlign: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <p className={styles.caption} style={{ flex: 1 }}>{method}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 섹션 5: 주의 · 좋은 흐름 */}
        <div className={styles.homeGrid}>
          <div className={styles.miniCard}>
            <span className={styles.label}>⚠ 주의 흐름</span>
            <p className={styles.miniCardText}>
              {ilju?.caution || report.cautionReading}
            </p>
          </div>
          <div className={styles.miniCard}>
            <span className={styles.label}>✓ 좋은 흐름</span>
            <p className={styles.miniCardText}>{report.positiveReading}</p>
          </div>
        </div>

        {/* 섹션 6: 대운·세운 */}
        <div className={styles.column} style={{ gap: 8 }}>
          <div className={`${styles.row} ${styles.between}`}>
            <span className={styles.label}>대운 흐름</span>
            <span className={styles.caption}>10년 단위</span>
          </div>
          <div className={styles.card}>
            {daeWoonList.length > 0 ? (
              <>
                <div className={styles.timeline}>
                  {daeWoonList.map((dw) => (
                    <div key={`${dw.ganJi.stem}${dw.ganJi.branch}-${dw.startAge}`} className={styles.timelineNode}>
                      <span
                        className={`${styles.timelineCircle} ${dw.isCurrent ? styles.timelineCircleActive : ''}`}
                        style={dw.isCurrent ? { background: OHANG_COLOR[dw.ohang] } : {}}
                      >
                        {dw.startAge}
                      </span>
                      <span className={styles.timelineLabel}>{dw.ganJi.stem}{dw.ganJi.branch}</span>
                      <span className={styles.caption} style={{ fontSize: 10, color: OHANG_COLOR[dw.ohang] }}>
                        {dw.ohang}
                      </span>
                    </div>
                  ))}
                </div>
                {report.saju.currentDaeWoon && (
                  <div className={styles.softCard} style={{ marginTop: 12 }}>
                    <p className={styles.bodyText}>
                      현재 {report.saju.currentDaeWoon.ganJi.stem}{report.saju.currentDaeWoon.ganJi.branch} 대운
                      ({report.saju.currentDaeWoon.startAge}~{report.saju.currentDaeWoon.endAge}세)
                    </p>
                    <p className={styles.caption}>
                      {report.saju.currentDaeWoon.ohang} 기운이 강하게 흐르는 시기 · 공간에서 이 기운을 활용해보세요
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className={styles.caption}>생년월일을 입력하면 대운 흐름을 볼 수 있어요.</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={`${styles.row} ${styles.between}`}>
            <span className={styles.label}>세운 ({seWoon.year}년)</span>
            <span className={styles.badgeFill}>{seWoon.ganJi.stem}{seWoon.ganJi.branch} · {seWoon.ohang}</span>
          </div>
          <p className={styles.caption} style={{ marginTop: 8 }}>
            올해는 {seWoon.ganJi.stemKor}{seWoon.ganJi.branchKor}년 · {seWoon.ohang} 기운의 흐름입니다.
            공간에서 {seWoon.ohang} 기운을 더해주면 세운과 시너지를 만들 수 있어요.
          </p>
        </div>
      </div>
    </Layout>
  );
}
