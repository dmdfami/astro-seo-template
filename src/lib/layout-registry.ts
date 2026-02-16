/**
 * Layout Registry — Single source of truth for 11 content type layouts.
 * Maps content types to rendering patterns used by [slug].astro and products/[slug].astro.
 */

export type LayoutPattern = 'fullwidth' | 'hybrid' | 'split' | 'prose';

export interface LayoutConfig {
  pattern: LayoutPattern;
  container: 'none' | 'md' | 'lg' | 'xl';
  proseWrapper: boolean;
  h1Auto: boolean;
  breadcrumb: boolean;
}

export const LAYOUT_REGISTRY: Record<string, LayoutConfig> = {
  homepage: {
    pattern: 'hybrid',
    container: 'none',
    proseWrapper: false,
    h1Auto: false,
    breadcrumb: false,
  },
  landing: {
    pattern: 'fullwidth',
    container: 'none',
    proseWrapper: false,
    h1Auto: false,
    breadcrumb: false,
  },
  gallery: {
    pattern: 'fullwidth',
    container: 'none',
    proseWrapper: false,
    h1Auto: false,
    breadcrumb: true,
  },
  'video-hub': {
    pattern: 'fullwidth',
    container: 'none',
    proseWrapper: false,
    h1Auto: false,
    breadcrumb: true,
  },
  product: {
    pattern: 'split',
    container: 'lg',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  blog: {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  generic: {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  about: {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  contact: {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  'product-list': {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  'blog-list': {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
  reviews: {
    pattern: 'prose',
    container: 'md',
    proseWrapper: true,
    h1Auto: true,
    breadcrumb: true,
  },
};

export function getLayout(contentType: string): LayoutConfig {
  return LAYOUT_REGISTRY[contentType] || LAYOUT_REGISTRY.generic;
}

export function isFullWidth(contentType: string): boolean {
  const layout = getLayout(contentType);
  return layout.pattern === 'fullwidth' || layout.pattern === 'hybrid';
}
