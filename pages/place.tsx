import React from 'react';
import Layout from './_layout';
import styles from '../styles/Place.module.css';

export default function PlacePage() {
  const places = [
    { rank: 1, name: '한강로동', gu: '용산구', reason: '水 오행 + 수변 지형' },
    { rank: 2, name: '금호동', gu: '성동구', reason: '金·水 오행 + 수변' },
    { rank: 3, name: '옥수동', gu: '성동구', reason: '金·水 오행 + 수변' },
  ];

  return (
    <Layout title="명당" showTabBar activeTab="place">
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.subtitle}>추천 행정동 TOP 3</h3>
          <div className={styles.placesList}>
            {places.map(place => (
              <div key={place.rank} className={styles.placeCard}>
                <div className={styles.rank}>{place.rank}</div>
                <div className={styles.placeInfo}>
                  <h4 className={styles.placeName}>{place.name}</h4>
                  <span className={styles.gu}>{place.gu}</span>
                </div>
                <p className={styles.reason}>{place.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>침대 머리 방향</h3>
          <div className={styles.card}>
            <div className={styles.emoji}>🛏️</div>
            <p className={styles.direction}>남쪽 방향으로 머리를 두는 것을 권합니다</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>개운 쇼핑</h3>
          <a href="#" className={styles.shopButton}>
            쿠팡에서 추천 상품 보기
          </a>
        </div>
      </div>
    </Layout>
  );
}
