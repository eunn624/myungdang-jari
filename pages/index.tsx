import { useEffect } from 'react';
import { useRouter } from 'next/router';
import FortuneMascot from '../components/FortuneMascot';
import styles from '../styles/AppFlow.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 온보딩으로 자동 리다이렉트
    router.push('/onboarding-1');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #eef4ff, #f7f9ff)',
      padding: 24,
    }}>
      <div className={`${styles.heroPanel} ${styles.heroPanelBlue}`} style={{ width: 'min(100%, 360px)' }}>
        <div className={styles.heroCloudA + ' ' + styles.heroCloud}></div>
        <div className={styles.heroCloudB + ' ' + styles.heroCloud}></div>
        <div className={styles.heroPanelHeader}>
          <span className={styles.heroPanelLabel}>명당자리</span>
          <span className={styles.heroPanelLabel}>앱 준비 중</span>
        </div>
        <div className={styles.heroDeckSingle}>
          <FortuneMascot size="lg" mood="blue" badge="환영해요" />
        </div>
        <div className={styles.column} style={{ gap: 10, marginTop: 14 }}>
          <h1 className={styles.heroTitle}>나와 잘 맞는 공간을<br />읽어오는 중</h1>
          <p className={styles.heroDescription}>온보딩 화면으로 자연스럽게 이어집니다.</p>
        </div>
      </div>
    </div>
  );
}
