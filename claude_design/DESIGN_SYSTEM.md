# 명당자리 — 디자인 시스템

## 1. 색상 팔레트 (오행 기반)

### 주요 색상
- **Fire (火)** — #E85D3F (따뜻한 코랄-주황)
- **Water (水)** — #4A90E2 (차분한 파랑)
- **Wood (木)** — #5CB85C (신선한 초록)
- **Metal (金)** — #E8D4A8 (따뜻한 베이지)
- **Earth (土)** — #D4A574 (흙색 브라운)

### 톤 (보조)
- **Primary Accent** — #8F7CE0 (보라, CTA/활성)
- **Background** — #F8F6F2 (따뜻한 오프화이트)
- **Surface** — #FFFFFF (폰 스크린)
- **Text Primary** — #2C2420 (짙은 갈색)
- **Text Secondary** — #8C7A6E (중간 회색)
- **Text Tertiary** — #B8AEA0 (옅은 회색)
- **Divider** — #E8DED2 (구분선)

### 마스코트 색상
- **Pink (귀여움)** — #F2B5CC (밝은 핑크, 마스코트/강조)
- **Pink Light** — #FCE8F2 (매우 옅은 핑크, 배경)

---

## 2. 타이포그래피

### 폰트 스택
- **Display** — Ongleip Park Dahyeon (손글씨, 제목·캐릭터 스피치)
  ```css
  @font-face {
    font-family: 'OngleipParkDahyeon';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_ParkDaHyun.woff2') format('woff2');
    font-weight: normal;
    font-display: swap;
  }
  ```
- **Heading** — Pretendard Bold (친화적이면서 명확)
- **Body** — Pretendard Regular (가독성 높음)
- **Mono** — SF Mono / Roboto Mono (숫자·코드)

### 사이즈 & 웨이트
| 용도 | 사이즈 | 웨이트 | 라인하이트 |
|------|--------|---------|-----------|
| H1 (화면 제목) | 28px | Bold (700) | 1.3 |
| H2 (섹션 제목) | 22px | Bold (700) | 1.3 |
| H3 (카드 제목) | 18px | Bold (700) | 1.3 |
| Body Large | 16px | Regular (400) | 1.5 |
| Body | 14px | Regular (400) | 1.5 |
| Body Small | 12px | Regular (400) | 1.4 |
| Caption | 11px | Regular (400) | 1.4 |

---

## 3. 컴포넌트 & 패턴

### 손글씨 박스 (Sketch Style)
```
border: 2px solid rgba(44, 36, 32, 0.3)
border-radius: 14px 11px 15px 12px / 12px 15px 11px 14px
background: #FFFFFF
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06)
```

### 버튼
**Primary (CTA)**
- Background: #8F7CE0
- Text: White, Bold
- Padding: 12px 24px
- Border-radius: 20px
- Hover: opacity 0.9

**Secondary (행동)**
- Background: transparent
- Border: 2px solid #E8DED2
- Text: #2C2420, Bold
- Padding: 10px 20px

### 칩 (태그)
- Background: #F8F6F2
- Border: 1.5px solid #8F7CE0
- Border-radius: 18px
- Padding: 4px 12px
- Font: 12px Bold

### 카드
```
border-radius: 18px
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
padding: 16px
background: #FFFFFF
```

---

## 4. 마스코트 (고양이 캐릭터)

### 구성
- 귀: 둥근 삼각형, 흑선 2.5px
- 얼굴: 원형, 흑선 2.5px, 밝은 배경
- 눈: 검은 동공 (원형)
- 입: 선 (중간 굵기)
- 색상: 본체 흰색, 핑크 강조 시 배경 #FCE8F2

### 크기 변형
- 큰 (80~100px) — 온보딩, 대기 상태
- 중간 (50~70px) — 홈, 카드
- 작은 (30~40px) — 아바타, 압축

---

## 5. 간격 & 레이아웃

### 기본 간격 단위 (8px)
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

### 폰 기본 구조
- 상단 상태바: 44px
- 콘텐츠 영역: 360px (폰 폭 기준)
- 좌우 여백: 16px
- 하단 탭바: 56px

---

## 6. 아이콘 & 이모지

- 모든 아이콘은 **단순 선화** (2px, 둥근 끝)
- 또는 **이모지** (활발한 감성)
- 예: ✓ ✕ → ↓ ⋮ ⬜ ◻ 🌊 💙 🧭

---

## 7. 상태 & 피드백

### 성공
- Color: #5CB85C (Wood)
- Icon: ✓

### 경고
- Color: #E85D3F (Fire)
- Icon: ⚠

### 정보
- Color: #4A90E2 (Water)
- Icon: ℹ

### 비활성
- Color: #B8AEA0 (Text Tertiary)
- Opacity: 0.5

---

## 8. 애니메이션 & 전환

- **버튼 호버**: opacity 0.9 + 0.1s ease-in-out
- **카드 탭**: 200ms ease-in-out (y 위치)
- **로딩**: 회전 애니메이션 (infinite)
- **스와이프**: 300ms cubic-bezier(0.4, 0, 0.2, 1)

---

## 9. 접근성

- 최소 타겟 크기: 44×44px
- 색상 대비: WCAG AA 이상
- 텍스트 최소 사이즈: 12px
- 포커스 상태: 2px 외부 테두리 (#8F7CE0)

---

## 10. 브레이크포인트 (모바일 우선)

- **Mobile** — 360px ~ 480px (기본)
- **Tablet** — 481px ~ 768px (필요시만)
