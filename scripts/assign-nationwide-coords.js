#!/usr/bin/env node

/**
 * 전국 좌표 할당 스크립트
 *
 * adminLevel이 sgg/si/gun인 지역에 대해 시도별/시군구별 centroid 좌표 추가
 */

const fs = require('fs');
const path = require('path');

// 시도별 대표 좌표 (centroid)
const SIDO_COORDS = {
  '부산': { lat: 35.1796, lng: 129.0756 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '인천': { lat: 37.2557, lng: 126.8354 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '울산': { lat: 35.5394, lng: 129.3114 },
  '강원': { lat: 37.7510, lng: 128.8761 },
  '전남': { lat: 34.8160, lng: 126.4627 },
  '전북': { lat: 35.7175, lng: 127.1540 },
  '경남': { lat: 35.2374, lng: 128.6923 },
  '경북': { lat: 36.4919, lng: 129.1075 },
  '제주': { lat: 33.5033, lng: 126.5312 },
};

// 시군구별 더 정교한 좌표 (선택사항)
const SIGUNGU_COORDS = {
  // 부산
  '부산_중구': { lat: 35.0977, lng: 129.0310 },
  '부산_서구': { lat: 35.1169, lng: 129.0098 },
  '부산_동구': { lat: 35.1305, lng: 129.0723 },
  '부산_영도구': { lat: 35.0790, lng: 128.9888 },
  '부산_부산진구': { lat: 35.1604, lng: 129.0703 },
  '부산_동래구': { lat: 35.1916, lng: 129.0866 },
  '부산_남구': { lat: 35.1496, lng: 129.1007 },
  '부산_북구': { lat: 35.2258, lng: 129.0407 },
  '부산_해운대구': { lat: 35.1676, lng: 129.1603 },
  '부산_사하구': { lat: 35.0926, lng: 128.9810 },
  '부산_금정구': { lat: 35.2689, lng: 129.1162 },
  '부산_강서구': { lat: 35.2292, lng: 128.8834 },
  '부산_연제구': { lat: 35.2048, lng: 129.1249 },
  '부산_수영구': { lat: 35.1789, lng: 129.1231 },
  '부산_사상구': { lat: 35.1382, lng: 128.9405 },
  '부산_기장군': { lat: 35.2597, lng: 129.2147 },

  // 대구
  '대구_중구': { lat: 35.8719, lng: 128.5957 },
  '대구_동구': { lat: 35.8881, lng: 128.6336 },
  '대구_서구': { lat: 35.8742, lng: 128.5694 },
  '대구_남구': { lat: 35.8472, lng: 128.5954 },
  '대구_북구': { lat: 35.8998, lng: 128.5812 },
  '대구_수성구': { lat: 35.8469, lng: 128.6409 },
  '대구_달서구': { lat: 35.8312, lng: 128.5421 },
  '대구_달성군': { lat: 35.7689, lng: 128.4523 },

  // 인천
  '인천_중구': { lat: 37.2764, lng: 126.6348 },
  '인천_동구': { lat: 37.2442, lng: 126.6787 },
  '인천_미추홀구': { lat: 37.2674, lng: 126.6347 },
  '인천_연수구': { lat: 37.3833, lng: 126.7638 },
  '인천_남동구': { lat: 37.3946, lng: 126.7191 },
  '인천_부평구': { lat: 37.4889, lng: 126.7267 },
  '인천_계양구': { lat: 37.5444, lng: 126.6688 },
  '인천_서구': { lat: 37.3604, lng: 126.6048 },
};

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const districts = data.districts || [];

  let updatedCount = 0;

  districts.forEach((d) => {
    // 기존 좌표가 있으면 유지 (수도권)
    if (d.lat && d.lng) return;

    // 시군구 레벨 좌표 확인
    const key = `${d.siDo}_${d.siGunGu}`;
    if (SIGUNGU_COORDS[key]) {
      const coord = SIGUNGU_COORDS[key];
      d.lat = parseFloat(coord.lat.toFixed(4));
      d.lng = parseFloat(coord.lng.toFixed(4));
      updatedCount++;
      return;
    }

    // 시도 레벨 좌표 사용
    if (SIDO_COORDS[d.siDo]) {
      const coord = SIDO_COORDS[d.siDo];
      d.lat = parseFloat(coord.lat.toFixed(4));
      d.lng = parseFloat(coord.lng.toFixed(4));
      updatedCount++;
    }
  });

  const output = {
    _meta: data._meta,
    districts,
  };

  fs.writeFileSync(inputPath, JSON.stringify(output, null, 2));
  console.log(`✅ 전국 좌표 할당 완료: ${updatedCount}개 지역`);
}

main();
