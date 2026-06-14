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
    <Layout showTabBar activeTab="store" headerTitle="추천 소품" showBackButton>
      <div className={styles.screen}>

        {/* 헤더 */}
        <div className={styles.softCard}>
          <span className={styles.badgeSoft}>나와 어울리는 공간 아이템</span>
          <h1 className={styles.sectionTitle} style={{ marginTop: 8 }}>
            {report.profile.name}님의<br />맞춤 공간 소품
          </h1>
          <p className={styles.caption} style={{ marginTop: 4 }}>
            보완이 필요한 오행 <strong>{deficit}</strong>과 길방 <strong>{report.saju.gilbang}</strong>을 바탕으로 골랐어요.
          </p>
        </div>

        {/* 대가성 공지 */}
        <div className={styles.noticeCard}>
          <p className={styles.caption} style={{ color: '#8c7a6e' }}>
            📌 아래 링크는 쿠팡 파트너스·오늘의집 제휴 링크입니다.
            구매 시 소정의 수수료가 발생할 수 있어요. 추천은 취향과 공간 연출을 돕는 참고용 가이드입니다.
          </p>
        </div>

        {/* 탭 */}
        <div className={styles.tabRow}>
          <button
            type="button"
            className={activeTab === 'recommend' ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => setActiveTab('recommend')}
          >
            추천
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
          <div className={styles.stackVertical}>
            <span
              className={styles.badgeFill}
              style={{ background: OHANG_STORE_INFO[activeTab].colorHex }}
            >
              {OHANG_STORE_INFO[activeTab].label}
            </span>
            <span className={styles.caption}>{OHANG_STORE_INFO[activeTab].subtitle}</span>
          </div>
        ) : (
          <div className={styles.stackVertical}>
            <span className={styles.badgeFill}>{deficit} 기운을 채우는 추천</span>
            <span className={styles.caption}>지금 공간에 가볍게 더해보기 좋은 아이템</span>
          </div>
        )}

        {/* 상품 리스트 */}
        <div className={styles.column} style={{ gap: 10 }}>
          {displayItems.length === 0 ? (
            <div className={styles.card}>
              <p className={styles.bodyText}>정보를 입력하면 어울리는 소품을 보여드릴게요.</p>
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
            {deficit} 관련 소품 더 보기
          </button>
        )}

        {/* 개운법 안내 */}
        <div className={styles.softCard}>
          <p className={styles.label}>이렇게 놓아보세요</p>
          <div className={styles.column} style={{ gap: 6, marginTop: 8 }}>
            <p className={styles.caption}>• 해당 오행과 잘 맞는 방향 가까이에 두면 공간의 분위기를 맞추기 좋아요.</p>
            <p className={styles.caption}>• 자주 보는 선반이나 테이블 위처럼 눈에 잘 띄는 곳이 잘 어울려요.</p>
            <p className={styles.caption}>• 먼지가 쌓이지 않게 관리하면 공간 전체가 더 정돈돼 보여요.</p>
            <p className={styles.caption}>• 계절이 바뀌거나 기분 전환이 필요할 때 교체해도 좋아요.</p>
          </div>
        </div>

        {/* 면책 고지 */}
        <p className={styles.footerNote} style={{ textAlign: 'center', padding: '8px 0' }}>
          이 페이지는 재미와 참고를 위한 콘텐츠예요.
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
          잘 맞는 추천
        </span>
      )}

      <div className={styles.stackVertical}>
        {/* 오행 컬러 바 */}
        <div
          style={{
            width: '100%',
            height: 6,
            borderRadius: 4,
            background: info.colorHex,
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

          <div className={styles.stackVertical} style={{ marginTop: 6 }}>
            <button
              type="button"
              className={styles.secondaryButton}
              style={{ minHeight: 40, fontSize: 13 }}
              onClick={handleClick}
            >
              {item.source}에서 확인하기 →
            </button>
            <span className={styles.caption} style={{ color: '#b0a098', fontSize: 11 }}>
              제휴 링크 포함
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
