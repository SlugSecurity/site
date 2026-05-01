import { getCollection, type CollectionEntry } from 'astro:content'

type Post = CollectionEntry<'posts'>

export async function getAllPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', e => !e.data.draft)
	return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getExcerpt(post: Post, maxLen = 180): string {
	if (post.data.excerpt) return post.data.excerpt
	const body = post.body ?? ''
	// honor the <!-- more --> excerpt cut convention from MkDocs posts
	const cut = body.split(/<!--\s*more\s*-->/i)[0] ?? body
	const cleaned = cut
		.replace(/```[\s\S]*?```/g, '')
		.replace(/!!![^\n]*\n(?:\s{4,}[^\n]*\n)*/g, '')
		// strip remark callout directives: opening `:::name{attrs}` and closing `:::`
		.replace(/^:::\s*\w*\s*(?:\{[^}]*\})?\s*$/gm, '')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		// strip remark-imgattr trailing attribute groups like `(class: "invert")`
		.replace(/\(\s*[\w-]+\s*:\s*"[^"]*"\s*\)/g, '')
		.replace(/<[^>]+>/g, '')
		.replace(/[#*_`]/g, '')
		.replace(/\s+/g, ' ')
		.trim()
	if (cleaned.length <= maxLen) return cleaned
	return cleaned.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}
