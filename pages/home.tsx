import React from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <Layout title="오늘의 운" showTabBar activeTab="home">
      <div className={styles.content}>
        {/* 일진 카드 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>오늘의 일진</span>
            <span className={styles.date}>2026. 06. 14</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.emoji}>☀️</div>
            <h3 className={styles.title}>甲寅日</h3>
            <p className={styles.description}>활동적이고 생기 있는 기운의 날입니다.</p>
          </div>
        </div>

        {/* 개운 미션 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>오늘의 미션</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.emoji}>🌿</div>
            <h3 className={styles.title}>동쪽에 식물 두기</h3>
            <p className={styles.description}>당신의 오행을 보완하는 목(木)의 기운을 끌어모으세요.</p>
          </div>
        </div>

        {/* 색감 제안 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>어울리는 색</span>
          </div>
          <div className={styles.colorPalette}>
            <div className={`${styles.colorSwatch}`} style={{backgroundColor: '#4A90E2'}}></div>
            <div className={`${styles.colorSwatch}`} style={{backgroundColor: '#5CB85C'}}></div>
            <div className={`${styles.colorSwatch}`} style={{backgroundColor: '#E8D4A8'}}></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
