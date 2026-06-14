import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/AppFlow.module.css';
import { createQueryFromProfile, type AppProfile } from '../lib/app-report';

interface InputState {
  name: string;
  gender: AppProfile['gender'];
  calendar: AppProfile['calendar'];
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
}

export default function InputScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<InputState>({
    name: '',
    gender: '여성',
    calendar: '양력',
    birthDate: '',
    birthTime: '',
    unknownTime: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.birthDate) {
      setError('생년월일을 입력해 주세요.');
      return;
    }

    if (!formData.unknownTime && !formData.birthTime) {
      setError('출생 시간을 입력하거나 시 모름을 선택해 주세요.');
      return;
    }

    setError('');
    router.push({
      pathname: '/loading',
      query: createQueryFromProfile({
        ...formData,
        name: formData.name.trim() || '사용자',
        birthTime: formData.unknownTime ? '00:00' : formData.birthTime,
      }),
    });
  };

  return (
    <Layout headerTitle="정보 입력" showBackButton backHref="/onboarding-1">
      <form className={`${styles.screen} ${styles.slideEnter}`} onSubmit={handleSubmit}>
        <div className={styles.row} style={{ gap: 8 }}>
          <span className={styles.caption}>입력 단계</span>
        </div>

        <div className={`${styles.heroPanel} ${styles.heroPanelDark}`}>
          <span className={`${styles.heroSpark} ${styles.heroSparkA}`}>✦</span>
          <span className={`${styles.heroSpark} ${styles.heroSparkB}`}>✦</span>
          <div className={styles.heroPanelHeader}>
            <span className={styles.heroPanelLabel}>입력 시작</span>
            <span className={styles.heroPanelLabel}>정보 입력</span>
          </div>
          <div className={styles.heroDeck}>
            <div className={styles.column} style={{ gap: 10 }}>
              <h1 className={styles.heroTitle}>이제 내 정보를<br />입력해볼까요?</h1>
              <p className={styles.heroDescription}>입력 후에는 분석 로딩을 거쳐 결과 홈으로 부드럽게 이어집니다.</p>
              <div className={styles.progressPillRow}>
                <span className={`${styles.progressPill} ${styles.progressPillActive}`}>온보딩 완료</span>
                <span className={styles.progressPill}>사주 계산</span>
                <span className={styles.progressPill}>결과 리딩</span>
              </div>
            </div>
            <div className={styles.visualPlaceholder}></div>
          </div>
        </div>

        <div className={styles.floatingSheet}>
          <div className={styles.formCard}>
            <div className={styles.column} style={{ gap: 18 }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="name">이름 · 닉네임</label>
                <input
                  id="name"
                  className={styles.input}
                  placeholder="이름 또는 닉네임"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.label}>성별</span>
                <div className={styles.quickPair}>
                  <button
                    type="button"
                    className={`${styles.chipButton} ${formData.gender === '여성' ? styles.chipButtonActive : ''}`}
                    style={{ minHeight: 48 }}
                    onClick={() => setFormData((prev) => ({ ...prev, gender: '여성' }))}
                  >
                    여성
                  </button>
                  <button
                    type="button"
                    className={`${styles.chipButton} ${formData.gender === '남성' ? styles.chipButtonActive : ''}`}
                    style={{ minHeight: 48 }}
                    onClick={() => setFormData((prev) => ({ ...prev, gender: '남성' }))}
                  >
                    남성
                  </button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.label}>양력 / 음력</span>
                <div className={styles.quickPair}>
                  <button
                    type="button"
                    className={`${styles.chipButton} ${formData.calendar === '양력' ? styles.chipButtonActive : ''}`}
                    style={{ minHeight: 48 }}
                    onClick={() => setFormData((prev) => ({ ...prev, calendar: '양력' }))}
                  >
                    양력
                  </button>
                  <button
                    type="button"
                    className={`${styles.chipButton} ${formData.calendar === '음력' ? styles.chipButtonActive : ''}`}
                    style={{ minHeight: 48 }}
                    onClick={() => setFormData((prev) => ({ ...prev, calendar: '음력' }))}
                  >
                    음력
                  </button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="birthDate">생년월일</label>
                <input
                  id="birthDate"
                  type="date"
                  className={styles.input}
                  value={formData.birthDate}
                  onChange={(event) => {
                    setError('');
                    setFormData((prev) => ({ ...prev, birthDate: event.target.value }));
                  }}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="birthTime">출생 시간</label>
                <input
                  id="birthTime"
                  type="time"
                  className={styles.input}
                  value={formData.birthTime}
                  onChange={(event) => {
                    setError('');
                    setFormData((prev) => ({ ...prev, birthTime: event.target.value }));
                  }}
                  disabled={formData.unknownTime}
                />
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.unknownTime}
                    onChange={(event) => {
                      setError('');
                      setFormData((prev) => ({
                        ...prev,
                        unknownTime: event.target.checked,
                        birthTime: event.target.checked ? '' : prev.birthTime,
                      }));
                    }}
                  />
                  <span className={styles.label} style={{ fontWeight: 700 }}>시 모름으로 분석하기</span>
                </label>
                <span className={styles.inputNote}>시간을 모르면 3주 기준으로 부드럽게 해석해요.</span>
              </div>

              <div className={styles.softCard}>
                <p className={styles.bodyText}>입력한 생년월일시는 브라우저 안에서만 계산해요.</p>
              </div>

              {error ? <div className={styles.errorText}>{error}</div> : null}

              <button type="submit" className={styles.primaryButton}>
                분석 시작하기
              </button>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
}
