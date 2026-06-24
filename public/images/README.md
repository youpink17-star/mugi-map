# 이미지 폴더 (청월당식 일러스트)

여기에 그림 파일을 넣으면 자동으로 사이트에 반영됩니다.
**파일이 없으면** 카테고리 그라데이션 + 이모지로 자동 대체되므로, 천천히 채워도 됩니다.

## 파일 경로 규칙

| 위치 | 경로 | 권장 비율 | 용도 |
|---|---|---|---|
| 홈 히어로 | `hero/brand.jpg` | 4:5 (세로) | 브랜드 메인 |
| 홈 히어로 | `hero/business-marketing.jpg` | 4:5 | TOP 1 슬라이드 |
| 홈 히어로 | `hero/self-discovery.jpg` | 4:5 | TOP 2 슬라이드 |
| 진단 카드 | `products/{slug}.jpg` | 16:10 (가로) | 카드 썸네일 |
| 랜딩 상단 | `landing/{slug}.jpg` | 4:5 또는 3:4 | 상세 히어로(풀배경) |
| 테스트 가이드 | `guide/{slug}.jpg` | 16:9 (가로) | 진단 중 캐릭터 배너 |

## slug 목록 (12개)
business-item, business-marketing, ad-conversion, content-strategy,
instagram, youtube, shortform-writing, creator-fit,
self-discovery, purpose, priority, work-style

예) `public/images/products/business-marketing.jpg`

## 권장 사양
- 포맷: jpg 또는 webp (webp가 더 가벼움)
- 가로 카드: 1200×750 내외 / 세로 히어로: 1080×1350 내외
- 용량: 장당 300KB 이하 권장 (tinypng 등으로 압축)

## 그림 만드는 법
프로젝트 루트의 `IMAGE_PROMPTS.md` 에 Midjourney/DALL·E/Stable Diffusion 용
프롬프트가 정리돼 있습니다. 거기서 뽑아 이 폴더에 넣으면 끝.
