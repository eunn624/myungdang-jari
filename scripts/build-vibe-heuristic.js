#!/usr/bin/env node
/**
 * 행정동 분위기 지수 — 휴리스틱 버전
 *
 * 소상공인 원본 CSV 없이 실행 가능한 버전.
 * 시군구(구)별 상권 특성과 행정동명 패턴을 기반으로 분위기를 추정합니다.
 *
 * 데이터 근거:
 *  - 서울시 자치구별 상권 성격 (상권분석서비스 통계 + 공개 상권 리포트)
 *  - 경기도 시군구별 신도시/구도심 분류
 *  - 행정동명에서 추출한 상권 키워드 보정
 *
 * 실행:
 *  node scripts/build-vibe-heuristic.js
 *
 * 소상공인 원본 데이터를 확보하면 build-vibe.js 로 덮어쓸 수 있습니다.
 */

const fs = require('fs');
const path = require('path');

const DISTRICTS_PATH = path.join(__dirname, '../data/districts.json');
const BACKUP_PATH    = path.join(__dirname, '../data/districts.backup.json');

// ── 시군구별 기본 번화 지수 (0~100) ──────────────────────────────────
// 값이 높을수록 활기찬 상권. 65+ = lively, 35- = quiet, 나머지 = balanced.
// 근거: 소상공인진흥공단 상권분석 + 서울시 열린데이터광장 상권 통계

const SIGUNGU_VIBE = {
  // ── 서울 ────────────────────────────────────────────────────────────
  // 상권 최강 (lively)
  '마포구':     80,  // 홍대·합정·연남·망원 — 전국 상위 5% 상권 밀집
  '중구':       76,  // 명동·을지로·동대문 — 유동인구 전국 최상위
  '용산구':     75,  // 이태원·한남·경리단길
  '성동구':     72,  // 성수 트렌디 상권 급부상
  '강남구':     72,  // 역삼·논현·삼성·청담
  '서초구':     70,  // 강남역·반포·교대역 상권
  '영등포구':   67,  // 여의도·영등포타임스퀘어
  '종로구':     66,  // 인사동·삼청·혜화·광화문
  // 균형 (balanced)
  '광진구':     61,  // 건대입구·군자
  '동대문구':   59,  // 청량리·회기·전농
  '서대문구':   58,  // 신촌·연세로·이화여대 상권
  '관악구':     56,  // 서울대입구·신림·봉천
  '송파구':     60,  // 잠실·석촌·가락 — 일부 lively 섞임
  '강동구':     53,  // 천호·둔촌
  '성북구':     51,  // 길음·미아·돈암 — 생활상권
  '동작구':     51,  // 사당·노량진
  '양천구':     50,  // 목동·신정
  '강서구':     50,  // 김포공항·화곡
  // 조용한 주거 (quiet)
  '구로구':     46,  // 신도림은 있지만 전반적 구로 공단 배후
  '금천구':     43,  // 가산디지털단지 배후 주거
  '은평구':     44,  // 연신내 일부 제외 주로 주거
  '중랑구':     40,  // 상봉·중화·면목 — 구도심 조용
  '노원구':     40,  // 대규모 아파트 단지 주거
  '강북구':     38,  // 미아사거리 주변 — 조용한 주거
  '도봉구':     35,  // 쌍문·방학·창동 — 서울 최외곽 조용

  // ── 경기 ────────────────────────────────────────────────────────────
  // balanced-lively
  '성남시 분당구': 66,  // 판교테크노밸리·정자·서현
  '수원시 팔달구': 63,  // 수원 구도심 상권·팔달문
  '용인시 수지구': 61,  // 죽전·풍덕천 신도시 상권
  '안양시 동안구': 59,  // 평촌 신도시
  '고양시 일산동구': 58,  // 일산 라페스타·웨스턴돔
  '고양시 일산서구': 56,  // 일산 주거 중심
  '성남시 중원구': 53,
  '성남시 수정구': 51,
  '부천시 소사구': 52,
  '부천시 원미구': 54,  // 부천 중심상권
  '부천시 오정구': 48,
  '고양시 덕양구': 52,  // 화정·능곡
  '과천시':      55,  // 과천중앙공원 인근 상권
  '하남시':      53,  // 미사강변도시·하남시청
  '구리시':      51,
  '수원시 영통구': 56,  // 광교신도시 포함
  '수원시 권선구': 49,
  '수원시 장안구': 50,
  '용인시 기흥구': 52,  // 기흥역세권·동백
  '의정부시':    51,
  '광명시':      50,
  '시흥시':      47,
  '군포시':      49,
  '의왕시':      47,
  '안산시 단원구': 50,  // 안산 중심
  '안산시 상록구': 47,
  '화성시':      50,  // 동탄신도시 포함 — 편차 큼
  '오산시':      46,
  '평택시':      50,
  // quiet
  '남양주시':    46,  // 다산신도시 일부 있지만 전반 조용
  '김포시':      45,  // 한강신도시 일부 있지만 외곽
  '용인시 처인구': 38,  // 처인구 대부분 농촌
  '양주시':      36,
  '파주시':      40,  // 운정신도시 일부 있음
  '동두천시':    32,
  '포천시':      30,
  '이천시':      38,
  '광주시':      40,
  '여주시':      30,
  '가평군':      25,
  '양평군':      25,
  '연천군':      22,
};

