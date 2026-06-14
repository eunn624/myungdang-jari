import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

export default function Onboarding1() {
  return (
    <Layout>
      <div className={styles.onboardingScreen}>
        <div className={`${styles.topRow} ${styles.between}`}>
          <span className={styles.appName}>명당자리</span>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={styles.heroBlock}>
          <div className={`${styles.illustration} ${styles.illustrationLarge}`}>
            <div className={styles.illustrationText}>공간 일러스트{'\n'}방 · 창가 · 식물</div>
          </div>

          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>조용한 방 안에도<br />나만의 기운이 흘러요</h1>
            <p className={styles.heroDescription}>
              생년월일시를 바탕으로 지금의 공간과 잘 맞는 흐름을 귀엽고 편하게 읽어드릴게요.
            </p>
          </div>

          <div className={styles.mascot}>🐱</div>
        </div>

        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dotActive}`}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>

        <Link href="/onboarding-2" className={styles.primaryButton}>
          시작하기
        </Link>
      </div>
    </Layout>
  );
}
