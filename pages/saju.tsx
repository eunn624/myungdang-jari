import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

function SajuCell({
  label,
  hanja,
  ko,
  tone,
}: {
  label?: string;
  hanja?: string;
  ko?: string;
  tone?: string;
}) {
  return (
    <div className={`${styles.sajuCell} ${label ? styles.sajuLabelCell : ''} ${tone ? styles[tone] : ''}`}>
      {label ? (
        <span>{label}</span>
      ) : (
        <>
          <span className={styles.hanja}>{hanja}</span>
          <span className={styles.ko}>{ko}</span>
        </>
      )}
    </div>
  );
}

export default function SajuPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const { year, month, day, hour } = report.saju.pillars;

  const rows = [
    {
      label: '천간',
      cells: [
        hour ? { hanja: hour.stem, ko: hour.stemKor, tone: 'wood' } : { hanja: '—', ko: '시 모름', tone: '' },
        { hanja: day.stem, ko: `${day.stemKor} · 일간`, tone: 'fire' },
        { hanja: month.stem, ko: month.stemKor, tone: 'fire' },
        { hanja: year.stem, ko: year.stemKor, tone: 'fire' },
      ],
    },
    {
      label: '지지',
      cells: [
        hour ? { hanja: hour.branch, ko: hour.branchKor, tone: 'fire' } : { hanja: '—', ko: '시 모름', tone: '' },
        { hanja: day.branch, ko: day.branchKor, tone: 'metal' },
        { hanja: month.branch, ko: month.branchKor, tone: 'fire' },
        { hanja: year.branch, ko: year.branchKor, tone: 'earth' },
      ],
    },
  ];

  const bars = [
    ['木', report.saju.ohang.wood, '#5cb85c'],
    ['火', report.saju.ohang.fire, '#e85d3f'],
    ['土', report.saju.ohang.earth, '#d4a574'],
    ['金', report.saju.ohang.metal, '#e8d4a8'],
    ['水', report.saju.ohang.water, '#4a90e2'],
  ] as const;

  return (
    <Layout showTabBar activeTab="saju">
      <div className={styles.screen}>
        <div className={`${styles.row} ${styles.between}`}>
          <h1 className={styles.sectionTitle}>사주원국</h1>
          <span className={styles.badge}>만세력</span>
        </div>

        <p className={styles.sectionSubtitle}>
          {report.profile.name} · {report.formattedBirth} · 일간 {report.saju.pillars.day.stem}
        </p>

        <div className={styles.sajuTable}>
          <div className={styles.sajuRow}>
            <div className={`${styles.sajuCell} ${styles.sajuLabelCell} ${styles.sajuTopLabel}`}></div>
            <div className={`${styles.sajuCell} ${styles.sajuLabelCell} ${styles.sajuTopLabel}`}>시주</div>
            <div className={`${styles.sajuCell} ${styles.sajuLabelCell} ${styles.sajuTopLabel}`}>일주</div>
            <div className={`${styles.sajuCell} ${styles.sajuLabelCell} ${styles.sajuTopLabel}`}>월주</div>
            <div className={`${styles.sajuCell} ${styles.sajuLabelCell} ${styles.sajuTopLabel}`}>년주</div>
          </div>
          {rows.map((row) => (
            <div className={styles.sajuRow} key={row.label}>
              <SajuCell label={row.label} />
              {row.cells.map((cell, index) => (
                <SajuCell key={`${row.label}-${index}`} hanja={cell.hanja} ko={cell.ko} tone={cell.tone} />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <div className={`${styles.row} ${styles.between}`}>
            <span className={styles.label}>오행 분포</span>
            <span className={styles.caption}>
              {report.saju.deficitOhang[0] || report.saju.yongsin} 보완 필요
            </span>
          </div>
          <div className={styles.bars} style={{ marginTop: 14 }}>
            {bars.map(([label, value, color]) => (
              <div key={label} className={styles.barRow}>
                <span>{label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${Math.max(value, 6)}%`, background: color }}></div>
                </div>
                <span>{value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column} style={{ gap: 8 }}>
          <span className={styles.label}>신살 · 길성</span>
          <div className={styles.badgeWrap}>
            <span className={styles.badgeSoft}>도화살</span>
            <span className={styles.badge}>반안살</span>
            <span className={styles.badge}>천을귀인</span>
            <span className={styles.badge}>문창귀인</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
