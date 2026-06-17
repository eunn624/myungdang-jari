import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, getReportFromQuery } from '../lib/app-report';

export default function MyPage() {
  const router = useRouter();
  const report = useMemo(() => getReportFromQuery(router.query), [router.query]);
  const query = createQueryFromProfile(report.profile);

  const menuItems = [
    { label: '입력 정보 수정', href: { pathname: '/input', query } },
    { label: '분석 기록', caption: '최근 결과 다시 보기' },
    { label: '핀한 지역', caption: `${Math.min(report.districts.length, 3)}` },
    { label: '상세 리딩 보기', href: { pathname: '/read', query } },
    { label: '알림 설정', caption: '준비 중' },
    { label: '고객센터', caption: '안내 예정' },
    { label: '앱 정보', caption: 'v1.0.0' },
  ];

  return (
    <Layout showTabBar activeTab="my" headerTitle="마이" showBackButton>
      <div className={styles.referenceScreen}>
        <section className={styles.referenceMyHeader}>
          <div className={styles.referenceMyBadge}>☼</div>
          <div>
            <h2 className={styles.referenceMyName}>{report.profile.name}님</h2>
            <p className={styles.referenceSubtitle}>
              {report.formattedBirth} / {report.profile.gender}
            </p>
          </div>
          <button type="button" className={styles.referenceMyEdit}>프로필 편집</button>
        </section>

        <Link href={{ pathname: '/home', query }} className={styles.referenceMyReportCard}>
          <div>
            <strong>내 공간 리포트</strong>
            <p>최근 분석일 {report.formattedToday}</p>
          </div>
          <span>›</span>
        </Link>

        <section className={styles.referenceMyMenuPanel}>
          {menuItems.map((item) => {
            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={styles.referenceMyMenuRow}>
                  <span>{item.label}</span>
                  <em>›</em>
                </Link>
              );
            }

            return (
              <button key={item.label} type="button" className={styles.referenceMyMenuButton}>
                <span>{item.label}</span>
                <div>
                  {item.caption ? <small>{item.caption}</small> : null}
                  <em>›</em>
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}
