import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

const steps = [
  '사주 흐름을 정리하고 있어요',
  '오행의 균형을 살펴보고 있어요',
  '어울리는 지역과 환경을 고르고 있어요',
  '공간 팁을 보기 좋게 준비하고 있어요',
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
    <Layout headerTitle="분석 중" showBackButton backHref="/input">
      <div className={`${styles.onboardingScreen} ${styles.slideEnter}`} style={{ justifyContent: 'center', gap: 18 }}>
        <div className={`${styles.heroPanel} ${styles.heroPanelBlue}`}>
          <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
          <span className={`${styles.heroSpark} ${styles.heroSparkB}`}>✦</span>
          <div className={styles.heroPanelHeader}>
            <span className={styles.heroPanelLabel}>결과 준비 중</span>
            <span className={styles.heroPanelLabel}>{activeStep + 1} / {steps.length}</span>
          </div>
          <div className={styles.heroDeck}>
            <div className={styles.column} style={{ gap: 10 }}>
              <h1 className={styles.heroTitle}>당신에게 어울리는 흐름을<br />정리하고 있어요</h1>
              <p className={styles.heroDescription}>사주와 공간 정보를 묶어서 한눈에 보기 쉬운 결과로 정리하는 중이에요.</p>
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
              <span className={styles.badgeFill}>잠시만 기다려주세요</span>
              <p className={styles.bodyText} style={{ marginTop: 10 }}>사주 원국, 오행 균형, 어울리는 지역, 오늘의 공간 팁까지 곧 바로 보여드릴게요.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
