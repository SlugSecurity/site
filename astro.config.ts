import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@tailwindcss/vite'
import icon from 'astro-icon'
import expressiveCode from 'astro-expressive-code'
import remarkDirective from 'remark-directive'
import remarkCalloutDirectives from '@microflash/remark-callout-directives'
import remarkImgAttr from 'remark-imgattr'
import rehypeFigureTitle from 'rehype-figure-title'
import { remarkLegacyShortcodes } from './src/lib/post-shortcodes'

type ContentNode = {
	type: string
	tagName?: string
	properties?: Record<string, unknown>
	value?: string
	children?: ContentNode[]
}

function labelEmbeddedMedia() {
	return (tree: ContentNode, file: { data: { astro?: { frontmatter?: { title?: string } } } }) => {
		const title = `Video accompanying ${file.data.astro?.frontmatter?.title ?? 'this article'}`
		const escapedTitle = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
		const walk = (node: ContentNode) => {
			if (node.tagName === 'iframe') {
				node.properties ??= {}
				node.properties.title ||= title
			}
			if (node.type === 'raw' && node.value) {
				node.value = node.value.replace(/<iframe\b([^>]*)>/gi, (tag, attributes: string) =>
					/\btitle\s*=/i.test(attributes) ? tag : `<iframe title="${escapedTitle}"${attributes}>`,
				)
			}
			node.children?.forEach(walk)
		}
		walk(tree)
	}
}

function recoverInlineDirectives() {
	const reconstruct = (node: any): string => {
		const prefix = node.type === 'leafDirective' ? '::' : ':'
		let out = prefix + (node.name ?? '')
		if (node.children?.length) {
			const inner = node.children.map((c: any) => c.type === 'text' ? c.value : reconstruct(c)).join('')
			out += '[' + inner + ']'
		}
		const attrs = node.attributes ?? {}
		const keys = Object.keys(attrs)
		if (keys.length) {
			out += '{' + keys.map(k => attrs[k] === '' ? k : `${k}="${attrs[k]}"`).join(' ') + '}'
		}
		return out
	}
	const walk = (parent: any) => {
		if (!parent.children) return
		for (let i = 0; i < parent.children.length; i++) {
			const child = parent.children[i]
			if (child.type === 'textDirective' || child.type === 'leafDirective') {
				parent.children[i] = { type: 'text', value: reconstruct(child) } // directive parsing also consumes colons in times
			} else {
				walk(child)
			}
		}
	}
	return (tree: any) => walk(tree)
}

const calloutOpts = {
	aliases: {
		info: 'assert',
		success: 'commend',
		danger: 'deter',
		question: 'note',
	},
	callouts: {
		quote: {
			title: 'Quote',
			hint: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>`,
		},
	},
}

export default defineConfig({
	site: 'https://slugsec.ucsc.edu',
	integrations: [
		expressiveCode({
			themes: ['github-dark-default'],
			styleOverrides: {
				codeFontFamily: 'var(--font-mono)',
				codeFontSize: 'var(--text-meta)',
				uiFontFamily: 'var(--font-pixel)',
				uiFontSize: 'var(--text-meta)',
				borderRadius: '0',
				borderColor: 'var(--color-line)',
				codeBackground: 'var(--color-bg-elev)',
				frames: {
					editorActiveTabBackground: 'var(--color-bg-panel)',
					editorTabBarBackground: 'var(--color-bg)',
					terminalBackground: 'var(--color-bg-elev)',
					terminalTitlebarBackground: 'var(--color-bg)',
				},
			},
		}),
		react(),
		mdx(),
		sitemap(),
		icon({
			iconDir: 'src/icons',
		}),
	],
	markdown: {
		remarkPlugins: [
			remarkDirective,
			[remarkCalloutDirectives, calloutOpts],
			recoverInlineDirectives,
			remarkLegacyShortcodes,
			remarkImgAttr,
		],
		rehypePlugins: [
			labelEmbeddedMedia,
			[rehypeFigureTitle, { className: 'post-figure' }],
		],
	},
	redirects: {
		'/about/officers': '/members',
		'/about/faqs': '/about',
		'/about/sponsors': '/about#sponsors',
		'/givingday': '/about#sponsors',
		'/discord': 'https://discord.gg/NUVZCumQXB',
		'/register': 'https://forms.gle/Ae97RjFZ8M2JJgF87',
		'/interest': 'https://forms.gle/qj2SEN1eYGDes1Sr8',
		'/posts/CyberForce-2021': '/posts/2021/cyberforce',
		'/posts/Codebreaker-2021': '/posts/2021/codebreaker',
		'/posts/CyberForce-2022': '/posts/2022/cyberforce',
		'/posts/Codebreaker-2022': '/posts/2022/codebreaker',
		'/posts/eCTF-2023': '/posts/2023/eCTF',
		'/posts/Laundry-2024': '/posts/2024/laundry',
		'/2021/11/CyberForce': '/posts/2021/cyberforce',
		'/2021/12/Codebreaker': '/posts/2021/codebreaker',
		'/2022/11/CyberForce': '/posts/2022/cyberforce',
		'/2022/12/Codebreaker': '/posts/2022/codebreaker',
		'/2023/04/eCTF': '/posts/2023/eCTF',
	},
	vite: {
		plugins: [tailwind()],
	},
	build: {
		format: 'directory',
	},
})
