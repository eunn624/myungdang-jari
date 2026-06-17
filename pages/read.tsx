import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import { TERRAIN_LABELS } from '../lib/location/terrain';
import { getYongsinReading } from '../data/saju-reading-content';

export default function ReadPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const yongsinReading = getYongsinReading(report.saju.yongsin);
  const iljuContent = report.iljuContent;
  const topDistrict = report.districts[0]?.district;
  const terrainLabel = topDistrict ? TERRAIN_LABELS[topDistrict.terrain] : '생활권';
  const dayPillar = report.saju.pillars.day;
  const spaceKeywords = iljuContent?.spaceKeywords?.slice(0, 4) || [
    `${report.saju.bedDirection}향 정리`,
    `${deficit} 보완`,
    terrainLabel,
    '생활 리듬',
  ];

  const actionCards = [
    {
      title: `${report.saju.bedDirection} 방향을 먼저 정리해요`,
      body: `침대 머리와 자주 머무는 자리가 ${report.saju.bedDirection} 방향의 흐름을 방해하지 않도록 물건을 덜어내보세요.`,
      doodle: '⌂',
    },
    {
      title: `${deficit} 기운을 생활 소품으로 보완해요`,
      body: yongsinReading.spaceHints.slice(0, 2).join(' · '),
      doodle: '♣',
    },
    {
      title: '오늘의 공간 미션을 작게 해봐요',
      body: report.todayMission,
      doodle: '☼',
    },
    {
      title: '추천 동네와 실제 생활권을 함께 봐요',
      body: topDistrict
        ? `${topDistrict.name}처럼 ${terrainLabel} 감각이 있는 후보를 예산, 출퇴근, 생활 편의와 함께 확인해보세요.`
        : '추천 동네는 실제 거주 조건과 함께 참고하는 공간 힌트로 보는 편이 좋아요.',
      doodle: '⌁',
    },
    {
      title: '이번 달 중점 공간을 정해요',
      body: report.monthTip.spaceActions[0] || report.monthTip.spaceTip,
      doodle: '□',
    },
  ];

  return (
    <Layout showTabBar activeTab="read" headerTitle="리딩" showBackButton>
      <div className={styles.referenceScreen}>
        <section className={styles.referenceHeaderBlock}>
          <div>
            <h2 className={styles.referenceTitle}>{report.profile.name}님의 공간 리딩</h2>
            <p className={styles.referenceSubtitle}>사주 흐름을 공간, 생활 리듬, 개운법으로 풀어봤어요.</p>
          </div>
          <span className={styles.referenceSpark}>☼</span>
        </section>

        <section className={styles.readHeroCard}>
          <span>오늘의 핵심</span>
          <strong>{report.summaryTitle}</strong>
          <p>{report.summaryDescription}</p>
          <div className={styles.referenceChipCloud}>
            <span>{dayPillar.stem}{dayPillar.branch} 일주</span>
            <span>{report.saju.yongsin} 용신</span>
            <span>{terrainLabel}</span>
          </div>
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceLongHeader}>
            <span>나는 어떤 사람인가</span>
            <strong>{dayPillar.stem}{dayPillar.branch}</strong>
          </div>
          <h3 className={styles.referenceReadingTitle}>
            {iljuContent ? `${iljuContent.korean} 일주 리딩` : `${dayPillar.stem}${dayPillar.branch} 일주 리딩`}
          </h3>
          <p className={styles.referenceReadingLead}>
            {iljuContent?.identitySummary || '일주를 중심으로 성향과 공간 리듬을 함께 읽어볼게요.'}
          </p>
          <div className={styles.referenceReadingStack}>
            {(iljuContent?.interpretation || report.longReading).map((paragraph, index) => (
              <p key={`ilju-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceLongHeader}>
            <span>어떤 공간에서 편안한가</span>
            <strong>{terrainLabel}</strong>
          </div>
          <h3 className={styles.referenceReadingTitle}>공간 성향 리딩</h3>
          <p className={styles.referenceReadingLead}>
            {spaceKeywords.join(' · ')} 키워드를 중심으로 공간을 조율하면 좋아요.
          </p>
          <div className={styles.referenceReadingStack}>
            <p>{report.positiveReading}</p>
            <p>{report.cautionReading}</p>
            <p>{report.monthSpaceTip}</p>
          </div>
          <div className={styles.referenceChipCloud}>
            {spaceKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className={styles.referencePanel}>
          <div className={styles.referenceLongHeader}>
            <span>용신 보완</span>
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
        </section>

        <section className={styles.referenceTipsStack}>
          <h3 className={styles.referencePanelTitle}>오늘 바로 해볼 수 있는 개운법</h3>
          {actionCards.map((tip) => (
            <article key={tip.title} className={styles.referenceTipCard}>
              <div className={styles.referenceTipContent}>
                <strong>{tip.title}</strong>
                <p>{tip.body}</p>
              </div>
              <span className={styles.referenceTipVisual}>{tip.doodle}</span>
            </article>
          ))}
        </section>

        <section className={styles.referencePanel}>
          <h3 className={styles.referencePanelTitle}>올해와 이번 달의 공간 흐름</h3>
          <div className={styles.sajuFortuneCards}>
            <article>
              <span>올해 세운</span>
              <strong>{report.saju.seWoon.year}년 {report.saju.seWoon.ganJi.stem}{report.saju.seWoon.ganJi.branch}</strong>
              <p>{report.seWoonHomeReading}</p>
            </article>
            <article>
              <span>이번 달 월운</span>
              <strong>{report.monthGanji.stem}{report.monthGanji.branch} · {report.monthOhang}</strong>
              <p>{report.monthTip.spaceActions.slice(0, 3).join(' ')}</p>
            </article>
          </div>
        </section>

        <div className={styles.referenceButtonRow}>
          <Link href={{ pathname: '/saju', query: router.query }} className={styles.referenceGhostButton}>
            사주 근거 보기
          </Link>
          <Link href={{ pathname: '/place', query: router.query }} className={styles.referencePrimaryButton}>
            추천 동네 보기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
