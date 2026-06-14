import React, { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../styles/Home.module.css';
import { analyzeSaju } from '../lib/saju';
import type { Ohang, SajuResult } from '../lib/saju/types';
import { matchDistricts } from '../lib/location/matcher';
import { classifyDistrictTerrain, TERRAIN_LABELS } from '../lib/location/terrain';
import type { MatchResult } from '../lib/location/types';

const OHANG_META: Record<Ohang, { key: keyof SajuResult['ohang']; label: string; color: string; items: string[] }> = {
  木: { key: 'wood', label: '목', color: '#4F7A5A', items: ['작은 식물', '우드 트레이', '그린 패브릭'] },
  火: { key: 'fire', label: '화', color: '#B7654D', items: ['따뜻한 조명', '코랄 포인트', '촛대 오브제'] },
  土: { key: 'earth', label: '토', color: '#9A7B55', items: ['세라믹 화병', '스톤 오브제', '베이지 러그'] },
  金: { key: 'metal', label: '금', color: '#8A8173', items: ['메탈 트레이', '화이트 수납함', '실버 포인트'] },
  水: { key: 'water', label: '수', color: '#3E6F8F', items: ['블루/네이비 패브릭', '유리 오브제', '물결 모티프'] },
};

const PILLAR_LABELS = [
  ['year', '년주'],
  ['month', '월주'],
  ['day', '일주'],
  ['hour', '시주'],
] as const;

const SPACE_GUIDE: Record<Ohang, { keyword: string; description: string; mission: string; avoid: string }> = {
  木: {
    keyword: '녹지와 생장감',
    description: '공간에서는 식물, 나무 소재, 초록 계열처럼 천천히 자라는 감각을 참고해볼 수 있어요.',
    mission: '책상이나 창가에 작은 식물 하나를 두고 주변을 비워보세요.',
    avoid: '너무 건조하거나 생기 없는 빈 공간은 잠시 덜어내는 쪽이 좋아요.',
  },
  火: {
    keyword: '빛과 온기',
    description: '공간에서는 조명, 따뜻한 색감, 햇빛이 드는 자리처럼 밝은 움직임을 참고해볼 수 있어요.',
    mission: '자주 머무는 곳에 따뜻한 조명이나 코랄 계열 포인트를 하나 더해보세요.',
    avoid: '이미 강한 자극이 많은 공간이라면 붉은 계열을 과하게 늘리지 않는 편이 좋아요.',
  },
  土: {
    keyword: '안정감과 중심',
    description: '공간에서는 돌, 흙, 세라믹, 낮고 안정적인 가구처럼 중심을 잡는 요소를 참고해볼 수 있어요.',
    mission: '침대 옆이나 현관 근처에 세라믹 오브제처럼 무게감 있는 소품을 놓아보세요.',
    avoid: '물건이 떠다니듯 흩어진 공간은 한 구역부터 차분히 정리해보세요.',
  },
  金: {
    keyword: '정돈과 결',
    description: '공간에서는 금속, 화이트, 깔끔한 수납처럼 선명하고 정돈된 감각을 참고해볼 수 있어요.',
    mission: '자주 쓰는 물건을 메탈 트레이나 흰 수납함에 모아 동선을 정리해보세요.',
    avoid: '장식이 지나치게 많으면 핵심 물건만 남기는 쪽이 더 잘 맞을 수 있어요.',
  },
  水: {
    keyword: '물길과 흐름',
    description: '공간에서는 수변, 북쪽, 블루 계열, 유리 소재처럼 흐름이 생기는 요소를 참고해볼 수 있어요.',
    mission: '북쪽 방향이나 책상 위에 투명한 유리컵, 블루 패브릭, 물결 모티프 중 하나를 놓아보세요.',
    avoid: '뜨겁고 건조한 인상이 강한 공간은 차분한 색과 비우는 동선으로 균형을 맞춰보세요.',
  },
};

interface AnalysisView {
  result: SajuResult;
  districts: MatchResult[];
  timeUnknown: boolean;
}

function parseBirth(dateValue: string, timeValue: string, timeUnknown: boolean) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const hour = timeUnknown ? undefined : Number(timeValue.split(':')[0]);
  return { year, month, day, hour };
}

