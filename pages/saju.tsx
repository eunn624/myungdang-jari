import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import { STEM_PROFILES, BRANCH_PROFILES } from '../data/ilju-content';

const OHANG_COLORS = {
  木: '#4a90e2',
  火: '#f25f5c',
  土: '#f4c84b',
  金: '#2f3137',
  水: '#4f7cff',
} as const;

// ─── 십성 계산 (일간 기준 동적 계산) ───────────────────────────────
const STEM_OHANG_MAP: Record<string, { ohang: string; yin: boolean }> = {
  甲: { ohang: '木', yin: false }, 乙: { ohang: '木', yin: true },
  丙: { ohang: '火', yin: false }, 丁: { ohang: '火', yin: true },
  戊: { ohang: '土', yin: false }, 己: { ohang: '土', yin: true },
  庚: { ohang: '金', yin: false }, 辛: { ohang: '金', yin: true },
  壬: { ohang: '水', yin: false }, 癸: { ohang: '水', yin: true },
};
const SS = [['木','火'],['火','土'],['土','金'],['金','水'],['水','木']];
const SG = [['木','土'],['土','水'],['水','火'],['火','金'],['金','木']];

function getSipsong(ilgan: string, target: string): string {
  if (!ilgan || !target) return '';
  if (ilgan === target) return '일원';
  const il = STEM_OHANG_MAP[ilgan];
  const tg = STEM_OHANG_MAP[target];
  if (!il || !tg) return '';
  const sy = il.yin === tg.yin;
  if (il.ohang === tg.ohang) return sy ? '비견' : '겁재';
  if (SS.some(([a, b]) => a === il.ohang && b === tg.ohang)) return sy ? '식신' : '상관';
  if (SG.some(([a, b]) => a === il.ohang && b === tg.ohang)) return sy ? '편재' : '정재';
  if (SS.some(([a, b]) => a === tg.ohang && b === il.ohang)) return sy ? '편인' : '정인';
  if (SG.some(([a, b]) => a === tg.ohang && b === il.ohang)) return sy ? '편관' : '정관';
  return '';
}

// 지지 → 장간 주기(主氣)
const BRANCH_MAIN_STEM: Record<string, string> = {
  子: '癸', 丑: '己', 寅: '甲', 卯: '乙', 辰: '戊',
  巳: '丙', 午: '丁', 未: '己', 申: '庚', 酉: '辛', 戌: '戊', 亥: '壬',
};

const SAJU_TABS = ['사주원국', '사주관계', '오행과 십성', '신강신약', '대운/세운'] as const;
type SajuTab = typeof SAJU_TABS[number];

function getToneClass(symbol?: string) {
  if (!symbol) return '';
  if (['甲', '乙', '寅', '卯'].includes(symbol)) return styles.cleanBlue;
  if (['丙', '丁', '巳', '午'].includes(symbol)) return styles.cleanRed;
  if (['戊', '己', '丑', '辰', '未', '戌'].includes(symbol)) return styles.cleanYellow;
  if (['庚', '辛', '申', '酉'].includes(symbol)) return styles.cleanBlack;
  return styles.cleanBlue;
}

function PillarTile({
  symbol,
  label,
  sublabel,
}: {
  symbol: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className={styles.cleanPillarColumn}>
      <div className={styles.cleanPillarTop}>{label}</div>
      <div className={`${styles.cleanPillarTile} ${getToneClass(symbol)}`}>{symbol}</div>
      <div className={styles.cleanPillarSub}>{sublabel}</div>
    </div>
  );
}

