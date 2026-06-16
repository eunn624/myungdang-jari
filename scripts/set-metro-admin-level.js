#!/usr/bin/env node

/**
 * 수도권 행정단위 레벨 설정
 * 
 * - 서울: emd (동 단위)
 * - 경기 도시/구: sgg, 군 지역: gun
 */

const fs = require('fs');
const path = require('path');

// 경기 군 지역 (gun)
const GYEONGGI_GUN = new Set([
  '가평군', '양평군', '연천군', '여주시',  // 여주는 2013년 시 승격하지만 행정상 sgg 취급
]);

function main() {
  const inputPath = path.join(__dirname, '..', 'data', 'districts.json');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const districts = data.districts || [];

  let updatedSeoul = 0;
  let updatedGyeonggiSgg = 0;
  let updatedGyeonggiGun = 0;

  districts.forEach((d) => {
    if (d.adminLevel) return; // 기존 adminLevel 유지

    if (d.siDo === '서울') {
      d.adminLevel = 'emd';
      updatedSeoul++;
    } else if (d.siDo === '경기') {
      if (GYEONGGI_GUN.has(d.siGunGu)) {
        d.adminLevel = 'gun';
        updatedGyeonggiGun++;
      } else {
        d.adminLevel = 'sgg';
        updatedGyeonggiSgg++;
      }
    }
  });

  const output = {
    _meta: data._meta,
    districts,
  };

  fs.writeFileSync(inputPath, JSON.stringify(output, null, 2));
  console.log(`✅ 수도권 adminLevel 설정 완료`);
  console.log(`   - 서울 (emd): ${updatedSeoul}개`);
  console.log(`   - 경기 (sgg): ${updatedGyeonggiSgg}개`);
  console.log(`   - 경기 (gun): ${updatedGyeonggiGun}개`);
}

main();
