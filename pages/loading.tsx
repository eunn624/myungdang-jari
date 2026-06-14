import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

const steps = [
  '사주팔자를 정리하는 중',
  '오행의 균형을 읽는 중',
  '지명과 지형을 맞춰보는 중',
  '침대 방향 가이드를 준비하는 중',
];

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push({
        pathname: '/result',
        query: router.query,
      });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <Layout>
      <div className={styles.onboardingScreen} style={{ justifyContent: 'center', gap: 22 }}>
        <div className={`${styles.mascot} ${styles.center}`} style={{ margin: '0 auto' }}>🐱</div>

        <div className={`${styles.column} ${styles.center}`} style={{ gap: 12 }}>
          <h1 className={styles.heroTitle}>당신의 기운을<br />읽고 있어요</h1>
          <p className={styles.heroDescription}>분석 과정을 단계별로 정리하면서 결과를 준비 중이에요.</p>
        </div>

        <div className={styles.loadingList}>
          {steps.map((step, index) => (
            <div key={step} className={styles.loadingItem}>
              <span className={`${styles.loadingBullet} ${index < 2 ? styles.loadingBulletDone : ''}`}>
                {index < 2 ? '✓' : '○'}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className={styles.progressTrack}>
          <div className={styles.progressFill}></div>
        </div>
      </div>
    </Layout>
  );
}
