import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const cleanId = ({ entry }: { entry: string }) =>
	entry
		.replace(/^data\//, '')
		.replace(/\/index\.md$/, '')
		.replace(/\.md$/, '')

const posts = defineCollection({
	loader: glob({
		pattern: 'data/**/*.md',
		base: './src/posts',
		generateId: cleanId,
	}),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		categories: z.array(z.string()).default([]),
		authors: z.array(z.string()).default([]),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		excerpt: z.string().optional(),
	}).transform(d => ({
		...d,
		tags: Array.from(new Set([...d.tags, ...d.categories.map(c => c.toLowerCase())])),
	})),
})

export const collections = { posts }
