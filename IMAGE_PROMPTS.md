# 무기제작소 — AI 일러스트 프롬프트 가이드

청월당처럼 "그림이 꽉 찬" 느낌을 내기 위한 AI 이미지 생성 프롬프트 모음입니다.
Midjourney / DALL·E 3(ChatGPT) / Stable Diffusion 어디서든 쓸 수 있어요.
생성한 이미지는 `public/images/` 의 규칙(README 참고)대로 넣으면 자동 반영됩니다.

---

## 0) 공통 아트 디렉션 (브랜드 톤)
- 스타일: **한국 웹툰/세미 실사 일러스트**, 부드러운 셀 음영, 깔끔한 선
- 컬러: **딥 네이비(#07071F) 배경 + 핫핑크(#FF2F8F)·퍼플(#8B5CF6) 포인트 라이트**
- 분위기: 신뢰감 있는 "전략/AI 진단센터" (운세풍보다 세련되고 모던)
- 인물: 1명, 정면~3/4 각도, 시선 카메라, 상반신, 여백은 어둡게(텍스트가 위에 올라감)
- 금지: 워터마크, 글자, 로고, 깨진 손가락 (negative)

> **세로(히어로/랜딩)** 는 `--ar 4:5`, **가로(카드/가이드)** 는 `--ar 16:9` 권장.
> DALL·E는 비율을 문장으로: "vertical 4:5 portrait" / "wide 16:9 banner".

### Stable Diffusion 공통 네거티브
```
lowres, bad anatomy, bad hands, extra fingers, text, watermark, logo, jpeg artifacts, deformed, blurry
```

---

## 1) 브랜드 마스코트 — 대장장이 ‘모루’ (hero/brand.jpg)
무기제작소의 정체성: "당신의 무기(강점)를 벼리는 대장장이".

**Midjourney**
```
korean webtoon style illustration, friendly young blacksmith mascot character holding a glowing hammer, leather apron, confident warm smile, sparks of orange embers, deep navy background with hot pink and purple rim light, semi-realistic soft cel shading, upper body, looking at camera, cinematic, dark empty space at top for title text --ar 4:5 --style raw
```
**DALL·E 3**
```
A Korean webtoon-style illustration of a friendly young blacksmith mascot holding a glowing hammer, wearing a leather apron, warm confident smile, orange ember sparks, deep navy background with hot pink and purple rim lighting, semi-realistic soft shading, upper body, vertical 4:5 portrait, dark empty space at the top for overlaid title text, no text in image.
```

---

## 2) 카테고리별 캐릭터 톤
일관성을 위해 카테고리마다 캐릭터 컨셉을 고정하면 좋아요.

- **비즈니스**: 전략가/CEO 느낌. 정장 캐주얼, 차트·그래프 홀로그램, 단단한 눈빛.
  `confident young strategist, smart casual blazer, floating holographic charts and arrows`
- **크리에이터**: 콘텐츠 메이커. 카메라/스마트폰/링라이트, 밝고 트렌디.
  `trendy young content creator with smartphone and ring light, playful energetic vibe`
- **아이덴티티**: 사색/성찰. 별·나침반·열쇠 모티프, 차분하고 몽환적.
  `thoughtful person with a glowing compass and stars, calm dreamy introspective mood`

위 공통 톤(네이비+핫핑크) + 카테고리 문장을 합쳐 사용하세요.

---

## 3) 진단별 프롬프트 (products/{slug}.jpg — 가로 16:9)
각 줄 끝에 공통 톤(`korean webtoon, deep navy bg, hot pink & purple rim light, semi-realistic, --ar 16:9`)을 붙이세요.

| slug | 핵심 프롬프트(영문) |
|---|---|
| business-item | a person mining a glowing diamond idea from rock, "finding the right business item" |
| business-marketing | a strategist pointing at a glowing funnel/sales chart, money flow lines |
| ad-conversion | a megaphone with light beam and conversion funnel, leaking coins being fixed |
| content-strategy | a creator surrounded by floating content cards and a pen of light |
| instagram | a creator holding phone showing a glowing feed grid, camera aesthetic |
| youtube | a creator with a glowing play button and thumbnail panels behind |
| shortform-writing | a writer typing, short glowing text bubbles floating (threads/X vibe) |
| creator-fit | a creator standing before multiple glowing platform doors to choose |
| self-discovery | a person holding a glowing key to their own glowing heart/mind |
| purpose | a traveler holding a glowing compass under a starry sky |
| priority | a person organizing glowing task blocks, one big block highlighted |
| work-style | a person in a focused glowing workspace bubble, gears and flow |

예시(business-marketing):
```
korean webtoon style, a confident young strategist pointing at a glowing sales funnel and rising chart, money flow light lines, deep navy background, hot pink and purple rim light, semi-realistic soft cel shading, wide 16:9 banner, dark space for title --ar 16:9 --style raw
```

---

## 4) 랜딩 히어로 (landing/{slug}.jpg — 세로 4:5)
3)의 같은 캐릭터를 **세로 풀배경**으로. 인물 크게, 하단은 어둡게(텍스트 오버레이).
프롬프트 끝만 `--ar 4:5`, "full body or upper body, dark gradient at bottom for text" 추가.

## 5) 테스트 가이드 (guide/{slug}.jpg — 가로 16:9)
같은 캐릭터의 **친근한 안내 포즈**(손짓/미소). 좌측 인물, 우측 여백(글자 들어감).
```
... the same character smiling and gesturing welcomingly, positioned on the left, empty darker space on the right for caption, wide 16:9 --ar 16:9
```

---

## 6) 워크플로 팁
1. 마스코트(모루) 1장 먼저 확정 → 그 캐릭터 시트를 레퍼런스로 일관성 유지
   - Midjourney: 캐릭터 이미지 URL을 프롬프트 앞에 붙여 `--cref`(캐릭터 일관성) 사용
2. 카테고리 3종 톤 확정 → 진단 12개 가로 카드 생성
3. 필요 시 랜딩/가이드용 변형 생성
4. [tinypng.com](https://tinypng.com) 등으로 압축 후 `public/images/`에 규칙대로 저장
5. 새로고침하면 그라데이션 자리에 그림이 자동으로 들어갑니다.
