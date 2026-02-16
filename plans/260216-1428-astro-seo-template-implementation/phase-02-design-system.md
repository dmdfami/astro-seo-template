# Phase 2: Design System

**Priority:** P1 | **Status:** ✅ completed | **Effort:** 5h

## Context Links

- **Phase 1**: [Foundation Scaffold](phase-01-foundation-scaffold.md)
- **Research**: [Premium Template Research](../reports/researcher-260216-1414-astro-premium-template-research.md)

## Overview

Build design system foundation: UI atomics (Button, Input, Badge, Icon), layout components (Header, Footer, Navigation), section wrappers, dark mode toggle, view transitions. This phase creates reusable primitives for Phase 3 MDX components.

## Key Insights

- Keep each component under 200 lines (modularize if needed)
- Use `<ClientRouter />` (NOT deprecated `<ViewTransitions />`)
- Dark mode toggle must work with view transitions via `astro:after-swap` event
- IntersectionObserver + CSS animations for scroll effects (zero JS bundle)
- Glassmorphism limited to 3-5 elements per viewport for performance
- All interactive components need `prefers-reduced-motion` support

## Requirements

### Functional
- UI atomics: Button (6 variants), Input, Badge, Tag, Icon
- Layout: Header, Footer, Navigation (desktop + mobile), MobileMenu
- Section wrappers: Section, Container, Grid, Divider, Spacer
- Dark mode toggle (light/dark/system 3-state)
- View transitions with dark mode persistence
- Breadcrumb component (for SEO)

### Non-Functional
- Each component < 200 lines
- Zero console warnings
- Accessible (ARIA labels, keyboard nav)
- Responsive (320px → 1536px)
- Dark mode on all components

## Architecture

```
src/components/
├── ui/
│   ├── Button.astro              ← 6 variants: primary, secondary, outline, ghost, link, icon
│   ├── Input.astro               ← Text, email, tel with validation states
│   ├── Badge.astro               ← Pill-shaped labels (success, warning, error, info)
│   ├── Tag.astro                 ← Blog/product tags with optional close
│   ├── Icon.astro                ← SVG icon wrapper (heroicons)
│   └── ThemeToggle.astro         ← 3-state toggle (light/dark/system)
├── layout/
│   ├── Header.astro              ← Logo, nav, CTA, theme toggle
│   ├── Footer.astro              ← Multi-column links, social, copyright
│   ├── Navigation.astro          ← Desktop nav (from site-config.json)
│   └── MobileMenu.astro          ← Drawer-style mobile nav
└── sections/
    ├── Section.astro             ← Wrapper with optional bg, padding variants
    ├── Container.astro           ← Max-width constraint (sm/md/lg/xl/full)
    ├── Grid.astro                ← Responsive grid (cols-1/2/3/4)
    ├── Divider.astro             ← Horizontal rule with variants
    └── Spacer.astro              ← Vertical spacing (xs/sm/md/lg/xl/2xl)
```

## Related Code Files

### To Create
- `/Users/david/projects/astro-seo-template/src/components/ui/Button.astro`
- `/Users/david/projects/astro-seo-template/src/components/ui/Input.astro`
- `/Users/david/projects/astro-seo-template/src/components/ui/Badge.astro`
- `/Users/david/projects/astro-seo-template/src/components/ui/Tag.astro`
- `/Users/david/projects/astro-seo-template/src/components/ui/Icon.astro`
- `/Users/david/projects/astro-seo-template/src/components/ui/ThemeToggle.astro`
- `/Users/david/projects/astro-seo-template/src/components/layout/Header.astro`
- `/Users/david/projects/astro-seo-template/src/components/layout/Footer.astro`
- `/Users/david/projects/astro-seo-template/src/components/layout/Navigation.astro`
- `/Users/david/projects/astro-seo-template/src/components/layout/MobileMenu.astro`
- `/Users/david/projects/astro-seo-template/src/components/sections/Section.astro`
- `/Users/david/projects/astro-seo-template/src/components/sections/Container.astro`
- `/Users/david/projects/astro-seo-template/src/components/sections/Grid.astro`
- `/Users/david/projects/astro-seo-template/src/components/sections/Divider.astro`
- `/Users/david/projects/astro-seo-template/src/components/sections/Spacer.astro`
- `/Users/david/projects/astro-seo-template/src/components/seo/Breadcrumb.astro`

