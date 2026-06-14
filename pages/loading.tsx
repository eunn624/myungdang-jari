import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/Loading.module.css';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      router.push('/result');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <h2 className={styles.title}>당신의 운을 분석 중이에요</h2>
        <p className={styles.subtitle}>사주에서 드러나는 오행의 기운을 읽고 있습니다...</p>
      </div>
    </Layout>
  );
}
