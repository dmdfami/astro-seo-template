---
title: "Template Pipeline Alignment"
description: "Fix all gaps to make astro-seo-template compatible with ai-content-rewriter v6.0"
status: complete
priority: P1
effort: 8h
branch: main
tags: [seo, schema, mdx, routing, ui-ux, pipeline]
created: 2026-02-16
---

# Template Pipeline Alignment

Fix ALL gaps from 3 audit reports, making the template fully compatible with ai-content-rewriter v6.0 and ui-ux-pro-max standards.

## Context

- 24 pages + 146 blog posts from old site (TOP Google ranking)
- ALL slugs, URLs, images MUST be preserved
- Old site uses flat URLs: `/about-vietnam-plywood-factory/`, `/bintangor-plywood-vietnam/`, etc.
- Products must live in `pages` collection with flat URLs, NOT `/products/slug`
- Audit reports: `plans/reports/researcher-260216-1800-*.md`

## Phases

| # | Phase | Status | Effort | Files |
|---|-------|--------|--------|-------|
| 1 | [Content Collection & Routing](./phase-01-content-collection-routing.md) | complete | 2h | 6 modify, 2 delete |
| 2 | [MDX Component API Alignment](./phase-02-mdx-component-api-alignment.md) | complete | 2.5h | 9 modify, 2 create |
| 3 | [Schema & SEO Enhancement](./phase-03-schema-seo-enhancement.md) | complete | 1.5h | 4 modify |
| 4 | [UI/UX Quality Fixes](./phase-04-uiux-quality-fixes.md) | complete | 1h | 3 modify |
| 5 | [Content Migration Prep](./phase-05-content-migration-prep.md) | complete | 1h | 1 create |

## Dependencies

- Phase 1 MUST complete before Phase 5 (routing determines slug strategy)
- Phase 2 and Phase 3 can run in parallel
- Phase 4 is independent, can run anytime
- Phase 5 depends on Phase 1 completion

## Key Decisions

1. Products move to `pages` collection (flat URLs preserved)
2. Delete `about.astro` + `contact.astro` (collection-driven)
3. Template components accept BOTH rewriter + existing APIs (backward compat)
4. `MdxImage` aliased as `Image` in auto-import (no rewriter change needed)
5. `[slug].astro` becomes universal catch-all for all page types

## Validation Log

### Session 1 — 2026-02-16
**Trigger:** Initial plan creation validation
**Questions asked:** 4

#### Questions & Answers

1. **[Architecture]** Products hiện tại có collection riêng. Plan đề xuất chuyển vào pages collection để có flat URLs. Đồng ý không?
   - Options: Yes flat URLs | Keep /products/ prefix | Both flat + redirect
   - **Answer:** Yes, flat URLs (Recommended)
   - **Rationale:** Giữ nguyên URL cũ cho SEO ranking. Products nằm trong pages collection với contentType: product

2. **[Architecture]** About và Contact hiện là hardcoded .astro files. Plan đề xuất xóa và chuyển sang MDX. Đồng ý?
   - Options: Yes full MDX | Hybrid MDX+Astro | Keep hardcoded
   - **Answer:** Yes, full MDX (Recommended)
   - **Rationale:** Toàn bộ content MDX-driven để ai-content-rewriter quản lý. ContactForm component có sẵn

3. **[Scope]** Ảnh từ website cũ dùng /images/wp-content/uploads/... Template mới dùng /images/uploads/... Chiến lược?
   - Options: Keep old paths | New paths + redirects | Symlink
   - **Answer:** Keep old paths (Recommended)
   - **Rationale:** Giữ nguyên image paths trong public/ để không mất Google Image index

4. **[Tradeoff]** 7 MDX components có API mismatch. Dual-API hay sửa rewriter?
   - Options: Dual-API in template | Fix rewriter only | Fix both
   - **Answer:** Dual-API in template (Recommended)
   - **Rationale:** Template chấp nhận cả 2 format, backward compatible, không cần sửa rewriter scripts

#### Confirmed Decisions
- Product URLs: Flat via pages collection — preserves TOP Google ranking
- About/Contact: Full MDX — ai-content-rewriter pipeline complete
- Image paths: Keep /images/wp-content/uploads/ — no SEO image loss
- Component API: Dual-API — backward compatible, no rewriter change

#### Action Items
- [ ] All decisions align with existing plan — no changes needed

#### Impact on Phases
- No phase changes required — all answers confirmed Recommended options
