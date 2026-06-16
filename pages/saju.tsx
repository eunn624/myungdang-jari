import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import { TERRAIN_LABELS } from '../lib/location/terrain';
import { getSinsalReading, getYongsinReading } from '../data/saju-reading-content';

const OHANG_ROWS = [
  { key: 'wood', label: '목', color: '#88c77c' },
  { key: 'fire', label: '화', color: '#f09aa0' },
  { key: 'earth', label: '토', color: '#f2d16b' },
  { key: 'metal', label: '금', color: '#c8c4be' },
  { key: 'water', label: '수', color: '#94bde8' },
] as const;

export default function SajuPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  const ohang = report.saju.ohang;
  const dominantEntry = (['木', '火', '土', '金', '水'] as const)
    .map(o => ({ o, v: ohang[({ 木: 'wood', 火: 'fire', 土: 'earth', 金: 'metal', 水: 'water' } as const)[o]] }))
    .sort((a, b) => b.v - a.v)[0];
  const dominant = dominantEntry?.o ?? report.saju.yongsin;
  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const topTerrain = report.districts[0]?.district.terrain;
  const terrainLabel = topTerrain ? TERRAIN_LABELS[topTerrain] : '생활권';
  const currentDaeWoon = report.saju.currentDaeWoon;
  const dayPillar = report.saju.pillars.day;
  const iljuContent = report.iljuContent;
  const yongsinReading = getYongsinReading(report.saju.yongsin);
  const activeSinsalReadings = report.saju.sinsal
    .map((sinsal) => ({ sinsal, reading: getSinsalReading(sinsal.name) }))
    .filter((item) => item.reading);
  const sinsalSummary = report.saju.sinsal.length > 0
    ? report.saju.sinsal.slice(0, 3).map((item) => item.name).join(' · ')
    : '현재는 오행 균형과 공간 성향을 중심으로 읽는 편이 자연스러워요.';

  const energyCards = [
    { title: `${report.saju.bedDirection}향`, body: '시선이 열리고 햇빛이 부드럽게 드는 방향' },
    { title: terrainLabel, body: '자연과 생활 리듬이 어긋나지 않는 공간감' },
    { title: `${deficit} 보완`, body: '초록 식물과 소재, 색감으로 기운 보충' },
    { title: '우드 인테리어', body: '머무는 감각을 가볍게 잡아주는 재질' },
  ];

  return (
    <Layout showTabBar activeTab="saju" headerTitle="사주 오행 분석" showBackButton>
      <div className={styles.referenceScreen}>
        <section className={styles.referenceHeaderBlock}>
          <div>
            <h2 className={styles.referenceTitle}>사주 오행 분석</h2>
            <p className={styles.referenceSubtitle}>내 사주의 오행 균형을 확인해보세요.</p>
          </div>
          <span className={styles.referenceSpark}>☼</span>
        </section>

        <section className={styles.referenceHintCard}>
          <p>
            당신의 사주는 <strong>{dominant}</strong>과 <strong>{report.saju.yongsin}</strong>의 흐름이 또렷해요.
            {terrainLabel}와 가까운 공간에서 생활 리듬이 조금 더 편안해질 수 있어요.
          </p>
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceOhangList}>
            {OHANG_ROWS.map((row) => {
              const value = report.saju.ohang[row.key];
              return (
                <div key={row.key} className={styles.referenceOhangRow}>
                  <span>{row.label}</span>
                  <div className={styles.referenceOhangTrack}>
                    <div
                      className={styles.referenceOhangFill}
                      style={{ width: `${Math.max(value, 12)}%`, background: row.color }}
                    ></div>
                  </div>
                  <strong>{value}%</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.referenceCommentCard}>
          <strong>오행 균형 코멘트</strong>
          <p>
            {deficit} 기운이 조금 비어 있어서 {report.saju.bedDirection}향 채광, {terrainLabel} 감각,
            그리고 {deficit} 색감이 들어간 소품을 함께 쓰면 공간 만족도를 높이는 데 도움이 돼요.
          </p>
          <span>☼</span>
        </section>

        <section className={styles.referenceEnergySection}>
          <h3 className={styles.referencePanelTitle}>추천 공간 에너지</h3>
          <div className={styles.referenceEnergyRow}>
            {energyCards.map((item) => (
              <div key={item.title} className={styles.referenceEnergyItem}>
                <span className={styles.referenceEnergyCircle}>○</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.referencePanel}>
          <h3 className={styles.referencePanelTitle}>사주 메모</h3>
          <div className={styles.referenceNoteGrid}>
            <div className={styles.referenceMiniNote}>
              <strong>용신</strong>
              <p>{report.saju.yongsin} 흐름을 채우는 방향이 핵심이에요.</p>
            </div>
            <div className={styles.referenceMiniNote}>
              <strong>길방</strong>
              <p>{report.saju.gilbang} 방향을 기준으로 자주 머무는 자리를 정리해보세요.</p>
            </div>
            <div className={styles.referenceMiniNote}>
              <strong>신살 요약</strong>
              <p>{sinsalSummary}</p>
            </div>
            <div className={styles.referenceMiniNote}>
              <strong>공간 힌트</strong>
              <p>{terrainLabel} 감각이 살아 있는 동네에서 리듬을 잡기 쉬운 편이에요.</p>
            </div>
          </div>
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceLongHeader}>
            <span>일주 풀이</span>
            <strong>{dayPillar.stem}{dayPillar.branch}</strong>
          </div>
          <h3 className={styles.referenceReadingTitle}>
            {iljuContent ? `${iljuContent.korean} 일주` : `${dayPillar.stem}${dayPillar.branch} 일주`}
          </h3>
          <p className={styles.referenceReadingLead}>
            {iljuContent?.identitySummary || '사주의 중심인 일주를 기준으로 성향과 공간 리듬을 함께 읽어볼게요.'}
          </p>
          <div className={styles.referenceReadingStack}>
            {(iljuContent?.interpretation || report.longReading).map((paragraph, index) => (
              <p key={`ilju-${index}`}>{paragraph}</p>
            ))}
          </div>
          {iljuContent ? (
            <div className={styles.referenceChipCloud}>
              {iljuContent.spaceKeywords.slice(0, 5).map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          ) : null}
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceLongHeader}>
            <span>용신 풀이</span>
            <strong>{report.saju.yongsin}</strong>
          </div>
          <h3 className={styles.referenceReadingTitle}>{yongsinReading.title}</h3>
          <p className={styles.referenceReadingLead}>{yongsinReading.subtitle}</p>
          <div className={styles.referenceReadingStack}>
            {yongsinReading.paragraphs.map((paragraph, index) => (
              <p key={`yongsin-${index}`}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.referenceReadingSubBlock}>
            <strong>공간 힌트</strong>
            <div className={styles.referenceChipCloud}>
              {yongsinReading.spaceHints.map((hint) => (
                <span key={hint}>{hint}</span>
              ))}
            </div>
          </div>
          <div className={styles.referenceReadingSubBlock}>
            <strong>바로 해볼 수 있는 개운법</strong>
            <ul className={styles.referenceMethodList}>
              {yongsinReading.gaeunMethods.slice(0, 5).map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceLongHeader}>
            <span>신살 · 길성 풀이</span>
            <strong>{report.saju.sinsal.length || 0}개</strong>
          </div>
          {activeSinsalReadings.length > 0 ? (
            <div className={styles.referenceSinsalStack}>
              {activeSinsalReadings.map(({ sinsal, reading }) => (
                reading ? (
                  <article key={sinsal.name} className={styles.referenceSinsalCard}>
                    <h3 className={styles.referenceReadingTitle}>{reading.title} <small>{sinsal.hanja}</small></h3>
                    <p className={styles.referenceReadingLead}>{reading.subtitle}</p>
                    <div className={styles.referenceReadingStack}>
                      {reading.paragraphs.map((paragraph, index) => (
                        <p key={`${sinsal.name}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                    <div className={styles.referenceReadingSubBlock}>
                      <strong>공간 활용</strong>
                      <div className={styles.referenceChipCloud}>
                        {reading.spaceHints.map((hint) => (
                          <span key={hint}>{hint}</span>
                        ))}
                      </div>
                    </div>
                    <ul className={styles.referenceMethodList}>
                      {reading.gaeunMethods.slice(0, 4).map((method) => (
                        <li key={method}>{method}</li>
                      ))}
                    </ul>
                  </article>
                ) : null
              ))}
            </div>
          ) : (
            <div className={styles.referenceEmptyReading}>
              <strong>이번 결과에서는 주요 신살보다 오행 균형이 더 선명해요.</strong>
              <p>
                도화살, 역마살, 화개살, 천을귀인, 문창귀인 중 강하게 잡히는 항목이 없을 때는
                신살을 억지로 붙이기보다 일주와 용신을 중심으로 공간 리딩을 보는 편이 자연스럽습니다.
              </p>
            </div>
          )}
        </section>

        <section className={styles.referencePanel}>
          <h3 className={styles.referencePanelTitle}>대운 · 세운 메모</h3>
          <div className={styles.referenceTimelineCard}>
            {currentDaeWoon ? (
              <p>
                지금은 <strong>{currentDaeWoon.ganJi.stem}{currentDaeWoon.ganJi.branch}</strong> 대운
                ({currentDaeWoon.startAge}~{currentDaeWoon.endAge}세) 구간이에요.
                {currentDaeWoon.ohang} 기운이 강하게 들어와서 {deficit} 보완과 생활 리듬 정리가 함께 중요해요.
              </p>
            ) : (
              <p>대운 흐름은 입력한 생년월일시를 기준으로 계산돼요.</p>
            )}
            <p>
              올해 세운은 <strong>{report.saju.seWoon.ganJi.stem}{report.saju.seWoon.ganJi.branch}</strong>이고,
              {report.saju.seWoon.ohang} 기운이 생활 공간에 더 자주 드러날 수 있어요.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
