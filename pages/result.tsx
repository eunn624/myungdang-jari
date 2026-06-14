import React, { useState } from 'react';
import Link from 'next/link';
import Layout from './_layout';
import styles from '../styles/Result.module.css';

export default function ResultScreen() {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      title: '사주팔자',
      content: '丁丑 丙午 丁酉 乙巳',
      emoji: '⭐'
    },
    {
      title: '오행 분포',
      content: '火 62.5% | 水 0% | 木 12.5%',
      emoji: '🔥'
    },
    {
      title: '용신',
      content: '水를 보충하면 균형이 잡혀요',
      emoji: '💧'
    },
    {
      title: '침대 방향',
      content: '남쪽으로 머리를 두는 것을 권합니다',
      emoji: '🛏️'
    },
    {
      title: '길방',
      content: '북쪽 방향의 공간을 마련하세요',
      emoji: '🧭'
    },
    {
      title: '추천 동네',
      content: '수변 근접 지역 · 한강로동, 금호동',
      emoji: '🏘️'
    },
    {
      title: '오늘의 개운',
      content: '파란색 옷을 입고, 북쪽 창가에서 명상하기',
      emoji: '✨'
    }
  ];

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* 카드 스와이프 영역 */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.emoji}>{cards[currentCard].emoji}</div>
            <h3 className={styles.cardTitle}>{cards[currentCard].title}</h3>
            <p className={styles.cardContent}>{cards[currentCard].content}</p>
          </div>
        </div>

        {/* 카드 네비게이션 */}
        <div className={styles.nav}>
          <button
            onClick={handlePrev}
            disabled={currentCard === 0}
            className={styles.navButton}
          >
            ←
          </button>
          <div className={styles.indicator}>
            {currentCard + 1} / {cards.length}
          </div>
          <button
            onClick={handleNext}
            disabled={currentCard === cards.length - 1}
            className={styles.navButton}
          >
            →
          </button>
        </div>

        {/* CTA */}
        <div className={styles.ctaGroup}>
          <Link href="/home" className={styles.buttonPrimary}>
            홈으로 돌아가기
          </Link>
          <Link href="/share" className={styles.buttonSecondary}>
            결과 공유하기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
