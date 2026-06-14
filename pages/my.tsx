import React from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/My.module.css';

export default function MyPage() {
  return (
    <Layout title="마이" showTabBar activeTab="my">
      <div className={styles.content}>
        {/* 프로필 */}
        <div className={styles.profile}>
          <div className={styles.avatar}>👤</div>
          <h3 className={styles.name}>1997년 6월 24일</h3>
          <p className={styles.saju}>丁丑 丙午 丁酉 乙巳</p>
        </div>

        {/* 미션 기록 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>완료한 미션</h3>
          <div className={styles.missionsList}>
            <div className={styles.missionItem}>
              <span className={styles.checkmark}>✓</span>
              <span>동쪽에 식물 두기</span>
            </div>
            <div className={styles.missionItem}>
              <span className={styles.checkmark}>✓</span>
              <span>파란색 옷 입기</span>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className={styles.menuList}>
          <Link href="#" className={styles.menuItem}>
            <span>설정</span>
            <span>→</span>
          </Link>
          <Link href="#" className={styles.menuItem}>
            <span>이용약관</span>
            <span>→</span>
          </Link>
          <Link href="#" className={styles.menuItem}>
            <span>피드백 보내기</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
