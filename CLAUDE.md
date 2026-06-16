# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

사주 오행 기반 명당 가이드 앱. 생년월일시를 입력받아 **클라이언트에서만** 오행 분석을 수행하고, 행정동 추천·침대 방향·개운 소품·데일리 루틴을 제공하는 Next.js 웹앱.

**현재 상태:** Phase 1 MVP (Next.js 14 / 서버 없음 / 정적 웹앱 형태)

## 명령어

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드 (out/ 디렉터리)
npm test           # 전체 테스트
npm run test:watch # 워치 모드
npm run test:coverage

# 단일 테스트 파일 실행
npx jest __tests__/saju/manseryeok.test.ts
```

테스트는 `__tests__/**/*.test.ts` 패턴으로 매칭되며 `ts-jest`로 실행된다.

## 아키텍처

### 데이터 흐름
사용자 입력 → URL 쿼리 파라미터로 페이지 간 전달 → `lib/app-report.ts`의 `getReportFromQuery()` / `buildReport()`로 전체 리포트 생성 → 각 페이지에서 소비

**상태를 URL 쿼리로만 관리한다.** 별도 상태 관리 라이브러리 없음. `createQueryFromProfile()`로 직렬화, `getProfileFromQuery()`로 역직렬화. 프로필 데이터(`name`, `gender`, `calendar`, `birthDate`, `birthTime`, `unknownTime`)가 모든 탭 링크에 query로 따라다닌다.

### 핵심 레이어

**`lib/saju/`** — 사주 계산 엔진 (순수 함수, 서버 미사용)
- `manseryeok.ts`: 사주 사기둥 계산. JDN(율리우스 적일수) 기반 일주 계산, 절기 근사치로 월주 계산 (⚠️ 생일이 절기 전후 1~2일이면 월주 오류 가능 — R1 리스크)
- `ohang.ts`: 오행 분포 계산, 부족 오행(`deficitOhang`) 도출, 용신(`yongsin`) 결정
- `directions.ts`: 침대 방향·길방 계산
- `sinsal.ts`: 신살 감지
- `daewoon.ts` / `daily.ts`: 대운·세운·일진 계산
- `index.ts`: `analyzeSaju(birth, gender)` — 위 모듈을 조합한 단일 진입점

**`lib/location/`** — 행정동 매칭
- `matcher.ts`: `matchDistricts(options)` — 부족 오행·지형 선호를 기준으로 `data/districts.json`에서 행정동 스코어링 후 반환 (가중치: 1순위 오행 ×30, 2순위 ×20, 3순위 ×10; 지형 매칭 ×10~15; 한자 확정 +5; 복수 매칭 +10)
- `terrain.ts`: 지형 분류 유틸

**`lib/app-report.ts`** — 리포트 조립기
- `buildReport(profile)`: `analyzeSaju` + `matchDistricts` + 일주 콘텐츠 + 데일리 정보를 합쳐 `AppReport` 타입으로 반환. `todayDayMessage`와 `monthSpaceTip`은 이 파일 내 긴 텍스트 생성 함수(`buildTodayDayMessage`, `buildMonthSpaceTip`)가 만든다.

**`data/`** — 정적 데이터
- `districts.json`: 행정동 DB (이름·한자·시도·오행·지형·한자 확정 여부 포함)
- `ilju-content.ts`: 60 일주별 해석 콘텐츠
- `ohang-hanja-map.json`: 오행별 한자 매핑
- `store-items.ts`: 오행별 상품 피드

### 페이지 구조

온보딩 → 입력 → 결과로 이어지는 선형 흐름과, 결과 이후 탭 기반 코어 루프로 구성된다.

| 페이지 | 경로 | 역할 |
|---|---|---|
| 진입 | `/` | `/onboarding-1`으로 리다이렉트 |
| 온보딩 | `/onboarding-1,2,3` | 앱 소개·동의 |
| 입력 | `/input` | 생년월일시 폼 |
| 로딩 | `/loading` | 분석 중 화면 (쿼리 유지하며 `/result`로 이동) |
| 결과 | `/result` | 7장 카드 슬라이드 결과 요약 |
| 홈 | `/home` | 탭 진입점, 데일리 카드 |
| 사주 | `/saju` | 사기둥·오행 분포 상세 |
| 풀이 | `/read` | 긴 서술형 리딩 |
| 명당 | `/place` | 행정동 추천·침대 방향 |
| 소품 | `/store` | 개운 상품 피드 |
| 마이 | `/my` | 프로필·분석 재시작 |
| 공유 | `/share` | 공유 카드 생성 |

**`pages/_layout.tsx`**: 공통 레이아웃. `showTabBar` prop으로 탭바 표시 여부 제어. 탭 링크는 항상 `router.query`를 함께 넘겨 프로필 데이터를 유지한다.

### CSS 모듈

각 페이지마다 `styles/*.module.css`가 1:1 대응. 전역 스타일은 `styles/globals.css`·`styles/fonts.css`. 공통 UI 패턴(카드, 버튼, 바 등)은 `styles/AppFlow.module.css`에 모여 있다.

## 중요 제약

- **오행 계산은 반드시 클라이언트에서만** 수행한다. 생년월일시를 서버로 전송하지 않는다.
- 모든 결과 텍스트는 "오락·참고 목적" 포지셔닝을 유지한다. "운이 트인다", "병이 낫는다" 같은 효능 보장 표현을 코드에 추가하지 않는다.
- 제휴 커머스 링크에는 대가성·제휴 관계 표기가 필수다.
- 월주 계산은 절기 근사치를 사용 중 (R1 리스크). 절기 전후 1~2일 생일의 경우 월주가 달라질 수 있음을 알고 있어야 한다.

## 타입 참조

주요 타입은 `lib/saju/types.ts`에 정의: `BirthInfo`, `FourPillars`, `GanJi`, `OhangDistribution`, `SajuResult`, `Ohang`, `Direction`, `DaeWoon`, `SeWoon`, `SinsalResult`

행정동 관련 타입은 `lib/location/types.ts`: `District`, `MatchResult`, `MatchOptions`, `Terrain`

리포트 타입은 `lib/app-report.ts`: `AppProfile`, `AppReport`
