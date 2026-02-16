/plan:hard

## Task: UI/UX Pro Max Upgrade + Content Beautification Layer

### Context
- Project: /Users/david/projects/astro-seo-template (Astro 5 + Tailwind 4 + MDX)
- Website: vietnam-plywood.com (HCPLY) - plywood manufacturer B2B
- Pipeline alignment đã hoàn thành (commit b2d8665) - 11 content types, dual-API components, Schema.org
- Dev server: npm run dev → localhost:4321
- Reference demos: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/coworking-space

### Goal
Nâng cấp UI/UX template + thêm beautification layer cho ai-content-rewriter để MDX output đạt chuẩn ui-ux-pro-max. Template đẹp mà MDX viết xấu thì vẫn xấu.

### Critical Decisions
- **BỎ DARK MODE** hoàn toàn - xóa tất cả dark: prefixes, ThemeToggle, dark tokens
- **Light-only design** với sections xen kẽ sáng/tối tạo contrast rhythm
- **2 projects cần update**: astro-seo-template (components) + ai-content-rewriter skill (output format)
- **Reusable cho nhiều web plywood** - cùng industry, khác brand. Swap `site-config.json` + `design-tokens.json` + `schema-org.json` = new website
- Components, layouts, SEO structure, content patterns giống nhau; chỉ brand name/logo/colors/contact khác
- **KHÔNG hardcode** brand-specific values trong components - luôn đọc từ config/tokens

### Known UI Bugs to Fix First
1. Images broken trên blog/product listing (alt text thay vì ảnh)
2. Mobile header: logo wrap xấu, "Get Started" quá to
3. Blog post duplicate title (header + hero)
4. FeatureGrid icons: green squares thay vì real icons
5. Footer thiếu Facebook/YouTube social links
6. Section headings unstyled

### Template Upgrade (astro-seo-template)
1. **Xóa dark mode** - remove tất cả dark: classes, ThemeToggle component, dark theme tokens
2. **Gradient text highlights** - `<Highlight gradient="primary">keyword</Highlight>` component cho từ khóa quan trọng
3. **Floating badges/pills** - social proof `<Badge variant="floating">FSC Certified</Badge>`
4. **Bento grid layouts** - image collage với floating info cards
5. **Section rhythm** - xen kẽ bg-white/bg-neutral-50 sections tạo visual breaks
6. **Colored stats** - số liệu nổi bật với brand gradient
7. **Modern typography** - heading hierarchy rõ ràng, proper spacing cho long-form content
8. **Image fallback** - placeholder/skeleton khi ảnh fail load

### Content Beautification Layer (ai-content-rewriter)
- Skill path: /Users/david/.claude/skills/ai-content-rewriter/
- Thêm "beautification" instructions để MDX output dùng đúng premium components
- Visual break cứ 300-500 từ (Stats, Testimonials, CTA, Gallery...)
- Gradient highlights trên keywords quan trọng trong headings
- Section alternating layouts tự động (white → gray → white)
- "Dài mà vẫn đẹp" - 2000-5000 từ/trang nhưng user scroll hết vì đẹp

### Design Philosophy
- **Template ↔ Content là 2 mặt 1 đồng xu** - thiết kế phải song song, không tách rời
- Người thiết kế component phải hiểu cách content writer sử dụng nó
- Người viết content phải biết component nào có sẵn và API của nó
- **Mỗi component mới = Component API (template) + MDX Usage Pattern (rewriter)**
- Mỗi section là 1 visual experience, không phải wall of text
- Components phải backward-compatible với existing MDX content
- Light-only, professional, modern B2B industrial aesthetic
- Google loves: long content + low bounce rate = TOP 1

### Skills to Use During Planning
- ui-ux-pro-max: query design system, color palette, component patterns từ skill database
- ai-content-rewriter: review current output format và plan beautification layer updates
- Fetch demo page https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/coworking-space để phân tích design patterns

### Architecture: Shared Component Catalog (Contract-Based)
- **Tạo `docs/component-catalog.md`** - shared spec mà cả template + rewriter đều reference
- Mỗi component entry gồm: API (props/variants/slots), Usage (khi nào dùng, MDX example), Rules (spacing, frequency)
- **Template skill** đọc catalog → implement component đúng API
- **Rewriter skill** đọc catalog → output MDX đúng usage pattern
- Khi thêm/sửa component → update catalog → cả 2 skill tự động align
- Giống frontend/backend share API spec - 2 skill độc lập nhưng sync qua 1 contract

### 6 Phases đề xuất
1. **Bug Fixes & Dark Mode Removal** - fix 6 UI bugs + strip dark mode hoàn toàn
2. **Premium Components** - Highlight, FloatingBadge, BentoGrid, SectionWrapper, ImageWithFallback
3. **Typography & Layout System** - heading styles, prose spacing, section rhythm, responsive
4. **Existing Component Upgrade** - nâng cấp Hero, Card, Stats, Testimonial, Footer theo chuẩn mới
5. **Component Catalog** - tạo shared spec docs/component-catalog.md cho tất cả components
6. **ai-content-rewriter Beautification** - cập nhật skill references để output MDX đẹp, reference catalog
