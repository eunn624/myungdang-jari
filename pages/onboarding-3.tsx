import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import FortuneMascot from '../components/FortuneMascot';

export default function Onboarding3() {
  return (
    <Layout>
      <div className={styles.onboardingScreen}>
        <div className={styles.topRow} style={{ justifyContent: 'flex-end' }}>
          <Link href="/home" className={styles.skip}>건너뛰기</Link>
        </div>

        <div className={styles.heroBlock}>
          <div className={`${styles.heroPanel} ${styles.heroPanelYellow}`}>
            <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
            <span className={`${styles.heroSpark} ${styles.heroSparkB}`}>✦</span>
            <div className={styles.heroPanelHeader}>
              <span className={styles.heroPanelLabel}>온보딩 3</span>
              <span className={styles.heroPanelLabel}>안심 입력</span>
            </div>
            <div className={styles.heroDeck}>
              <div className={styles.heroInfoCard}>
                <h2 className={styles.heroInfoTitle}>입력 정보는<br />분석 흐름 계산에만 사용돼요</h2>
                <p className={styles.heroInfoBody}>브라우저 안에서만 읽고, 공유나 광고 목적 정보로 사용하지 않도록 설계했어요.</p>
              </div>
              <FortuneMascot size="lg" mood="yellow" badge="안심해요" />
            </div>
          </div>
          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>입력 뒤에는 바로<br />결과가 이어져요</h1>
            <p className={styles.bodyText}>
              입력한 정보는 결과 흐름을 계산하는 데만 쓰이고, 외부 공유나 광고 목적 데이터로 사용하지 않아요.
            </p>
          </div>

          <div className={styles.softCard}>
            <p className={styles.bodyText}>🔒 분석용 계산만 진행하고, 결과 카드로 자연스럽게 이어집니다.</p>
          </div>
        </div>

        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={`${styles.dot} ${styles.dotActive}`}></span>
        </div>

        <Link href="/input" className={styles.primaryButton}>
          내 정보 입력하러 가기
        </Link>
      </div>
    </Layout>
  );
}
