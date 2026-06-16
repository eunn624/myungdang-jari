import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { getReportFromQuery } from '../lib/app-report';

const TIP_FILTERS = ['전체', '침실', '거실', '식물', '기타'] as const;
type TipFilter = typeof TIP_FILTERS[number];

export default function ReadPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const [activeFilter, setActiveFilter] = useState<TipFilter>('전체');

  const deficit = report.saju.deficitOhang[0] || report.saju.yongsin;
  const tips = [
    {
      category: '침실' as const,
      title: `침대 머리는 ${report.saju.bedDirection}쪽이에요`,
      body: `${report.saju.bedDirection}은 몸이 쉬는 방향감과 잘 맞는 편이에요. 눕기 전 시선이 복잡하지 않게 정리해보세요.`,
      doodle: '⌂',
    },
    {
      category: '식물' as const,
      title: `${deficit} 기운 식물을 두어보세요`,
      body: `${deficit} 기운을 채우는 식물을 창가 가까이에 두면 공간의 숨결이 조금 더 부드럽게 느껴질 수 있어요.`,
      doodle: '♣',
    },
    {
      category: '거실' as const,
      title: '원목 가구를 추천해요',
      body: '자연의 결이 보이는 재질은 오래 머무는 공간에 안정감을 보태는 데 잘 어울려요.',
      doodle: '▤',
    },
    {
      category: '기타' as const,
      title: '창문은 가볍게 유지해보세요',
      body: '낮은 햇빛과 바람이 드나드는 길이 막히지 않도록 창가 주변 물건을 덜어내면 좋아요.',
      doodle: '☐',
    },
    {
      category: '기타' as const,
      title: '물의 요소를 가까이 두세요',
      body: '유리 화병, 투명한 볼, 차분한 블루 패브릭처럼 물성을 닮은 소품도 좋은 힌트가 돼요.',
      doodle: '◔',
    },
  ];

  const visibleTips = activeFilter === '전체'
    ? tips
    : tips.filter((tip) => tip.category === activeFilter);

  return (
    <Layout showTabBar activeTab="read" headerTitle="공간 팁" showBackButton>
      <div className={styles.doodlePage}>
        <section className={styles.doodleHeroBlock}>
          <div>
            <h2 className={styles.doodleTitle}>공간 꿀팁</h2>
            <p className={styles.doodleEyebrow}>나에게 좋은 공간을 만드는 작은 행동들이에요.</p>
          </div>
          <span className={styles.doodleFloat}>✎</span>
        </section>

        <div className={styles.doodleFilterRow}>
          {TIP_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? styles.doodleChipActive : styles.doodleChip}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className={styles.doodleTipsStack}>
          {visibleTips.map((tip) => (
            <article key={tip.title} className={styles.doodleTipCard}>
              <div className={styles.doodleTipContent}>
                <strong>{tip.title}</strong>
                <p>{tip.body}</p>
              </div>
              <span className={styles.doodleTipVisual}>{tip.doodle}</span>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
}
