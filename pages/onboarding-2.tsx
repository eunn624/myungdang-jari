import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import FortuneMascot from '../components/FortuneMascot';

export default function Onboarding2() {
  return (
    <Layout>
      <div className={styles.onboardingScreen}>
        <div className={styles.topRow} style={{ justifyContent: 'flex-end' }}>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={styles.heroBlock}>
          <div className={`${styles.heroPanel} ${styles.heroPanelPurple}`}>
            <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
            <span className={`${styles.heroSpark} ${styles.heroSparkC}`}>✦</span>
            <div className={styles.heroPanelHeader}>
              <span className={styles.heroPanelLabel}>온보딩 2</span>
              <span className={styles.heroPanelLabel}>라이프스타일 리딩</span>
            </div>
            <div className={styles.heroDeck}>
              <FortuneMascot size="lg" mood="purple" badge="참고용 가이드" />
              <div className={styles.heroInfoCard}>
                <h2 className={styles.heroInfoTitle}>운을 단정하기보다<br />생활을 더 편하게</h2>
                <p className={styles.heroInfoBody}>명당자리는 무서운 운세 앱이 아니라, 내가 쉬고 집중하는 공간을 더 잘 고르기 위한 참고 가이드예요.</p>
              </div>
            </div>
          </div>
          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>사주를 바탕으로<br />공간을 해석해요</h1>
            <p className={styles.bodyText}>
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
