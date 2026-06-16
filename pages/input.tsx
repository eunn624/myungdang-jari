import { useState, useRef } from 'react';
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
  const [dateFields, setDateFields] = useState({ year: '', month: '', day: '' });
  const [timeFields, setTimeFields] = useState({ hour: '', minute: '' });
  const [error, setError] = useState('');

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  function clamp(value: string, max: number): string {
    const n = parseInt(value, 10);
    if (isNaN(n) || value === '') return value;
    return String(Math.min(n, max));
  }

  function combineBirthDate(year: string, month: string, day: string): string {
    if (year.length === 4 && month.length >= 1 && day.length >= 1) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  }

  function combineBirthTime(hour: string, minute: string): string {
    if (hour.length >= 1 && minute.length >= 1) {
      return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }
    return '';
  }

  function handleDateField(field: 'year' | 'month' | 'day', raw: string) {
    const digits = raw.replace(/\D/g, '');
    let value = digits;
    if (field === 'month') value = clamp(digits, 12);
    if (field === 'day') value = clamp(digits, 31);

    const next = { ...dateFields, [field]: value };
    setDateFields(next);
    setError('');
    setFormData(prev => ({ ...prev, birthDate: combineBirthDate(next.year, next.month, next.day) }));

    if (field === 'year' && value.length === 4) monthRef.current?.focus();
    if (field === 'month' && value.length === 2) dayRef.current?.focus();
  }

  function handleTimeField(field: 'hour' | 'minute', raw: string) {
    const digits = raw.replace(/\D/g, '');
    let value = digits;
    if (field === 'hour') value = clamp(digits, 23);
    if (field === 'minute') value = clamp(digits, 59);

    const next = { ...timeFields, [field]: value };
    setTimeFields(next);
    setError('');
    setFormData(prev => ({ ...prev, birthTime: combineBirthTime(next.hour, next.minute) }));

    if (field === 'hour' && value.length === 2) minuteRef.current?.focus();
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.birthDate) {
      setError('생년월일을 입력해 주세요.');
      return;
    }

    if (!formData.unknownTime && !formData.birthTime) {
      setError('출생 시간을 입력해 주세요. 모르겠다면 시 모름을 선택하면 돼요.');
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

        {/* 진행 상태 표시 — compact, 180px 이하 */}
        <div className={styles.inputProgressHeader}>
          <div className={styles.progressPillRow}>
            <span className={`${styles.progressPill} ${styles.progressPillActive}`}>입력 중</span>
            <span className={styles.progressPill}>분석 준비</span>
            <span className={styles.progressPill}>결과 보기</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '25%' }}></div>
          </div>
          <p className={styles.caption}>생년월일시를 입력하면 바로 결과를 볼 수 있어요.</p>
        </div>

        {/* 폼 — 일반 흐름, sticky 없음 */}
        <div className={styles.formCard}>
          <div className={styles.column} style={{ gap: 24 }}>
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
              <span className={styles.label}>생년월일</span>
              <div className={styles.dateRow}>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="1990"
                  className={styles.splitInputYear}
                  value={dateFields.year}
                  onChange={e => handleDateField('year', e.target.value)}
                  aria-label="출생 년도"
                />
                <span className={styles.dateSep}>/</span>
                <input
                  ref={monthRef}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  placeholder="06"
                  className={styles.splitInputMD}
                  value={dateFields.month}
                  onChange={e => handleDateField('month', e.target.value)}
                  aria-label="출생 월"
                />
                <span className={styles.dateSep}>/</span>
                <input
                  ref={dayRef}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  placeholder="15"
                  className={styles.splitInputMD}
                  value={dateFields.day}
                  onChange={e => handleDateField('day', e.target.value)}
                  aria-label="출생 일"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <span className={styles.label}>출생 시간</span>
              <div className={styles.timeRow}>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  placeholder="14"
                  className={styles.splitInputMD}
                  value={timeFields.hour}
                  onChange={e => handleTimeField('hour', e.target.value)}
                  disabled={formData.unknownTime}
                  aria-label="출생 시"
                />
                <span className={styles.dateSep}>시</span>
                <input
                  ref={minuteRef}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  placeholder="30"
                  className={styles.splitInputMD}
                  value={timeFields.minute}
                  onChange={e => handleTimeField('minute', e.target.value)}
                  disabled={formData.unknownTime}
                  aria-label="출생 분"
                />
                <span className={styles.dateSep}>분</span>
              </div>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={formData.unknownTime}
                  onChange={(event) => {
                    setError('');
                    setTimeFields({ hour: '', minute: '' });
                    setFormData((prev) => ({
                      ...prev,
                      unknownTime: event.target.checked,
                      birthTime: '',
                    }));
                  }}
                />
                <span className={styles.label} style={{ fontWeight: 700 }}>출생 시간을 몰라요</span>
              </label>
              <span className={styles.inputNote}>시간 정보가 없으면 가능한 흐름을 넓게 보고 부드럽게 해석해드려요.</span>
            </div>
          </div>
        </div>

        <div className={styles.softCard}>
          <p className={styles.bodyText}>입력한 생년월일시는 이 화면 안에서만 계산돼요.</p>
        </div>

        {error ? <div className={styles.errorText}>{error}</div> : null}

        <button type="submit" className={styles.primaryButton}>
          결과 보러 가기
        </button>
      </form>
    </Layout>
  );
}
