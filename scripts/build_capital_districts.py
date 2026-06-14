#!/usr/bin/env python3
from __future__ import annotations

import csv
import io
import json
import re
import subprocess
from collections import Counter
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

import requests


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "districts.json"
SEED_COMMIT = "dc17e97"

MOIS_LOCATIONS_URL = "https://jumin.mois.go.kr/selectHangkikcdListAjax.do"
MOIS_CSV_URL = "https://jumin.mois.go.kr/downloadCsvAge.do?searchYearMonth=month&xlsStats=1"
TARGET_YEAR = "2026"
TARGET_MONTH = "05"

SIDO_CODE_MAP = {
    "서울특별시": "1100000000",
    "경기도": "4100000000",
}

TERRAIN_LABELS = {
    "highland": "고지대",
    "waterfront": "수변",
    "flatland": "평지",
    "green": "녹지",
}

OHANG_BY_HANGUL = {
    "강": "水", "천": "水", "호": "水", "수": "水",
    "산": "土", "봉": "土", "곡": "土", "현": "土", "암": "土", "덕": "土",
    "숲": "木", "림": "木", "목": "木", "화": "木", "송": "木", "죽": "木", "녹": "木",
    "광": "火", "명": "火", "남": "火", "양": "火", "일": "火", "해": "火",
    "금": "金", "은": "金", "철": "金", "백": "金", "옥": "金", "서": "金",
}

TERRAIN_KEYWORDS = {
    "waterfront": ["강", "천", "호", "수변", "나루", "항", "포구", "습지", "저수지"],
    "highland": ["산", "봉", "곡", "현", "암", "고개", "구릉", "언덕", "고지"],
    "green": ["숲", "림", "목", "화", "송", "죽", "녹", "공원"],
}

NAME_RULES = [
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^개포\d?동$", "terrain": "flatland", "terrainTags": ["green"]},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^논현\d?동$", "terrain": "flatland"},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^대치\d?동$", "terrain": "flatland"},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^삼성\d?동$", "terrain": "flatland"},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^역삼\d?동$", "terrain": "flatland"},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^도곡\d?동$", "terrain": "flatland", "terrainTags": ["green"]},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^수서동$", "terrain": "flatland", "terrainTags": ["waterfront"]},
    {"siDo": "서울", "siGunGu": "강남구", "pattern": r"^세곡동$", "terrain": "green", "terrainTags": ["highland"]},
    {"siDo": "서울", "siGunGu": "노원구", "pattern": r"^공릉\d?동$", "terrain": "green", "terrainTags": ["flatland"]},
    {"siDo": "서울", "siGunGu": "노원구", "pattern": r"^중계", "terrain": "flatland"},
    {"siDo": "서울", "siGunGu": "노원구", "pattern": r"^하계", "terrain": "flatland", "terrainTags": ["green"]},
    {"siDo": "경기", "siGunGu": "성남시 분당구", "pattern": r"^정자\d?동$", "terrain": "flatland", "terrainTags": ["waterfront"]},
    {"siDo": "경기", "siGunGu": "성남시 분당구", "pattern": r"^서현동$", "terrain": "flatland"},
    {"siDo": "경기", "siGunGu": "성남시 분당구", "pattern": r"^수내동$", "terrain": "flatland", "terrainTags": ["waterfront"]},
    {"siDo": "경기", "siGunGu": "성남시 분당구", "pattern": r"^야탑동$", "terrain": "flatland"},
    {"siDo": "경기", "siGunGu": "성남시 분당구", "pattern": r"^구미\d?동$", "terrain": "green", "terrainTags": ["waterfront"]},
    {"siDo": "경기", "siGunGu": "하남시", "pattern": r"^미사\d?동$", "terrain": "waterfront", "terrainTags": ["flatland"]},
    {"siDo": "경기", "siGunGu": "남양주시", "pattern": r"^다산\d?동$", "terrain": "waterfront", "terrainTags": ["flatland"]},
    {"siDo": "경기", "siGunGu": "김포시", "pattern": r"^구래동$", "terrain": "flatland"},
    {"siDo": "경기", "siGunGu": "용인시 수지구", "pattern": r"^풍덕천동$", "terrain": "waterfront", "terrainTags": ["flatland"]},
]


def normalize_name(name: str) -> str:
    normalized = name
    normalized = re.sub(r"제?\d+(\.\d+)?동$", "동", normalized)
    normalized = re.sub(r"\d+동$", "동", normalized)
    normalized = re.sub(r"제?\d+가동$", "가동", normalized)
    normalized = re.sub(r"본동$", "동", normalized)
    return normalized


