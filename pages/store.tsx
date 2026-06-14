import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery, createQueryFromProfile } from '../lib/app-report';
import {
  STORE_ITEMS,
  OHANG_STORE_INFO,
  getItemsByOhang,
  getRecommendedItems,
  type StoreItem,
} from '../data/store-items';
import type { Ohang } from '../lib/saju/types';

const OHANG_ORDER: Ohang[] = ['木', '火', '土', '金', '水'];

export default function StorePage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);

  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const [activeTab, setActiveTab] = useState<'recommend' | Ohang>('recommend');

  const displayItems: StoreItem[] = useMemo(() => {
    if (activeTab === 'recommend') {
      return getRecommendedItems(
        report.saju.deficitOhang.length > 0
          ? report.saju.deficitOhang
          : [report.saju.yongsin]
      );
    }
    return getItemsByOhang(activeTab);
  }, [activeTab, report.saju.deficitOhang, report.saju.yongsin]);

  return (
    <Layout showTabBar activeTab="store">
      <div className={styles.screen}>

        {/* 헤더 */}
        <div className={styles.softCard}>
          <span className={styles.badgeSoft}>오행별 개운 소품</span>
          <h1 className={styles.sectionTitle} style={{ marginTop: 8 }}>
            {report.profile.name}님의<br />맞춤 공간 소품
          </h1>
          <p className={styles.caption} style={{ marginTop: 4 }}>
            보완 오행 <strong>{deficit}</strong> · 길방 <strong>{report.saju.gilbang}</strong> 방향 기준 추천
          </p>
        </div>

        {/* 대가성 공지 */}
        <div className={styles.noticeCard}>
          <p className={styles.caption} style={{ color: '#8c7a6e' }}>
            📌 아래 링크는 쿠팡 파트너스·오늘의집 제휴 링크입니다.
            구매 시 수수료가 발생할 수 있습니다. 추천은 오행 풍수 기준이며 효능을 보장하지 않습니다.
          </p>
        </div>

        {/* 탭 */}
        <div className={styles.tabRow}>
          <button
            type="button"
            className={activeTab === 'recommend' ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => setActiveTab('recommend')}
          >
            ✦ 추천
          </button>
          {OHANG_ORDER.map((o) => (
            <button
              key={o}
              type="button"
              className={activeTab === o ? styles.tabBtnActive : styles.tabBtn}
              style={activeTab === o ? { background: OHANG_STORE_INFO[o].colorHex, color: '#fff', borderColor: OHANG_STORE_INFO[o].colorHex } : {}}
              onClick={() => setActiveTab(o)}
            >
              {o}
            </button>
          ))}
        </div>

        {/* 탭 설명 */}
        {activeTab !== 'recommend' ? (
          <div className={styles.row} style={{ gap: 8, alignItems: 'center' }}>
            <span
              className={styles.badgeFill}
              style={{ background: OHANG_STORE_INFO[activeTab].colorHex }}
            >
              {OHANG_STORE_INFO[activeTab].label}
            </span>
            <span className={styles.caption}>{OHANG_STORE_INFO[activeTab].subtitle}</span>
          </div>
        ) : (
          <div className={styles.row} style={{ gap: 8 }}>
            <span className={styles.badgeFill}>보완 오행 {deficit} 중심 추천</span>
            <span className={styles.caption}>사주 기반 맞춤 소품</span>
          </div>
        )}

        {/* 상품 리스트 */}
        <div className={styles.column} style={{ gap: 10 }}>
          {displayItems.length === 0 ? (
            <div className={styles.card}>
              <p className={styles.bodyText}>사주 정보를 입력하면 맞춤 상품을 추천해드립니다.</p>
            </div>
          ) : (
            displayItems.map((item) => (
              <StoreCard key={item.id} item={item} deficit={deficit} />
            ))
          )}
        </div>

        {/* 전체 보기 버튼 */}
        {activeTab === 'recommend' && displayItems.length > 0 && (
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setActiveTab(deficit)}
          >
            {deficit} 오행 소품 전체 보기
          </button>
        )}

        {/* 개운법 안내 */}
        <div className={styles.softCard}>
          <p className={styles.label}>소품 배치 가이드</p>
          <div className={styles.column} style={{ gap: 6, marginTop: 8 }}>
            <p className={styles.caption}>• 해당 오행의 방위(목→동, 화→남, 금→서, 수→북)에 가까운 공간에 배치</p>
            <p className={styles.caption}>• 눈에 잘 띄는 선반 위·테이블 위에 두어야 기운 인식이 생깁니다</p>
            <p className={styles.caption}>• 먼지·시듦 없이 관리 — 방치된 소품은 효과가 없습니다</p>
            <p className={styles.caption}>• 소품 교체는 월운이 바뀌는 시점(매달 초)에 하면 리듬이 맞습니다</p>
          </div>
        </div>

        {/* 면책 고지 */}
        <p className={styles.footerNote} style={{ textAlign: 'center', padding: '8px 0' }}>
          본 콘텐츠는 오락·참고 목적이며 풍수 효능을 보장하지 않습니다.
        </p>
      </div>
    </Layout>
  );
}

function StoreCard({ item, deficit }: { item: StoreItem; deficit: Ohang }) {
  const info = OHANG_STORE_INFO[item.ohang];
  const isDeficit = item.ohang === deficit;

  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.card} style={{ position: 'relative' }}>
      {isDeficit && item.recommended && (
        <span
          className={styles.badgeFill}
          style={{ background: info.colorHex, marginBottom: 8, display: 'inline-block' }}
        >
          ✦ 핵심 추천
        </span>
      )}

      <div className={styles.row} style={{ gap: 10, alignItems: 'flex-start' }}>
        {/* 오행 컬러 바 */}
        <div
          style={{
            width: 4,
            minHeight: 64,
            borderRadius: 4,
            background: info.colorHex,
            flexShrink: 0,
          }}
        />

        <div className={styles.column} style={{ gap: 4, flex: 1 }}>
          <div className={styles.row} style={{ gap: 6, flexWrap: 'wrap' }}>
            <span className={styles.badgeSoft}>{item.tag}</span>
            <span className={styles.caption} style={{ color: '#8c7a6e' }}>{item.priceRange}</span>
          </div>
          <p className={styles.label}>{item.name}</p>
          <p className={styles.caption} style={{ color: '#8c7a6e' }}>{item.subtitle}</p>
          <p className={styles.caption} style={{ marginTop: 2 }}>{item.description}</p>

          <div className={styles.row} style={{ gap: 8, marginTop: 6 }}>
            <button
              type="button"
              className={styles.secondaryButton}
              style={{ flex: 1, minHeight: 36, fontSize: 13 }}
              onClick={handleClick}
            >
              {item.source}에서 보기 →
            </button>
            <span className={styles.caption} style={{ color: '#b0a098', fontSize: 11, alignSelf: 'center' }}>
              제휴 링크
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
