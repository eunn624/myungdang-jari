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
    <Layout showTabBar activeTab="read" headerTitle="자세한 풀이" showBackButton>
      <div className={styles.screen}>
        <p className={styles.sectionSubtitle}>
          {report.saju.pillars.day.stem}{report.saju.pillars.day.branch} 일주 · {report.profile.name}
        </p>

        {/* 섹션 1: 기질·관계 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>나의 기본 성향</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            <p className={styles.bodyText}>{report.longReading[0]}</p>
          </div>
        </div>

        {/* 섹션 2: 공간·지형 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>어울리는 공간과 장소</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            <p className={styles.bodyText}>{report.longReading[1]}</p>
          </div>
        </div>

        {/* 섹션 3: 개운 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>생활 속 실천 팁</span>
          <div className={styles.column} style={{ gap: 14, marginTop: 12 }}>
            <p className={styles.bodyText}>{report.longReading[2]}</p>
          </div>
        </div>

        {/* 섹션 4: 개운법 6개 */}
        {ilju && ilju.gaeunMethods.length > 0 && (
          <div className={styles.card}>
            <span className={styles.label}>이렇게 실천해보세요</span>
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
            <span className={styles.label}>조금 더 조심하면 좋은 점</span>
            <p className={styles.miniCardText}>
              {ilju?.caution || report.cautionReading}
            </p>
          </div>
          <div className={styles.miniCard}>
            <span className={styles.label}>기대해볼 만한 흐름</span>
            <p className={styles.miniCardText}>{report.positiveReading}</p>
          </div>
        </div>

        {/* 섹션 6: 이사 · 주거 리딩 */}
        <div className={styles.card}>
          <span className={styles.badgeFill}>집과 이사에 대한 흐름</span>
          <p className={styles.caption} style={{ marginTop: 6, marginBottom: 12 }}>
            사주와 현재 흐름을 바탕으로 주거운을 정리했어요.
          </p>

          {/* 신살별 이사 해석 */}
          {report.saju.sinsal.length > 0 && (
            <div className={styles.column} style={{ gap: 10, marginBottom: 14 }}>
              {report.saju.sinsal.map((s) => (
                <div key={s.name} className={styles.softCard}>
                  <div className={styles.row} style={{ gap: 6, marginBottom: 4 }}>
                    <span className={styles.badgeSoft}>{s.name}</span>
                    <span className={styles.caption} style={{ color: '#8c7a6e' }}>{s.hanja} · {s.activePillar}</span>
                  </div>
                  <p className={styles.caption}>{s.homeReading}</p>
                </div>
              ))}
            </div>
          )}

          {/* 대운 이사 해석 */}
          {report.saju.currentDaeWoon && (
            <div className={styles.softCard} style={{ marginBottom: 10 }}>
              <div className={styles.row} style={{ gap: 6, marginBottom: 4 }}>
                <span
                  className={styles.badgeFill}
                  style={{ background: OHANG_COLOR[report.saju.currentDaeWoon.ohang] }}
                >
                  대운 · {report.saju.currentDaeWoon.ganJi.stem}{report.saju.currentDaeWoon.ganJi.branch}
                </span>
                <span className={styles.caption} style={{ color: '#8c7a6e' }}>
                  {report.saju.currentDaeWoon.ohang} · {report.saju.currentDaeWoon.startAge}~{report.saju.currentDaeWoon.endAge}세
                </span>
              </div>
              <p className={styles.caption}>{report.daeWoonHomeReading}</p>
            </div>
          )}

          {/* 세운 이사 해석 */}
          <div className={styles.softCard}>
            <div className={styles.row} style={{ gap: 6, marginBottom: 4 }}>
              <span
                className={styles.badgeFill}
                style={{ background: OHANG_COLOR[seWoon.ohang] }}
              >
                세운 · {seWoon.ganJi.stem}{seWoon.ganJi.branch}
              </span>
              <span className={styles.caption} style={{ color: '#8c7a6e' }}>
                {seWoon.year}년 · {seWoon.ohang}
              </span>
            </div>
            <p className={styles.caption}>{report.seWoonHomeReading}</p>
          </div>
        </div>

        {/* 섹션 7: 대운 타임라인 */}
        <div className={styles.column} style={{ gap: 8 }}>
          <div className={`${styles.row} ${styles.between}`}>
            <span className={styles.label}>대운 흐름</span>
            <span className={styles.caption}>10년 단위 변화</span>
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
                    <p className={styles.caption} style={{ marginTop: 4 }}>
                      {report.saju.currentDaeWoon.ohang} 기운이 두드러지는 시기예요. 공간에서도 이 흐름을 함께 살려보세요.
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
            올해는 {seWoon.ganJi.stemKor}{seWoon.ganJi.branchKor}년의 흐름이 들어와 있어요.
            공간에 {seWoon.ohang} 기운을 조금 더해주면 지금의 리듬을 맞추는 데 도움이 됩니다.
          </p>
        </div>
      </div>
    </Layout>
  );
}
