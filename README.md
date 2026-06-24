# 무기제작소 (Mugi Maker) — 사업·마케팅 무기진단센터

청월당 같은 **모바일 앱형 웹앱(max-width 430px)** 으로 만든 사업자/크리에이터용 진단 플랫폼입니다.
무료 진단 → "어, 나잖아" 미리보기 → 유료 리포트 결제 → 추가 입력 → **Make Webhook**으로 리포트 생성 요청까지 이어지는 퍼널을 갖췄습니다.

## 기술 스택
- **Next.js 14 (App Router)** + **TypeScript**
- **Tailwind CSS** (브랜드 컬러: 네이비 #07071F · 핫핑크 #FF2F8F · 퍼플 #8B5CF6)
- **Supabase** (Postgres + service_role 서버 접근)
- **Vercel** 배포 기준
- 결제: `mock / external / portone` 모드 추상화(구조만)
- 리포트 생성: **Make Webhook**으로 POST

---

## 1. 빠른 시작

> ⚠️ 이 PC에는 Node.js가 설치돼 있지 않습니다. 먼저 [Node.js LTS](https://nodejs.org) 를 설치하세요.

```bash
npm install
cp .env.local.example .env.local   # 값 채우기 (아래 참고)
npm run dev                         # http://localhost:3000
```

> **Supabase/Make 없이도** 바로 둘러볼 수 있습니다(데모 모드). 환경변수가 없으면
> 결과 데이터를 URL에 인코딩해 전체 플로우(진단→결과→유료폼→완료)가 동작합니다.
> 단, 관리자 페이지와 데이터 영구 저장은 Supabase 연결이 필요합니다.

## 2. 환경변수 (`.env.local`)
`.env.local.example` 참고. 핵심:
| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` | Supabase 프로젝트 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용** (절대 노출 금지) |
| `MAKE_WEBHOOK_URL` | 유료폼 제출 시 POST 보낼 Make 훅 |
| `NEXT_PUBLIC_PAYMENT_MODE` | `mock`(통과) / `external`(외부링크) / `portone`(추후) |
| `NEXT_PUBLIC_PAYMENT_EXTERNAL_URL` | external 모드 결제 링크 |
| `ADMIN_PASSWORD` | `/admin` 접근 비밀번호 |

## 3. Supabase 세팅
1. supabase.com 에서 프로젝트 생성
2. **SQL Editor** 에 `supabase/schema.sql` 전체 붙여넣고 RUN
   - 테이블 6개(products, leads, test_responses, orders, paid_forms, report_jobs) 생성
   - 상품 12개 시드 + RLS 활성화(서버 service_role 로만 접근)
3. Project Settings → API 에서 URL / anon / service_role 키를 `.env.local`에 입력

## 4. Make(Integromat) 연동
1. Make 시나리오 시작에 **Custom Webhook** 모듈 추가 → URL 복사 → `MAKE_WEBHOOK_URL`
2. 유료폼 제출 시 아래 형태의 JSON이 POST 됩니다:
```jsonc
{
  "order_id": "...",
  "product_slug": "business-marketing",
  "product_title": "사업 전략 및 마케팅 진단",
  "customer_info": { "name": "...", "email": "...", "phone": "..." },
  "free_test_answers": { "...": "..." },
  "free_result": { "businessType": "...", "stuckStage": "...", "...": "..." },
  "paid_answers": { "...": "..." },
  "created_at": "ISO8601"
}
```
3. Make에서 GPT/문서생성/메일·카카오 발송 등으로 리포트를 만들어 고객에게 전달

## 5. 결제 연동(포트원)
`src/lib/payment.ts` 에 모드만 추상화돼 있습니다.
- 지금: `mock`(바로 통과) 또는 `external`(외부 결제 링크)
- 추후 포트원 붙일 때: 결제 위젯 호출 → 결제 성공 콜백에서 `orders.status='paid'` 업데이트 → `/paid-form/[orderId]` 이동 로 연결하면 됩니다. (`/api/orders` 가 진입점)

## 6. Vercel 배포
1. GitHub 푸시 → Vercel "New Project" 로 import
2. 환경변수(위 표) 등록
3. Deploy. (Make/Supabase는 운영 키로 교체)

---

## 디렉터리 구조
```
src/
  app/
    layout.tsx            # 루트 레이아웃 (AppShell로 전체 감쌈)
    globals.css
    page.tsx              # / 메인 (히어로 + 상품 12 카드)
    not-found.tsx
    landing/[slug]/page.tsx     # 진단 랜딩(후킹/무료공개/유료항목/후기/CTA)
    test/[slug]/page.tsx        # 무료 테스트(한 화면 한 문항, 진행바)
    result/[id]/page.tsx        # 무료 결과(미리보기 + 잠금 + 유료 CTA)
    paid-form/[id]/page.tsx     # 결제 후 추가 입력
    complete/[id]/page.tsx      # 완료(리포트 생성 중)
    admin/page.tsx              # 관리자(주문 목록 + 상태 변경)
    api/
      leads/route.ts            # Coming Soon 이메일 수집
      test/submit/route.ts      # 무료 진단 저장 + 무료결과 계산
      orders/route.ts           # 주문 생성(+결제모드 분기)
      paid-form/submit/route.ts # 유료폼 저장 + Make Webhook 전송
      admin/orders/route.ts     # 관리자 조회/상태변경 (비번 헤더)
  components/
    AppShell, AppHeader, BottomCTA, ProductCard, ProgressBar,
    QuestionCard, ResultPreviewCard, LockedSection, LoadingAnalysis,
    EmailNotifyForm, PaidCTA, PaidFormClient
  lib/
    types.ts, products.ts(상품 12), questions.ts(문항),
    scoring.ts(무료결과 계산), payment.ts, webhook.ts, demoid.ts,
    supabase/server.ts, supabase/client.ts
supabase/schema.sql
legacy/prototype.html       # 초기 단일 HTML 시안(참고용)
```

## 주문 상태 흐름
`무료진단 완료(free_done)` → `결제 대기(payment_pending)` → `결제 완료(paid)` → `유료폼 완료(paid_form_done)` → `리포트 발송 완료(report_sent)`
(관리자 페이지에서 수동 변경 가능)

## 진단 상품 추가/수정
- 카탈로그: `src/lib/products.ts`
- 무료 문항: `src/lib/questions.ts` 의 `FREE_TESTS[slug]`
- 무료 결과 로직: `src/lib/scoring.ts`
- 유료폼 문항: `src/lib/questions.ts` 의 `PAID_FORMS[slug]`
> 현재 `business-item`, `business-marketing` 두 상품이 활성(문항 완비)입니다.
> 나머지 10개는 Coming Soon(이메일 수집)이며, 문항만 추가하면 즉시 활성화됩니다.

## 참고: 데모용 더미 값
랜딩 후기/홈 카피의 일부 수치·후기는 예시입니다. 실제 운영 전 교체하세요.
