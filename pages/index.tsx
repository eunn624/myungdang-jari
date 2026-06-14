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

        {analysis && strongestOhang && (
          <section className={styles.results} aria-live="polite">
            <div className={styles.resultSummary}>
              <p className={styles.eyebrow}>분석 요약</p>
              <h2>
                {strongestOhang}가 강하고 {analysis.result.yongsin} 보완을 참고해볼 수 있어요.
              </h2>
              <p>
                머리 방향은 {analysis.result.bedDirection}쪽, {analysis.result.yongsin} 보완 기준 길방은{' '}
                {analysis.result.gilbang}쪽으로 안내됩니다.
              </p>
            </div>

            {analysis.timeUnknown && (
              <p className={styles.notice}>시주를 제외한 3주 기준 분석입니다. 실제 결과와 차이가 있을 수 있어요.</p>
            )}

            <section className={styles.resultBlock}>
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

            <section className={styles.resultBlock}>
              <div className={styles.sectionHeader}>
                <span>03</span>
                <h2>오행 비중</h2>
              </div>
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

            <section className={styles.resultBlock}>
              <div className={styles.sectionHeader}>
                <span>04</span>
                <h2>참고해볼 동네</h2>
              </div>
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
                        <span>{TERRAIN_LABELS[terrain.primary]}</span>
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
                <p>머리는 {analysis.result.bedDirection}쪽을 참고해볼 수 있어요. 구조상 어렵다면 같은 방향에 작은 정리 공간을 두는 방식도 괜찮습니다.</p>
              </article>
              <article className={styles.guidanceCard}>
                <span>길방 안내</span>
                <h3>{analysis.result.gilbang}</h3>
                <p>{analysis.result.yongsin} 보완 기준으로 {analysis.result.gilbang}쪽을 생활 동선이나 소품 배치에 가볍게 참고하세요.</p>
              </article>
            </section>

            <section className={styles.resultBlock}>
              <div className={styles.sectionHeader}>
                <span>05</span>
                <h2>보완 소품 예시</h2>
              </div>
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
