import React from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/Share.module.css';

export default function SharePage() {
  return (
    <Layout>
      <div className={styles.content}>
        <h2 className={styles.title}>결과 공유하기</h2>
        
        {/* 공유 카드 미리보기 */}
        <div className={styles.preview}>
          <div className={styles.card}>
            <div className={styles.cardEmoji}>🔮</div>
            <h3 className={styles.cardTitle}>나의 명당</h3>
            <p className={styles.cardDate}>1997. 06. 24</p>
            
            <div className={styles.cardContent}>
              <p><strong>용신:</strong> 水</p>
              <p><strong>침대 방향:</strong> 남쪽</p>
              <p><strong>추천 동네:</strong> 한강로동</p>
            </div>

            <div className={styles.cardFooter}>
              나도 명당자리로 내 운을 찾아봤어요 ✨
            </div>
          </div>
        </div>

        {/* 공유 버튼 */}
        <div className={styles.shareButtons}>
          <button className={styles.shareButton} onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: '명당자리',
                text: '나의 명당을 찾아봤어요!',
              });
            }
          }}>
            📱 카카오톡 공유
          </button>
          <button className={styles.shareButton}>
            📸 인스타그램 스토리
          </button>
          <button className={styles.shareButton}>
            🔗 링크 복사
          </button>
        </div>

        <Link href="/home" className={styles.backButton}>
          홈으로 돌아가기
        </Link>
      </div>
    </Layout>
  );
}
