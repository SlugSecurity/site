import { site } from '@/consts'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const internalHosts = new Set([location.host, new URL(site.url).host])
const managedAttrs = new WeakMap<HTMLAnchorElement, { target: boolean; rel: string[] }>()

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!<>-_\\/[]{}=+*^?#%&~'

function scrambleChar(orig: string): string {
	if (/[A-Z]/.test(orig)) return UPPER[Math.floor(Math.random() * UPPER.length)]
	if (/[a-z]/.test(orig)) return LOWER[Math.floor(Math.random() * LOWER.length)]
	if (/[0-9]/.test(orig)) return DIGITS[Math.floor(Math.random() * DIGITS.length)]
	if (/\s/.test(orig)) return orig
	return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}

function isExternal(link: HTMLAnchorElement) {
	const href = link.getAttribute('href')?.trim()
	if (!href) return false
	try {
		const url = new URL(href, link.baseURI)
		return (url.protocol === 'https:' || url.protocol === 'http:') && !internalHosts.has(url.host)
	} catch {
		return false
	}
}

function applyExternalAttrs(link: HTMLAnchorElement, external: boolean) {
	const rel = new Set((link.rel || '').split(/\s+/).filter(Boolean))
	const managed = managedAttrs.get(link) ?? { target: false, rel: [] }
	if (external) {
		if (!link.hasAttribute('target')) {
			link.target = '_blank'
			managed.target = true
		}
		for (const token of ['noopener', 'noreferrer']) {
			if (rel.has(token)) continue
			rel.add(token)
			managed.rel.push(token)
		}
		managedAttrs.set(link, managed)
	} else if (managedAttrs.has(link)) {
		if (managed.target && link.target === '_blank') link.removeAttribute('target')
		for (const token of managed.rel) rel.delete(token)
		managedAttrs.delete(link)
	} else {
		return
	}
	if (rel.size) link.rel = Array.from(rel).join(' ')
	else link.removeAttribute('rel')
}

function textWalker(target: Element) {
	return document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			return node.textContent?.trim() && !node.parentElement?.closest('svg, .sr-only, [aria-hidden="true"]')
				? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
		},
	})
}

function externalIcon() {
	const ns = 'http://www.w3.org/2000/svg'
	const icon = document.createElementNS(ns, 'svg')
	icon.classList.add('external-link-icon')
	icon.setAttribute('viewBox', '0 0 10 10')
	icon.setAttribute('aria-hidden', 'true')
	icon.setAttribute('focusable', 'false')
	const path = document.createElementNS(ns, 'path')
	path.setAttribute('d', 'M2 8L8 2M8 2H3.5M8 2V6.5')
	path.setAttribute('fill', 'none')
	path.setAttribute('stroke', 'currentColor')
	path.setAttribute('stroke-width', '1.2')
	icon.append(path)
	return icon
}

function syncExternalIcon(link: HTMLAnchorElement, external: boolean) {
	let content = link.querySelector<HTMLSpanElement>(':scope > .external-link-content')
	const icon = link.querySelector<SVGSVGElement>('.external-link-icon')
	const hasText = Boolean(link.querySelector('.link-scramble-text') || textWalker(link).nextNode())
	if (!external || !hasText) {
		icon?.remove()
		if (content) content.replaceWith(...content.childNodes)
		return
	}
	const display = getComputedStyle(link).display
	if (display.includes('flex') && !content) {
		content = document.createElement('span')
		content.className = 'external-link-content'
		content.append(...link.childNodes)
		link.append(content)
	}
	if (!icon) {
		const parent = content ?? link
		parent.append(externalIcon())
	}
}

type ScrambleCharacter = {
	source: HTMLSpanElement
	glyph: HTMLSpanElement
	text: string
}

const characters = new WeakMap<HTMLAnchorElement, ScrambleCharacter[]>()
const playing = new WeakSet<HTMLAnchorElement>()
const scrambleQuery = window.matchMedia('(min-width: 768px) and (hover: hover)')

