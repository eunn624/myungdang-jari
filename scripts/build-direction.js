#!/usr/bin/env node

/**
 * 행정동 방위 데이터 생성 스크립트
 *
 * districts.json의 각 행정동에 대해:
 * - lat, lng: 행정동 대표 좌표
 * - direction: 서울 시청 기준 8방위 (북/동북/동/동남/남/서남/서/서북)
 */

const fs = require('fs');
const path = require('path');

// 서울 시청 기준점 (37.5665, 126.9784)
const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.9784 };

// 시군구별 대표 좌표 (centroid 또는 주요 거점)
const SIGUNGU_COORDS = {
  // 서울
  '중구': { lat: 37.5640, lng: 126.9974 },
  '종로구': { lat: 37.5735, lng: 126.9910 },
  '용산구': { lat: 37.5406, lng: 126.9656 },
  '성동구': { lat: 37.5485, lng: 127.0379 },
  '광진구': { lat: 37.5388, lng: 127.0820 },
  '동대문구': { lat: 37.5713, lng: 127.0398 },
  '중랑구': { lat: 37.6061, lng: 127.0926 },
  '성북구': { lat: 37.5893, lng: 127.0165 },
  '강북구': { lat: 37.6403, lng: 127.0253 },
  '도봉구': { lat: 37.6663, lng: 127.0479 },
  '노원구': { lat: 37.6552, lng: 127.0776 },
  '은평구': { lat: 37.6024, lng: 126.9298 },
  '서대문구': { lat: 37.5787, lng: 126.9368 },
  '마포구': { lat: 37.5630, lng: 126.9016 },
  '양천구': { lat: 37.5169, lng: 126.8664 },
  '강서구': { lat: 37.5510, lng: 126.8247 },
  '구로구': { lat: 37.4954, lng: 126.8853 },
  '금천구': { lat: 37.4568, lng: 126.8954 },
  '영등포구': { lat: 37.5256, lng: 126.8984 },
  '동작구': { lat: 37.4959, lng: 126.9395 },
  '관악구': { lat: 37.4816, lng: 126.9545 },
  '서초구': { lat: 37.4845, lng: 127.0330 },
  '강남구': { lat: 37.4979, lng: 127.0276 },
  '송파구': { lat: 37.5147, lng: 127.1077 },

  // 경기
  '고양시': { lat: 37.6841, lng: 126.8346 },
  '파주시': { lat: 37.7597, lng: 126.7915 },
  '의정부시': { lat: 37.7389, lng: 127.0445 },
  '동두천시': { lat: 37.9026, lng: 127.0701 },
  '포천시': { lat: 37.8959, lng: 127.2097 },
  '연천군': { lat: 38.0995, lng: 127.0934 },
  '남양주시': { lat: 37.6396, lng: 127.1877 },
  '구리시': { lat: 37.5893, lng: 127.1247 },
  '하남시': { lat: 37.5397, lng: 127.2099 },
  '광주시': { lat: 37.4273, lng: 127.2055 },
  '양평군': { lat: 37.4886, lng: 127.4970 },
  '성남시': { lat: 37.4395, lng: 127.1371 },
  '용인시': { lat: 37.2397, lng: 127.1780 },
  '이천시': { lat: 37.2731, lng: 127.4449 },
  '여주시': { lat: 37.2844, lng: 127.6413 },
  '수원시': { lat: 37.2661, lng: 127.0093 },
  '화성시': { lat: 37.1978, lng: 126.8389 },
  '오산시': { lat: 37.1395, lng: 127.0762 },
  '평택시': { lat: 37.0067, lng: 127.1078 },
  '안성시': { lat: 36.7819, lng: 127.2902 },
  '안산시': { lat: 37.2808, lng: 126.8329 },
  '시흥시': { lat: 37.3842, lng: 126.8033 },
  '광명시': { lat: 37.4764, lng: 126.8678 },
  '부천시': { lat: 37.5032, lng: 126.7656 },
  '김포시': { lat: 37.6129, lng: 126.6892 },
};

/**
 * 두 좌표 간 방위각 계산 (라디안 → 도)
 * from → to 방향의 방위각 반환 (0° = 북, 90° = 동, 180° = 남, 270° = 서)
 */
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
  return (degrees + 360) % 360; // 0~360 범위
}

/**
 * 방위각 → 8방위 분류
 */
function bearingToDirection(degrees) {
  // 북쪽 중심 0°부터 시작, 각 방위마다 45°
  const normalized = (degrees + 22.5) % 360;
  const directions = ['북', '동북', '동', '동남', '남', '서남', '서', '서북'];
  const index = Math.floor(normalized / 45);
  return directions[index] || '북';
}

/**
 * 행정동 좌표 추정
 * siGunGu의 centroid + 동 이름 해시로 약간의 offset 추가
 */
function estimateDistrictCoord(siGunGu, name) {
  const base = SIGUNGU_COORDS[siGunGu] || { lat: 37.5665, lng: 126.9784 };

  // 동 이름의 자음 개수를 해시로 사용해서 offset 추가
  const hash = name
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const offsetLat = ((hash % 100) / 10000) * (name.includes('북') ? 1 : -1);
  const offsetLng = ((hash % 200) / 10000) * (name.includes('동') ? 1 : -1);

  return {
    lat: base.lat + offsetLat,
    lng: base.lng + offsetLng,
  };
}

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const outputPath = inputPath;

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const districts = data.districts || (Array.isArray(data) ? data : []);

  console.log(`📍 Processing ${districts.length} districts...`);

  let processedCount = 0;
  let skippedCount = 0;
  districts.forEach((d) => {
    if (!d.siGunGu || !d.name) return;

    // 좌표 확인: 기존 좌표가 있으면 사용, 없으면 추정
    let coord;
    if (d.lat && d.lng) {
      coord = { lat: d.lat, lng: d.lng };
      skippedCount++;
    } else {
      // 동 단위는 구 좌표에서 추정
      coord = estimateDistrictCoord(d.siGunGu, d.name);
      d.lat = parseFloat(coord.lat.toFixed(4));
      d.lng = parseFloat(coord.lng.toFixed(4));
    }

    // 방위 계산 (서울 시청 기준)
    const bearingDegrees = getBearingDegrees(SEOUL_CITY_HALL, coord);
    d.direction = bearingToDirection(bearingDegrees);

    processedCount++;
  });

  // 결과 저장
  const output = data._meta ? { _meta: data._meta, districts } : districts;
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`✅ Recalculated directions for ${processedCount} districts`);
  console.log(`   (${skippedCount} districts used existing coordinates)`);
  console.log(`📁 Saved to: ${outputPath}`);
}

main();
