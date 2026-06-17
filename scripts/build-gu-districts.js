#!/usr/bin/env node

/**
 * 서울/경기 동 단위 → 구/시/군 단위 집계 스크립트
 *
 * 서울 427동 + 경기 604동 → siGunGu 기준 집계 (~72개)
 * 광역시/도 80개 레코드는 그대로 유지
 *
 * 집계 규칙:
 * - ohang: 구성 동의 오행 빈도 상위 2개
 * - terrain: 최빈 지형 (동률 시 waterfront > green > highland > flatland)
 * - terrainTags: 구성 동 terrainTags union
 * - vibe: 최빈, vibeScore: 평균 (반올림)
 * - lat/lng: 구성 동 좌표 centroid
 * - direction: centroid 기준 8방위 재계산
 * - adminLevel: 기존 레코드의 adminLevel 유지 (sgg/si/gun)
 * - 서울 구는 adminLevel='sgg'로 설정
 */

const fs = require('fs');
const path = require('path');

// 서울 시청 기준점
const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.9784 };

// 광역시/도 기준점 (방위 계산용)
const SIDO_CENTERS = {
  서울: { lat: 37.5665, lng: 126.9784 },
  경기: { lat: 37.5665, lng: 126.9784 }, // 경기도 → 서울 시청 기준 유지
  부산: { lat: 35.1796, lng: 129.0756 },
  대구: { lat: 35.8714, lng: 128.6014 },
  인천: { lat: 37.4563, lng: 126.7052 },
  광주: { lat: 35.1595, lng: 126.8526 },
  대전: { lat: 36.3504, lng: 127.3845 },
  울산: { lat: 35.5384, lng: 129.3114 },
  강원: { lat: 37.8228, lng: 128.1555 },
  전남: { lat: 34.8679, lng: 126.9910 },
  전북: { lat: 35.7175, lng: 127.1530 },
  경남: { lat: 35.4606, lng: 128.2132 },
  경북: { lat: 36.4919, lng: 128.8889 },
  제주: { lat: 33.4996, lng: 126.5312 },
};

const TERRAIN_PRIORITY = ['waterfront', 'green', 'highland', 'flatland'];

function getBearingDegrees(from, to) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lng1 = (from.lng * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lng2 = (to.lng * Math.PI) / 180;
  const dLng = lng2 - lng1;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = Math.atan2(y, x);
  const degrees = (bearing * 180) / Math.PI;
  return (degrees + 360) % 360;
}

function bearingToDirection(degrees) {
  const normalized = (degrees + 22.5) % 360;
  const directions = ['북', '동북', '동', '동남', '남', '서남', '서', '서북'];
  return directions[Math.floor(normalized / 45)] || '북';
}

function getMostFrequent(arr, tiebreaker) {
  const freq = {};
  arr.forEach((v) => { if (v != null) freq[v] = (freq[v] || 0) + 1; });
  const sorted = Object.entries(freq).sort(([a, ca], [b, cb]) => {
    if (cb !== ca) return cb - ca;
    if (tiebreaker) {
      return tiebreaker.indexOf(a) - tiebreaker.indexOf(b);
    }
    return 0;
  });
  return sorted.length > 0 ? sorted[0][0] : null;
}

function getTopOhang(dongs, n = 2) {
  const freq = {};
  dongs.forEach((d) => {
    (d.ohang || []).forEach((o) => { freq[o] = (freq[o] || 0) + 1; });
  });
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([o]) => o);
}