function RadarChart({ values }: { values: { label: string; value: number; color: string }[] }) {
  const size = 190;
  const center = size / 2;
  const radius = 62;
  const angleStep = (Math.PI * 2) / values.length;

  const ring = (scale: number) =>
    values.map((_, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const x = center + Math.cos(angle) * radius * scale;
      const y = center + Math.sin(angle) * radius * scale;
      return `${x},${y}`;
    }).join(' ');

  const polygon = values.map((item, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const x = center + Math.cos(angle) * radius * (item.value / 100);
    const y = center + Math.sin(angle) * radius * (item.value / 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.cleanRadarSvg}>
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={ring(scale)}
          fill="none"
          stroke="#e8ebf2"
          strokeWidth="1"
        />
      ))}
      {values.map((item, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        return (
          <line
            key={item.label}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#eceff5"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={polygon}
        fill="rgba(242,95,92,0.14)"
        stroke="#f25f5c"
        strokeWidth="2"
      />
      {values.map((item, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const valueX = center + Math.cos(angle) * radius * (item.value / 100);
        const valueY = center + Math.sin(angle) * radius * (item.value / 100);
        const labelX = center + Math.cos(angle) * (radius + 26);
        const labelY = center + Math.sin(angle) * (radius + 26);
        return (
          <g key={`${item.label}-point`}>
            <circle cx={valueX} cy={valueY} r="4" fill={item.color} />
            <text x={labelX} y={labelY} textAnchor="middle" className={styles.cleanRadarLabel}>
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StrengthGauge({ score, label }: { score: number; label: string }) {
  const progress = (score / 100) * 220;

  return (
    <div className={styles.cleanGaugeWrap}>
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="#eef1f5" strokeWidth="10" strokeLinecap="round" />
        <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="url(#gauge)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${progress} 220`} />
        <defs>
          <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f3c74c" />
            <stop offset="60%" stopColor="#f08b3d" />
            <stop offset="100%" stopColor="#5a7cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.cleanGaugeCenter}>
        <strong>{score}</strong>
        <span>{label}예요</span>
      </div>
    </div>
  );
}

export default function SajuPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const [activeTab, setActiveTab] = useState<SajuTab>('사주원국');
  const [relationTab, setRelationTab] = useState<'천간과 지지' | '신살과 길성'>('천간과 지지');

  const originalRef = useRef<HTMLDivElement | null>(null);
  const relationRef = useRef<HTMLDivElement | null>(null);
  const ohangRef = useRef<HTMLDivElement | null>(null);
  const strengthRef = useRef<HTMLDivElement | null>(null);
  const fortuneRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Record<SajuTab, RefObject<HTMLDivElement>> = {
    사주원국: originalRef,
    사주관계: relationRef,
    '오행과 십성': ohangRef,
    신강신약: strengthRef,
    '대운/세운': fortuneRef,
  };

  const { year, month, day, hour } = report.saju.pillars;
  const ilju = report.iljuContent;
  const dayStem = day.stem;
  const dayBranch = day.branch;
  const stemProfile = STEM_PROFILES[dayStem];
  const branchProfile = BRANCH_PROFILES[dayBranch];
  const currentDaeWoon = report.saju.currentDaeWoon;

  const radarValues = [
    { label: '화', value: report.saju.ohang.fire, color: OHANG_COLORS.火 },
    { label: '토', value: report.saju.ohang.earth, color: OHANG_COLORS.土 },
    { label: '금', value: report.saju.ohang.metal, color: OHANG_COLORS.金 },
    { label: '수', value: report.saju.ohang.water, color: OHANG_COLORS.水 },
    { label: '목', value: report.saju.ohang.wood, color: OHANG_COLORS.木 },
  ];

  const strengthScore = Math.max(
    38,
    Math.min(
      82,
      Math.round(52 + (Math.max(...radarValues.map((item) => item.value)) - Math.min(...radarValues.map((item) => item.value))) / 1.8),
    ),
  );
  const strengthLabel = strengthScore >= 62 ? '신강 사주' : strengthScore <= 48 ? '신약 사주' : '중화 사주';

  useEffect(() => {
    const scrollRoot = document.getElementById('app-main-scroll');
    if (!scrollRoot) return undefined;

    const sections = Object.entries(sectionRefs)
      .map(([key, ref]) => ({ key: key as SajuTab, node: ref.current }))
      .filter((item): item is { key: SajuTab; node: HTMLDivElement } => Boolean(item.node));

    const onScroll = () => {
      let current: SajuTab = '사주원국';
      for (const section of sections) {
        const top = section.node.offsetTop - scrollRoot.scrollTop;
        if (top <= 180) current = section.key;
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
    const scrollRoot = document.getElementById('app-main-scroll');
    if (!node || !scrollRoot) return;
    scrollRoot.scrollTo({ top: node.offsetTop - 116, behavior: 'smooth' });
  };

  return (
    <Layout showTabBar activeTab="saju" headerTitle="만세력" showBackButton>
      <div className={styles.cleanPage}>
        <div className={styles.cleanProfileHeader}>
          <div className={styles.cleanAvatar}></div>
          <h2>{report.profile.name}</h2>
          <p>{report.saju.pillars.day.stem}{report.saju.pillars.day.branch} · {report.profile.gender}</p>
        </div>

        <div className={styles.cleanInfoPanel}>
          <div><span>양력</span><strong>{report.formattedBirth}</strong></div>
          <div><span>용신</span><strong>{report.saju.yongsin}</strong></div>
          <div><span>길방</span><strong>{report.saju.gilbang}</strong></div>
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
                <span className={activeTab === tab ? styles.cleanTabActive : styles.cleanTab}>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <section ref={originalRef} className={styles.cleanSection}>
          <div className={styles.cleanSectionTitleRow}>
            <h3>사주원국</h3>
            <span>?</span>
          </div>

          <div className={styles.cleanOriginGrid}>
            <div className={styles.cleanOriginHeader}>
              <span>시주</span>
              <span>일주</span>
              <span>월주</span>
              <span>년주</span>
            </div>

            <div className={styles.cleanOriginRow}>
              <span className={styles.cleanOriginSide}>십성</span>
              <span>{hour ? getSipsong(dayStem, hour.stem) : '시 모름'}</span>
              <span>{getSipsong(dayStem, day.stem)}</span>
              <span>{getSipsong(dayStem, month.stem)}</span>
              <span>{getSipsong(dayStem, year.stem)}</span>
            </div>

            <div className={styles.cleanPillarRow}>
              <PillarTile symbol={hour?.stem ?? '—'} label={hour ? hour.stemKor : '시 모름'} sublabel={hour ? hour.stemKor : ''} />
              <PillarTile symbol={day.stem} label={day.stemKor} sublabel="일간" />
              <PillarTile symbol={month.stem} label={month.stemKor} sublabel={month.stemKor} />
              <PillarTile symbol={year.stem} label={year.stemKor} sublabel={year.stemKor} />
            </div>

            <div className={styles.cleanPillarRow}>
              <PillarTile symbol={hour?.branch ?? '—'} label={hour ? hour.branchKor : '시 모름'} sublabel={hour ? getSipsong(dayStem, BRANCH_MAIN_STEM[hour.branch] ?? '') : ''} />
              <PillarTile symbol={day.branch} label={day.branchKor} sublabel={getSipsong(dayStem, BRANCH_MAIN_STEM[dayBranch] ?? '')} />
              <PillarTile symbol={month.branch} label={month.branchKor} sublabel={getSipsong(dayStem, BRANCH_MAIN_STEM[month.branch] ?? '')} />
              <PillarTile symbol={year.branch} label={year.branchKor} sublabel={getSipsong(dayStem, BRANCH_MAIN_STEM[year.branch] ?? '')} />
            </div>
          </div>
        </section>

        <section ref={relationRef} className={styles.cleanSection}>
          <div className={styles.cleanSectionTitleRow}>
            <h3>사주관계</h3>
            <span>?</span>
          </div>
          <div className={styles.cleanInlineTabs}>
            <button
              type="button"
              className={relationTab === '천간과 지지' ? styles.cleanInlineTabActive : styles.cleanInlineTab}
              onClick={() => setRelationTab('천간과 지지')}
              style={{ cursor: 'pointer', border: 'none', background: 'none', font: 'inherit', padding: 0 }}
            >천간과 지지</button>
            <button
              type="button"
              className={relationTab === '신살과 길성' ? styles.cleanInlineTabActive : styles.cleanInlineTab}
              onClick={() => setRelationTab('신살과 길성')}
              style={{ cursor: 'pointer', border: 'none', background: 'none', font: 'inherit', padding: 0 }}
            >신살과 길성</button>
          </div>

          {relationTab === '천간과 지지' && (
            <div className={styles.cleanRelationBox}>
              <div className={styles.cleanRelationHeadRow}>
                <span>시간</span>
                <span>일간</span>
                <span>월간</span>
                <span>년간</span>
              </div>
              <div className={styles.cleanRelationTiles}>
                <div className={`${styles.cleanMiniTile} ${getToneClass(hour?.stem)}`}>{hour?.stem ?? '—'}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(day.stem)}`}>{day.stem}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(month.stem)}`}>{month.stem}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(year.stem)}`}>{year.stem}</div>
              </div>
              <div className={styles.cleanRelationTiles}>
                <div className={`${styles.cleanMiniTile} ${getToneClass(hour?.branch)}`}>{hour?.branch ?? '—'}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(day.branch)}`}>{day.branch}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(month.branch)}`}>{month.branch}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(year.branch)}`}>{year.branch}</div>
              </div>
              <div className={styles.cleanRelationGuide}>
                <div className={styles.cleanRelationLine}></div>
                <p>{ilju?.interpretation[0] || `${report.profile.name}님은 일간 ${day.stem}과 일지 ${day.branch}의 결이 또렷해서, 자기 기준과 감정 리듬이 분명한 편으로 읽힙니다.`}</p>
              </div>
            </div>
          )}

          {relationTab === '신살과 길성' && (
            <div className={styles.cleanRelationBox}>
              <div className={styles.cleanRelationTiles}>
                {[year.stem, month.stem, day.stem, hour?.stem ?? '—'].map((symbol, index) => (
                  <div key={`${symbol}-${index}`} className={`${styles.cleanMiniTileWide} ${getToneClass(symbol)}`}>{symbol}</div>
                ))}
              </div>
              <p className={styles.cleanMutedParagraph}>
                {report.saju.sinsal.length > 0
                  ? report.saju.sinsal.map((item) => `${item.name}(${item.hanja})`).join(' · ')
                  : '현재 강하게 드러난 신살은 많지 않아서 오행 균형과 일주 해석 중심으로 읽는 편이 자연스럽습니다.'}
              </p>
              {report.saju.sinsal.length > 0 && (
                <div className={styles.column} style={{ gap: 8, marginTop: 8 }}>
                  {report.saju.sinsal.map((s) => (
                    <div key={s.name} className={styles.softCard}>
                      <div className={styles.row} style={{ gap: 6, marginBottom: 4 }}>
                        <span className={styles.badge}>{s.name}</span>
                        <span className={styles.caption} style={{ color: '#8c7a6e' }}>{s.hanja}</span>
                      </div>
                      <p className={styles.caption}>{s.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section ref={ohangRef} className={styles.cleanSection}>
          <div className={styles.cleanSectionTitleRow}>
            <h3>오행과 십성</h3>
            <span>?</span>
          </div>

          <div className={styles.cleanOhangArea}>
            <div className={styles.cleanRadarWrap}>
              <RadarChart values={radarValues} />
              <div className={styles.cleanRadarCenter}>
                <strong>{Math.max(...radarValues.map((item) => item.value))}%</strong>
              </div>
            </div>

            <div className={styles.cleanLegendList}>
              {radarValues.map((item) => (
                <div key={item.label} className={styles.cleanLegendItem}>
                  <div className={styles.cleanLegendLeft}>
                    <span className={styles.cleanLegendDot} style={{ background: item.color }}></span>
                    <span>{item.label}기운</span>
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cleanMutedParagraph}>
            {ilju?.interpretation[1] || `${stemProfile.space} 같은 환경이 잘 맞고, ${branchProfile.terrain.join(', ')} 성향의 장소에서 기운이 정리되기 쉽습니다.`}
          </div>
        </section>

        <section ref={strengthRef} className={styles.cleanSection}>
          <div className={styles.cleanSectionTitleRow}>
            <h3>신강신약</h3>
            <span>?</span>
          </div>
          <StrengthGauge score={strengthScore} label={strengthLabel} />
          <div className={styles.cleanGaugeLegend}>
            <span><i style={{ background: '#f3c74c' }}></i>목적성</span>
            <span><i style={{ background: '#f08b3d' }}></i>주도성</span>
            <span><i style={{ background: '#5a7cff' }}></i>회복력</span>
          </div>
        </section>

        <section ref={fortuneRef} className={styles.cleanSection}>
          <div className={styles.cleanSectionTitleRow}>
            <h3>대운/세운</h3>
            <span>?</span>
          </div>

          <div className={styles.cleanFortuneBlock}>
            <h4>대운 (10년)</h4>
            <div className={styles.cleanFortuneGrid}>
              {report.saju.daeWoon.slice(0, 7).map((dw) => (
                <div key={`${dw.ganJi.stem}${dw.ganJi.branch}-${dw.startAge}`} className={`${styles.cleanFortuneColumn} ${dw.isCurrent ? styles.cleanFortuneCurrent : ''}`}>
                  <span>{dw.startAge}</span>
                  <div className={`${styles.cleanMiniTile} ${getToneClass(dw.ganJi.stem)}`}>{dw.ganJi.stem}</div>
                  <div className={`${styles.cleanMiniTile} ${getToneClass(dw.ganJi.branch)}`}>{dw.ganJi.branch}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cleanFortuneBlock}>
            <h4>세운</h4>
            <div className={styles.cleanFortuneGridSingle}>
              <div className={styles.cleanFortuneColumn}>
                <span>{report.saju.seWoon.year}</span>
                <div className={`${styles.cleanMiniTile} ${getToneClass(report.saju.seWoon.ganJi.stem)}`}>{report.saju.seWoon.ganJi.stem}</div>
                <div className={`${styles.cleanMiniTile} ${getToneClass(report.saju.seWoon.ganJi.branch)}`}>{report.saju.seWoon.ganJi.branch}</div>
              </div>
            </div>
          </div>

          <div className={styles.cleanMutedParagraph}>
            {currentDaeWoon
              ? `${currentDaeWoon.ganJi.stem}${currentDaeWoon.ganJi.branch} 대운은 ${currentDaeWoon.ohang} 기운이 강한 시기예요. ${DAE_WOON_LABEL(currentDaeWoon.ohang)}`
              : `${report.saju.seWoon.year}년은 ${report.saju.seWoon.ganJi.stem}${report.saju.seWoon.ganJi.branch} 세운으로 ${report.saju.seWoon.ohang} 기운이 강조됩니다.`}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function DAE_WOON_LABEL(ohang: string) {
  return ({
    木: '확장과 성장의 흐름이 강합니다.',
    火: '표현과 추진의 흐름이 강합니다.',
    土: '정착과 안정의 흐름이 강합니다.',
    金: '정리와 결실의 흐름이 강합니다.',
    水: '회복과 순환의 흐름이 강합니다.',
  } as Record<string, string>)[ohang] || '';
}
