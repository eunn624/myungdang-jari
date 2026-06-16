import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  showTabBar?: boolean;
  activeTab?: 'home' | 'saju' | 'read' | 'place' | 'store' | 'my';
  headerTitle?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function Layout({ 
  children, 
  showTabBar = false,
  activeTab,
  headerTitle,
  showBackButton = false,
  backHref,
}: LayoutProps) {
  const router = useRouter();

  const tabHref = (pathname: string) => ({
    pathname,
    query: router.query,
  });

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref || '/home');
  };

  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        {headerTitle ? (
          <header className={styles.topbar}>
            <div className={styles.topbarSide}>
              {showBackButton ? (
                <button type="button" className={styles.backButton} onClick={handleBack}>
                  ←
                </button>
              ) : null}
            </div>
            <h1 className={styles.topbarTitle}>{headerTitle}</h1>
            <div className={styles.topbarSide}></div>
          </header>
        ) : null}

        <main id="app-main-scroll" className={`${styles.main} ${headerTitle ? styles.mainWithHeader : ''} ${showTabBar ? styles.mainWithTabbar : ''}`}>
          {children}
        </main>

        {showTabBar && (
          <nav className={styles.tabbar}>
            <Link href={tabHref('/home')} className={`${styles.tab} ${activeTab === 'home' ? styles.active : ''}`}>
              <span className={styles.tabIcon}>◻</span>
              <span className={styles.tabLabel}>홈</span>
            </Link>
            <Link href={tabHref('/saju')} className={`${styles.tab} ${activeTab === 'saju' ? styles.active : ''}`}>
              <span className={styles.tabIcon}>四</span>
              <span className={styles.tabLabel}>사주</span>
            </Link>
            <Link href={tabHref('/read')} className={`${styles.tab} ${activeTab === 'read' ? styles.active : ''}`}>
              <span className={styles.tabIcon}>文</span>
              <span className={styles.tabLabel}>공간 팁</span>
            </Link>
            <Link href={tabHref('/place')} className={`${styles.tab} ${activeTab === 'place' ? styles.active : ''}`}>
              <span className={styles.tabIcon}>向</span>
              <span className={styles.tabLabel}>명당</span>
            </Link>
            <Link href={tabHref('/store')} className={`${styles.tab} ${activeTab === 'store' ? styles.active : ''}`}>
              <span className={styles.tabIcon}>◈</span>
              <span className={styles.tabLabel}>소품</span>
            </Link>
            <Link href={tabHref('/my')} className={`${styles.tab} ${activeTab === 'my' ? styles.active : ''}`}>
              <span className={styles.tabIcon}>人</span>
              <span className={styles.tabLabel}>마이</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
