import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

export default function Onboarding1() {
  return (
    <Layout>
      <div className={`${styles.onboardingScreen} ${styles.slideEnter}`}>
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
              <span className={styles.heroPanelLabel}>내 공간 가이드</span>
              <span className={styles.heroPanelLabel}>시작하기</span>
            </div>
            <div className={styles.heroDeck}>
              <div className={styles.heroInfoCard}>
                <h2 className={styles.heroInfoTitle}>나와 잘 맞는 공간은<br />생각보다 분명해요</h2>
                <p className={styles.heroInfoBody}>생년월일시를 바탕으로 편안한 방향, 어울리는 동네, 머물기 좋은 공간 습관을 차근차근 찾아드릴게요.</p>
              </div>
              <div className={styles.visualPlaceholder}></div>
            </div>
          </div>

          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>내게 잘 맞는 공간을<br />한 번에 살펴볼게요</h1>
            <p className={styles.bodyText}>
              입력 한 번으로 사주 흐름, 오행 균형, 침대 방향, 어울리는 지역, 긴 해석 카드까지 자연스럽게 이어서 볼 수 있어요.
            </p>
            <div className={styles.pageIntroCard}>
              <div className={styles.stackVertical}>
                <span className={styles.badgeFill}>입력 한 번으로 바로 확인</span>
                <span className={styles.caption}>가볍게 참고하는 라이프스타일 가이드예요.</span>
                <span className={styles.caption}>지역 추천, 공간 팁, 공유 카드까지 한 번에 준비했어요.</span>
              </div>
            </div>
          </div>
        </div>

        <Link href="/input" className={styles.primaryButton}>
          내 정보 입력하러 가기
        </Link>
      </div>
    </Layout>
  );
}
