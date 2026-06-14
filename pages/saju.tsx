import React from 'react';
import Layout from './_layout';
import styles from '../styles/Saju.module.css';

export default function SajuPage() {
  return (
    <Layout title="사주원국" showTabBar activeTab="saju">
      <div className={styles.content}>
        <div className={styles.card}>
          <h3 className={styles.subtitle}>사주팔자 (四柱八字)</h3>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>년</th>
                <th>월</th>
                <th>일</th>
                <th>시</th>
              </tr>
              <tr>
                <td className={styles.hanja}>丁丑</td>
                <td className={styles.hanja}>丙午</td>
                <td className={styles.hanja}>丁酉</td>
                <td className={styles.hanja}>乙巳</td>
              </tr>
              <tr>
                <td className={styles.hangul}>정축</td>
                <td className={styles.hangul}>병오</td>
                <td className={styles.hangul}>정유</td>
                <td className={styles.hangul}>을사</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <h3 className={styles.subtitle}>오행 분석</h3>
          <div className={styles.ohangBars}>
            <div className={styles.ohangItem}>
              <span className={styles.ohangLabel}>火</span>
              <div className={styles.bar} style={{backgroundColor: '#E85D3F', width: '62.5%'}}></div>
              <span className={styles.ohangValue}>62.5%</span>
            </div>
            <div className={styles.ohangItem}>
              <span className={styles.ohangLabel}>木</span>
              <div className={styles.bar} style={{backgroundColor: '#5CB85C', width: '12.5%'}}></div>
              <span className={styles.ohangValue}>12.5%</span>
            </div>
            <div className={styles.ohangItem}>
              <span className={styles.ohangLabel}>金</span>
              <div className={styles.bar} style={{backgroundColor: '#E8D4A8', width: '12.5%'}}></div>
              <span className={styles.ohangValue}>12.5%</span>
            </div>
            <div className={styles.ohangItem}>
              <span className={styles.ohangLabel}>土</span>
              <div className={styles.bar} style={{backgroundColor: '#D4A574', width: '12.5%'}}></div>
              <span className={styles.ohangValue}>12.5%</span>
            </div>
            <div className={styles.ohangItem}>
              <span className={styles.ohangLabel}>水</span>
              <div className={styles.bar} style={{backgroundColor: '#4A90E2', width: '0%'}}></div>
              <span className={styles.ohangValue}>0%</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
