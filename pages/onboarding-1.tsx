import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

export default function Onboarding1() {
  return (
    <Layout>
      <div className={`${styles.onboardingRoot} ${styles.slideEnter}`}>
        <header className={styles.onboardingHeader}>
          <span className={styles.onboardingLogo}>명당자리</span>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </header>

        <section className={styles.onboardingContent}>
          <div className={styles.onboardingProgress}>
            <span className={styles.onboardingProgressDotActive}></span>
            <span className={styles.onboardingProgressDot}></span>
          </div>

          <div className={styles.onboardingVisualWrap}>
            <div className={styles.onboardingVisualCard}>
              <div className={styles.onboardingWindow}></div>
              <div className={styles.onboardingPlant}></div>
              <div className={styles.onboardingMapSheet}>
                <div className={styles.onboardingMapTileA}></div>
                <div className={styles.onboardingMapTileB}></div>
                <div className={styles.onboardingMapTileC}></div>
                <span className={`${styles.onboardingPin} ${styles.onboardingPinOne}`}>1</span>
                <span className={`${styles.onboardingPin} ${styles.onboardingPinTwo}`}>2</span>
                <span className={`${styles.onboardingPin} ${styles.onboardingPinThree}`}>3</span>
              </div>
              <div className={styles.onboardingRoomCard}>
                <span className={styles.onboardingRoomBadge}>수도권 후보</span>
                <strong>나와 잘 맞는 동네</strong>
                <span>지도 위에서 먼저 찾아볼게요</span>
              </div>
              <div className={styles.onboardingWave}></div>
            </div>
          </div>

          <div className={styles.onboardingCopyBlock}>
            <h1 className={styles.onboardingTitle}>내 사주에 맞는<br />동네를 찾아볼까요?</h1>
            <p className={styles.onboardingSubtitle}>
              오행 흐름과 지형, 지명 힌트를 연결해 수도권 명당 후보를 가볍게 추천해드려요.
            </p>
          </div>
        </section>

        <footer className={styles.onboardingFooter}>
          <p className={styles.onboardingTrustNote}>
            오락·참고 목적의 공간 가이드예요. 실제 거주 결정에는 예산, 출퇴근, 생활권을 함께 확인해주세요.
          </p>
          <Link href="/input" className={styles.primaryButton}>
            시작하기
          </Link>
        </footer>
      </div>
    </Layout>
  );
}
