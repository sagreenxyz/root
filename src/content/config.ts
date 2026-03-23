import { defineCollection, z } from 'astro:content';

const foundationsOfNursing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    chapterNumber: z.number(),
    unit: z.string(),
  }),
});

export const collections = {
  'foundations-of-nursing': foundationsOfNursing,
};