// ── 행정동명 키워드 보정치 ─────────────────────────────────────────────
// 특정 동 이름 패턴이 있으면 기본 점수에서 가감
const DONG_MODIFIERS = [
  // 서울 핵심 상권 행정동명 (홍대입구역 주변 등)
  { pattern: /서교/,    delta: +10 },  // 서교동 = 홍대 중심
  { pattern: /합정/,    delta: +8  },
  { pattern: /연남/,    delta: +8  },
  { pattern: /망원/,    delta: +6  },
  { pattern: /성수/,    delta: +8  },  // 성수1가, 성수2가
  { pattern: /이태원/,  delta: +8  },
  { pattern: /한남/,    delta: +7  },
  { pattern: /청담/,    delta: +6  },
  { pattern: /명동/,    delta: +8  },
  { pattern: /혜화/,    delta: +7  },  // 대학로
  { pattern: /역삼/,    delta: +5  },
  { pattern: /삼성/,    delta: +4  },
  { pattern: /논현/,    delta: +4  },
  { pattern: /잠실/,    delta: +5  },
  { pattern: /여의도/,  delta: +6  },
  { pattern: /영등포/,  delta: +5  },
  { pattern: /신림/,    delta: +3  },  // 대학가 + 상권
  { pattern: /봉천/,    delta: +2  },
  // 상암·수색·은평 뉴타운 등 — 상권보다 주거·미디어
  { pattern: /상암/,    delta: -5  },
  { pattern: /은평뉴타운/, delta: -3 },
  // 공원·자연·농촌 키워드 동
  { pattern: /산/,      delta: -5  },   // 능곡산, 불암산 등
  { pattern: /계곡/,    delta: -8  },
  // 신도시 플래그 (경기 신도시는 계획 상권)
  { pattern: /동탄/,    delta: +5  },  // 동탄2신도시
  { pattern: /판교/,    delta: +8  },  // 판교 테크노밸리
  { pattern: /광교/,    delta: +5  },
  { pattern: /위례/,    delta: +4  },
  { pattern: /미사/,    delta: +3  },
  { pattern: /다산/,    delta: +3  },
  { pattern: /운정/,    delta: +3  },
];

// ── 분류 임계값 ─────────────────────────────────────────────────────

const LIVELY_THRESHOLD = 65;
const QUIET_THRESHOLD  = 35;

function classifyVibe(score) {
  if (score >= LIVELY_THRESHOLD) return 'lively';
  if (score <= QUIET_THRESHOLD)  return 'quiet';
  return 'balanced';
}

function vibeLabel(vibe) {
  return { lively: '활기찬 상권', balanced: '균형잡힌 동네', quiet: '조용한 주거' }[vibe];
}

// ── 메인 ─────────────────────────────────────────────────────────────

function main() {
  console.log('[1/3] districts.json 로드...');
  const districtData = JSON.parse(fs.readFileSync(DISTRICTS_PATH, 'utf8'));
  const districts = districtData.districts;
  console.log(`  ${districts.length}개 행정동 로드`);

  let matched = 0;
  let defaulted = 0;

  console.log('\n[2/3] 분위기 지수 계산...');
  for (const d of districts) {
    const baseScore = SIGUNGU_VIBE[d.siGunGu];

    if (baseScore === undefined) {
      // 정의되지 않은 시군구 — balanced 기본값
      d.vibe      = 'balanced';
      d.vibeScore = 50;
      d.vibeNote  = `${d.siGunGu} 기본값 (데이터 없음)`;
      defaulted++;
      continue;
    }

    // 행정동명 보정
    let delta = 0;
    for (const mod of DONG_MODIFIERS) {
      if (mod.pattern.test(d.name)) {
        delta += mod.delta;
        break; // 첫 매칭만 적용 (중복 방지)
      }
    }

    const score = Math.max(0, Math.min(100, baseScore + delta));
    const vibe  = classifyVibe(score);

    d.vibe      = vibe;
    d.vibeScore = score;
    d.vibeNote  = delta !== 0
      ? `${d.siGunGu} 기준 ${baseScore} + 지명 보정 ${delta > 0 ? '+' : ''}${delta} → ${vibeLabel(vibe)}`
      : `${d.siGunGu} 기준 → ${vibeLabel(vibe)}`;

    matched++;
  }

  // 분포 확인
  const dist = { lively: 0, balanced: 0, quiet: 0 };
  for (const d of districts) dist[d.vibe]++;
  console.log(`  시군구 매칭: ${matched}개, 기본값: ${defaulted}개`);
  console.log(`  분포 — 활기: ${dist.lively} / 균형: ${dist.balanced} / 조용: ${dist.quiet}`);

  // 샘플 출력
  console.log('\n  샘플:');
  const samples = ['서교동', '합정동', '개포1동', '창1동', '판교동', '수내1동'];
  for (const name of samples) {
    const found = districts.find(x => x.name === name);
    if (found) {
      console.log(`    ${found.siGunGu} ${found.name}: ${found.vibe} (${found.vibeScore}점)`);
    }
  }

  console.log('\n[3/3] 저장...');
  fs.copyFileSync(DISTRICTS_PATH, BACKUP_PATH);
  console.log(`  백업: ${BACKUP_PATH}`);
  fs.writeFileSync(DISTRICTS_PATH, JSON.stringify(districtData, null, 2), 'utf8');
  console.log(`  저장: ${DISTRICTS_PATH}`);

  console.log('\n✅ 완료!');
  console.log('   소상공인 원본 데이터를 확보하면 "npm run build:vibe <CSV>" 로 정밀 업데이트 가능합니다.');
}

main();
