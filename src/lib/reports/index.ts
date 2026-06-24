import type { PaidItem } from "../types";
import type { RichReportDef } from "./kit";
import { BUSINESS_ITEM_PAID } from "./business-item";
import { SELF_DISCOVERY_PAID } from "./self-discovery";

// 4축 공통 엔진(buildRichFromDef)으로 처리되는 진단들의 정의 레지스트리
import { AD_CONVERSION_DEF } from "./ad-conversion";
import { CONTENT_STRATEGY_DEF } from "./content-strategy";
import { INSTAGRAM_DEF } from "./instagram";
import { YOUTUBE_DEF } from "./youtube";
import { SHORTFORM_WRITING_DEF } from "./shortform-writing";
import { CREATOR_FIT_DEF } from "./creator-fit";
import { PURPOSE_DEF } from "./purpose";
import { PRIORITY_DEF } from "./priority";
import { WORK_STYLE_DEF } from "./work-style";

// slug → RichReportDef (4축 공통 엔진용)
export const RICH_DEFS: Record<string, RichReportDef> = {
  "ad-conversion": AD_CONVERSION_DEF,
  "content-strategy": CONTENT_STRATEGY_DEF,
  instagram: INSTAGRAM_DEF,
  youtube: YOUTUBE_DEF,
  "shortform-writing": SHORTFORM_WRITING_DEF,
  "creator-fit": CREATOR_FIT_DEF,
  purpose: PURPOSE_DEF,
  priority: PRIORITY_DEF,
  "work-style": WORK_STYLE_DEF,
};

export function getRichDef(slug: string): RichReportDef | undefined {
  return RICH_DEFS[slug];
}

// slug → 유료 리포트에서 열리는 구체적 항목 명세
export const PAID_ITEMS: Record<string, PaidItem[]> = {
  "business-item": BUSINESS_ITEM_PAID,
  "self-discovery": SELF_DISCOVERY_PAID,
  ...Object.fromEntries(Object.entries(RICH_DEFS).map(([slug, def]) => [slug, def.paid])),
};

export function getPaidItems(slug: string): PaidItem[] {
  return PAID_ITEMS[slug] ?? [];
}
