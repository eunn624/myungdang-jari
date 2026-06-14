# Vercel 배포 설정 가이드

**상태:** 로컬 Git 저장소 준비 완료 ✅  
**다음 단계:** GitHub 연동 → Vercel 연결

---

## 📋 체크리스트

### 1단계: GitHub 저장소 생성 & 푸시

```bash
# GitHub 웹에서 'myungdang-jari' 저장소 생성 (공개/비공개 선택)
# https://github.com/new

# 로컬 저장소를 GitHub에 연결
cd /Users/gimsieun/Desktop/02\ 실험실/05\ 명당자리

# GitHub URL 설정 (예: https://github.com/USERNAME/myungdang-jari.git)
git remote add origin https://github.com/YOUR_USERNAME/myungdang-jari.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel 연결

1. **Vercel 로그인** → https://vercel.com
2. **"Add New..."** → **"Project"** 선택
3. **GitHub 저장소 선택** → `myungdang-jari`
4. **프로젝트 설정:**
   - Framework Preset: **Expo** (또는 Custom)
   - Build Command: `expo build:web` (vercel.json에서 자동 인식)
   - Output Directory: `web-build`
5. **Deploy** 클릭

### 3단계: 환경 변수 설정 (필요 시)

Vercel 프로젝트 Settings → Environment Variables:

```
REACT_APP_API_URL=https://api.myungdang-jari.com (추후 결정)
```

---

## 🔗 현재 구성

| 항목 | 상태 |
|---|---|
| **로컬 Git** | ✅ 초기화 완료 |
| **Git Commits** | ✅ 2개 (initial + docs) |
| **package.json** | ✅ Expo 기반 설정 |
| **vercel.json** | ✅ 배포 설정 완료 |
| **GitHub 저장소** | ⏳ 생성 필요 |
| **Vercel 연결** | ⏳ GitHub 후 연결 |

---

## 🚀 Vercel 자동 배포 설정

### 자동 배포 트리거

vercel.json 설정으로 다음이 자동 작동합니다:

```json
{
  "buildCommand": "expo build:web",
  "outputDirectory": "web-build"
}
```

- **main 브랜치 push** → 프로덕션 배포
- **PR 생성** → 프리뷰 배포 (자동)

---

## 📝 추가 설정 (Phase 2)

### 커스텀 도메인 (추후)
- Vercel Settings → Domains
- 예: `myungdang-jari.com` 또는 `명당자리.com`

### API 연동 (추후)
- Vercel Functions for serverless API
- 또는 별도 백엔드 서버 연결

### 모니터링
- Vercel Analytics (자동 활성화)
- Error tracking, Performance insights

---

## ✅ 체크 완료

### 현재까지 완료된 항목
- [x] 로컬 Git 저장소 초기화
- [x] package.json 생성 (Expo 기반)
- [x] .gitignore 설정
- [x] vercel.json 배포 설정
- [x] README.md 작성
- [x] CLAUDE.md (개발 가이드) 작성
- [x] 만세력 라이브러리 조사 완료

### 다음 항목 (사용자 수행)
- [ ] GitHub 저장소 생성
- [ ] GitHub에 푸시
- [ ] Vercel 프로젝트 연결
- [ ] 프리뷰 배포 확인

---

**Last Updated:** 2026-06-14  
**담당:** 개발팀  
**예상 완료:** GitHub 계정 확인 후 즉시 가능
