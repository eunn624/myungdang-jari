import Link from 'next/link';
import { useState } from 'react';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';

const slides = [
  {
    title: <>내 사주에 맞는<br />명당을 찾아드려요</>,
    underline: 'Yellow',
    body: '오행과 지형, 생활권 데이터를 분석해 나에게 가장 잘 맞는 동네를 추천해드려요.',
    visual: 'map',
    button: '다음',
  },
  {
    title: <>지도 위에서<br />한눈에 비교해요</>,
    underline: 'Pink',
    body: '추천 지역의 환경, 교통, 편의시설까지 지도에서 바로 확인할 수 있어요.',
    visual: 'compare',
    button: '다음',
  },
  {
    title: <>공간 팁으로<br />일상을 더 좋아지게</>,
    underline: 'Blue',
    body: '공간 에너지를 높이는 맞춤 팁으로 더 편안하고 좋은 일상이 시작돼요.',
    visual: 'tips',
    button: '시작하기',
  },
] as const;

export default function Onboarding1() {
  const [step, setStep] = useState(0);
  const slide = slides[step];

  const content = (
    <div className={styles.referenceOnboardingShell}>
      <main className={styles.referenceOnboardingContent}>
        <section className={styles.referenceOnboardingCopy}>
          <h1>{slide.title}</h1>
          <span className={`${styles.referenceUnderline} ${styles[`referenceUnderline${slide.underline}`]}`}></span>
          <p>{slide.body}</p>
        </section>

        {slide.visual === 'map' ? (
          <section className={styles.referenceOnboardingVisualMap}>
            <span className={styles.referenceDoodleStar}>☆</span>
            <span className={styles.referenceDoodleCloud}></span>
            <div className={styles.referenceFoldMap}>
              <span className={styles.referenceFoldRiver}></span>
              <span className={styles.referenceFoldPark}></span>
              <span className={styles.referenceBigPin}></span>
            </div>
          </section>
        ) : null}

        {slide.visual === 'compare' ? (
          <section className={styles.referenceOnboardingVisualCompare}>
            <span className={styles.referenceDoodleBurst}>✧</span>
            <div className={styles.referenceCompareMap}>
              <span className={styles.referenceFoldRiver}></span>
              <span className={styles.referenceFoldPark}></span>
              <span className={styles.referenceSmallPin}></span>
            </div>
            <div className={styles.referenceCompareCards}>
              {['교통', '자연환경', '편의시설'].map((item, index) => (
                <div key={item} className={styles.referenceCompareCard}>
                  <span>{index === 0 ? '●' : index === 1 ? '▲' : '■'}</span>
                  <strong>{item}</strong>
                  <em>★★★★☆</em>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {slide.visual === 'tips' ? (
          <section className={styles.referenceOnboardingVisualTips}>
            <span className={styles.referenceDoodleBulb}>♢</span>
            {[
              ['초록 식물을 두면', '공간의 기운이 좋아져요.', '♧'],
              ['침대 머리는 동쪽이', '좋은 에너지를 불러와요.', '▱'],
              ['원목 가구는 안정감과', '편안함을 높여줘요.', '▤'],
            ].map(([title, body, icon]) => (
              <div key={title} className={styles.referenceTipPreviewCard}>
                <span>{icon}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </main>

      <footer className={styles.referenceOnboardingFooter}>
        <div className={styles.referenceOnboardingDots}>
          {slides.map((_, index) => (
            <span key={index} className={index === step ? styles.referenceOnboardingDotActive : styles.referenceOnboardingDot}></span>
          ))}
        </div>

        {step < slides.length - 1 ? (
          <button
            type="button"
            className={styles.referenceLargeButton}
            onClick={() => setStep((prev) => prev + 1)}
          >
            {slide.button}
            <span>›</span>
          </button>
        ) : (
          <Link href="/input" className={styles.referenceLargeButton}>
            {slide.button}
            <span>›</span>
          </Link>
        )}
      </footer>
    </div>
  );

  return <Layout>{content}</Layout>;
}
