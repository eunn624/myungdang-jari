import { useState, type FormEvent } from 'react';
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

const years = Array.from({ length: 91 }, (_, index) => String(2026 - index));
const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
const hours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const minutes = ['00', '10', '20', '30', '40', '50'];

function to24Hour(meridiem: string, hour: string) {
  const parsed = parseInt(hour, 10);
  if (meridiem === '오전') return parsed === 12 ? '00' : String(parsed).padStart(2, '0');
  return parsed === 12 ? '12' : String(parsed + 12).padStart(2, '0');
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
  const [dateFields, setDateFields] = useState({ year: '1990', month: '05', day: '23' });
  const [timeFields, setTimeFields] = useState({ meridiem: '오전', hour: '09', minute: '30' });
  const [error, setError] = useState('');

  function updateDate(next: typeof dateFields) {
    setDateFields(next);
    setFormData((prev) => ({ ...prev, birthDate: `${next.year}-${next.month}-${next.day}` }));
    setError('');
  }

  function updateTime(next: typeof timeFields) {
    setTimeFields(next);
    setFormData((prev) => ({
      ...prev,
      birthTime: `${to24Hour(next.meridiem, next.hour)}:${next.minute}`,
    }));
    setError('');
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const birthDate = formData.birthDate || `${dateFields.year}-${dateFields.month}-${dateFields.day}`;
    const birthTime = formData.unknownTime
      ? '00:00'
      : formData.birthTime || `${to24Hour(timeFields.meridiem, timeFields.hour)}:${timeFields.minute}`;

    if (!formData.name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }

    setError('');
    router.push({
      pathname: '/loading',
      query: createQueryFromProfile({
        ...formData,
        name: formData.name.trim(),
        birthDate,
        birthTime,
      }),
    });
  };

  return (
    <Layout>
      <form className={styles.referenceInputShell} onSubmit={handleSubmit}>
        <header className={styles.referenceInputHeader}>
          <button type="button" className={styles.referencePlainBack} onClick={() => router.push('/onboarding-1')}>
            ‹
          </button>
          <div>
            <h1>사주 정보 등록</h1>
            <span className={styles.referenceUnderlinePink}></span>
            <p>정확한 분석을 위해<br />사주 정보를 입력해주세요.</p>
          </div>
          <div className={styles.referenceInputIllustration}>
            <span className={styles.referenceFormPaper}></span>
            <span className={styles.referencePencil}></span>
            <span className={styles.referenceDoodleStarSmall}>☆</span>
          </div>
        </header>

        <section className={styles.referenceInputCard}>
          <div className={styles.referenceInputField}>
            <label htmlFor="name">이름 <em>*</em></label>
            <div className={styles.referenceNameInputWrap}>
              <input
                id="name"
                value={formData.name}
                onChange={(event) => {
                  setError('');
                  setFormData((prev) => ({ ...prev, name: event.target.value }));
                }}
                placeholder="이름을 입력해주세요"
              />
              <span>♧</span>
            </div>
          </div>

          <div className={styles.referenceInputField}>
            <label>생년월일 <em>*</em></label>
            <span className={styles.referenceCalendarDoodle}></span>
            <div className={styles.referenceSelectGrid}>
              <select
                value={dateFields.year}
                className={styles.referenceSelect}
                onChange={(event) => updateDate({ ...dateFields, year: event.target.value })}
              >
                {years.map((year) => <option key={year} value={year}>{year}년</option>)}
              </select>
              <select
                value={dateFields.month}
                className={styles.referenceSelect}
                onChange={(event) => updateDate({ ...dateFields, month: event.target.value })}
              >
                {months.map((month) => <option key={month} value={month}>{month}월</option>)}
              </select>
              <select
                value={dateFields.day}
                className={styles.referenceSelect}
                onChange={(event) => updateDate({ ...dateFields, day: event.target.value })}
              >
                {days.map((day) => <option key={day} value={day}>{day}일</option>)}
              </select>
            </div>
            <p className={styles.referenceInputHelp}>양력 / 음력은 결과 화면에서 확인 및 변경할 수 있어요.</p>
          </div>

          <div className={styles.referenceInputField}>
            <label>태어난 시간 <em>*</em></label>
            <span className={styles.referenceClockDoodle}></span>
            <div className={styles.referenceSelectGrid}>
              <select
                value={timeFields.meridiem}
                className={styles.referenceSelect}
                disabled={formData.unknownTime}
                onChange={(event) => updateTime({ ...timeFields, meridiem: event.target.value })}
              >
                <option value="오전">오전</option>
                <option value="오후">오후</option>
              </select>
              <select
                value={timeFields.hour}
                className={styles.referenceSelect}
                disabled={formData.unknownTime}
                onChange={(event) => updateTime({ ...timeFields, hour: event.target.value })}
              >
                {hours.map((hour) => <option key={hour} value={hour}>{hour}시</option>)}
              </select>
              <select
                value={timeFields.minute}
                className={styles.referenceSelect}
                disabled={formData.unknownTime}
                onChange={(event) => updateTime({ ...timeFields, minute: event.target.value })}
              >
                {minutes.map((minute) => <option key={minute} value={minute}>{minute}분</option>)}
              </select>
            </div>
            <label className={styles.referenceCheckRow}>
              <input
                type="checkbox"
                checked={formData.unknownTime}
                onChange={(event) => {
                  setError('');
                  setFormData((prev) => ({
                    ...prev,
                    unknownTime: event.target.checked,
                    birthTime: event.target.checked ? '' : `${to24Hour(timeFields.meridiem, timeFields.hour)}:${timeFields.minute}`,
                  }));
                }}
              />
              <span>태어난 시간을 모름</span>
            </label>
            <p className={styles.referenceInputHelp}>시간을 모르는 경우, ‘시간 모름’으로 분석됩니다.</p>
          </div>

          <div className={styles.referenceInputNotice}>
            <span>♢</span>
            <p>정확한 시간을 입력할수록 더 정밀한 분석이 가능해요. 모르는 경우 대략적인 시간을 선택해도 괜찮아요.</p>
            <em>♡</em>
          </div>

          {error ? <p className={styles.referenceError}>{error}</p> : null}

          <button type="submit" className={styles.referenceLargeButton}>
            저장하고 분석하기
            <span>›</span>
          </button>
        </section>
      </form>
    </Layout>
  );
}
