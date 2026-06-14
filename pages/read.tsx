import React from 'react';
import Layout from './_layout';
import styles from '../styles/Read.module.css';

export default function ReadPage() {
  return (
    <Layout title="풀이" showTabBar activeTab="read">
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>당신의 기운</h3>
          <p className={styles.text}>
            불(火)의 기운이 강하고, 물(水)의 기운이 부족한 사주입니다. 
            따뜻하고 밝은 성향이지만, 감정의 기복이 클 수 있습니다.
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>이번 달 운세</h3>
          <p className={styles.text}>
            활동적인 시기입니다. 새로운 일을 시작하기에 좋은 때이지만, 
            꼼꼼한 검토를 잊지 마세요.
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>대운 흐름</h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.age}>26~35세</span>
              <span className={styles.text}>木 대운</span>
            </div>
            <div className={styles.timelineItem}>
              <span className={styles.age}>36~45세</span>
              <span className={styles.text}>火 대운</span>
            </div>
          </div>
        </div>

        <p className={styles.disclaimer}>
          💡 이 풀이는 참고 목적이며, 실제 운명을 예측하는 것이 아닙니다.
        </p>
      </div>
    </Layout>
  );
}
