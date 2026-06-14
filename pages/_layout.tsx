import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showTabBar?: boolean;
  activeTab?: 'home' | 'saju' | 'read' | 'place' | 'my';
}

export default function Layout({ 
  children, 
  title, 
  showTabBar = false,
  activeTab 
}: LayoutProps) {
  return (
    <div className={styles.container}>
      {title && (
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
        </header>
      )}
      
      <main className={styles.main}>
        {children}
      </main>

      {showTabBar && (
        <nav className={styles.tabbar}>
          <Link href="/home" className={`${styles.tab} ${activeTab === 'home' ? styles.active : ''}`}>
            <span className={styles.tabIcon}>🏠</span>
            <span className={styles.tabLabel}>홈</span>
          </Link>
          <Link href="/saju" className={`${styles.tab} ${activeTab === 'saju' ? styles.active : ''}`}>
            <span className={styles.tabIcon}>🔮</span>
            <span className={styles.tabLabel}>사주</span>
          </Link>
          <Link href="/read" className={`${styles.tab} ${activeTab === 'read' ? styles.active : ''}`}>
            <span className={styles.tabIcon}>📖</span>
            <span className={styles.tabLabel}>풀이</span>
          </Link>
          <Link href="/place" className={`${styles.tab} ${activeTab === 'place' ? styles.active : ''}`}>
            <span className={styles.tabIcon}>🏡</span>
            <span className={styles.tabLabel}>명당</span>
          </Link>
          <Link href="/my" className={`${styles.tab} ${activeTab === 'my' ? styles.active : ''}`}>
            <span className={styles.tabIcon}>👤</span>
            <span className={styles.tabLabel}>마이</span>
          </Link>
        </nav>
      )}
    </div>
  );
}
