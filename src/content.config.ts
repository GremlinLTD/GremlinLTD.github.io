import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const onboarding = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/onboarding' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    step: z.number(),
  }),
});

export const collections = { guides, onboarding };
