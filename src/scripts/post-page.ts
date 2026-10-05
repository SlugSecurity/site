import GlitchedWriter from 'glitched-writer'

for (const pre of document.querySelectorAll<HTMLElement>('.prose-content pre:not([data-language="plaintext"])')) {
	pre.tabIndex = 0
}

const images = document.querySelectorAll<HTMLImageElement>('.prose-content figure img, .prose-content > p > img')
if (images.length) {
	const dialog = document.createElement('dialog')
	dialog.className = 'image-dialog'
	dialog.setAttribute('aria-label', 'Enlarged image')
	const close = document.createElement('button')
	close.type = 'button'
	close.className = 'image-dismiss'
	close.setAttribute('aria-label', 'Close enlarged image')
	const enlarged = document.createElement('img')
	close.append(enlarged)
	dialog.append(close)
	document.body.append(dialog)
	let opener: HTMLButtonElement | null = null
	dialog.addEventListener('click', () => dialog.close())
	dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }))
	for (const img of images) {
		img.alt = img.alt.replace(/&#(?:x27|39);/gi, "'")
		if (img.closest('a, button')) continue
		const button = document.createElement('button')
		button.type = 'button'
		button.className = 'image-zoom'
		button.setAttribute('aria-haspopup', 'dialog')
		button.setAttribute('aria-label', img.alt ? `Enlarge image: ${img.alt}` : 'Enlarge image')
		img.replaceWith(button)
		button.append(img)
		button.addEventListener('click', () => {
			opener = button
			enlarged.src = img.currentSrc || img.src
			enlarged.alt = img.alt
			dialog.setAttribute('aria-label', img.alt ? `Enlarged image: ${img.alt}` : 'Enlarged image')
			enlarged.classList.toggle('invert', img.classList.contains('invert'))
			dialog.showModal()
		})
	}
}

const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.post-toc a[href^="#"]'))
if (tocLinks.length) {
	const headings = tocLinks
		.map(a => document.getElementById(decodeURIComponent(a.getAttribute('href')!.slice(1))))
		.filter((h): h is HTMLElement => !!h)
	let suppressUntil = 0
	const setActive = (target: string | null) => {
		for (const a of tocLinks) {
			const active = a.getAttribute('href') === target
			a.classList.toggle('is-active', active)
			if (active) a.setAttribute('aria-current', 'location')
			else a.removeAttribute('aria-current')
		}
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
const titleMotion = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
if (title && titleMotion.matches) {
	void document.fonts.ready.then(() => {
		const text = title.textContent?.trim() ?? ''
		if (!text || text.length > 120 || !titleMotion.matches) return
		const glyphs = '!<>-_\\/[]{}=+*^?#%&~01ABCDEF'
		const fitWords = new ResizeObserver(entries => {
			for (const { target, contentRect } of entries) {
				if (!contentRect.width) continue
				const animated = target as HTMLElement
				const width = animated.parentElement!.getBoundingClientRect().width
				animated.style.transform = `scaleX(${width / contentRect.width})`
			}
		})
		const words: { writer: GlitchedWriter; text: string }[] = []
		const content = document.createDocumentFragment()
		for (const part of text.split(/(\s+)/)) {
			if (/^\s+$/.test(part)) {
				content.append(part)
				continue
			}
			const word = document.createElement('span')
			word.className = 'post-title-word'
			const original = document.createElement('span')
			original.className = 'post-title-original'
			original.textContent = part
			const animated = document.createElement('span')
			animated.className = 'post-title-glitch'
			animated.setAttribute('aria-hidden', 'true')
			animated.textContent = Array.from(part, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join('')
			word.append(original, animated)
			content.append(word)
			fitWords.observe(animated)
			words.push({
				text: part,
				writer: new GlitchedWriter(animated, {
					steps: [5, 9],
					interval: [25, 45],
					delay: [0, 100],
					changeChance: 1,
					ghostChance: 0,
					mode: 'normal',
					glyphs,
				}),
			})
		}
		title.replaceChildren(content)
		let finished = false
		let timeout = 0
		const finish = () => {
			if (finished) return
			finished = true
			clearTimeout(timeout)
			fitWords.disconnect()
			for (const { writer } of words) writer.pause()
			title.textContent = text
			titleMotion.removeEventListener('change', finish)
		}
		titleMotion.addEventListener('change', finish, { once: true })
		timeout = window.setTimeout(finish, 900)
		void Promise.all(words.map(({ writer, text }) => writer.write(text))).then(finish, finish)
	})
}
