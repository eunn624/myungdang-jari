import React from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>🔮 명당자리</h1>
        <p className={styles.subtitle}>사주/풍수 기반 초개인화 명당 가이드</p>
        
        {/* 폰트 테스트 */}
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>📋 폰트 테스트</h2>
          <p style={{ fontSize: '16px' }}>
            <strong>본문 (16px):</strong> OngleipParkDahyeon → Pretendard (귀여운 톤)
          </p>
          <p style={{ fontSize: '14px' }}>
            <strong>중간 (14px):</strong> OngleipParkDahyeon로 표시됩니다.
          </p>
          <p className="small" style={{ marginTop: '1rem' }}>
            <strong>작은 텍스트 (12px):</strong> Pretendard Regular로 명확하게 표시됩니다.
          </p>
          <div className="saju-table" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f7f4ef', fontFamily: 'monospace' }}>
            <strong>사주 데이터 표:</strong> Pretendard Bold (정확도)
            <div>年 甲 月 丙 日 丁 時 乙</div>
            <div>子 午 酉 巳</div>
          </div>
        </div>

        <p className={styles.text}>Coming Soon...</p>
      </main>
    </div>
  );
}
