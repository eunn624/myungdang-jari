import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import { STEM_PROFILES, BRANCH_PROFILES } from '../data/ilju-content';

const OHANG_COLOR: Record<string, string> = {
  木: '#5cb85c', 火: '#e85d3f', 土: '#d4a574', 金: '#b8a88a', 水: '#4a90e2',
};

const DAEWOON_COLOR: Record<string, string> = {
  木: '#5cb85c', 火: '#e85d3f', 土: '#d4a574', 金: '#b8a88a', 水: '#4a90e2',
};

const SAJU_TABS = ['원국', '일주', '오행', '신살', '대운'] as const;
type SajuTab = typeof SAJU_TABS[number];

function SajuCell({
  label, hanja, ko, tone,
}: {
  label?: string; hanja?: string; ko?: string; tone?: string;
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
  const [activeTab, setActiveTab] = useState<SajuTab>('원국');

  const { year, month, day, hour } = report.saju.pillars;
  const ilju = report.iljuContent;
  const dayStem = day.stem;
  const dayBranch = day.branch;
  const stemProfile = STEM_PROFILES[dayStem];
  const branchProfile = BRANCH_PROFILES[dayBranch];

  const bars = [
    { label: '木', value: report.saju.ohang.wood, color: '#5cb85c' },
    { label: '火', value: report.saju.ohang.fire, color: '#e85d3f' },
    { label: '土', value: report.saju.ohang.earth, color: '#d4a574' },
    { label: '金', value: report.saju.ohang.metal, color: '#e8d4a8' },
    { label: '水', value: report.saju.ohang.water, color: '#4a90e2' },
  ];

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

  return (
    <Layout showTabBar activeTab="saju" headerTitle="사주원국" showBackButton>
      <div className={styles.screen}>
        <div className={`${styles.row} ${styles.between}`}>
          <span className={styles.badge}>만세력</span>
        </div>
        <p className={styles.sectionSubtitle}>
          {report.profile.name} · {report.formattedBirth} · 일간 {dayStem}
        </p>

        <div className={styles.badgeWrap}>
          {SAJU_TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{ cursor: 'pointer', border: 'none', padding: 0, font: 'inherit', background: 'none' }}
            >
              <span className={activeTab === tab ? styles.badgeFill : styles.badge}>{tab}</span>
            </button>
          ))}
        </div>

        {activeTab === '원국' && (
          <>
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

            {ilju ? (
              <div className={styles.card}>
                <div className={styles.row} style={{ gap: 10, alignItems: 'center' }}>
                  <span className={styles.badgeFill}>{dayStem}{dayBranch} 일주</span>
                  <span className={styles.caption}>{ilju.korean} · {ilju.animal}</span>
                </div>
                <p className={styles.bodyText} style={{ marginTop: 10 }}>{ilju.identitySummary}</p>
                <div className={styles.badgeWrap} style={{ marginTop: 10 }}>
                  <span className={styles.badge}>일간 {ilju.stemElement}</span>
                  <span className={styles.badge}>일지 {ilju.branchElement}</span>
                  {ilju.favorableTerrains.map(t => (
                    <span key={t} className={styles.badgeSoft}>{t}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.softCard}>
                <p className={styles.caption}>생년월일을 입력하면 일주 분석을 볼 수 있어요.</p>
              </div>
            )}
          </>
        )}

        {activeTab === '일주' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <div className={`${styles.row} ${styles.between}`}>
                <span className={styles.label}>일간 (천간) · {dayStem}</span>
                <span className={styles.badgeFill} style={{ background: OHANG_COLOR[report.saju.yongsin] }}>
                  {ilju?.stemElement ?? report.saju.yongsin}
                </span>
              </div>
              <p className={styles.bodyText} style={{ marginTop: 8, fontWeight: 600 }}>{stemProfile.title}</p>
              <p className={styles.caption} style={{ marginTop: 6 }}>{stemProfile.metaphor}</p>
              <div className={styles.column} style={{ gap: 4, marginTop: 10 }}>
                <p className={styles.caption}>• 성향: {stemProfile.temperament}</p>
                <p className={styles.caption}>• 강점: {stemProfile.strength}</p>
                <p className={styles.caption}>• 관계: {stemProfile.relationship}</p>
                <p className={styles.caption}>• 공간: {stemProfile.space}</p>
                <p className={styles.caption}>• 균형 포인트: {stemProfile.balance}</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={`${styles.row} ${styles.between}`}>
                <span className={styles.label}>일지 (지지) · {dayBranch}</span>
                <span className={styles.badge}>{branchProfile.animal}</span>
              </div>
              <p className={styles.caption} style={{ marginTop: 8, fontStyle: 'italic' }}>{branchProfile.scene}</p>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>{branchProfile.placeMood}</p>
              <div className={styles.column} style={{ gap: 4, marginTop: 10 }}>
                <p className={styles.caption}>• 지형: {branchProfile.terrain.join('·')}</p>
                <p className={styles.caption}>• 기후 흐름: {branchProfile.climate}</p>
                <p className={styles.caption}>• 주의: {branchProfile.caution}</p>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>일상 루틴 개운법</span>
              <p className={styles.caption} style={{ marginTop: 8 }}>{stemProfile.ritual}</p>
            </div>

            {ilju && (
              <div className={styles.card}>
                <span className={styles.label}>사주관계 리딩</span>
                <p className={styles.bodyText} style={{ marginTop: 8, whiteSpace: 'pre-line' }}>
                  {ilju.interpretation[0]}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === '오행' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <div className={`${styles.row} ${styles.between}`}>
                <span className={styles.label}>오행 분포</span>
                <span className={styles.caption}>
                  {report.saju.deficitOhang[0] || report.saju.yongsin} 보완 필요
                </span>
              </div>
              <div className={styles.bars} style={{ marginTop: 14 }}>
                {bars.map(({ label, value, color }) => (
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

            <div className={styles.card}>
              <span className={styles.label}>용신 · 길방</span>
              <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                <span className={styles.badgeFill} style={{ background: OHANG_COLOR[report.saju.yongsin] }}>
                  용신 {report.saju.yongsin}
                </span>
                <span className={styles.badge}>길방 {report.saju.gilbang}</span>
                {report.saju.deficitOhang.map(o => (
                  <span key={o} className={styles.badgeSoft}>{o} 부족</span>
                ))}
              </div>
            </div>

            {ilju && (
              <>
                <div className={styles.card}>
                  <span className={styles.label}>지형 · 공간 성향</span>
                  <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                    {ilju.favorableTerrains.map(t => (
                      <span key={t} className={styles.badge}>{t}</span>
                    ))}
                    {ilju.favorableDirections.map(d => (
                      <span key={d} className={styles.badge}>{d}쪽</span>
                    ))}
                  </div>
                  <div className={styles.column} style={{ gap: 4, marginTop: 10 }}>
                    {ilju.spaceKeywords.map(k => (
                      <p key={k} className={styles.caption}>• {k}</p>
                    ))}
                  </div>
                </div>

                <div className={styles.card}>
                  <span className={styles.label}>추천 동네 타입</span>
                  <div className={styles.column} style={{ gap: 4, marginTop: 8 }}>
                    {ilju.recommendedPlaces.map(p => (
                      <p key={p} className={styles.caption}>• {p}</p>
                    ))}
                  </div>
                  <p className={styles.bodyText} style={{ marginTop: 10, whiteSpace: 'pre-line' }}>
                    {ilju.interpretation[1]}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === '신살' && (
          <div className={styles.column} style={{ gap: 8 }}>
            {report.saju.sinsal.length > 0 ? (
              report.saju.sinsal.map(s => (
                <div key={s.name} className={styles.card}>
                  <div className={styles.row} style={{ gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span className={s.category === 'guiin' ? styles.badgeFill : styles.badgeSoft}>{s.name}</span>
                    <span className={styles.caption}>{s.hanja} · {s.activePillar}</span>
                  </div>
                  <p className={styles.bodyText}>{s.description}</p>
                  <div className={styles.softCard} style={{ marginTop: 8 }}>
                    <p className={styles.caption} style={{ color: '#6b5e56' }}>공간 팁: {s.spaceTag}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.softCard}>
                <p className={styles.caption}>이 사주에서 주요 신살이 감지되지 않았습니다.</p>
                <p className={styles.caption} style={{ marginTop: 4 }}>오행 분포와 일간 중심으로 읽어볼 수 있어요.</p>
              </div>
            )}

            {ilju && ilju.spaceKeywords.length > 0 && (
              <div className={styles.card}>
                <span className={styles.label}>길성 공간 키워드</span>
                <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                  {ilju.spaceKeywords.map(k => (
                    <span key={k} className={styles.badge}>{k}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === '대운' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <span className={styles.label}>대운 흐름</span>
              {report.saju.daeWoon.length > 0 ? (
                <>
                  <div className={styles.timeline} style={{ marginTop: 12 }}>
                    {report.saju.daeWoon.slice(0, 7).map((dw) => (
                      <div key={`${dw.ganJi.stem}${dw.ganJi.branch}-${dw.startAge}`} className={styles.timelineNode}>
                        <span
                          className={`${styles.timelineCircle} ${dw.isCurrent ? styles.timelineCircleActive : ''}`}
                          style={dw.isCurrent ? { background: DAEWOON_COLOR[dw.ohang] } : {}}
                        >
                          {dw.startAge}
                        </span>
                        <span className={styles.timelineLabel}>{dw.ganJi.stem}{dw.ganJi.branch}</span>
                        <span className={styles.caption} style={{ fontSize: 10, color: DAEWOON_COLOR[dw.ohang] }}>
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
                      <p className={styles.caption}>{report.saju.currentDaeWoon.ohang} 기운의 시기</p>
                    </div>
                  )}
                </>
              ) : (
                <p className={styles.caption} style={{ marginTop: 8 }}>생년월일을 입력하면 대운 흐름을 볼 수 있어요.</p>
              )}
            </div>

            <div className={styles.card}>
              <div className={`${styles.row} ${styles.between}`}>
                <span className={styles.label}>세운 ({report.saju.seWoon.year}년)</span>
                <span className={styles.badgeFill}>
                  {report.saju.seWoon.ganJi.stem}{report.saju.seWoon.ganJi.branch} · {report.saju.seWoon.ohang}
                </span>
              </div>
              <p className={styles.caption} style={{ marginTop: 8 }}>
                {report.saju.seWoon.ganJi.stemKor}{report.saju.seWoon.ganJi.branchKor}년 · {report.saju.seWoon.ohang} 기운이 강하게 흐르는 해
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
