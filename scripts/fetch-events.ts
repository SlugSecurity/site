import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import ical, { type VEvent } from 'node-ical'
import { parseMeta } from '../src/lib/event-metadata'
import type { Event } from '../src/lib/events'
import { calendar } from '../src/consts'

const str = (v: unknown): string | undefined => {
	if (v === undefined || v === null) return undefined
	if (typeof v === 'string') return v
	if (typeof v === 'object' && 'val' in v && typeof (v as { val: unknown }).val === 'string') {
		return (v as { val: string }).val
	}
	return String(v)
}

const stripHtml = (v: unknown): string | undefined => {
	const s = str(v)
	if (!s) return s
	return s
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
		.replace(/\u00a0/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;|&#39;/g, "'")
		.replace(/\r\n/g, '\n')
		.replace(/[ \t]+/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim() || undefined
}

const OUT = resolve(process.cwd(), 'src/data/events.json')
const HORIZON_DAYS_PAST = 14
const HORIZON_DAYS_FUTURE = 77

function isInWindow(start: Date, now: Date) {
	const past = new Date(now.getTime() - HORIZON_DAYS_PAST * 86400_000)
	const future = new Date(now.getTime() + HORIZON_DAYS_FUTURE * 86400_000)
	return start >= past && start <= future
}

async function main() {
	console.log('fetching gcal ics...')
	const data = await ical.async.fromURL(calendar.icsUrl)
	const now = new Date()
	const out: Event[] = []

	for (const key of Object.keys(data)) {
		const raw = data[key]
		if (!raw || raw.type !== 'VEVENT') continue
		const ev = raw as VEvent

		const { meta, body } = parseMeta(stripHtml(ev.description))
		if (ev.rrule && ev.start && ev.end) {
			const occurrences = ev.rrule.between(
				new Date(now.getTime() - HORIZON_DAYS_PAST * 86400_000),
				new Date(now.getTime() + HORIZON_DAYS_FUTURE * 86400_000),
				true,
			)
			const duration = ev.end.getTime() - ev.start.getTime()
			for (const occ of occurrences) {
				const exMatch = Object.values(ev.exdate ?? {}).some(ex => Math.abs(ex.getTime() - occ.getTime()) < 60_000)
				if (exMatch) continue
				out.push({
					uid: `${ev.uid}-${occ.toISOString()}`,
					title: str(ev.summary) ?? '(untitled)',
					description: body,
					location: str(ev.location),
					start: occ.toISOString(),
					end: new Date(occ.getTime() + duration).toISOString(),
					url: str(ev.url),
					...meta,
				})
			}
			continue
		}

		if (!ev.start || !ev.end) continue
		const start = ev.start as Date
		const end = ev.end as Date
		if (!isInWindow(start, now)) continue
		out.push({
			uid: ev.uid,
			title: str(ev.summary) ?? '(untitled)',
			description: body,
			location: str(ev.location),
			start: start.toISOString(),
			end: end.toISOString(),
			url: str(ev.url),
			...meta,
		})
	}

	out.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

	await mkdir(dirname(OUT), { recursive: true })
	await writeFile(OUT, JSON.stringify(out, null, '\t') + '\n')
	console.log(`wrote ${out.length} events to ${OUT}`)
}

main().catch(err => {
	console.error('fetch-events failed:', err)
	process.exit(0) // keep cached events when the calendar fetch fails
})