function scramble(link: HTMLAnchorElement, chars: ScrambleCharacter[], durationMs = 420) {
	const start = performance.now()
	const range = document.createRange()
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / durationMs)
		if (t === 1 || reducedMotion.matches || !scrambleQuery.matches) {
			for (const { source, glyph } of chars) {
				source.style.opacity = ''
				glyph.hidden = true
			}
			playing.delete(link)
			return
		}
		const reveal = Math.floor(t * chars.length * 1.15)
		chars.forEach(({ source, glyph, text }, index) => {
			source.style.opacity = '0'
			glyph.hidden = false
			glyph.style.transform = ''
			glyph.textContent = index < reveal ? text : scrambleChar(text)
		})
		const transforms = chars.map(({ source, glyph }) => {
			const original = source.getBoundingClientRect()
			range.selectNodeContents(glyph)
			const animated = range.getBoundingClientRect()
			return {
				scale: animated.width ? original.width / animated.width : 1,
				y: original.top - animated.top,
			}
		})
		chars.forEach(({ glyph }, index) => {
			glyph.style.transform = `translateY(${transforms[index].y}px) scaleX(${transforms[index].scale})`
		})
		requestAnimationFrame(step)
	}
	playing.add(link)
	requestAnimationFrame(step)
}

function attachScramble(link: HTMLAnchorElement): ScrambleCharacter[] {
	if (link.querySelector('img')) return []
	const target = link.querySelector<HTMLElement>('[data-scramble], h2, h3, h4') ?? link
	const walker = textWalker(target)
	const nodes: Text[] = []
	while (walker.nextNode()) nodes.push(walker.currentNode as Text)
	const chars: ScrambleCharacter[] = []
	for (const node of nodes) {
		const run = document.createElement('span')
		run.className = 'link-scramble-text'
		for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
			const decoration = getComputedStyle(ancestor).textDecorationLine
			if (decoration !== 'none') {
				run.style.textDecorationLine = decoration
				break
			}
			if (ancestor === link) break
		}
		const accessible = document.createElement('span')
		accessible.className = 'sr-only'
		accessible.textContent = node.data
		const visual = document.createElement('span')
		visual.setAttribute('aria-hidden', 'true')
		run.append(accessible, visual)
		for (const text of node.data) {
			if (/\s/.test(text)) {
				visual.append(text)
				continue
			}
			const cell = document.createElement('span')
			cell.className = 'link-scramble-char'
			const source = document.createElement('span')
			source.className = 'link-scramble-source'
			source.textContent = text
			const glyph = document.createElement('span')
			glyph.className = 'link-scramble-glyph'
			glyph.setAttribute('aria-hidden', 'true')
			glyph.hidden = true
			cell.append(source, glyph)
			visual.append(cell)
			chars.push({ source, glyph, text })
		}
		node.replaceWith(run)
	}
	characters.set(link, chars)
	return chars
}

function enhance(link: HTMLAnchorElement) {
	const external = isExternal(link)
	applyExternalAttrs(link, external)
	syncExternalIcon(link, external)
}

function attachAll() {
	document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(enhance)
}

document.addEventListener(
	'mouseover',
	e => {
		const link = (e.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
		if (!link || reducedMotion.matches || !scrambleQuery.matches) return
		if (e.relatedTarget instanceof Node && link.contains(e.relatedTarget)) return
		if (playing.has(link)) return
		const chars = characters.get(link) ?? attachScramble(link)
		if (chars.length) scramble(link, chars)
	},
	{ passive: true },
)

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', attachAll)
} else {
	attachAll()
}
document.addEventListener('astro:page-load', attachAll)

new MutationObserver(records => {
	const links = new Set<HTMLAnchorElement>()
	for (const record of records) {
		if (record.target instanceof HTMLAnchorElement) links.add(record.target)
		if (record.target instanceof Element && record.target.matches('.external-link-content') &&
			record.target.parentElement instanceof HTMLAnchorElement) links.add(record.target.parentElement)
		for (const node of record.addedNodes) {
			if (!(node instanceof Element)) continue
			if (node instanceof HTMLAnchorElement) links.add(node)
			node.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => links.add(link))
		}
	}
	for (const link of links) if (link.isConnected) enhance(link)
}).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] })
