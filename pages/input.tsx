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
    <Layout>
      <form className={styles.screen} onSubmit={handleSubmit}>
        <div className={styles.row} style={{ gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>←</span>
          <span className={styles.caption}>3 / 4</span>
        </div>

        <div className={styles.column} style={{ gap: 4 }}>
          <h1 className={styles.sectionTitle}>기본 정보를 알려주세요</h1>
          <p className={styles.sectionSubtitle}>한 화면에서 빠르게 입력하고 바로 리딩으로 넘어가요.</p>
        </div>

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
          <div className={styles.row} style={{ gap: 8 }}>
            <button
              type="button"
              className={`${styles.chipButton} ${formData.gender === '여성' ? styles.chipButtonActive : ''}`}
              style={{ flex: 1, minHeight: 48 }}
              onClick={() => setFormData((prev) => ({ ...prev, gender: '여성' }))}
            >
              여성
            </button>
            <button
              type="button"
              className={`${styles.chipButton} ${formData.gender === '남성' ? styles.chipButtonActive : ''}`}
              style={{ flex: 1, minHeight: 48 }}
              onClick={() => setFormData((prev) => ({ ...prev, gender: '남성' }))}
            >
              남성
            </button>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <span className={styles.label}>양력 / 음력</span>
          <div className={styles.row} style={{ gap: 8 }}>
            <button
              type="button"
              className={`${styles.chipButton} ${formData.calendar === '양력' ? styles.chipButtonActive : ''}`}
              style={{ flex: 1, minHeight: 48 }}
              onClick={() => setFormData((prev) => ({ ...prev, calendar: '양력' }))}
            >
              양력
            </button>
            <button
              type="button"
              className={`${styles.chipButton} ${formData.calendar === '음력' ? styles.chipButtonActive : ''}`}
              style={{ flex: 1, minHeight: 48 }}
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
            <span className={styles.label} style={{ fontWeight: 600 }}>시 모름으로 분석하기</span>
          </label>
          <span className={styles.inputNote}>모르면 3주 기준으로 분석해요</span>
        </div>

        <span className={styles.inputNote}>생년월일시는 브라우저에서만 계산됩니다.</span>
        {error ? <div className={styles.errorText}>{error}</div> : null}

        <div className={styles.grow}></div>
        <button type="submit" className={styles.primaryButton}>
          분석 시작하기
        </button>
      </form>
    </Layout>
  );
}
