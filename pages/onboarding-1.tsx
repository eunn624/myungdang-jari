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
              <span className={styles.heroPanelLabel}>공간 리딩 앱</span>
              <span className={styles.heroPanelLabel}>첫 시작</span>
            </div>
            <div className={styles.heroDeck}>
              <div className={styles.heroInfoCard}>
                <h2 className={styles.heroInfoTitle}>좋은 공간은<br />예쁜 취향만의 문제가 아니에요</h2>
                <p className={styles.heroInfoBody}>사주 흐름과 생활 감각을 함께 읽어서 내가 쉬기 편한 방향, 어울리는 동네, 정리하기 좋은 방위를 찾습니다.</p>
              </div>
              <div className={styles.visualPlaceholder}></div>
            </div>
          </div>

          <div className={styles.column} style={{ gap: 12 }}>
            <h1 className={styles.heroTitle}>나와 잘 맞는 공간을<br />한 번에 읽어드릴게요</h1>
            <p className={styles.bodyText}>
              생년월일시를 바탕으로 사주원국, 오행 균형, 침대 방향, 명당 후보, 긴 해석 카드까지 모바일에서 자연스럽게 이어서 볼 수 있어요.
            </p>
            <div className={styles.pageIntroCard}>
              <div className={styles.stackVertical}>
                <span className={styles.badgeFill}>입력 1회 · 결과 홈 바로 연결</span>
                <span className={styles.caption}>오락·참고 목적의 라이프스타일 가이드</span>
                <span className={styles.caption}>행정동 추천 · 지형 가이드 · 공유 카드 포함</span>
              </div>
            </div>
          </div>
        </div>

        <Link href="/input" className={styles.primaryButton}>
          시작하고 정보 입력하기
        </Link>
      </div>
    </Layout>
  );
}