function getStrongestOhang(result: SajuResult): Ohang {
  return (Object.keys(OHANG_META) as Ohang[]).reduce((strongest, current) => {
    const strongestValue = result.ohang[OHANG_META[strongest].key];
    const currentValue = result.ohang[OHANG_META[current].key];
    return currentValue > strongestValue ? current : strongest;
  }, '木');
}

function formatPillar(stem: string, branch: string, stemKor: string, branchKor: string) {
  return `${stem}${branch} · ${stemKor}${branchKor}`;
}

function getOhangValue(result: SajuResult, ohang: Ohang) {
  return result.ohang[OHANG_META[ohang].key];
}

export default function Home() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisView | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const strongestOhang = useMemo(() => {
    return analysis ? getStrongestOhang(analysis.result) : null;
  }, [analysis]);

  const yongsinGuide = analysis ? SPACE_GUIDE[analysis.result.yongsin] : null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    if (!timeUnknown && !birthTime) {
      setError('출생 시간을 입력하거나 “시 모름”을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      const birth = parseBirth(birthDate, birthTime, timeUnknown);
      const result = analyzeSaju(birth);
      const districts = matchDistricts({ deficitOhang: result.deficitOhang, topN: 3 });
      setAnalysis({ result, districts, timeUnknown });
      setIsLoading(false);
    }, 520);
  };

  return (
    <div className={styles.pageShell}>
      <main className={styles.appFrame}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>라이프스타일 공간 가이드</p>
            <h1 className={styles.title}>명당자리</h1>
          </div>
          <p className={styles.subtitle}>
            생년월일시를 바탕으로 오행 흐름과 참고해볼 동네, 침대 방향을 한 번에 정리해요.
          </p>
          <p className={styles.disclaimer}>오락·참고 목적의 라이프스타일 가이드입니다.</p>
        </section>

        <form className={styles.inputPanel} onSubmit={handleSubmit}>
          <div className={styles.sectionHeader}>
            <span>01</span>
            <h2>생년월일시</h2>
          </div>

          <label className={styles.field}>
            <span>양력 생년월일</span>
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              aria-label="양력 생년월일"
            />
          </label>

          <label className={`${styles.field} ${timeUnknown ? styles.disabledField : ''}`}>
            <span>출생 시간</span>
            <input
              type="time"
              value={birthTime}
              onChange={(event) => setBirthTime(event.target.value)}
              disabled={timeUnknown}
              aria-label="출생 시간"
            />
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={(event) => setTimeUnknown(event.target.checked)}
            />
            <span>시 모름으로 분석하기</span>
          </label>

          <p className={styles.privacyNote}>생년월일시는 브라우저에서만 계산됩니다.</p>
          {error && <p className={styles.errorText}>{error}</p>}

          <button className={styles.primaryButton} type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className={styles.loadingInline}>
                <span />
                <span />
                <span />
                <span />
                <span />
                분석 중
              </span>
            ) : (
              '내 공간 가이드 보기'
            )}
          </button>
        </form>

        {analysis && strongestOhang && yongsinGuide && (
          <section className={styles.results} aria-live="polite">
            <div className={styles.storyTopper}>
              <p>공간 리딩</p>
              <div className={styles.storyProgress} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <section className={styles.resultHero}>
              <div className={styles.elementSigil} style={{ borderColor: OHANG_META[analysis.result.yongsin].color }}>
                <span style={{ color: OHANG_META[analysis.result.yongsin].color }}>{analysis.result.yongsin}</span>
              </div>
              <p className={styles.darkEyebrow}>오늘의 공간 키워드</p>
              <h2>{analysis.result.yongsin} 보완</h2>
              <strong>{yongsinGuide.keyword}</strong>
              <p>
                {strongestOhang} 기운이 가장 두드러지고 {analysis.result.yongsin} 기운은 보완 여지가 있어요.
                {' '}
                {yongsinGuide.description}
              </p>
              <div className={styles.insightChips}>
                <span>{strongestOhang} {getOhangValue(analysis.result, strongestOhang)}%</span>
                <span>{analysis.result.yongsin} {getOhangValue(analysis.result, analysis.result.yongsin)}%</span>
                <span>길방 {analysis.result.gilbang}</span>
                <span>침대 {analysis.result.bedDirection}</span>
              </div>
            </section>

            {analysis.timeUnknown && (
              <p className={styles.notice}>시주를 제외한 3주 기준 분석입니다. 실제 결과와 차이가 있을 수 있어요.</p>
            )}

            <section className={styles.storySection}>
              <div className={styles.sectionHeader}>
                <span>02</span>
                <h2>사주팔자</h2>
              </div>
              <div className={styles.pillarGrid}>
                {PILLAR_LABELS.map(([key, label]) => {
                  const pillar = analysis.result.pillars[key];
                  return (
                    <div className={styles.pillarChip} key={key}>
                      <span>{label}</span>
                      <strong>
                        {pillar ? formatPillar(pillar.stem, pillar.branch, pillar.stemKor, pillar.branchKor) : '시 모름'}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={styles.balancePanel}>
              <div className={styles.sectionHeader}>
                <span>03</span>
                <h2>오행 균형</h2>
              </div>
              <p className={styles.panelLead}>
                가장 낮은 오행부터 공간에서 가볍게 보완해보는 흐름으로 읽습니다.
              </p>
              <div className={styles.ohangList}>
                {(Object.keys(OHANG_META) as Ohang[]).map((ohang) => {
                  const meta = OHANG_META[ohang];
                  const value = analysis.result.ohang[meta.key];
                  return (
                    <div className={styles.ohangRow} key={ohang}>
                      <div className={styles.ohangLabel}>
                        <strong style={{ color: meta.color }}>{ohang}</strong>
                        <span>{meta.label}</span>
                      </div>
                      <div className={styles.barTrack}>
                        <span
                          className={styles.barFill}
                          style={{ width: `${value}%`, backgroundColor: meta.color }}
                        />
                      </div>
                      <span className={styles.percent}>{value}%</span>
                    </div>
                  );
                })}
              </div>
              <p className={styles.helperText}>
                부족 오행: {analysis.result.deficitOhang.slice(0, 3).join(' · ')}
              </p>
            </section>

            <section className={styles.storySection}>
              <div className={styles.sectionHeader}>
                <span>04</span>
                <h2>참고해볼 동네</h2>
              </div>
              <p className={styles.panelLead}>
                점수나 순위가 아니라, 지명 한자와 지형 속성을 함께 참고하는 후보예요.
              </p>
              <div className={styles.districtList}>
                {analysis.districts.map((match) => {
                  const terrain = classifyDistrictTerrain(match.district);
                  return (
                    <article className={styles.districtCard} key={match.district.code}>
                      <div>
                        <p className={styles.districtMeta}>
                          {match.district.siDo} · {match.district.siGunGu}
                        </p>
                        <h3>{match.district.name}</h3>
                        <p className={styles.hanjaText}>{match.district.hanja}</p>
                      </div>
                      <div className={styles.chipRow}>
                        {terrain.tags.map((tag) => (
                          <span key={tag}>{TERRAIN_LABELS[tag]}</span>
                        ))}
                        {match.district.ohang.map((ohang) => (
                          <span key={ohang}>{ohang} 보완</span>
                        ))}
                      </div>
                      <p className={styles.reasonText}>{match.reasons[0]}</p>
                      <p className={styles.terrainNote}>{match.district.terrainNote}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className={styles.guidanceGrid}>
              <article className={styles.guidanceCard}>
                <span>침대 방향</span>
                <h3>{analysis.result.bedDirection}</h3>
                <p>머리는 {analysis.result.bedDirection}쪽을 참고해볼 수 있어요. 구조상 어렵다면 같은 방향의 벽면을 정리하거나 작은 조명을 두는 방식도 괜찮습니다.</p>
              </article>
              <article className={styles.guidanceCard}>
                <span>길방 안내</span>
                <h3>{analysis.result.gilbang}</h3>
                <p>{analysis.result.yongsin} 보완 기준으로 {analysis.result.gilbang}쪽을 생활 동선이나 소품 배치에 가볍게 참고하세요.</p>
              </article>
            </section>

            <section className={styles.missionPanel}>
              <div className={styles.sectionHeader}>
                <span>05</span>
                <h2>오늘의 공간 미션</h2>
              </div>
              <p className={styles.missionText}>{yongsinGuide.mission}</p>
              <p className={styles.avoidText}>{yongsinGuide.avoid}</p>
              <div className={styles.itemList}>
                {OHANG_META[analysis.result.yongsin].items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className={styles.helperText}>실제 상품과 제휴 링크는 커머스 DB 연결 후 별도 표기됩니다.</p>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}
