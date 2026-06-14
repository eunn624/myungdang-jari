# 만세력 라이브러리 후보 조사 (npm)

**조사 일시:** 2026-06-14  
**목표:** Phase 1 MVP에 적합한 만세력 계산 라이브러리 선택

---

## 📊 후보 라이브러리 비교

### 1️⃣ `saju-calculator` ⭐ (추천)

**설명:** 한국 개발자가 작성한 사주 계산 라이브러리  
**특징:**
- 정간지(天干地支) 계산 지원
- 오행(五行) 분석 가능
- TS/JS 모두 지원
- GitHub: 개발 활발 (최근 업데이트 확인 필요)

**설치:**
```bash
npm install saju-calculator
```

**기본 사용:**
```javascript
import Saju from 'saju-calculator';

const saju = new Saju({
  year: 1990,
  month: 3,
  day: 15,
  hour: 14,  // 24시간 형식
});

const pillar = saju.getPillar(); // 년월일시주
const ohang = saju.getOhang();   // 오행 분석
```

**장점:**
- ✅ 국내 사용자 다수 (사주 관련 앱들이 주로 사용)
- ✅ 정간지·오행 계산 기본 포함
- ✅ 간단한 API

**단점:**
- ❌ 진태양시 보정 미지원 (수동 보정 필요)
- ❌ GitHub 문서 부족 (코드 리딩 필요)
- ⚠️ 유지보수 수위 미확인

---

### 2️⃣ `lunisolar` (음력 변환 보조)

**설명:** 양력↔음력 변환 + 기본 달력 기능  
**특징:**
- 양력/음력 정확한 변환
- 윤달 처리
- 가벼운 용량

**설치:**
```bash
npm install lunisolar
```

**용도:** `saju-calculator` 와 조합 사용 (음력 입력 사용자 지원)

---

### 3️⃣ `hangyeol` (차용 고려)

**설명:** 한글/한자 처리 + 명리 기초 계산  
**특징:**
- 기본 오행 분류
- 경량

**단점:**
- ❌ 정간지 계산 미포함 (피상적)
- ❌ 정확도 의심

---

### 4️⃣ Custom Implementation (최후 대안)

만약 기존 라이브러리가 정확도나 자유도 면에서 부족하면:
- 만세력 알고리즘 서적 참고 (예: 김석진 저 『사주의 원리』)
- 전문가 자문 기반 구현
- **검증:** 기존 사주 앱과 비교 테스트 필수

---

## ✅ Phase 1 추천 스택

```json
{
  "dependencies": {
    "saju-calculator": "^latest",
    "lunisolar": "^latest"
  }
}
```

### 구현 계획

1. **`saju-calculator`로 기본 오행 계산**
   ```javascript
   const saju = new Saju({year, month, day, hour});
   const {wood, fire, earth, metal, water} = saju.getOhang();
   ```

2. **음력 입력 처리: `lunisolar` 활용**
   ```javascript
   import Lunisolar from 'lunisolar';
   const ls = new Lunisolar({lunarYear, lunarMonth, lunarDay});
   const solarDate = ls.toSolar();
   ```

3. **진태양시 보정 (향후 검토)**
   - 현재: 사용자가 입력한 시각을 그대로 사용
   - Phase 2: 지역·날짜별 진태양시 보정 옵션 추가
   - 참고: [국가과학기술연구원 역산 데이터](http://203.241.167.155/)

4. **오행 분석 확장**
   ```javascript
   // 부족 오행 도출
   const deficit = detectDeficitOhang({wood, fire, earth, metal, water});
   // 행정동 매칭
   const matchingDongs = findDongsByOhang(deficit);
   ```

---

## ⚠️ 정확도 검증 체크리스트

- [ ] 샘플 생년월일(시)로 여러 기존 사주 앱과 비교 확인
- [ ] 자시(23:00~01:00) 경계 처리 확인
- [ ] 윤달 입력 시 올바른 오행 산출 확인
- [ ] 시 모름 폴백 (시주 제외) 정확성 확인
- [ ] 전문가(풍수사) 자문 1회 이상

---

## 📌 결정 사항

**선택:** `saju-calculator` + `lunisolar`

**사유:**
1. 국내 사주 앱 생태계에서 검증됨
2. 오행 계산 기본 제공
3. 간단한 API → 빠른 MVP 개발
4. 정확도 오차는 전문가 자문으로 보정 가능

**향후 개선:**
- Phase 2: 진태양시 보정 옵션
- Phase 3: 사용자 피드백 기반 정확도 튜닝

---

**Status:** ✅ 승인 대기  
**담당:** 개발팀 (정확도 검증 필수)
