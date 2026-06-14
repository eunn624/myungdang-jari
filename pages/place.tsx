import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';
import type { Ohang } from '../lib/saju/types';

const OHANG_COLOR: Record<Ohang, string> = {
  木: '#5cb85c', 火: '#e85d3f', 土: '#d4a574', 金: '#b8a88a', 水: '#4a90e2',
};

const OHANG_COLORS: Record<Ohang, string[]> = {
  木: ['초록', '청록', '연두'],
  火: ['빨강', '오렌지', '코랄'],
  土: ['베이지', '카멜', '테라코타'],
  金: ['화이트', '실버', '크림'],
  水: ['네이비', '파랑', '인디고'],
};

const OHANG_MATERIALS: Record<Ohang, string[]> = {
  木: ['원목', '라탄', '대나무'],
  火: ['가죽', '울', '패브릭'],
  土: ['도자기', '세라믹', '황토'],
  金: ['스테인리스', '유리', '크리스털'],
  水: ['유리', '거울', '크리스털'],
};

const OHANG_PLANTS: Record<Ohang, string> = {
  木: '아레카야자, 관음죽, 스킨답서스',
  火: '선인장, 붉은 잎 식물',
  土: '산세비에리아, 알로에, 다육이',
  金: '흰 화분 관엽식물, 안스리움',
  水: '수경재배 식물, 아이비, 수련',
};

const OHANG_DIRECTION_KOR: Record<Ohang, string> = {
  木: '동쪽', 火: '남쪽', 土: '서남쪽', 金: '서쪽', 水: '북쪽',
};

const SEUN_SPACE_TIP: Record<Ohang, string> = {
  木: '동쪽 공간 정돈 · 식물과 우드 소품으로 성장 기운 활성화',
  火: '남쪽 공간 조명 강화 · 따뜻한 컬러로 활력 기운 순환',
  土: '중앙·서남 공간 정리 · 베이지 패브릭으로 안정감 강화',
  金: '서쪽 수납 정리 · 화이트·메탈로 집중력 공간 완성',
  水: '북쪽 공간 정돈 · 유리·거울로 순환과 회복 기운 순환',
};

const DAE_WOON_SPACE_TIP: Record<Ohang, string> = {
  木: '이번 대운은 성장과 확장의 시기. 동쪽에 식물을 두고 공간을 넓게 쓰세요.',
  火: '이번 대운은 활발하고 드러나는 시기. 남향 공간을 활성화하고 조명을 밝게.',
  土: '이번 대운은 안정과 실속의 시기. 공간을 정리하고 베이지 톤으로 뿌리감을.',
  金: '이번 대운은 결실과 정리의 시기. 서쪽 수납 정리와 화이트 공간 완성이 핵심.',
  水: '이번 대운은 깊어지고 순환하는 시기. 물성 소품과 조용한 공간이 힘이 됩니다.',
};

const SPACE_TABS = ['지역 추천', '방위 가이드', '공간별', '비보 소품'] as const;
type SpaceTab = typeof SPACE_TABS[number];

