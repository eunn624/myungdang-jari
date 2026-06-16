#!/usr/bin/env node

/**
 * 전국 지역별 지형 데이터 개선 스크립트
 *
 * 부산, 대구, 인천 등 광역시/도 지역의 지형을 
 * 실제 지리·생활 특성에 맞게 정제
 */

const fs = require('fs');
const path = require('path');

// 지역별 지형 정보 (광역시/도 단위 지역만 업데이트)
const REGION_TERRAIN_MAP = {
  // 부산: 해운대·기장은 waterfront, 금정·강서는 highland, 나머지 flatland
  '부산': {
    '중구': 'flatland',
    '서구': 'waterfront',
    '동구': 'flatland',
    '영도구': 'waterfront',
    '부산진구': 'flatland',
    '동래구': 'green',
    '남구': 'flatland',
    '북구': 'highland',
    '해운대구': 'waterfront',
    '사하구': 'waterfront',
    '금정구': 'highland',
    '강서구': 'green',
    '연제구': 'flatland',
    '수영구': 'green',
    '사상구': 'flatland',
    '기장군': 'waterfront',
  },
  
  // 대구: 달성·달서는 flatland, 북구는 highland
  '대구': {
    '중구': 'flatland',
    '동구': 'flatland',
    '서구': 'flatland',
    '남구': 'flatland',
    '북구': 'highland',
    '수성구': 'flatland',
    '달서구': 'flatland',
    '달성군': 'green',
  },
  
  // 인천: 중구·미추홀은 waterfront, 계양은 highland, 나머지 flatland
  '인천': {
    '중구': 'waterfront',
    '동구': 'flatland',
    '미추홀구': 'waterfront',
    '연수구': 'waterfront',
    '남동구': 'flatland',
    '부평구': 'flatland',
    '계양구': 'highland',
    '서구': 'waterfront',
  },
  
  // 광주: 전형적 광주권 주거·상업지역
  '광주': {
    '동구': 'flatland',
    '서구': 'flatland',
    '남구': 'green',
    '북구': 'highland',
    '광산구': 'flatland',
  },
  
  // 대전: 유성구는 과학도시, 중앙·북부는 flatland
  '대전': {
    '동구': 'flatland',
    '중구': 'flatland',
    '서구': 'flatland',
    '유성구': 'flatland',
    '대덕구': 'green',
  },
  
  // 울산: 중구·남구는 waterfront(공업항), 북구·동구는 flatland
  '울산': {
    '중구': 'waterfront',
    '남구': 'waterfront',
    '동구': 'flatland',
    '북구': 'highland',
    '울주군': 'green',
  },
  
  // 강원: 춘천·강릉·원주는 green, 속초는 waterfront, 산지는 highland
  '강원': {
    '춘천시': 'green',
    '강릉시': 'waterfront',
    '원주시': 'green',
    '속초시': 'waterfront',
    '홍천군': 'green',
    '횡성군': 'highland',
    '평창군': 'highland',
  },
  
  // 전남: 목포·여수·순천 waterfront, 광양은 flatland, 산지는 green
  '전남': {
    '목포시': 'waterfront',
    '여수시': 'waterfront',
    '순천시': 'green',
    '광양시': 'flatland',
    '담양군': 'green',
    '함평군': 'flatland',
  },
  
  // 전북: 전주·군산는 flatland, 익산·정읍는 flatland, 남원·완주는 green
  '전북': {
    '전주시': 'flatland',
    '군산시': 'waterfront',
    '익산시': 'flatland',
    '정읍시': 'green',
    '남원시': 'highland',
    '완주군': 'green',
  },
  
  // 경남: 창원·김해는 flatland, 통영·거제는 waterfront, 진주는 flatland, 합천은 highland
  '경남': {
    '창원시': 'flatland',
    '김해시': 'flatland',
    '진주시': 'flatland',
    '통영시': 'waterfront',
    '거제시': 'waterfront',
    '합천군': 'highland',
  },
  
  // 경북: 포항·통영은 waterfront, 경주·구미·영주는 flatland, 산지는 green
  '경북': {
    '포항시': 'waterfront',
    '경주시': 'flatland',
    '구미시': 'flatland',
    '영주시': 'green',
    '영천시': 'flatland',
    '예천군': 'green',
  },
  
  // 제주: 모두 waterfront (해안 관광지)
  '제주': {
    '제주시': 'waterfront',
    '서귀포시': 'waterfront',
  },
};

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const districts = data.districts || [];

  console.log(`🗺️  Processing terrain for nationwide districts...`);
  
  let updatedCount = 0;
  districts.forEach((d) => {
    // 광역시·도 지역만 업데이트 (adminLevel: sgg, si, gun)
    if (!['sgg', 'si', 'gun'].includes(d.adminLevel)) return;
    
    // 시도별 맵에서 해당 지역 찾기
    const regionMap = REGION_TERRAIN_MAP[d.siDo];
    if (!regionMap) return;
    
    const newTerrain = regionMap[d.siGunGu];
    if (!newTerrain) return;
    
    // 기존 지형과 다르면 업데이트
    if (d.terrain !== newTerrain) {
      d.terrain = newTerrain;
      updatedCount++;
    }
  });

  const output = {
    _meta: data._meta,
    districts,
  };

  fs.writeFileSync(inputPath, JSON.stringify(output, null, 2));
  console.log(`✅ Updated terrain for ${updatedCount} nationwide districts`);
}

main();
