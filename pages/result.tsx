import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';

function BarRows({ report }: { report: ReturnType<typeof getReportFromQuery> }) {
  const rows = [
    { label: '木', value: report.saju.ohang.wood, color: '#5cb85c' },
    { label: '火', value: report.saju.ohang.fire, color: '#e85d3f' },
    { label: '土', value: report.saju.ohang.earth, color: '#d4a574' },
    { label: '金', value: report.saju.ohang.metal, color: '#e8d4a8' },
    { label: '水', value: report.saju.ohang.water, color: '#4a90e2' },
  ];

  return (
    <div className={styles.bars}>
      {rows.map((row) => (
        <div key={row.label} className={styles.barRow}>
          <span>{row.label}</span>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${Math.max(row.value, 6)}%`, background: row.color }}></div>
          </div>
          <span>{row.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ResultScreen() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      number: '01',
      title: `${report.profile.name}님의 사주팔자`,
      body: `${report.formattedBirth} 기준으로 계산한 사주예요. ${report.saju.pillars.year.stem}${report.saju.pillars.year.branch} · ${report.saju.pillars.month.stem}${report.saju.pillars.month.branch} · ${report.saju.pillars.day.stem}${report.saju.pillars.day.branch}${report.saju.pillars.hour ? ` · ${report.saju.pillars.hour.stem}${report.saju.pillars.hour.branch}` : ''}`,
    },
    {
      number: '02',
      title: `일간 ${report.saju.pillars.day.stem} — 나의 중심`,
      body: report.summaryDescription,
    },
    {
      number: '03',
      title: report.summaryTitle,
      body: `${report.saju.deficitOhang[0] || report.saju.yongsin} 기운을 생활 공간에서 보완해보면 좋아요.`,
      renderExtra: <BarRows report={report} />,
    },
    {
      number: '04',
      title: '신살 · 길성과 사주관계',
      body: report.saju.sinsal.length > 0
        ? report.saju.sinsal.map(s => `${s.name}(${s.hanja}): ${s.description}`).join('\n\n')
        : '사주에서 주요 신살이 감지되지 않았습니다. 오행 분포와 일간 중심으로 읽어볼 수 있어요.',
    },
    {
      number: '05',
      title: '대운 · 세운 흐름',
      body: report.saju.currentDaeWoon
        ? `현재 ${report.saju.currentDaeWoon.ganJi.stem}${report.saju.currentDaeWoon.ganJi.branch} 대운 (${report.saju.currentDaeWoon.startAge}~${report.saju.currentDaeWoon.endAge}세) · ${report.saju.currentDaeWoon.ohang} 기운의 시기\n\n올해 ${report.saju.seWoon.year}년은 ${report.saju.seWoon.ganJi.stem}${report.saju.seWoon.ganJi.branch} 세운 · ${report.saju.seWoon.ohang} 기운이 흐릅니다.`
        : `올해 ${report.saju.seWoon.year}년은 ${report.saju.seWoon.ganJi.stem}${report.saju.seWoon.ganJi.branch} 세운 · ${report.saju.seWoon.ohang} 기운의 해입니다.`,
    },
    {
      number: '06',
      title: '참고해볼 지역 · 명당',
      body: report.districts.slice(0, 3).map((item) => item.district.name).join(', '),
    },
    {
      number: '07',
      title: '개운법 & 공유 카드',
      body: '오늘의 공간 미션, 침대 방향, 공유 카드까지 한 번에 정리해볼 수 있어요.',
    },
  ];

  const card = cards[currentCard];

  return (
    <Layout>
      <div className={styles.screen}>
        <div className={`${styles.row} ${styles.between}`}>
          <span className={styles.caption}>{currentCard + 1} / {cards.length}</span>
          <Link href={{ pathname: '/home', query }} className={styles.caption}>닫기</Link>
        </div>

        <div className={styles.navDots}>
          {cards.map((item, index) => (
            <span key={item.number} className={`${styles.dot} ${index === currentCard ? styles.dotActive : ''}`}></span>
          ))}
        </div>

        <div className={styles.resultCard}>
          <span className={styles.badgeFill}>{card.number} · 리딩</span>
          <div className={styles.column} style={{ gap: 12, marginTop: 16 }}>
            <span className={styles.caption}>{report.profile.name} · {report.formattedBirth}</span>
            <h1 className={styles.resultTitle}>{card.title}</h1>
            <p className={styles.bodyText} style={{ whiteSpace: 'pre-line' }}>{card.body}</p>
            {card.renderExtra}
            {currentCard === 2 && (
              <div className={styles.softCard}>
                <p className={styles.bodyText}>💡 공간에서 {report.saju.deficitOhang[0] || report.saju.yongsin} 기운을 더하면 좋아요</p>
                <p className={styles.caption}>침대 {report.saju.bedDirection}쪽 · 길방 {report.saju.gilbang} · {report.todayMission}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.resultFooter}>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setCurrentCard((prev) => Math.max(prev - 1, 0))}
          >
            ← 이전
          </button>
          <span className={styles.caption}>옆으로 넘기는 리딩 흐름</span>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setCurrentCard((prev) => Math.min(prev + 1, cards.length - 1))}
          >
            다음 →
          </button>
        </div>

        <div className={styles.row} style={{ gap: 8 }}>
          <Link href={{ pathname: '/home', query }} className={styles.primaryButton} style={{ flex: 1 }}>
            홈으로 이동
          </Link>
          <Link href={{ pathname: '/share', query }} className={styles.ghostButton} style={{ minWidth: 104, minHeight: 56 }}>
            공유 카드
          </Link>
        </div>
      </div>
    </Layout>
  );
}
