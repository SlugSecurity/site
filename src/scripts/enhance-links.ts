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

function isExternal(href: string) {
	if (!href) return false
	if (href.startsWith('mailto:') || href.startsWith('tel:')) return true
	if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) return false
	try {
		const u = new URL(href, location.origin)
		return u.origin !== location.origin
	} catch {
		return false
	}
}

function applyExternalAttrs(link: HTMLAnchorElement) {
	if (!isExternal(link.getAttribute('href') ?? '')) return
	if (!link.hasAttribute('target')) link.target = '_blank'
	const rel = new Set((link.rel || '').split(/\s+/).filter(Boolean))
	rel.add('noopener')
	rel.add('noreferrer')
	link.rel = Array.from(rel).join(' ')
}

function scrambleSpan(span: HTMLSpanElement, finalText: string, durationMs = 400) {
	const len = finalText.length
	const start = performance.now()
	let raf = 0
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / durationMs)
		const reveal = Math.floor(t * len * 1.15)
		let out = ''
		for (let i = 0; i < len; i++) {
			out += i < reveal ? finalText[i] : scrambleChar(finalText[i] ?? 'a')
		}
		span.textContent = out
		if (t < 1) raf = requestAnimationFrame(step)
		else span.textContent = finalText
	}
	cancelAnimationFrame(raf)
	raf = requestAnimationFrame(step)
}

const overlays = new WeakMap<HTMLAnchorElement, HTMLSpanElement>()
const originals = new WeakMap<HTMLAnchorElement, string>()
const playing = new WeakSet<HTMLAnchorElement>()

const INLINE_FORMATTERS = new Set(['STRONG', 'EM', 'B', 'I', 'CODE', 'U', 'MARK', 'INS', 'DEL'])

function attachScramble(link: HTMLAnchorElement) {
	if (link.querySelector('img, svg')) return

	const marker = link.querySelector<HTMLElement>('[data-scramble]')
	const direct: Text | undefined = !marker
		? Array.from(link.childNodes).find(
			(n): n is Text => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim().length ?? 0) > 0,
		)
		: undefined

	const elementChildren = Array.from(link.children) as HTMLElement[]
	const wrappedFormatter = !marker && !direct
		&& elementChildren.length === 1
		&& INLINE_FORMATTERS.has(elementChildren[0].tagName)
		&& link.childNodes.length === 1
		? elementChildren[0]
		: null

	const text = marker?.textContent ?? direct?.textContent ?? wrappedFormatter?.textContent ?? ''
	const trimmed = text.trim()
	if (!trimmed || trimmed.length > 200) return
	if (!marker && !direct && !wrappedFormatter) return

	const wrap = document.createElement('span')
	wrap.style.cssText = 'position: relative; display: inline-block; vertical-align: baseline; line-height: inherit; text-decoration: inherit; text-decoration-color: inherit;'

	const ghost = document.createElement('span')
	ghost.textContent = text
	ghost.style.cssText = 'visibility: hidden; white-space: pre; text-decoration: inherit;'
	ghost.setAttribute('aria-hidden', 'true')

	const overlay = document.createElement('span')
	overlay.textContent = text
	overlay.style.cssText = 'position: absolute; inset: 0; white-space: pre; text-decoration: inherit; text-decoration-color: inherit;'

	wrap.append(ghost, overlay)
	if (marker) {
		marker.replaceChildren(wrap)
	} else if (direct) {
		direct.replaceWith(wrap)
	} else if (wrappedFormatter) {
		wrappedFormatter.replaceChildren(wrap)
	}

	overlays.set(link, overlay)
	originals.set(link, trimmed)
}

function enhance(link: HTMLAnchorElement) {
	if (link.dataset.linkEnhanced) return
	link.dataset.linkEnhanced = '1'
	applyExternalAttrs(link)
	attachScramble(link)
}

function attachAll() {
	document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(enhance)
}

document.addEventListener(
	'mouseover',
	e => {
		const link = (e.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
		if (!link) return
		const overlay = overlays.get(link)
		const text = originals.get(link)
		if (!overlay || !text) return
		if (playing.has(link)) return
		playing.add(link)
		scrambleSpan(overlay, text, 420)
		setTimeout(() => playing.delete(link), 480)
	},
	{ passive: true },
)

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', attachAll)
} else {
	attachAll()
}
document.addEventListener('astro:page-load', attachAll)
