import mediumZoom from 'medium-zoom'
import GlitchedWriter from 'glitched-writer'

const GLYPHS = '!<>-_\\/[]{}=+*^?#%&~01ABCDEF'

mediumZoom('.prose-content figure img, .prose-content > p > img', {
	background: 'rgba(10, 10, 10, 0.94)',
	margin: 32,
})

const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.post-toc a[href^="#"]'))
if (tocLinks.length) {
	const headings = tocLinks
		.map(a => document.getElementById(decodeURIComponent(a.getAttribute('href')!.slice(1))))
		.filter((h): h is HTMLElement => !!h)
	let suppressUntil = 0
	const setActive = (target: string | null) => {
		for (const a of tocLinks) a.classList.toggle('is-active', a.getAttribute('href') === target)
	}
	const update = () => {
		if (Date.now() < suppressUntil) return
		const trigger = window.innerHeight * 0.25
		let activeId: string | null = headings[0]?.id ?? null
		for (const h of headings) {
			if (h.getBoundingClientRect().top < trigger) activeId = h.id
			else break
		}
		const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
		if (atBottom) activeId = headings[headings.length - 1]?.id ?? activeId
		setActive(activeId ? `#${activeId}` : null)
	}
	update()
	addEventListener('scroll', update, { passive: true })
	addEventListener('resize', update, { passive: true })
	for (const a of tocLinks) {
		a.addEventListener('click', () => {
			setActive(a.getAttribute('href'))
			suppressUntil = Date.now() + 900
		})
	}
}

const title = document.querySelector<HTMLElement>('.post-title')
if (title && window.matchMedia('(min-width: 768px)').matches) {
	const final = (title.textContent ?? '').trim()
	if (final && final.length <= 120) {
		const wrap = document.createElement('span')
		wrap.style.cssText = 'position: relative; display: block; vertical-align: baseline;'
		const ghost = document.createElement('span')
		ghost.textContent = final
		ghost.style.cssText = 'visibility: hidden;'
		ghost.setAttribute('aria-hidden', 'true')
		const overlay = document.createElement('span')
		overlay.style.cssText = 'position: absolute; inset: 0;'
		wrap.append(ghost, overlay)
		title.replaceChildren(wrap)

		const writer = new GlitchedWriter(overlay, {
			steps: [1, 2],
			interval: [8, 20],
			glyphs: GLYPHS,
		})
		const seed = Array.from({ length: final.length }, () =>
			GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
		).join('')
		overlay.textContent = seed
		writer.write(final)
	}
}
