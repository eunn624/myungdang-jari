#!/usr/bin/env node

/**
 * 전국 행정동 데이터 구축 스크립트
 *
 * 광역시/도의 주요 시/군/구 데이터를 districts.json에 추가
 * - 부산, 대구, 인천, 광주, 대전, 울산: 구 단위 (adminLevel: sgg)
 * - 강원, 전남, 전북, 경남, 경북, 제주: 시/군 단위 (adminLevel: si/gun)
 */

const fs = require('fs');
const path = require('path');

// 광역시 자치구
const METRO_DISTRICTS = [
  // 부산 (16개 구)
  { siDo: '부산', siGunGu: '중구', name: '중구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '서구', name: '서구', adminLevel: 'sgg', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '부산', siGunGu: '동구', name: '동구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '영도구', name: '영도구', adminLevel: 'sgg', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '부산', siGunGu: '부산진구', name: '부산진구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '동래구', name: '동래구', adminLevel: 'sgg', ohang: ['木'], terrain: 'green' },
  { siDo: '부산', siGunGu: '남구', name: '남구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '북구', name: '북구', adminLevel: 'sgg', ohang: ['水'], terrain: 'highland' },
  { siDo: '부산', siGunGu: '해운대구', name: '해운대구', adminLevel: 'sgg', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '부산', siGunGu: '사하구', name: '사하구', adminLevel: 'sgg', ohang: ['土'], terrain: 'waterfront' },
  { siDo: '부산', siGunGu: '금정구', name: '금정구', adminLevel: 'sgg', ohang: ['金'], terrain: 'highland' },
  { siDo: '부산', siGunGu: '강서구', name: '강서구', adminLevel: 'sgg', ohang: ['木'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '연제구', name: '연제구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '수영구', name: '수영구', adminLevel: 'sgg', ohang: ['水'], terrain: 'green' },
  { siDo: '부산', siGunGu: '사상구', name: '사상구', adminLevel: 'sgg', ohang: ['土'], terrain: 'flatland' },
  { siDo: '부산', siGunGu: '기장군', name: '기장군', adminLevel: 'sgg', ohang: ['水'], terrain: 'waterfront' },

  // 대구 (8개 구)
  { siDo: '대구', siGunGu: '중구', name: '중구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '대구', siGunGu: '동구', name: '동구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '대구', siGunGu: '서구', name: '서구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '대구', siGunGu: '남구', name: '남구', adminLevel: 'sgg', ohang: ['土'], terrain: 'flatland' },
  { siDo: '대구', siGunGu: '북구', name: '북구', adminLevel: 'sgg', ohang: ['木'], terrain: 'highland' },
  { siDo: '대구', siGunGu: '수성구', name: '수성구', adminLevel: 'sgg', ohang: ['水'], terrain: 'flatland' },
  { siDo: '대구', siGunGu: '달서구', name: '달서구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '대구', siGunGu: '달성군', name: '달성군', adminLevel: 'sgg', ohang: ['土'], terrain: 'green' },

  // 인천 (8개 구)
  { siDo: '인천', siGunGu: '중구', name: '중구', adminLevel: 'sgg', ohang: ['金'], terrain: 'waterfront' },
  { siDo: '인천', siGunGu: '동구', name: '동구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '인천', siGunGu: '미추홀구', name: '미추홀구', adminLevel: 'sgg', ohang: ['水'], terrain: 'flatland' },
  { siDo: '인천', siGunGu: '연수구', name: '연수구', adminLevel: 'sgg', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '인천', siGunGu: '남동구', name: '남동구', adminLevel: 'sgg', ohang: ['土'], terrain: 'flatland' },
  { siDo: '인천', siGunGu: '부평구', name: '부평구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '인천', siGunGu: '계양구', name: '계양구', adminLevel: 'sgg', ohang: ['木'], terrain: 'highland' },
  { siDo: '인천', siGunGu: '서구', name: '서구', adminLevel: 'sgg', ohang: ['金'], terrain: 'waterfront' },

  // 광주 (5개 구)
  { siDo: '광주', siGunGu: '동구', name: '동구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '광주', siGunGu: '서구', name: '서구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '광주', siGunGu: '남구', name: '남구', adminLevel: 'sgg', ohang: ['水'], terrain: 'green' },
  { siDo: '광주', siGunGu: '북구', name: '북구', adminLevel: 'sgg', ohang: ['木'], terrain: 'highland' },
  { siDo: '광주', siGunGu: '광산구', name: '광산구', adminLevel: 'sgg', ohang: ['土'], terrain: 'flatland' },

  // 대전 (5개 구)
  { siDo: '대전', siGunGu: '동구', name: '동구', adminLevel: 'sgg', ohang: ['火'], terrain: 'flatland' },
  { siDo: '대전', siGunGu: '중구', name: '중구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '대전', siGunGu: '서구', name: '서구', adminLevel: 'sgg', ohang: ['金'], terrain: 'flatland' },
  { siDo: '대전', siGunGu: '유성구', name: '유성구', adminLevel: 'sgg', ohang: ['水'], terrain: 'flatland' },
  { siDo: '대전', siGunGu: '대덕구', name: '대덕구', adminLevel: 'sgg', ohang: ['木'], terrain: 'green' },

  // 울산 (5개 구)
  { siDo: '울산', siGunGu: '중구', name: '중구', adminLevel: 'sgg', ohang: ['金'], terrain: 'waterfront' },
  { siDo: '울산', siGunGu: '남구', name: '남구', adminLevel: 'sgg', ohang: ['火'], terrain: 'waterfront' },
  { siDo: '울산', siGunGu: '동구', name: '동구', adminLevel: 'sgg', ohang: ['水'], terrain: 'flatland' },
  { siDo: '울산', siGunGu: '북구', name: '북구', adminLevel: 'sgg', ohang: ['木'], terrain: 'highland' },
  { siDo: '울산', siGunGu: '울주군', name: '울주군', adminLevel: 'sgg', ohang: ['土'], terrain: 'green' },
];

// 도 지역 (시/군)
const PROVINCE_AREAS = [
  // 강원 (예시)
  { siDo: '강원', siGunGu: '춘천시', name: '춘천시', adminLevel: 'si', ohang: ['木'], terrain: 'green' },
  { siDo: '강원', siGunGu: '강릉시', name: '강릉시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '강원', siGunGu: '원주시', name: '원주시', adminLevel: 'si', ohang: ['火'], terrain: 'flatland' },
  { siDo: '강원', siGunGu: '속초시', name: '속초시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '강원', siGunGu: '홍천군', name: '홍천군', adminLevel: 'gun', ohang: ['木'], terrain: 'green' },
  { siDo: '강원', siGunGu: '횡성군', name: '횡성군', adminLevel: 'gun', ohang: ['金'], terrain: 'highland' },
  { siDo: '강원', siGunGu: '평창군', name: '평창군', adminLevel: 'gun', ohang: ['土'], terrain: 'highland' },

  // 전남 (예시)
  { siDo: '전남', siGunGu: '목포시', name: '목포시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '전남', siGunGu: '여수시', name: '여수시', adminLevel: 'si', ohang: ['火'], terrain: 'waterfront' },
  { siDo: '전남', siGunGu: '순천시', name: '순천시', adminLevel: 'si', ohang: ['木'], terrain: 'green' },
  { siDo: '전남', siGunGu: '광양시', name: '광양시', adminLevel: 'si', ohang: ['火'], terrain: 'flatland' },
  { siDo: '전남', siGunGu: '담양군', name: '담양군', adminLevel: 'gun', ohang: ['木'], terrain: 'green' },
  { siDo: '전남', siGunGu: '함평군', name: '함평군', adminLevel: 'gun', ohang: ['土'], terrain: 'flatland' },

  // 전북 (예시)
  { siDo: '전북', siGunGu: '전주시', name: '전주시', adminLevel: 'si', ohang: ['火'], terrain: 'flatland' },
  { siDo: '전북', siGunGu: '군산시', name: '군산시', adminLevel: 'si', ohang: ['金'], terrain: 'waterfront' },
  { siDo: '전북', siGunGu: '익산시', name: '익산시', adminLevel: 'si', ohang: ['水'], terrain: 'flatland' },
  { siDo: '전북', siGunGu: '정읍시', name: '정읍시', adminLevel: 'si', ohang: ['木'], terrain: 'green' },
  { siDo: '전북', siGunGu: '남원시', name: '남원시', adminLevel: 'si', ohang: ['土'], terrain: 'highland' },
  { siDo: '전북', siGunGu: '완주군', name: '완주군', adminLevel: 'gun', ohang: ['木'], terrain: 'green' },

  // 경남 (예시)
  { siDo: '경남', siGunGu: '창원시', name: '창원시', adminLevel: 'si', ohang: ['火'], terrain: 'flatland' },
  { siDo: '경남', siGunGu: '김해시', name: '김해시', adminLevel: 'si', ohang: ['木'], terrain: 'flatland' },
  { siDo: '경남', siGunGu: '진주시', name: '진주시', adminLevel: 'si', ohang: ['水'], terrain: 'flatland' },
  { siDo: '경남', siGunGu: '통영시', name: '통영시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '경남', siGunGu: '거제시', name: '거제시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '경남', siGunGu: '합천군', name: '합천군', adminLevel: 'gun', ohang: ['土'], terrain: 'highland' },

  // 경북 (예시)
  { siDo: '경북', siGunGu: '포항시', name: '포항시', adminLevel: 'si', ohang: ['火'], terrain: 'waterfront' },
  { siDo: '경북', siGunGu: '경주시', name: '경주시', adminLevel: 'si', ohang: ['土'], terrain: 'flatland' },
  { siDo: '경북', siGunGu: '구미시', name: '구미시', adminLevel: 'si', ohang: ['火'], terrain: 'flatland' },
  { siDo: '경북', siGunGu: '영주시', name: '영주시', adminLevel: 'si', ohang: ['木'], terrain: 'green' },
  { siDo: '경북', siGunGu: '영천시', name: '영천시', adminLevel: 'si', ohang: ['金'], terrain: 'flatland' },
  { siDo: '경북', siGunGu: '예천군', name: '예천군', adminLevel: 'gun', ohang: ['水'], terrain: 'green' },

  // 제주
  { siDo: '제주', siGunGu: '제주시', name: '제주시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
  { siDo: '제주', siGunGu: '서귀포시', name: '서귀포시', adminLevel: 'si', ohang: ['水'], terrain: 'waterfront' },
];

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const districts = data.districts || [];

  console.log(`📍 기존 행정동: ${districts.length}개`);

  // 새 데이터 추가 (code 생성)
  const newDistricts = [...METRO_DISTRICTS, ...PROVINCE_AREAS].map((d, idx) => ({
    code: `${99000000 + idx}`,  // 임시 코드 (향후 행안부 정식 코드로 교체)
    ...d,
    hanja: '',
    ohangChars: d.ohang,
    ohang: d.ohang,
    terrainTags: [],
    terrainNote: `자동 생성: ${d.siDo} ${d.siGunGu}`,
    hanjaStatus: 'manual_review',
    manualNote: '전국 확장 데이터',
    vibe: 'balanced',
    vibeScore: 50,
    vibeNote: '기본값',
    adminLevel: d.adminLevel,
  }));

  districts.push(...newDistricts);

  const output = {
    _meta: {
      ...data._meta,
      description: data._meta.description + ' + 광역시/도 주요 지역',
      totalCount: districts.length,
    },
    districts,
  };

  fs.writeFileSync(inputPath, JSON.stringify(output, null, 2));
  console.log(`✅ 전국 데이터 추가 완료`);
  console.log(`📦 총 ${districts.length}개 행정동 (기존 ${districts.length - newDistricts.length} + 신규 ${newDistricts.length})`);
}

main();
