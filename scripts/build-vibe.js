#!/usr/bin/env node
/**
 * 행정동별 분위기 지수(vibe score) 계산 스크립트
 *
 * ── 데이터 다운로드 ──────────────────────────────────────────────────
 *
 *  소상공인진흥공단 상가업소 정보 (분기별 전체)
 *  URL: https://www.data.go.kr/data/15083033/fileData.do
 *      → "소상공인시장진흥공단_상가(상권)정보" 항목
 *      → 최신 분기 ZIP 다운로드 (예: 소상공인시장진흥공단_상가(상권)정보_전체_2024Q3.zip)
 *      → 압축 해제 후 CSV 파일 (보통 서울.csv / 경기.csv 또는 전체.csv)
 *
 *  ※ 파일 크기: 서울 약 200MB, 경기 약 300MB (총 500MB+)
 *  ※ 인코딩: UTF-8 (간혹 EUC-KR인 경우 iconv -f euc-kr -t utf-8 원본.csv > 변환.csv 로 먼저 변환)
 *
 * ── 실행 ─────────────────────────────────────────────────────────────
 *
 *  node scripts/build-vibe.js <CSV파일경로> [CSV파일경로2 ...]
 *
 *  예시:
 *    node scripts/build-vibe.js ~/Downloads/서울.csv ~/Downloads/경기.csv
 *
 *  출력:
 *    data/districts.json 이 vibe/vibeScore/vibeNote 필드를 포함하도록 갱신됩니다.
 *    (기존 데이터는 덮어쓰기 전 data/districts.backup.json 으로 백업됩니다)
 *
 * ── CSV 컬럼 구조 (소상공인진흥공단 표준) ─────────────────────────────
 *
 *  상가업소번호 | 상호명 | 지점명 | 상권업종대분류코드 | 상권업종대분류명 |
 *  상권업종중분류코드 | 상권업종중분류명 | 상권업종소분류코드 | 상권업종소분류명 |
 *  표준산업분류코드 | 표준산업분류명 | 시도코드 | 시도명 | 시군구코드 | 시군구명 |
 *  행정동코드 | 행정동명 | 법정동코드 | 법정동명 | ...
 *
 * ── 분위기 점수 계산 방식 ─────────────────────────────────────────────
 *
 *  번화 업종 (lively proxy):
 *    음식, 소매, 여가/오락, 숙박  → 높을수록 활기찬 동네
 *
 *  생활 업종 (residential proxy):
 *    학문/교육, 의료/복지, 종교  → 높을수록 조용한 생활 동네
 *
 *  vibeScore = percentileRank(번화업종수 / 전체업종수) × 100
 *  vibe = 'lively' | 'balanced' | 'quiet'
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ── 설정 ─────────────────────────────────────────────────────────────

const DISTRICTS_PATH = path.join(__dirname, '../data/districts.json');
const BACKUP_PATH = path.join(__dirname, '../data/districts.backup.json');

// 번화 업종 대분류명 (정확히 포함 여부)
const LIVELY_CATEGORIES = new Set(['음식', '소매', '여가/오락', '숙박']);

// 생활 업종 대분류명
const RESIDENTIAL_CATEGORIES = new Set(['학문/교육', '의료/복지', '종교']);

// 분위기 분류 임계값 (percentile)
const LIVELY_THRESHOLD = 65;   // 상위 35% → lively
const QUIET_THRESHOLD = 35;    // 하위 35% → quiet

// ── CSV 컬럼 자동 감지 ─────────────────────────────────────────────────

function detectColumns(header) {
  const cols = header.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

  const find = (...candidates) => {
    for (const c of candidates) {
      const idx = cols.findIndex(h => h.includes(c));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const result = {
    sidoName:    find('시도명'),
    sigunguName: find('시군구명'),
    dongName:    find('행정동명'),
    categoryL:   find('상권업종대분류명'),  // 대분류명
  };

  const missing = Object.entries(result).filter(([, v]) => v === -1).map(([k]) => k);
  if (missing.length > 0) {
    console.error('필수 컬럼을 찾지 못했습니다:', missing.join(', '));
    console.error('실제 헤더:', cols.slice(0, 20).join(', '));
    process.exit(1);
  }

  return result;
}

// ── CSV 한 줄 파싱 (쌍따옴표 내부 쉼표 처리) ──────────────────────────

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── 시도명 정규화 (전체명 → 짧은명) ──────────────────────────────────

function normalizeSido(sidoName) {
  if (sidoName.startsWith('서울')) return '서울';
  if (sidoName.startsWith('경기')) return '경기';
  return sidoName;
}

// ── 행정동명 정규화 (공백 제거, 표준화) ──────────────────────────────

function normalizeDong(name) {
  return name.trim().replace(/\s+/g, '');
}

// ── CSV 파일 처리 ─────────────────────────────────────────────────────

async function processCsvFile(filePath, aggregator) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let lineNum = 0;
    let cols = null;
    let processedRows = 0;
    let skippedRows = 0;

    rl.on('line', (line) => {
      lineNum++;

      if (lineNum === 1) {
        // 헤더 처리
        // BOM 제거
        const cleanedLine = line.replace(/^﻿/, '');
        cols = detectColumns(cleanedLine);
        console.log(`  컬럼 감지 완료 (시도:${cols.sidoName}, 시군구:${cols.sigunguName}, 동:${cols.dongName}, 업종:${cols.categoryL})`);
        return;
      }

      if (lineNum % 200000 === 0) {
        process.stdout.write(`\r  진행: ${(lineNum / 10000).toFixed(0)}만 행 처리 중...`);
      }

      const cells = parseCsvLine(line);
      if (cells.length <= Math.max(cols.sidoName, cols.sigunguName, cols.dongName, cols.categoryL)) {
        skippedRows++;
        return;
      }

      const sido    = normalizeSido(cells[cols.sidoName]?.trim() ?? '');
      const sigungu = cells[cols.sigunguName]?.trim() ?? '';
      const dong    = normalizeDong(cells[cols.dongName] ?? '');
      const cat     = cells[cols.categoryL]?.trim() ?? '';

      if (!sido || !sigungu || !dong || !cat) {
        skippedRows++;
        return;
      }

      // 서울·경기만 처리
      if (sido !== '서울' && sido !== '경기') return;

      const key = `${sido}__${sigungu}__${dong}`;

      if (!aggregator.has(key)) {
        aggregator.set(key, { total: 0, lively: 0, residential: 0, sido, sigungu, dong });
      }
      const entry = aggregator.get(key);
      entry.total++;
      if (LIVELY_CATEGORIES.has(cat))       entry.lively++;
      if (RESIDENTIAL_CATEGORIES.has(cat)) entry.residential++;
      processedRows++;
    });

    rl.on('close', () => {
      console.log(`\n  완료: 유효 ${processedRows.toLocaleString()}행, 스킵 ${skippedRows.toLocaleString()}행`);
      resolve();
    });
    rl.on('error', reject);
    fileStream.on('error', reject);
  });
}

// ── 백분위 계산 ───────────────────────────────────────────────────────

function percentileRank(values, value) {
  const sorted = [...values].sort((a, b) => a - b);
  const below = sorted.filter(v => v < value).length;
  return Math.round((below / sorted.length) * 100);
}

// ── 메인 ─────────────────────────────────────────────────────────────

async function main() {
  const csvFiles = process.argv.slice(2);
  if (csvFiles.length === 0) {
    console.error('사용법: node scripts/build-vibe.js <CSV파일> [CSV파일2 ...]');
    console.error('예시:   node scripts/build-vibe.js ~/Downloads/서울.csv ~/Downloads/경기.csv');
    process.exit(1);
  }

  // 1. CSV 파일 존재 여부 확인
  for (const f of csvFiles) {
    if (!fs.existsSync(f)) {
      console.error(`파일을 찾을 수 없습니다: ${f}`);
      process.exit(1);
    }
  }

  // 2. districts.json 로드
  console.log('\n[1/4] districts.json 로드...');
  const districtData = JSON.parse(fs.readFileSync(DISTRICTS_PATH, 'utf8'));
  const districts = districtData.districts;
  console.log(`  행정동 ${districts.length}개 로드`);

  // 조회용 맵 생성: "sido__sigungu__dong" → district 인덱스
  const districtMap = new Map();
  for (let i = 0; i < districts.length; i++) {
    const d = districts[i];
    const key = `${d.siDo}__${d.siGunGu}__${normalizeDong(d.name)}`;
    districtMap.set(key, i);
  }

  // 3. CSV 집계
  console.log('\n[2/4] CSV 집계 시작...');
  const aggregator = new Map();

  for (const filePath of csvFiles) {
    console.log(`\n  파일: ${path.basename(filePath)}`);
    await processCsvFile(filePath, aggregator);
  }

  console.log(`\n  집계된 행정동: ${aggregator.size}개`);

  // 4. 번화 비율 계산 및 percentile rank
  console.log('\n[3/4] 분위기 점수 계산...');

  const livelyCounts = [];
  for (const [, entry] of aggregator) {
    if (entry.total > 0) {
      livelyCounts.push(entry.lively / entry.total);
    }
  }

  let matchCount = 0;
  let noMatchCount = 0;

  for (const [key, entry] of aggregator) {
    if (entry.total === 0) continue;

    const livelyratio = entry.lively / entry.total;
    const score = percentileRank(livelyCounts, livelyratio);

    const vibe = score >= LIVELY_THRESHOLD ? 'lively'
               : score <= QUIET_THRESHOLD  ? 'quiet'
               : 'balanced';

    const mainCat = entry.lively > entry.residential
      ? `번화업종 ${Math.round(livelyratio * 100)}%`
      : `생활업종 ${Math.round((entry.residential / entry.total) * 100)}%`;

    const vibeNote = `상가 ${entry.total}개소 기준, ${mainCat} (${score}백분위)`;

    const idx = districtMap.get(key);
    if (idx !== undefined) {
      districts[idx].vibe = vibe;
      districts[idx].vibeScore = score;
      districts[idx].vibeNote = vibeNote;
      matchCount++;
    } else {
      noMatchCount++;
    }
  }

  // 매칭되지 않은 동에 기본값 설정
  let defaultCount = 0;
  for (const d of districts) {
    if (!d.vibe) {
      d.vibe = 'balanced';
      d.vibeScore = 50;
      d.vibeNote = '상가 데이터 없음 — 기본값';
      defaultCount++;
    }
  }

  console.log(`  매칭 성공: ${matchCount}개`);
  console.log(`  매칭 실패 (CSV에 있으나 districts에 없음): ${noMatchCount}개`);
  console.log(`  기본값 처리 (데이터 없음): ${defaultCount}개`);

  // vibe 분포
  const vibeDist = { lively: 0, balanced: 0, quiet: 0 };
  for (const d of districts) vibeDist[d.vibe]++;
  console.log(`  분포: 활기 ${vibeDist.lively} / 균형 ${vibeDist.balanced} / 조용 ${vibeDist.quiet}`);

  // 5. 저장
  console.log('\n[4/4] 저장...');

  // 백업
  fs.copyFileSync(DISTRICTS_PATH, BACKUP_PATH);
  console.log(`  백업: ${BACKUP_PATH}`);

  // 저장
  fs.writeFileSync(DISTRICTS_PATH, JSON.stringify(districtData, null, 2), 'utf8');
  console.log(`  저장: ${DISTRICTS_PATH}`);

  console.log('\n✅ 완료!');
  console.log('   다음 단계: npm run dev 로 결과 확인');
}

main().catch(err => {
  console.error('\n오류:', err.message);
  process.exit(1);
});
