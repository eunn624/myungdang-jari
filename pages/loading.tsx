import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

const steps = [
  '사주 흐름을 정리하고 있어요',
  '오행 균형을 살펴보고 있어요',
  '잘 맞는 동네 후보를 고르고 있어요',
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
    <Layout>
      <div className={styles.referenceLoadingShell}>
        <div className={styles.referenceStatusBar}>
          <span>10:04</span>
          <span className={styles.referenceDynamicIsland}></span>
          <span>32</span>
        </div>

        <section className={styles.referenceLoadingHeader}>
          <h1>명당을 찾는 중이에요</h1>
          <span className={styles.referenceUnderlineBlue}></span>
          <p>사주와 공간 데이터를 연결해<br />가장 잘 맞는 후보를 정리하고 있어요.</p>
        </section>

        <section className={styles.referenceLoadingVisual}>
          <div className={styles.referenceLoadingMap}>
            <span className={styles.referenceFoldRiver}></span>
            <span className={styles.referenceFoldPark}></span>
            <span className={styles.referenceBigPin}></span>
          </div>
          <div className={styles.referenceLoadingOrbit}>
            <span>木</span>
            <span>火</span>
            <span>土</span>
            <span>金</span>
            <span>水</span>
          </div>
        </section>

        <section className={styles.referenceLoadingCard}>
          {steps.map((step, index) => (
            <div key={step} className={styles.referenceLoadingStep}>
              <span className={index <= activeStep ? styles.referenceLoadingStepDone : ''}>
                {index <= activeStep ? '✓' : '○'}
              </span>
              <p>{step}</p>
            </div>
          ))}
          <div className={styles.referenceLoadingTrack}>
            <div
              className={styles.referenceLoadingFill}
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </section>

        <p className={styles.referenceLoadingNote}>잠시 후 추천 지역과 공간 리포트를 보여드릴게요.</p>
      </div>
    </Layout>
  );
}
