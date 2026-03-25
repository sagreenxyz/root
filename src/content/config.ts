import { defineCollection, z } from 'astro:content';

const foundationsOfNursing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    chapterNumber: z.number(),
    unit: z.string(),
  }),
});

const lectureNotes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    course: z.string(),
    lecturer: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    issueNumber: z.number().optional(),
  }),
});

export const collections = {
  'foundations-of-nursing': foundationsOfNursing,
  'lecture-notes': lectureNotes,
};