### To Modify
- `/Users/david/projects/astro-seo-template/src/layouts/BaseLayout.astro` (add ClientRouter, view transitions script)
- `/Users/david/projects/astro-seo-template/src/styles/global.css` (add scroll animation utilities)

## Implementation Steps

### 1. Update BaseLayout with View Transitions

```astro
---
// src/layouts/BaseLayout.astro (add to existing)
import { ClientRouter } from 'astro:transitions';
import '../styles/global.css';
import schemaOrg from '../../schema-org.json';

// ... existing code ...
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <ClientRouter />

  <!-- Dark mode script (inline to prevent FOUC) -->
  <script is:inline>
    (function() {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>

  <!-- Re-apply dark mode after view transition -->
  <script is:inline>
    document.addEventListener('astro:after-swap', () => {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  </script>

  <!-- Existing schema scripts ... -->
</head>
<!-- ... rest of file ... -->
```

### 2. Add Scroll Animation Utilities to global.css

```css
/* src/styles/global.css - add after existing content */

/* Scroll reveal animations */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-animate="fade-up"] { transform: translateY(30px); }
[data-animate="fade-down"] { transform: translateY(-30px); }
[data-animate="fade-left"] { transform: translateX(30px); }
[data-animate="fade-right"] { transform: translateX(-30px); }
[data-animate="scale"] { transform: scale(0.95); }
[data-animate="scale"].is-visible { transform: scale(1); }

/* Stagger children */
[data-animate-stagger] > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
[data-animate-stagger].is-visible > *:nth-child(1) { transition-delay: 0ms; opacity: 1; transform: translateY(0); }
[data-animate-stagger].is-visible > *:nth-child(2) { transition-delay: 100ms; opacity: 1; transform: translateY(0); }
[data-animate-stagger].is-visible > *:nth-child(3) { transition-delay: 200ms; opacity: 1; transform: translateY(0); }
[data-animate-stagger].is-visible > *:nth-child(4) { transition-delay: 300ms; opacity: 1; transform: translateY(0); }
[data-animate-stagger].is-visible > *:nth-child(5) { transition-delay: 400ms; opacity: 1; transform: translateY(0); }
[data-animate-stagger].is-visible > * { opacity: 1; transform: translateY(0); }
```

### 3. Create Button Component

```astro
---
// src/components/ui/Button.astro
import { cn } from '@lib/utils';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  class?: string;
}

const {
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  disabled = false,
  class: className,
  ...rest
} = Astro.props;

const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-700',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950',
  ghost: 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
  link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
  icon: 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-base px-4 py-2 rounded-lg',
  lg: 'text-lg px-6 py-3 rounded-xl',
};

const iconSizes = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2 rounded-lg',
  lg: 'p-3 rounded-xl',
};

const classes = cn(
  baseStyles,
  variants[variant],
  variant === 'icon' ? iconSizes[size] : sizes[size],
  className
);

const Tag = href ? 'a' : 'button';
const props = href ? { href } : { type, disabled };
---

<Tag class={classes} {...props} {...rest}>
  <slot />
</Tag>
```

### 4. Create Input Component

```astro
---
// src/components/ui/Input.astro
import { cn } from '@lib/utils';

interface Props {
  type?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';
  name: string;
  id?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  class?: string;
}

const {
  type = 'text',
  name,
  id = name,
  placeholder,
  value,
  required = false,
  disabled = false,
  error = false,
  class: className,
  ...rest
} = Astro.props;

const classes = cn(
  'w-full px-4 py-2 rounded-lg border transition-colors',
  'bg-white dark:bg-neutral-900',
  'text-neutral-900 dark:text-neutral-100',
  'placeholder:text-neutral-400 dark:placeholder:text-neutral-600',
  'focus:outline-none focus:ring-2',
  error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-neutral-300 dark:border-neutral-700 focus:ring-primary-500',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  className
);
---

<input
  type={type}
  name={name}
  id={id}
  placeholder={placeholder}
  value={value}
  required={required}
  disabled={disabled}
  class={classes}
  {...rest}
/>
```

### 5. Create Badge Component

