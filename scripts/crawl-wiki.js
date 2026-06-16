#!/usr/bin/env node

/**
 * 나무위키 행정동 정보 크롤링 스크립트
 *
 * 서울·경기 행정동의 나무위키 페이지에서:
 * - 소개 문단 추출
 * - 특징·키워드 추출
 * - data/neighborhood-desc.json 저장
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 주요 행정동 목록 (서울 25개 + 경기 주요 15개)
const DISTRICTS_TO_CRAWL = [
  // 서울
  '강남구', '강북구', '강서구', '관악구', '광진구',
  '구로구', '금천구', '노원구', '도봉구', '동대문구',
  '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구',
  '은평구', '종로구', '중구', '중랑구',
  // 경기
  '고양시', '성남시', '수원시', '용인시', '부천시',
  '안산시', '안양시', '남양주시', '하남시', '화성시',
  '김포시', '파주시', '이천시', '평택시', '광주시',
];

/**
 * 나무위키 페이지 가져오기
 */
function fetchWikiPage(districtName) {
  return new Promise((resolve, reject) => {
    const encodedName = encodeURIComponent(districtName);
    const url = `https://namu.wiki/w/${encodedName}`;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * HTML에서 주요 정보 추출
 */
function extractInfo(html, districtName) {
  const desc = { name: districtName, keywords: [], summary: '' };

  // 1. 첫 단락 추출 (소개 텍스트)
  const firstParaMatch = html.match(
    /<div[^>]*class="wiki-paragraph"[^>]*>[\s\S]*?<\/div>/
  );
  if (firstParaMatch) {
    let text = firstParaMatch[0]
      .replace(/<[^>]+>/g, ' ')  // HTML 태그 제거
      .replace(/&nbsp;/g, ' ')
      .trim();
    // 최대 200자
    desc.summary = text.substring(0, 200).trim();
  }

  // 2. 특징 키워드 추출 (제목 및 강조 텍스트)
  const headingMatches = html.match(/<h[2-4][^>]*>([^<]+)<\/h[2-4]>/g);
  if (headingMatches) {
    const keywords = new Set();
    headingMatches.forEach((match) => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length < 30 && text.length > 2) {
        keywords.add(text);
      }
    });
    desc.keywords = Array.from(keywords).slice(0, 5);
  }

  // 3. 주소 정보 추출 (편의)
  if (html.includes('강남') && districtName.includes('강남')) {
    desc.keywords.push('강남');
  }
  if (html.includes('도심') || html.includes('시내')) {
    desc.keywords.push('도시');
  }
  if (html.includes('주거')) {
    desc.keywords.push('주거');
  }
  if (html.includes('상권')) {
    desc.keywords.push('상권');
  }
  if (html.includes('녹지') || html.includes('공원')) {
    desc.keywords.push('녹지');
  }

  return desc;
}

/**
 * 모든 행정동 크롤링
 */
async function crawlAll() {
  const results = {};
  let successCount = 0;
  let failCount = 0;

  console.log(`📚 ${DISTRICTS_TO_CRAWL.length}개 행정동 크롤링 시작...\n`);

  for (const district of DISTRICTS_TO_CRAWL) {
    try {
      console.log(`⏳ ${district}...`);
      const html = await fetchWikiPage(district);
      const info = extractInfo(html, district);
      results[district] = info;
      successCount++;
      console.log(`✅ ${district} — ${info.summary.substring(0, 40)}...`);
    } catch (err) {
      failCount++;
      console.log(`❌ ${district} — ${err.message}`);
      // fallback: 최소 데이터
      results[district] = {
        name: district,
        keywords: ['서울', '경기'].includes(district.slice(-2)) ? ['주거'] : [],
        summary: `${district} 지역 정보`,
      };
    }
    // Rate limiting: 500ms 대기
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n📊 결과: 성공 ${successCount}, 실패 ${failCount}`);
  return results;
}

/**
 * JSON 저장
 */
function saveJSON(data) {
  const outputPath = path.join(__dirname, '..', 'data', 'neighborhood-desc.json');
  const output = {
    _meta: {
      description: '행정동별 나무위키 크롤링 정보',
      source: 'namu.wiki',
      timestamp: new Date().toISOString(),
      totalCount: Object.keys(data).length,
    },
    descriptions: data,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✅ 저장 완료: ${outputPath}`);
  console.log(`📦 ${Object.keys(data).length}개 항목 저장됨`);
}

/**
 * 메인
 */
(async () => {
  try {
    const data = await crawlAll();
    saveJSON(data);
  } catch (err) {
    console.error('❌ 크롤링 실패:', err);
    process.exit(1);
  }
})();
