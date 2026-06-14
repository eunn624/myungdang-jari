import React from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/Onboarding.module.css';

export default function Onboarding3() {
  return (
    <Layout>
      <div className={styles.screen}>
        <div className={styles.header}>
          <div></div>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={styles.content}>
          <div className={styles.illustration}>
            <div className={styles.placeholder}>자물쇠 아이콘</div>
          </div>

          <div className={styles.textBlock}>
            <h2 className={styles.h1}>개인정보는<br/>안전해요</h2>
            <p className={styles.description}>
              생년월일시는 폰에서만 계산되고, 서버에 저장되지 않습니다.
            </p>
          </div>
        </div>

        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={`${styles.dot} ${styles.active}`}></span>
        </div>

        <Link href="/input" className={styles.button}>
          시작하기
        </Link>
      </div>
    </Layout>
  );
}