```astro
---
// src/components/ui/Badge.astro
import { cn } from '@lib/utils';

interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  class?: string;
}

const { variant = 'neutral', size = 'md', class: className } = Astro.props;

const variants = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  neutral: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

const classes = cn(
  'inline-flex items-center font-medium rounded-full',
  variants[variant],
  sizes[size],
  className
);
---

<span class={classes}>
  <slot />
</span>
```

### 6. Create Tag Component

```astro
---
// src/components/ui/Tag.astro
import { cn } from '@lib/utils';

interface Props {
  href?: string;
  removable?: boolean;
  class?: string;
}

const { href, removable = false, class: className } = Astro.props;

const Tag = href ? 'a' : 'span';
const classes = cn(
  'inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md',
  'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  'hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors',
  className
);
---

<Tag class={classes} href={href}>
  <slot />
  {removable && (
    <button type="button" class="ml-1 hover:text-primary-900 dark:hover:text-primary-100" aria-label="Remove tag">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  )}
</Tag>
```

### 7. Create Icon Component

```astro
---
// src/components/ui/Icon.astro
interface Props {
  name: 'menu' | 'close' | 'sun' | 'moon' | 'chevron-down' | 'chevron-right' | 'external-link';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const { name, size = 'md', class: className = '' } = Astro.props;

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const icons = {
  menu: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />',
  close: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />',
  sun: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />',
  moon: '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />',
  'chevron-down': '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />',
  'chevron-right': '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />',
  'external-link': '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />',
};
---

<svg
  class={`${sizes[size]} ${className}`}
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <Fragment set:html={icons[name]} />
</svg>
```

### 8. Create ThemeToggle Component

```astro
---
// src/components/ui/ThemeToggle.astro
import Icon from './Icon.astro';
---

<button
  id="theme-toggle"
  type="button"
  class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
  aria-label="Toggle dark mode"
>
  <Icon name="sun" class="hidden dark:block" />
  <Icon name="moon" class="block dark:hidden" />
</button>

<script is:inline>
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Listen for system changes when user hasn't set preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
  }

  // Init on page load
  initThemeToggle();

  // Re-init after view transition
  document.addEventListener('astro:page-load', initThemeToggle);
</script>
```

### 9. Create Section Wrapper Components

```astro
---
// src/components/sections/Section.astro
import { cn } from '@lib/utils';

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'neutral' | 'primary' | 'gradient';
  class?: string;
}

const { padding = 'lg', background = 'none', class: className } = Astro.props;

const paddings = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

const backgrounds = {
  none: '',
  neutral: 'bg-neutral-100 dark:bg-neutral-900',
  primary: 'bg-primary-50 dark:bg-primary-950',
  gradient: 'bg-gradient-to-br from-primary-600 to-secondary-500 text-white',
};

const classes = cn(paddings[padding], backgrounds[background], className);
---

<section class={classes}>
  <slot />
</section>
```

```astro
---
// src/components/sections/Container.astro
import { cn } from '@lib/utils';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  class?: string;
}

const { size = 'lg', class: className } = Astro.props;

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1440px]',
  full: 'max-w-full',
};

const classes = cn('mx-auto px-4 sm:px-6 lg:px-8', sizes[size], className);
---

<div class={classes}>
  <slot />
</div>
```

```astro
---
// src/components/sections/Grid.astro
import { cn } from '@lib/utils';

interface Props {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  class?: string;
}

const { cols = 3, gap = 'md', class: className } = Astro.props;

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

const gaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const classes = cn('grid', colsMap[cols], gaps[gap], className);
---

<div class={classes}>
  <slot />
</div>
```

```astro
---
// src/components/sections/Divider.astro
import { cn } from '@lib/utils';

interface Props {
  variant?: 'solid' | 'dashed' | 'gradient';
  class?: string;
}

const { variant = 'solid', class: className } = Astro.props;

const variants = {
  solid: 'border-t border-neutral-200 dark:border-neutral-800',
  dashed: 'border-t border-dashed border-neutral-300 dark:border-neutral-700',
  gradient: 'h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent',
};

const classes = cn(variants[variant], className);
---

<hr class={classes} />
```

