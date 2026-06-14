import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import FortuneMascot from '../components/FortuneMascot';

export default function Onboarding1() {
  return (
    <Layout>
      <div className={styles.onboardingScreen}>
        <div className={`${styles.topRow} ${styles.between}`}>
          <span className={styles.appName}>명당자리</span>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={styles.heroBlock}>
          <div className={`${styles.heroPanel} ${styles.heroPanelBlue}`}>
            <div className={`${styles.heroCloud} ${styles.heroCloudA}`}></div>
            <div className={`${styles.heroCloud} ${styles.heroCloudB}`}></div>
            <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
            <span className={`${styles.heroSpark} ${styles.heroSparkB}`}>✦</span>
            <div className={styles.heroPanelHeader}>
              <span className={styles.heroPanelLabel}>온보딩 1</span>
              <span className={styles.heroPanelLabel}>공간 리딩</span>
            </div>
            <div className={styles.heroDeck}>
              <div className={styles.heroInfoCard}>
                <h2 className={styles.heroInfoTitle}>좋은 공간은<br />예쁜 취향만의 문제가 아니에요</h2>
                <p className={styles.heroInfoBody}>사주 흐름과 생활 감각을 함께 읽어서 나에게 편한 방향을 찾아가요.</p>
              </div>
              <FortuneMascot size="lg" mood="blue" badge="오늘의 리딩" />
            </div>
          </div>

          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>조용한 방 안에도<br />나만의 결이 있어요</h1>
            <p className={styles.bodyText}>
              생년월일시를 바탕으로 지금의 공간, 침대 방향, 잘 맞는 동네 감각까지 귀엽고 편하게 풀어드릴게요.
            </p>
          </div>
        </div>

        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dotActive}`}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>

        <Link href="/onboarding-2" className={styles.primaryButton}>
          나의 공간 흐름 보기
        </Link>
      </div>
    </Layout>
  );
}
