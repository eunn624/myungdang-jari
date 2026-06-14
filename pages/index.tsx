import React from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>🔮 명당자리</h1>
        <p className={styles.subtitle}>사주/풍수 기반 초개인화 명당 가이드</p>
        <p className={styles.text}>나의 운을 트이게 하는 공간 가이드</p>
      </main>
    </div>
  );
}