```astro
---
// src/components/sections/Spacer.astro
import { cn } from '@lib/utils';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  class?: string;
}

const { size = 'md', class: className } = Astro.props;

const sizes = {
  xs: 'h-4',
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
  xl: 'h-16',
  '2xl': 'h-24',
};

const classes = cn(sizes[size], className);
---

<div class={classes} aria-hidden="true"></div>
```

### 10. Create Navigation Component

```astro
---
// src/components/layout/Navigation.astro
import siteConfig from '../../../site-config.json';
import Icon from '../ui/Icon.astro';

const { main } = siteConfig.navigation;
const currentPath = Astro.url.pathname;
---

<nav class="hidden md:flex items-center gap-8">
  {main.map(link => (
    <a
      href={link.href}
      class:list={[
        'text-sm font-medium transition-colors',
        currentPath === link.href
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'
      ]}
    >
      {link.label}
    </a>
  ))}
</nav>
```

### 11. Create MobileMenu Component

```astro
---
// src/components/layout/MobileMenu.astro
import siteConfig from '../../../site-config.json';
import Icon from '../ui/Icon.astro';
import Button from '../ui/Button.astro';

const { main } = siteConfig.navigation;
const currentPath = Astro.url.pathname;
---

<div>
  <Button variant="icon" id="mobile-menu-toggle" class="md:hidden">
    <Icon name="menu" id="menu-icon" />
    <Icon name="close" id="close-icon" class="hidden" />
  </Button>

  <div
    id="mobile-menu"
    class="fixed inset-0 z-50 bg-white dark:bg-neutral-950 transform translate-x-full transition-transform duration-300 md:hidden"
  >
    <div class="p-6 space-y-6">
      {main.map(link => (
        <a
          href={link.href}
          class:list={[
            'block text-lg font-medium',
            currentPath === link.href
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-neutral-900 dark:text-neutral-100'
          ]}
        >
          {link.label}
        </a>
      ))}
    </div>
  </div>
</div>

<script is:inline>
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!toggle || !menu || !menuIcon || !closeIcon) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('translate-x-0');

      if (isOpen) {
        menu.classList.remove('translate-x-0');
        menu.classList.add('translate-x-full');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      } else {
        menu.classList.remove('translate-x-full');
        menu.classList.add('translate-x-0');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      }
    });
  }

  initMobileMenu();
  document.addEventListener('astro:page-load', initMobileMenu);
</script>
```

### 12. Create Header Component

```astro
---
// src/components/layout/Header.astro
import siteConfig from '../../../site-config.json';
import Navigation from './Navigation.astro';
import MobileMenu from './MobileMenu.astro';
import ThemeToggle from '../ui/ThemeToggle.astro';
import Button from '../ui/Button.astro';
import Container from '../sections/Container.astro';

const { site } = siteConfig;
---

<header class="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
  <Container>
    <div class="flex h-16 items-center justify-between">
      <div class="flex items-center gap-8">
        <a href="/" class="text-xl font-bold text-neutral-900 dark:text-white">
          {site.name}
        </a>
        <Navigation />
      </div>

      <div class="flex items-center gap-4">
        <ThemeToggle />
        <Button href="/contact" size="sm" class="hidden md:inline-flex">
          Get Started
        </Button>
        <MobileMenu />
      </div>
    </div>
  </Container>
</header>
```

### 13. Create Footer Component

```astro
---
// src/components/layout/Footer.astro
import siteConfig from '../../../site-config.json';
import Container from '../sections/Container.astro';

const { site, navigation, social } = siteConfig;
const currentYear = new Date().getFullYear();
---

<footer class="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
  <Container>
    <div class="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="col-span-1">
        <a href="/" class="text-xl font-bold text-neutral-900 dark:text-white">
          {site.name}
        </a>
        <p class="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {site.description}
        </p>
      </div>

      {navigation.footer.map(section => (
        <div>
          <h3 class="font-semibold text-neutral-900 dark:text-white mb-4">
            {section.title}
          </h3>
          <ul class="space-y-2">
            {section.links.map(link => (
              <li>
                <a
                  href={link.href}
                  class="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div class="py-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        © {currentYear} {site.name}. All rights reserved.
      </p>

      <div class="flex items-center gap-4">
        {social.twitter && (
          <a href={social.twitter} class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400" aria-label="Twitter">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400" aria-label="LinkedIn">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        )}
      </div>
    </div>
  </Container>
</footer>
```