def load_seed_overrides() -> Tuple[Dict[Tuple[str, str, str], dict], Dict[Tuple[str, str, str], dict]]:
    raw = subprocess.check_output(
        ["git", "show", f"{SEED_COMMIT}:data/districts.json"],
        cwd=ROOT,
        text=True,
    )
    payload = json.loads(raw)
    exact = {}
    normalized = {}
    for item in payload.get("districts", []):
        exact[(item["siDo"], item["siGunGu"], item["name"])] = item
        normalized[(item["siDo"], item["siGunGu"], normalize_name(item["name"]))] = item
    return exact, normalized


def fetch_locations() -> List[dict]:
    response = requests.post(MOIS_LOCATIONS_URL, timeout=20)
    response.raise_for_status()
    return response.json()["locations"]


def fetch_rows(sido_name: str, sigungu_code: str) -> List[List[str]]:
    data = {
        "sltOrgType": "2",
        "sltOrgLvl1": SIDO_CODE_MAP[sido_name],
        "sltOrgLvl2": sigungu_code,
        "gender": "gender",
        "sum": "sum",
        "sltUndefType": "",
        "searchYearStart": TARGET_YEAR,
        "searchMonthStart": TARGET_MONTH,
        "searchYearEnd": TARGET_YEAR,
        "searchMonthEnd": TARGET_MONTH,
        "sltOrderType": "1",
        "sltOrderValue": "ASC",
        "sltArgTypes": "10",
        "sltArgTypeA": "0",
        "sltArgTypeB": "100",
        "category": "month",
    }
    response = requests.post(MOIS_CSV_URL, data=data, timeout=60)
    response.raise_for_status()
    decoded = response.content.decode("cp949", "replace")
    return list(csv.reader(io.StringIO(decoded)))


def parse_region(region: str) -> Tuple[str, str, str, str]:
    match = re.match(r"^(?P<path>.+?)\((?P<code>\d{10})\)$", region.strip())
    if not match:
        raise ValueError(f"Unable to parse region: {region}")

    path = match.group("path").strip()
    code = match.group("code")
    tokens = path.split()
    if tokens[0] == "서울특별시":
        si_do = "서울"
        si_gun_gu = tokens[1]
        name = tokens[2]
    elif tokens[0] == "경기도":
        si_do = "경기"
        if tokens[1].endswith(("시", "군")) and len(tokens) == 3:
            si_gun_gu = tokens[1]
            name = tokens[2]
        else:
            si_gun_gu = f"{tokens[1]} {tokens[2]}"
            name = tokens[3]
    else:
        raise ValueError(f"Unsupported region prefix: {region}")
    return code, si_do, si_gun_gu, name


def find_name_rule(si_do: str, si_gun_gu: str, name: str) -> Optional[dict]:
    for rule in NAME_RULES:
        if rule.get("siDo") and rule["siDo"] != si_do:
            continue
        if rule.get("siGunGu") and rule["siGunGu"] != si_gun_gu:
            continue
        if re.match(rule["pattern"], name):
            return rule
    return None


def infer_terrain(si_do: str, si_gun_gu: str, name: str) -> Tuple[str, List[str], str]:
    rule = find_name_rule(si_do, si_gun_gu, name)
    if rule:
        primary = rule["terrain"]
        tags = rule.get("terrainTags", [])
        note = f"{si_gun_gu} 생활권 기준 수작업 규칙 적용 · {TERRAIN_LABELS[primary]} 성향 우세"
        if tags:
            note += f" · 보조 태그 {', '.join(TERRAIN_LABELS[tag] for tag in tags)}"
        return primary, tags, note

    hits: List[str] = []
    for terrain, keywords in TERRAIN_KEYWORDS.items():
        if any(keyword in name for keyword in keywords):
            hits.append(terrain)

    if not hits:
        primary = "flatland"
    elif "waterfront" in hits:
        primary = "waterfront"
    elif "highland" in hits:
        primary = "highland"
    elif "green" in hits:
        primary = "green"
    else:
        primary = hits[0]

    tags = [tag for tag in hits if tag != primary]
    note = (
        f"{si_gun_gu} 생활권 기준 자동 분류 · "
        f"{TERRAIN_LABELS[primary]} 성향 우세"
    )
    if tags:
        note += f" · 보조 태그 {', '.join(TERRAIN_LABELS[tag] for tag in tags)}"
    return primary, tags, note


def infer_ohang(name: str) -> Tuple[List[str], List[str]]:
    chars: List[str] = []
    ohang: List[str] = []
    for syllable, element in OHANG_BY_HANGUL.items():
        if syllable in name and syllable not in chars:
            chars.append(syllable)
            if element not in ohang:
                ohang.append(element)
    return chars, ohang


