import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('default'),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    contentType: z.literal('blog').default('blog'),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    // Pipeline fields
    authorCredentials: z.string().optional(),
    category: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    steps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    specs: z.record(z.string()).optional(),
    contentType: z.literal('product').default('product'),
    draft: z.boolean().default(false),
    // Pipeline fields
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    publishDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    contentType: z.enum([
      'landing', 'generic', 'homepage', 'about', 'contact',
      'product', 'product-list', 'blog-list',
      'reviews', 'gallery', 'video-hub'
    ]).default('generic'),
    draft: z.boolean().default(false),
    // Pipeline fields
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    author: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    specs: z.record(z.string()).optional(),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    steps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    category: z.string().optional(),
    authorCredentials: z.string().optional(),
  }),
});

export const collections = { blog, products, pages };
