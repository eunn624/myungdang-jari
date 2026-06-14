import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
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

  const originalRef = useRef<HTMLDivElement | null>(null);
  const iljuRef = useRef<HTMLDivElement | null>(null);
  const ohangRef = useRef<HTMLDivElement | null>(null);
  const sinsalRef = useRef<HTMLDivElement | null>(null);
  const daewoonRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Record<SajuTab, RefObject<HTMLDivElement>> = {
    원국: originalRef,
    일주: iljuRef,
    오행: ohangRef,
    신살: sinsalRef,
    대운: daewoonRef,
  };

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

  useEffect(() => {
    const scrollRoot = document.getElementById('app-main-scroll');
    if (!scrollRoot) return undefined;

    const sections = Object.entries(sectionRefs)
      .map(([key, ref]) => ({ key: key as SajuTab, node: ref.current }))
      .filter((item): item is { key: SajuTab; node: HTMLDivElement } => Boolean(item.node));

    const onScroll = () => {
      let current: SajuTab = '원국';
      for (const section of sections) {
        const top = section.node.offsetTop - scrollRoot.scrollTop;
        if (top <= 180) {
          current = section.key;
        }
      }
      setActiveTab(current);
    };

    onScroll();
    scrollRoot.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollRoot.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (tab: SajuTab) => {
    setActiveTab(tab);
    const node = sectionRefs[tab].current;
    if (!node) return;

    const scrollRoot = document.getElementById('app-main-scroll');
    if (!scrollRoot) return;

    const headerOffset = 116;
    const top = node.offsetTop - headerOffset;
    scrollRoot.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <Layout showTabBar activeTab="saju" headerTitle="사주원국" showBackButton>
      <div className={styles.screen}>
        <div className={styles.pageIntroCard}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>만세력</span>
            <h2 className={styles.sectionTitle}>{report.profile.name}</h2>
            <p className={styles.sectionSubtitle}>
              {report.formattedBirth} · {report.profile.gender} · 일간 {dayStem} · 일주 {dayStem}{dayBranch}
            </p>
          </div>
          <div className={styles.statsGrid} style={{ marginTop: 14 }}>
            <div className={styles.statCard}>
              <strong className={styles.statValue}>{report.saju.pillars.day.stem}{report.saju.pillars.day.branch}</strong>
              <span className={styles.statLabel}>일주</span>
            </div>
            <div className={styles.statCard}>
              <strong className={styles.statValue}>{report.saju.yongsin}</strong>
              <span className={styles.statLabel}>용신</span>
            </div>
            <div className={styles.statCard}>
              <strong className={styles.statValue}>{report.saju.gilbang}</strong>
              <span className={styles.statLabel}>길방</span>
            </div>
          </div>
        </div>

        <div className={styles.stickySectionTabs}>
          <div className={styles.badgeWrap}>
            {SAJU_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => scrollToSection(tab)}
                style={{ cursor: 'pointer', border: 'none', padding: 0, font: 'inherit', background: 'none' }}
              >
                <span className={activeTab === tab ? styles.badgeFill : styles.badge}>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={originalRef} className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>사주원국</h3>
            <p className={styles.sectionSubtitle}>사주팔자 네 기둥을 한 화면에서 바로 읽을 수 있게 정리했어요.</p>
          </div>

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
              <div className={styles.stackVertical}>
                <div className={styles.badgeWrap}>
                  <span className={styles.badgeFill}>{dayStem}{dayBranch} 일주</span>
                  <span className={styles.badge}>{ilju.korean}</span>
                  <span className={styles.badgeSoft}>{ilju.animal}</span>
                </div>
                <p className={styles.bodyText}>{ilju.identitySummary}</p>
                <div className={styles.badgeWrap}>
                  <span className={styles.badge}>일간 {ilju.stemElement}</span>
                  <span className={styles.badge}>일지 {ilju.branchElement}</span>
                  {ilju.favorableTerrains.map((t) => (
                    <span key={t} className={styles.badgeSoft}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.softCard}>
              <p className={styles.caption}>생년월일을 입력하면 일주 분석을 볼 수 있어요.</p>
            </div>
          )}
        </div>

        <div ref={iljuRef} className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>일주</h3>
            <p className={styles.sectionSubtitle}>일간과 일지를 중심으로 성향, 관계, 공간 감각을 읽습니다.</p>
          </div>

          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <div className={styles.stackVertical}>
                <div className={styles.badgeWrap}>
                  <span className={styles.badge}>일간 (천간)</span>
                  <span className={styles.badgeFill} style={{ background: OHANG_COLOR[report.saju.yongsin] }}>
                    {dayStem} · {ilju?.stemElement ?? report.saju.yongsin}
                  </span>
                </div>
                <p className={styles.bodyText} style={{ fontWeight: 600 }}>{stemProfile.title}</p>
                <p className={styles.caption}>{stemProfile.metaphor}</p>
                <div className={styles.column} style={{ gap: 4 }}>
                  <p className={styles.caption}>• 성향: {stemProfile.temperament}</p>
                  <p className={styles.caption}>• 강점: {stemProfile.strength}</p>
                  <p className={styles.caption}>• 관계: {stemProfile.relationship}</p>
                  <p className={styles.caption}>• 공간: {stemProfile.space}</p>
                  <p className={styles.caption}>• 균형 포인트: {stemProfile.balance}</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.stackVertical}>
                <div className={styles.badgeWrap}>
                  <span className={styles.badge}>일지 (지지)</span>
                  <span className={styles.badgeSoft}>{dayBranch} · {branchProfile.animal}</span>
                </div>
                <p className={styles.caption} style={{ fontStyle: 'italic' }}>{branchProfile.scene}</p>
                <p className={styles.bodyText}>{branchProfile.placeMood}</p>
                <div className={styles.column} style={{ gap: 4 }}>
                  <p className={styles.caption}>• 지형: {branchProfile.terrain.join(' · ')}</p>
                  <p className={styles.caption}>• 기후 흐름: {branchProfile.climate}</p>
                  <p className={styles.caption}>• 주의: {branchProfile.caution}</p>
                </div>
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
        </div>

        <div ref={ohangRef} className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>오행</h3>
            <p className={styles.sectionSubtitle}>오행 분포, 부족한 기운, 용신과 길방을 한 번에 봅니다.</p>
          </div>

          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <div className={styles.stackVertical}>
                <div className={styles.row} style={{ justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                  <span className={styles.label}>오행 분포</span>
                  <span className={styles.caption}>
                    {report.saju.deficitOhang[0] || report.saju.yongsin} 보완 필요
                  </span>
                </div>
                <div className={styles.bars}>
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
            </div>

            <div className={styles.card}>
              <span className={styles.label}>용신 · 길방</span>
              <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                <span className={styles.badgeFill} style={{ background: OHANG_COLOR[report.saju.yongsin] }}>
                  용신 {report.saju.yongsin}
                </span>
                <span className={styles.badge}>길방 {report.saju.gilbang}</span>
                {report.saju.deficitOhang.map((o) => (
                  <span key={o} className={styles.badgeSoft}>{o} 부족</span>
                ))}
              </div>
            </div>

            {ilju && (
              <>
                <div className={styles.card}>
                  <span className={styles.label}>지형 · 공간 성향</span>
                  <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                    {ilju.favorableTerrains.map((t) => (
                      <span key={t} className={styles.badge}>{t}</span>
                    ))}
                    {ilju.favorableDirections.map((d) => (
                      <span key={d} className={styles.badge}>{d}쪽</span>
                    ))}
                  </div>
                  <div className={styles.column} style={{ gap: 4, marginTop: 10 }}>
                    {ilju.spaceKeywords.map((k) => (
                      <p key={k} className={styles.caption}>• {k}</p>
                    ))}
                  </div>
                </div>

                <div className={styles.card}>
                  <span className={styles.label}>추천 동네 타입</span>
                  <div className={styles.column} style={{ gap: 4, marginTop: 8 }}>
                    {ilju.recommendedPlaces.map((p) => (
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
        </div>

        <div ref={sinsalRef} className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>신살</h3>
            <p className={styles.sectionSubtitle}>현재 사주에서 두드러지는 신살과 공간 힌트를 정리했습니다.</p>
          </div>

          <div className={styles.column} style={{ gap: 8 }}>
            {report.saju.sinsal.length > 0 ? (
              report.saju.sinsal.map((s) => (
                <div key={s.name} className={styles.card}>
                  <div className={styles.row} style={{ gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
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
                  {ilju.spaceKeywords.map((k) => (
                    <span key={k} className={styles.badge}>{k}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div ref={daewoonRef} className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>대운</h3>
            <p className={styles.sectionSubtitle}>대운과 세운 흐름을 아래로 이어서 볼 수 있게 붙였습니다.</p>
          </div>

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
              <div className={styles.row} style={{ justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
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
        </div>
      </div>
    </Layout>
  );
}
