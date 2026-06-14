import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

export default function Onboarding3() {
  return (
    <Layout>
      <div className={styles.onboardingScreen}>
        <div className={styles.topRow} style={{ justifyContent: 'flex-end' }}>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={`${styles.heroBlock} ${styles.center}`}>
          <div className={styles.illustration} style={{ minHeight: 120, borderRadius: 999 }}>
            <div className={styles.illustrationText}>자물쇠{'\n'}아이콘</div>
          </div>
          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>생년월일시는<br />분석에만 사용돼요</h1>
            <p className={styles.heroDescription}>
              입력한 정보는 결과 흐름을 계산하는 데만 쓰이고, 외부 공유나 광고 목적 데이터로 사용하지 않아요.
            </p>
          </div>

          <div className={styles.softCard}>
            <p className={styles.bodyText}>🔒 외부 공유·광고에 쓰지 않아요</p>
          </div>
        </div>

        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={`${styles.dot} ${styles.dotActive}`}></span>
        </div>

        <Link href="/input" className={styles.primaryButton}>
          내 정보 입력하기
        </Link>
      </div>
    </Layout>
  );
}
