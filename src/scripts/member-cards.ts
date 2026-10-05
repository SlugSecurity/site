const context = document.createElement('canvas').getContext('2d')

function inkBounds(element: HTMLElement) {
	const node = element.firstChild
	if (!context || !(node instanceof Text)) return null

	const style = getComputedStyle(element)
	const lines: { text: string; top: number }[] = []
	const range = document.createRange()

	for (let index = 0; index < node.length; index++) {
		range.setStart(node, index)
		range.setEnd(node, index + 1)
		const rect = range.getBoundingClientRect()
		if (!lines.length || rect.top > lines[lines.length - 1].top + 1) lines.push({ text: '', top: rect.top })
		lines[lines.length - 1].text += node.data[index]
	}
	if (!lines.length) return null

	context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
	const text = (line: string) => style.textTransform === 'uppercase' ? line.toUpperCase() : line
	const firstLine = lines[0]
	const lastLine = lines[lines.length - 1]
	const first = context.measureText(text(firstLine.text))
	const last = context.measureText(text(lastLine.text))
	return {
		top: firstLine.top + first.fontBoundingBoxAscent - first.actualBoundingBoxAscent,
		bottom: lastLine.top + last.fontBoundingBoxAscent + last.actualBoundingBoxDescent,
	}
}

function balanceSpacing(info: HTMLElement) {
	const role = info.querySelector<HTMLElement>('.officer-identity > .label-sm')
	const name = info.querySelector<HTMLElement>('h4')
	const handle = info.querySelector<HTMLElement>('.officer-handle')
	const meta = info.querySelector<HTMLElement>('.officer-meta')
	if (!role || !name || !handle || !meta) return

	const roleInk = inkBounds(role)
	const nameInk = inkBounds(name)
	const handleInk = inkBounds(handle)
	if (!roleInk || !nameInk || !handleInk) return

	const roleNameGap = nameInk.top - roleInk.bottom
	const nameHandleGap = handleInk.top - nameInk.bottom
	const difference = roleNameGap - nameHandleGap
	if (Math.abs(difference) < 0.02) return

	const margin = parseFloat(getComputedStyle(meta).marginTop)
	meta.style.marginTop = `${margin + difference}px`
}

const cards = document.querySelectorAll<HTMLElement>('.officer-info')
document.fonts.addEventListener('loadingdone', () => cards.forEach(balanceSpacing))

void document.fonts.ready.then(() => {
	const observer = new ResizeObserver(entries => {
		const cards = new Set(entries.map(entry => entry.target.closest<HTMLElement>('.officer-info')))
		for (const card of cards) {
			if (card) balanceSpacing(card)
		}
	})
	for (const info of cards) {
		balanceSpacing(info)
		for (const element of info.querySelectorAll('.officer-identity, .officer-handle')) observer.observe(element)
	}
})