def build_record(
    code: str,
    si_do: str,
    si_gun_gu: str,
    name: str,
    exact_overrides: Dict[Tuple[str, str, str], dict],
    normalized_overrides: Dict[Tuple[str, str, str], dict],
) -> dict:
    key = (si_do, si_gun_gu, name)
    override = exact_overrides.get(key)
    normalized_override = normalized_overrides.get((si_do, si_gun_gu, normalize_name(name)))
    name_rule = find_name_rule(si_do, si_gun_gu, name)

    primary, terrain_tags, terrain_note = infer_terrain(si_do, si_gun_gu, name)
    ohang_chars, ohang = infer_ohang(name)

    record = {
        "code": code,
        "name": name,
        "hanja": "",
        "siDo": si_do,
        "siGunGu": si_gun_gu,
        "ohangChars": ohang_chars,
        "ohang": ohang,
        "terrain": primary,
        "terrainTags": terrain_tags,
        "terrainNote": terrain_note,
        "hanjaStatus": "manual_review",
        "manualNote": (
            "행안부 행정동 전체 목록 기반 자동 생성본. "
            + ("오행 미확정으로 지형 중심 추천을 사용" if not ohang else "한자/지형은 후속 검수 필요")
        ),
    }

    if override:
        for field in [
            "hanja",
            "ohangChars",
            "ohang",
            "terrain",
            "terrainTags",
            "terrainNote",
            "hanjaStatus",
            "hanjaNote",
            "manualNote",
        ]:
            if field in override:
                record[field] = override[field]
    elif normalized_override:
        for field in ["ohangChars", "ohang"]:
            if field in normalized_override:
                record[field] = normalized_override[field]
        if not name_rule:
            for field in ["terrain", "terrainTags", "terrainNote"]:
                if field in normalized_override:
                    record[field] = normalized_override[field]

    if not record.get("terrainTags"):
        record.pop("terrainTags", None)
    if not record.get("ohang"):
        record["ohang"] = []
    if not override:
        record["manualNote"] = (
            "행안부 행정동 전체 목록 기반 자동 생성본. "
            + ("오행 미확정으로 지형 중심 추천을 사용" if not record["ohang"] else "한자/지형은 후속 검수 필요")
        )
    if not record.get("manualNote"):
        record.pop("manualNote", None)
    if not record.get("hanjaNote"):
        record.pop("hanjaNote", None)

    return record


def iter_admin_dongs() -> Iterable[Tuple[str, str, str, str]]:
    locations = fetch_locations()
    targets = [loc for loc in locations if loc.get("levels") == "2" and loc.get("sidonm") in SIDO_CODE_MAP]
    for target in targets:
        sido_name = target["sidonm"]
        rows = fetch_rows(sido_name, target["hangkikcd"])
        for row in rows[1:]:
            region = row[0]
            match = re.search(r"\((\d{10})\)$", region)
            if not match:
                continue
            code = match.group(1)
            if code.endswith("00000000") or code.endswith("00000"):
                continue
            parsed_code, si_do, si_gun_gu, name = parse_region(region)
            yield parsed_code, si_do, si_gun_gu, name


def main() -> None:
    exact_overrides, normalized_overrides = load_seed_overrides()
    seen_codes = set()
    districts = []
    for code, si_do, si_gun_gu, name in iter_admin_dongs():
        if code in seen_codes:
            continue
        seen_codes.add(code)
        districts.append(build_record(code, si_do, si_gun_gu, name, exact_overrides, normalized_overrides))

    districts.sort(key=lambda item: (0 if item["siDo"] == "서울" else 1, item["siGunGu"], item["name"]))
    counts = Counter(item["siDo"] for item in districts)
    review_count = sum(1 for item in districts if item.get("hanjaStatus") == "manual_review")

    payload = {
        "_meta": {
            "description": "수도권 전체 행정동 DB — 서울·경기 행정동/읍면동 전체 + 오행·지형 속성",
            "source": "행정안전부 주민등록 인구통계 CSV(행정동 현황) + 기존 수작업 정제본 병합",
            "referenceUrls": [
                "https://jumin.mois.go.kr/",
                "https://www.data.go.kr/",
            ],
            "version": "2.0.0-capital-full",
            "scope": "서울·경기 전체 행정동/읍면동 자동 생성본",
            "snapshotYearMonth": f"{TARGET_YEAR}-{TARGET_MONTH}",
            "totalCount": len(districts),
            "seoulCount": counts.get("서울", 0),
            "gyeonggiCount": counts.get("경기", 0),
            "hanjaReviewNeeded": review_count,
            "note": "공식 행정동 코드는 행안부 주민등록 인구통계 CSV 기준. 기존 수작업 항목은 우선 보존하고, 신규 항목의 한자/오행/지형은 MVP용 자동 분류를 적용했다.",
        },
        "districts": districts,
    }

    DATA_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(districts)} districts to {DATA_PATH}")


if __name__ == "__main__":
    main()
