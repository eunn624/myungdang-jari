import { useEffect, useState } from 'react';
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
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 520);

    const timer = window.setTimeout(() => {
      router.push({
        pathname: '/result',
        query: router.query,
      });
    }, 2400);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(progressTimer);
    };
  }, [router]);

  return (
    <Layout headerTitle="분석 준비" showBackButton backHref="/input">
      <div className={`${styles.onboardingScreen} ${styles.slideEnter}`} style={{ justifyContent: 'center', gap: 18 }}>
        <div className={`${styles.heroPanel} ${styles.heroPanelBlue}`}>
          <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
          <span className={`${styles.heroSpark} ${styles.heroSparkB}`}>✦</span>
          <div className={styles.heroPanelHeader}>
            <span className={styles.heroPanelLabel}>분석 중</span>
            <span className={styles.heroPanelLabel}>{activeStep + 1} / {steps.length}</span>
          </div>
          <div className={styles.heroDeck}>
            <div className={styles.column} style={{ gap: 10 }}>
              <h1 className={styles.heroTitle}>당신의 기운을<br />읽고 있어요</h1>
              <p className={styles.heroDescription}>입력값을 정리하고, 사주 흐름과 공간 가이드를 카드 형태로 준비하는 중이에요.</p>
            </div>
            <div className={styles.visualPlaceholder}></div>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.loadingList}>
            {steps.map((step, index) => (
              <div key={step} className={styles.loadingItem}>
                <span className={`${styles.loadingBullet} ${index <= activeStep ? styles.loadingBulletDone : ''}`}>
                  {index <= activeStep ? '✓' : '○'}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className={styles.progressTrack} style={{ marginTop: 18 }}>
            <div className={styles.progressFill} style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}></div>
          </div>

          <div className={styles.stackedPreview} style={{ marginTop: 18 }}>
            <div className={styles.stackCardA}></div>
            <div className={styles.stackCardB}></div>
            <div className={styles.stackCardC}>
              <span className={styles.badgeFill}>곧 도착할 결과</span>
              <p className={styles.bodyText} style={{ marginTop: 10 }}>사주원국, 오행 균형, 명당 추천, 개운 루틴을 카드 흐름으로 바로 볼 수 있어요.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