export default function PlacePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const [activeTab, setActiveTab] = useState<SpaceTab>('지역 추천');

  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const recommended = report.districts.slice(0, 3);
  const seWoon = report.saju.seWoon;
  const currentDaeWoon = report.saju.currentDaeWoon;
  const sinsal = report.saju.sinsal;

  const hasDohwa = sinsal.some(s => s.name === '도화살');
  const hasYeokma = sinsal.some(s => s.name === '역마살');
  const hasMunchang = sinsal.some(s => s.name === '문창귀인');

  return (
    <Layout showTabBar activeTab="place">
      <div className={styles.screen}>
        <h1 className={styles.sectionTitle}>명당</h1>

        <div className={styles.badgeWrap}>
          {SPACE_TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                cursor: 'pointer', border: 'none', padding: 0, font: 'inherit', background: 'none',
              }}
            >
              <span className={activeTab === tab ? styles.badgeFill : styles.badge}>{tab}</span>
            </button>
          ))}
        </div>

        {activeTab === '지역 추천' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <span className={styles.label}>{deficit} 기운을 보완할 지역</span>
            {recommended.length > 0 ? recommended.map((item, index) => (
              <div key={item.district.code} className={`${styles.placeCard} ${index === 0 ? styles.placeCardStrong : ''}`}>
                <div className={styles.placeHeader}>
                  <h2 className={styles.placeName}>{index + 1}. {item.district.name}</h2>
                  <span className={index === 0 ? styles.badgeFill : styles.badge}>추천</span>
                </div>
                <span className={styles.placeMeta}>
                  {item.district.siDo} {item.district.siGunGu} · {item.district.hanja}
                </span>
                <div className={styles.badgeWrap}>
                  {item.district.ohang.map((tag) => (
                    <span key={tag} className={styles.badge}>{tag} 보완</span>
                  ))}
                  <span className={styles.badge}>{item.district.terrainNote}</span>
                </div>
                <p className={styles.placeReason}>{item.reasons[0]} · {item.reasons[1] || '생활 동선과 자연환경의 순환감이 강한 편입니다.'}</p>
                {hasYeokma && index === 0 && (
                  <p className={styles.caption} style={{ marginTop: 6, color: '#6b5e56' }}>
                    역마살 보유 — 교통 접근성 좋은 지역이 더 잘 맞습니다
                  </p>
                )}
                {hasDohwa && index === 0 && (
                  <p className={styles.caption} style={{ marginTop: 6, color: '#6b5e56' }}>
                    도화살 보유 — 문화·상업시설 가까운 지역이 활력에 도움돼요
                  </p>
                )}
              </div>
            )) : (
              <div className={styles.softCard}>
                <p className={styles.caption}>생년월일시를 입력하면 명당을 추천받을 수 있어요.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === '방위 가이드' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <span className={styles.label}>침대 머리 방향</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                머리는 <strong>{report.saju.bedDirection}쪽</strong>을 참고해보세요. 구조상 어렵다면 그 방향 벽면을 비우고, {OHANG_COLORS[deficit][0]} 계열 소재로 분위기를 맞춰주세요.
              </p>
              <div className={styles.badgeWrap} style={{ marginTop: 10 }}>
                <span className={styles.badgeFill}>침대 {report.saju.bedDirection}쪽</span>
                <span className={styles.badge}>{OHANG_MATERIALS[deficit][0]} 소재</span>
                <span className={styles.badge}>{OHANG_COLORS[deficit][0]} 계열</span>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>길방 (용신 방위)</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                {deficit} 기운이 필요한 분에게 <strong>{OHANG_DIRECTION_KOR[deficit]} ({report.saju.gilbang})</strong>이 길방입니다. 이 방위를 등지고 앉거나, 집중 정돈하면 좋아요.
              </p>
              <div className={styles.badgeWrap} style={{ marginTop: 10 }}>
                <span className={styles.badgeFill} style={{ background: OHANG_COLOR[deficit] }}>길방 {OHANG_DIRECTION_KOR[deficit]}</span>
                <span className={styles.badge}>{deficit} 용신</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={`${styles.row} ${styles.between}`}>
                <span className={styles.label}>올해 집중 방위</span>
                <span className={styles.badgeFill}>{seWoon.year}년 세운</span>
              </div>
              <p className={styles.caption} style={{ marginTop: 8 }}>
                {seWoon.ganJi.stem}{seWoon.ganJi.branch} · {seWoon.ohang} 기운이 강한 해
              </p>
              <div className={styles.softCard} style={{ marginTop: 10 }}>
                <p className={styles.caption} style={{ color: OHANG_COLOR[seWoon.ohang] }}>
                  {SEUN_SPACE_TIP[seWoon.ohang]}
                </p>
              </div>
            </div>

            {currentDaeWoon && (
              <div className={styles.card}>
                <div className={`${styles.row} ${styles.between}`}>
                  <span className={styles.label}>현재 대운 공간 팁</span>
                  <span className={styles.badgeSoft}>{currentDaeWoon.ganJi.stem}{currentDaeWoon.ganJi.branch} 대운</span>
                </div>
                <p className={styles.caption} style={{ marginTop: 8 }}>
                  {currentDaeWoon.startAge}~{currentDaeWoon.endAge}세 · {currentDaeWoon.ohang} 기운의 시기
                </p>
                <div className={styles.softCard} style={{ marginTop: 10 }}>
                  <p className={styles.caption}>{DAE_WOON_SPACE_TIP[currentDaeWoon.ohang]}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === '공간별' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.card}>
              <span className={styles.label}>🛏 침실</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                머리는 {report.saju.bedDirection}쪽, {OHANG_COLORS[deficit][0]}·{OHANG_COLORS[deficit][1]} 계열 침구
              </p>
              <div className={styles.column} style={{ gap: 4, marginTop: 8 }}>
                <p className={styles.caption}>• 소재: {OHANG_MATERIALS[deficit].join('·')} 위주</p>
                <p className={styles.caption}>• 식물: {OHANG_PLANTS[deficit].split(',')[0]}</p>
                <p className={styles.caption}>• 수면 전 30분 조명 낮추기</p>
                {hasDohwa && <p className={styles.caption} style={{ color: '#6b5e56' }}>• 도화살: 동쪽 창가에 거울·꽃 배치</p>}
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>🪑 거실</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                {deficit} 기운 소품으로 균형 잡기
              </p>
              <div className={styles.column} style={{ gap: 4, marginTop: 8 }}>
                <p className={styles.caption}>• 쿠션·러그: {OHANG_COLORS[deficit][0]}·{OHANG_COLORS[deficit][1]} 톤</p>
                <p className={styles.caption}>• 소품 소재: {OHANG_MATERIALS[deficit][0]}</p>
                <p className={styles.caption}>• 자연광 방향(동·남) 동선 비우기</p>
                <p className={styles.caption}>• 식물: {OHANG_PLANTS[deficit].split(',')[0]}</p>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>📚 서재·작업 공간</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                {hasMunchang ? '문창귀인 보유 — 북동쪽 책상이 최적' : '집중력 공간 셋업'}
              </p>
              <div className={styles.column} style={{ gap: 4, marginTop: 8 }}>
                <p className={styles.caption}>• 책상 방향: {hasMunchang ? '북동쪽' : '창가 또는 남향'}</p>
                <p className={styles.caption}>• 조명: 주광색 5000K 이상</p>
                <p className={styles.caption}>• 모니터 뒤 빈 공간 확보</p>
                <p className={styles.caption}>• 식물: 산세비에리아 또는 아레카야자</p>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>🚪 현관</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                {hasYeokma ? '역마살 — 동선 최소화와 정리가 핵심' : '첫 인상 공간 정돈'}
              </p>
              <div className={styles.column} style={{ gap: 4, marginTop: 8 }}>
                {hasYeokma ? (
                  <>
                    <p className={styles.caption}>• 신발장: 안 쓰는 신발 비우기</p>
                    <p className={styles.caption}>• 우산·가방 수납함으로 정리</p>
                    <p className={styles.caption}>• 바닥 매트 교체 — 가벼운 느낌</p>
                    <p className={styles.caption}>• 현관 거울 1개로 시각적 확장감</p>
                  </>
                ) : (
                  <>
                    <p className={styles.caption}>• 신발 3켤레 이하만 노출</p>
                    <p className={styles.caption}>• 계절 소품(꽃·식물) 1개</p>
                    <p className={styles.caption}>• 조명 밝게 — 첫 인상이 기운의 시작</p>
                    <p className={styles.caption}>• 향기(디퓨저·초)로 공간 정화</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === '비보 소품' && (
          <div className={styles.column} style={{ gap: 10 }}>
            <div className={styles.softCard}>
              <p className={styles.caption}>{deficit} 기운을 보완하는 소품 큐레이션</p>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>🎨 색상</span>
              <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                {OHANG_COLORS[deficit].map(c => (
                  <span key={c} className={styles.badgeFill} style={{ background: OHANG_COLOR[deficit] }}>{c}</span>
                ))}
              </div>
              <p className={styles.caption} style={{ marginTop: 8 }}>
                침구·쿠션·커튼·러그에 {OHANG_COLORS[deficit][0]} 계열을 더하세요
              </p>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>🪵 소재</span>
              <div className={styles.badgeWrap} style={{ marginTop: 8 }}>
                {OHANG_MATERIALS[deficit].map(m => (
                  <span key={m} className={styles.badge}>{m}</span>
                ))}
              </div>
              <p className={styles.caption} style={{ marginTop: 8 }}>
                가구·소품에 {OHANG_MATERIALS[deficit][0]} 소재를 1개 이상 배치해보세요
              </p>
            </div>

            <div className={styles.card}>
              <span className={styles.label}>🌿 식물</span>
              <p className={styles.bodyText} style={{ marginTop: 8 }}>{OHANG_PLANTS[deficit]}</p>
              <p className={styles.caption} style={{ marginTop: 6 }}>
                {OHANG_DIRECTION_KOR[deficit]}에 배치하면 시너지가 높아요
              </p>
            </div>

            {seWoon.ohang !== deficit && (
              <div className={styles.card}>
                <div className={`${styles.row} ${styles.between}`}>
                  <span className={styles.label}>올해 추가 소품</span>
                  <span className={styles.badgeSoft}>{seWoon.year}년 세운</span>
                </div>
                <p className={styles.caption} style={{ marginTop: 8 }}>
                  세운 {seWoon.ohang} 기운도 함께 보완하면 좋아요
                </p>
                <div className={styles.badgeWrap} style={{ marginTop: 6 }}>
                  {OHANG_COLORS[seWoon.ohang].slice(0, 2).map(c => (
                    <span key={c} className={styles.badge}>{c}</span>
                  ))}
                  <span className={styles.badge}>{OHANG_MATERIALS[seWoon.ohang][0]}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