### 14. Create Breadcrumb Component

```astro
---
// src/components/seo/Breadcrumb.astro
import Icon from '../ui/Icon.astro';

interface Props {
  items: Array<{ label: string; href?: string }>;
}

const { items } = Astro.props;
---

<nav aria-label="Breadcrumb" class="py-4">
  <ol class="flex items-center gap-2 text-sm">
    {items.map((item, index) => (
      <li class="flex items-center gap-2">
        {index > 0 && <Icon name="chevron-right" size="sm" class="text-neutral-400" />}
        {item.href ? (
          <a
            href={item.href}
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <span class="text-neutral-900 dark:text-white font-medium">
            {item.label}
          </span>
        )}
      </li>
    ))}
  </ol>
</nav>
```

### 15. Update Test Homepage

```astro
---
// src/pages/index.astro
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import Section from '@components/sections/Section.astro';
import Container from '@components/sections/Container.astro';
import Button from '@components/ui/Button.astro';
import Badge from '@components/ui/Badge.astro';
---

<BaseLayout title="Home" description="Welcome to the template">
  <Header />

  <Section padding="xl" background="gradient">
    <Container>
      <div class="text-center" data-animate="fade-up">
        <Badge variant="info">Phase 2 Complete</Badge>
        <h1 class="mt-6 text-6xl font-heading font-bold">
          Design System Ready
        </h1>
        <p class="mt-4 text-xl opacity-90 max-w-2xl mx-auto">
          UI components, layout system, dark mode, and view transitions implemented ✅
        </p>
        <div class="mt-8 flex items-center justify-center gap-4">
          <Button variant="secondary" size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>
    </Container>
  </Section>

  <Footer />
</BaseLayout>
```

## Todo List

- [ ] Update BaseLayout with ClientRouter and view transition scripts
- [ ] Add scroll animation utilities to global.css
- [ ] Create Button component (6 variants)
- [ ] Create Input component with validation states
- [ ] Create Badge component (5 variants)
- [ ] Create Tag component with optional close
- [ ] Create Icon component (7 common icons)
- [ ] Create ThemeToggle component (3-state with persistence)
- [ ] Create Section wrapper with padding/background variants
- [ ] Create Container with size variants
- [ ] Create Grid component (responsive cols)
- [ ] Create Divider component (3 variants)
- [ ] Create Spacer component (6 sizes)
- [ ] Create Navigation component (desktop nav from site-config)
- [ ] Create MobileMenu component (drawer-style)
- [ ] Create Header component (logo, nav, CTA, theme toggle)
- [ ] Create Footer component (multi-column from site-config)
- [ ] Create Breadcrumb component for SEO
- [ ] Update test homepage with design system components
- [ ] Test dark mode toggle (localStorage + system preference)
- [ ] Test view transitions between pages
- [ ] Test mobile menu open/close
- [ ] Test all button variants on dark background
- [ ] Verify scroll animations trigger on viewport entry
- [ ] Verify all components work in dark mode
- [ ] Test responsive layout (320px → 1536px)
- [ ] Run Lighthouse accessibility audit (target 100)

## Success Criteria

- All 15 components render without errors
- Dark mode toggle works and persists across page navigations
- View transitions smooth between page changes
- Mobile menu opens/closes correctly
- Header sticky on scroll
- All components accessible (ARIA labels, keyboard nav)
- Lighthouse accessibility score 100
- Zero console warnings
- Responsive from 320px to 1536px

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mobile menu z-index conflicts | Low | Use z-50, test with future modals |
| View transitions + dark mode flash | Medium | `astro:after-swap` event re-applies theme |
| Scroll animations performance | Low | Use IntersectionObserver, GPU-accelerated transforms |
| Icon component scalability | Low | Start with 7 icons, easy to extend later |

## Security Considerations

- No user input stored in this phase
- External links should have `rel="noopener noreferrer"` (add in Phase 3)
- Dark mode preference stored in localStorage (client-side only)

## Next Steps

→ **Phase 3**: Build 51 MDX Components (4 parallel agents)

**Dependencies**: Phase 3 requires Phase 2 complete (uses Button, Badge, Icon, Section, Container, Grid)
