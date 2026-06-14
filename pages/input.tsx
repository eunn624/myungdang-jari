import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './_layout';
import styles from '../styles/Input.module.css';

export default function InputScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    unknownHour: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 분석 로딩 페이지로 이동
    router.push('/loading');
  };

  return (
    <Layout title="생년월일시 입력">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>생년월일</label>
          <div className={styles.dateInputs}>
            <input
              type="number"
              name="year"
              placeholder="2000"
              min="1900"
              max="2024"
              value={formData.year}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <span className={styles.separator}>년</span>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className={styles.input}
            >
              <option value="">월</option>
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <span className={styles.separator}>월</span>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              required
              className={styles.input}
            >
              <option value="">일</option>
              {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span className={styles.separator}>일</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>태어난 시간</label>
          <div className={styles.timeInputs}>
            <select
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              disabled={formData.unknownHour}
              className={styles.input}
            >
              <option value="">시</option>
              {Array.from({length: 24}, (_, i) => i).map(h => (
                <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className={styles.separator}>시</span>
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="unknownHour"
              checked={formData.unknownHour}
              onChange={handleChange}
            />
            <span>시간을 정확히 모릅니다</span>
          </label>
        </div>

        <div className={styles.note}>
          💡 생년월일시가 정확할수록 분석이 더 정확해져요.
        </div>

        <button type="submit" className={styles.submitButton}>
          분석하기
        </button>
      </form>
    </Layout>
  );
}
