import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { articles };
