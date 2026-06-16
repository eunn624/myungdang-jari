#!/usr/bin/env node

/**
 * 수도권(서울·경기) 행정동 오행 할당 스크립트
 *
 * 행정동 이름의 한자 또는 지명 특성으로 오행 추정
 * 예: 강남(水), 산(木), 해운대(水) 등
 */

const fs = require('fs');
const path = require('path');

// 지명·특성별 오행 매핑
const NAME_OHANG_MAP = {
  // 木: 숲, 나무, 산, 동쪽 지역
  wood: {
    patterns: ['강북', '도봉', '노원', '남양주', '양주', '홍천', '원주', '춘천', '영주', '숲', '산', '동'],
    chars: ['林', '松', '竹', '柳', '樹', '木', '杉', '栗', '榕'],
  },
  // 火: 남쪽, 밝음, 열정
  fire: {
    patterns: ['영등포', '동작', '강남', '송파', '서초', '관악', '광진', '성동', '종로', '중구', '남', '광', '등'],
    chars: ['火', '丙', '丁', '光', '南'],
  },
  // 土: 중앙, 안정, 산업
  earth: {
    patterns: ['구로', '금천', '영등포', '부천', '안산', '안양', '용인', '수원', '화성', '평택', '산업', '공단'],
    chars: ['土', '城', '埴', '坤'],
  },
  // 金: 서쪽, 귀금속, 금융
  metal: {
    patterns: ['강서', '마포', '서대문', '은평', '종로', '중구', '영등포', '여의', '금융', '서', '금'],
    chars: ['金', '銀', '鐵', '庚', '辛', '西'],
  },
  // 水: 북쪽, 물, 해변, 강변
  water: {
    patterns: ['강변', '청담', '강일', '암사', '부산', '해운', '인천', '해변', '강', '수', '북', '해'],
    chars: ['水', '川', '江', '汐', '壬', '癸'],
  },
};

// 오행 배열로 변환
const OHANG_KEYS = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

function inferOhangFromName(name, hanja) {
  let matches = {};

  // 1. 한자에서 패턴 매칭
  for (const [ohang, data] of Object.entries(NAME_OHANG_MAP)) {
    if (hanja && data.chars.some(char => hanja.includes(char))) {
      matches[ohang] = (matches[ohang] || 0) + 3;
    }
  }

  // 2. 이름의 키워드 패턴 매칭
  for (const [ohang, data] of Object.entries(NAME_OHANG_MAP)) {
    if (data.patterns.some(pattern => name.includes(pattern))) {
      matches[ohang] = (matches[ohang] || 0) + 1;
    }
  }

  // 점수가 가장 높은 오행 반환 (최대 1-2개)
  const sorted = Object.entries(matches)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([ohang]) => OHANG_KEYS[ohang]);

  return sorted;
}

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const districts = data.districts || [];

  let assignedCount = 0;
  let skippedCount = 0;

  districts.forEach((d) => {
    // 이미 오행이 있으면 유지
    if (d.ohang && d.ohang.length > 0) {
      skippedCount++;
      return;
    }

    // 수도권만 처리
    if (!['서울', '경기'].includes(d.siDo)) {
      return;
    }

    const inferred = inferOhangFromName(d.name, d.hanja);
    if (inferred.length > 0) {
      d.ohang = inferred;
      assignedCount++;
    }
  });

  const output = {
    _meta: data._meta,
    districts,
  };

  fs.writeFileSync(inputPath, JSON.stringify(output, null, 2));
  console.log(`✅ 수도권 오행 할당 완료`);
  console.log(`   - 신규 할당: ${assignedCount}개`);
  console.log(`   - 기존 유지: ${skippedCount}개`);
}

main();
