import React, { useState } from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/Onboarding.module.css';

export default function Onboarding1() {
  const [dotIndex, setDotIndex] = useState(0);

  return (
    <Layout>
      <div className={styles.screen}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.appName}>명당자리</h1>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        {/* 메인 콘텐츠 */}
        <div className={styles.content}>
          {/* 일러스트 영역 */}
          <div className={styles.illustration}>
            <div className={styles.placeholder}>공간 일러스트</div>
          </div>

          {/* 텍스트 */}
          <div className={styles.textBlock}>
            <h2 className={styles.h1}>조용한 방 안에도<br/>나만의 기운이 흘러요</h2>
            <p className={styles.description}>당신의 사주에 맞춰, 지금 사는 곳이 정말 당신에게 맞는지 알아봐요.</p>
          </div>

          {/* 마스코트 */}
          <div className={styles.mascot}>
            <div className={styles.mascotPlaceholder}>🐱</div>
          </div>
        </div>

        {/* 도트 네비게이션 */}
        <div className={styles.dots}>
          <span className={`${styles.dot} ${dotIndex === 0 ? styles.active : ''}`}></span>
          <span className={`${styles.dot} ${dotIndex === 1 ? styles.active : ''}`}></span>
          <span className={`${styles.dot} ${dotIndex === 2 ? styles.active : ''}`}></span>
        </div>

        {/* CTA 버튼 */}
        <Link href="/onboarding-2" className={styles.button}>
          시작하기
        </Link>
      </div>
    </Layout>
  );
}