function aggregateDongs(siDo, siGunGu, dongs) {
  // 좌표 centroid
  const validCoords = dongs.filter((d) => d.lat != null && d.lng != null);
  const lat =
    validCoords.length > 0
      ? parseFloat((validCoords.reduce((s, d) => s + d.lat, 0) / validCoords.length).toFixed(4))
      : null;
  const lng =
    validCoords.length > 0
      ? parseFloat((validCoords.reduce((s, d) => s + d.lng, 0) / validCoords.length).toFixed(4))
      : null;

  // 방위 계산
  const center = SIDO_CENTERS[siDo] || SEOUL_CITY_HALL;
  const direction =
    lat != null && lng != null
      ? bearingToDirection(getBearingDegrees(center, { lat, lng }))
      : null;

  // 오행 집계 (빈도 상위 2개)
  const ohang = getTopOhang(dongs, 2);

  // 지형 집계
  const terrain = getMostFrequent(
    dongs.map((d) => d.terrain),
    TERRAIN_PRIORITY
  ) || 'flatland';

  // terrainTags union
  const tagsSet = new Set();
  dongs.forEach((d) => (d.terrainTags || []).forEach((t) => tagsSet.add(t)));
  const terrainTags = Array.from(tagsSet);

  // vibe 집계
  const vibe = getMostFrequent(dongs.map((d) => d.vibe)) || 'balanced';
  const vibeScores = dongs.map((d) => d.vibeScore).filter((v) => v != null);
  const vibeScore =
    vibeScores.length > 0
      ? Math.round(vibeScores.reduce((s, v) => s + v, 0) / vibeScores.length)
      : 60;

  // adminLevel: 서울은 sgg, 경기는 기존 값 사용
  const adminLevel =
    siDo === '서울' ? 'sgg' : (dongs[0]?.adminLevel || 'sgg');

  // sampleDongs: vibeScore 상위 3개
  const sampleDongs = [...dongs]
    .sort((a, b) => (b.vibeScore || 0) - (a.vibeScore || 0))
    .slice(0, 3)
    .map((d) => d.name);

  // 대표 code: 구성 동 중 첫 번째 code 앞 6자리 + '000000' (시군구 코드 기반)
  const baseCode = dongs[0]?.code?.slice(0, 5) || '00000';
  const code = baseCode + '000000';

  return {
    code,
    name: siGunGu,
    hanja: '',
    siDo,
    siGunGu,
    ohangChars: [],
    ohang,
    terrain,
    terrainTags: terrainTags.length > 0 ? terrainTags : undefined,
    terrainNote: `${siGunGu} 구성 동 집계 (${dongs.length}개 동 기준)`,
    hanjaStatus: 'manual_review',
    manualNote: `구 단위 집계본. 구성 동 ${dongs.length}개 집계.`,
    vibe,
    vibeScore,
    lat,
    lng,
    direction,
    adminLevel,
    dongCount: dongs.length,
    sampleDongs,
  };
}

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const backupPath = path.join(__dirname, '..', 'data', 'districts-dong.json');
  const outputPath = inputPath;

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  // 소스 결정: 원본 동 단위 백업이 있으면 그것을 소스로 사용(재실행 안전/멱등)
  let raw;
  if (fs.existsSync(backupPath)) {
    raw = fs.readFileSync(backupPath, 'utf8');
    console.log(`📦 Using backup as source: ${backupPath}`);
  } else {
    raw = fs.readFileSync(inputPath, 'utf8');
    fs.writeFileSync(backupPath, raw);
    console.log(`📦 Backed up original to: ${backupPath}`);
  }
  const data = JSON.parse(raw);
  const districts = data.districts || (Array.isArray(data) ? data : []);

  // 서울/경기 동 단위 레코드 → 구 단위 집계
  const seoulGyeonggi = districts.filter(
    (d) => d.siDo === '서울' || d.siDo === '경기'
  );
  const others = districts.filter(
    (d) => d.siDo !== '서울' && d.siDo !== '경기'
  );

  console.log(`📊 Input: ${districts.length} records`);
  console.log(`   서울/경기: ${seoulGyeonggi.length}, 기타: ${others.length}`);

  // siDo + siGunGu 기준으로 그룹화
  const groups = {};
  seoulGyeonggi.forEach((d) => {
    const key = `${d.siDo}::${d.siGunGu}`;
    if (!groups[key]) groups[key] = { siDo: d.siDo, siGunGu: d.siGunGu, dongs: [] };
    groups[key].dongs.push(d);
  });

  const aggregated = Object.values(groups).map(({ siDo, siGunGu, dongs }) =>
    aggregateDongs(siDo, siGunGu, dongs)
  );

  // 광역시/도 레코드: 방위를 "자기 시도 중심" 기준으로 재계산
  // (원본은 전부 서울 시청 기준이라 같은 시도 내 구들이 동일 방위가 되는 버그)
  let redirected = 0;
  others.forEach((d) => {
    const center = SIDO_CENTERS[d.siDo];
    if (center && d.lat != null && d.lng != null) {
      const before = d.direction;
      d.direction = bearingToDirection(
        getBearingDegrees(center, { lat: d.lat, lng: d.lng })
      );
      if (before !== d.direction) redirected++;
    }
  });
  console.log(`🧭 광역시/도 방위 재계산: ${redirected}개 변경`);

  const result = [...aggregated, ...others];

  const meta = {
    ...data._meta,
    description: '구/시/군 단위 지역 DB — 서울 25구 + 경기 47구/시/군 + 광역시/도 80개',
    version: '3.0.0-gu-level',
    scope: '서울 구 단위 + 경기 구/시/군 단위 + 전국 광역시/도 주요 지역',
    totalCount: result.length,
    seoulCount: aggregated.filter((d) => d.siDo === '서울').length,
    gyeonggiCount: aggregated.filter((d) => d.siDo === '경기').length,
    otherCount: others.length,
    sourceNote: `서울/경기는 기존 ${seoulGyeonggi.length}개 동 단위를 구/시/군으로 집계. 원본은 districts-dong.json 참조.`,
  };

  const output = { _meta: meta, districts: result };
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`✅ Aggregated: ${seoulGyeonggi.length} dongs → ${aggregated.length} gu/si/gun records`);
  console.log(`   서울: ${aggregated.filter((d) => d.siDo === '서울').length}개 구`);
  console.log(`   경기: ${aggregated.filter((d) => d.siDo === '경기').length}개 구/시/군`);
  console.log(`   기타: ${others.length}개 (유지)`);
  console.log(`   총계: ${result.length}개`);
  console.log(`📁 Saved to: ${outputPath}`);
}

main();
