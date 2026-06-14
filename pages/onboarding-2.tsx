import React from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/Onboarding.module.css';

export default function Onboarding2() {
  return (
    <Layout>
      <div className={styles.screen}>
        <div className={styles.header}>
          <div></div>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={styles.content}>
          <div className={styles.mascot}>
            <div className={styles.mascotPlaceholder}>🐱</div>
          </div>
          
          <div className={styles.illustration}>
            <div className={styles.placeholder}>약속 일러스트</div>
          </div>

          <div className={styles.textBlock}>
            <h2 className={styles.h1} style={{textAlign: 'center'}}>명당자리는<br/>공간 가이드예요</h2>
            <p className={styles.description} style={{textAlign: 'center'}}>
              사주에 기반해 당신이 살기 좋은 동네, 배치, 색상을 추천해드려요.
            </p>
          </div>
        </div>

        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={`${styles.dot} ${styles.active}`}></span>
          <span className={styles.dot}></span>
        </div>

        <Link href="/onboarding-3" className={styles.button}>
          알겠어요
        </Link>
      </div>
    </Layout>
  );
}
