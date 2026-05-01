function relTime(start: Date): string {
	const ms = start.getTime() - Date.now()
	if (ms <= 0) return 'happening now'
	if (ms > 24 * 3600_000) return ''
	const mins = Math.floor(ms / 60_000)
	if (mins < 60) return `in ${mins} ${mins === 1 ? 'minute' : 'minutes'}`
	const hours = Math.floor(mins / 60)
	return `in ${hours} ${hours === 1 ? 'hour' : 'hours'}`
}

function tickCountdowns() {
	document.querySelectorAll<HTMLElement>('.countdown[data-start]').forEach(el => {
		const start = new Date(el.dataset.start ?? '')
		const txt = relTime(start)
		el.textContent = txt
		el.style.display = txt ? '' : 'none'
	})
}

tickCountdowns()
setInterval(tickCountdowns, 60_000)
