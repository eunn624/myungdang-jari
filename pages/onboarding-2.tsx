import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

export default function Onboarding2() {
  return (
    <Layout>
      <div className={styles.onboardingScreen}>
        <div className={styles.topRow} style={{ justifyContent: 'flex-end' }}>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={`${styles.heroBlock} ${styles.center}`}>
          <div className={styles.mascot}>🐱</div>
          <div className={styles.illustration}>
            <div className={styles.illustrationText}>약속 일러스트{'\n'}손 내밀기</div>
          </div>
          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>명당자리는<br />공간 가이드예요</h1>
            <p className={styles.heroDescription}>
              운을 단정하기보다, 내 공간과 생활 습관을 조금 더 편안하게 고를 수 있도록 돕는 참고용 리딩이에요.
            </p>
          </div>
        </div>

        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={`${styles.dot} ${styles.dotActive}`}></span>
          <span className={styles.dot}></span>
        </div>

        <Link href="/onboarding-3" className={styles.primaryButton}>
          알겠어요
        </Link>
      </div>
    </Layout>
  );
}
