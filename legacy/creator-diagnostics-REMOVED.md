# 크리에이터 진단 4종 — 비활성(de-wired) 기록

2026-06 무기지도 방향 정리 중, 아래 4개 크리에이터 진단을 **앱에서 접근 불가**로 만들었습니다.
**삭제가 아니라 연결 해제**입니다 — 콘텐츠 코드는 그대로 남아 있고 git 히스토리에도 보존됩니다.
나중에 별도 사이트(content-factory, localhost:3001)로 옮길 때 아래 항목만 들고 가면 됩니다.

## 대상 slug
- `instagram` (인스타그램 운영 진단)
- `youtube` (유튜브 운영 진단)
- `shortform-writing` (숏폼 글쓰기 진단)
- `creator-fit` (크리에이터 적성 진단)

## 무엇을 끊었나 (접근 차단 = 이 4개를 지움)
- `src/lib/products.ts` — PRODUCTS 4개 항목 + CATEGORY_ORDER 의 `"creator"` 제거 → 더 이상 목록/랜딩/테스트/결과 진입 불가
- `src/lib/journey.ts` — STAGES(select·sharpen) slug + NEXT_RECOMMEND 체인에서 제거
- `src/lib/wiki.ts` — TEST_TO_SECTIONS 4개 매핑 제거 (위키에서 "관련 문서"로 안 뜸)
- `src/lib/situations.ts` — `side`(부업) 추천 slug 를 `creator-fit` → `business-item` 으로 변경

## 무엇을 남겨뒀나 (= 이동용 보존본)
아래는 **그대로 코드에 남아 있음**(키만 존재, 호출되지 않음). 3001로 옮길 때 복사:
- `src/lib/reports/instagram.ts` · `youtube.ts` · `shortform-writing.ts` · `creator-fit.ts`
- `src/lib/reports/index.ts` 의 4개 import + REPORTS 매핑
- `src/lib/questions.ts` 의 FREE_TESTS / PAID_FORMS 4개 블록
- `src/lib/reports/offers.ts` 의 OFFERS 4개 블록
- `src/lib/results.ts` 의 4개 블록
- `src/lib/products.ts` 항목(텍스트) → git 히스토리에 보존(현재 파일에선 제거됨)

## 되살리려면
products.ts 에 4개 항목을 다시 추가(혹은 git 에서 복원)하고, journey/wiki/situations 매핑만 되돌리면 즉시 복구됩니다.

---

# work-style(일하는 방식) — 함께 de-wire (2026-06-28)

자기발견과 '내 무기' 칸이 중복이라 같은 방식으로 접근 차단.
- 끊은 곳: `products.ts`(PRODUCTS 항목), `journey.ts`(discover STAGES slug + NEXT_RECOMMEND `purpose→work-style→priority` → `purpose→priority`), `wiki.ts`(TEST_TO_SECTIONS `work-style` 제거)
- 남긴 것(보존): `reports/work-style.ts`(WORK_STYLE_DEF) + `reports/index.ts` 등록 + `questions.ts` FREE_TESTS["work-style"]
- 되살리려면: products 항목 복원 + journey/wiki 매핑 되돌리기
- 결과: `/landing/work-style` 404 확인.

(ad-conversion은 '인지·구매' 퍼널 칸을 채우는 유일 진단이라 **유지**.)
