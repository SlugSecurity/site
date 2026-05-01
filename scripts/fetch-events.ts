import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import ical, { type VEvent } from 'node-ical'
import yaml from 'js-yaml'
import type { Event } from '../src/lib/events'
import { calendar } from '../src/consts'

// Format for Google Calendar event descriptions:
//
// ---
// private: working group
// competition: CCDC
// host: Korben Tompkin
// tags: ccdc, blue-team
// ---
// Real description goes after the second ---.
//
// All fields are optional. `private` and `competition` can be `true` or a
// string (e.g. audience name or competition name). `tags` can be a comma list
// or YAML array.

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
		.replace(/&nbsp;/g, ' ')
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

type Meta = {
	private?: string | boolean
	competition?: string | boolean
	host?: string
	tags?: string[]
}

const parseMeta = (raw: string | undefined): { meta: Meta; body: string | undefined } => {
	if (!raw) return { meta: {}, body: undefined }
	const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
	if (!m) return { meta: {}, body: raw }
	const [, fm, rest] = m
	try {
		const parsed = (yaml.load(fm) ?? {}) as Record<string, unknown>
		const meta: Meta = {}
		const isStrOrBool = (v: unknown): v is string | boolean => typeof v === 'string' || typeof v === 'boolean'
		if (isStrOrBool(parsed.private)) meta.private = parsed.private
		if (isStrOrBool(parsed.competition)) meta.competition = parsed.competition
		if (parsed.host !== undefined) meta.host = String(parsed.host)
		if (parsed.tags !== undefined) {
			const t = parsed.tags
			meta.tags = Array.isArray(t)
				? t.map(String).map(s => s.trim()).filter(Boolean)
				: String(t).split(',').map(s => s.trim()).filter(Boolean)
		}
		return { meta, body: rest.trim() || undefined }
	} catch {
		return { meta: {}, body: raw }
	}
}

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
		const metaSpread = {
			...(meta.private !== undefined && { private: meta.private }),
			...(meta.competition !== undefined && { competition: meta.competition }),
			...(meta.host !== undefined && { host: meta.host }),
			...(meta.tags !== undefined && { tags: meta.tags }),
		}

		if (ev.rrule && ev.start && ev.end) {
			const occurrences = ev.rrule.between(
				new Date(now.getTime() - HORIZON_DAYS_PAST * 86400_000),
				new Date(now.getTime() + HORIZON_DAYS_FUTURE * 86400_000),
				true,
			)
			const duration = ev.end.getTime() - ev.start.getTime()
			for (const occ of occurrences) {
				const exMatch = ev.exdate
					? Object.keys(ev.exdate).some(k => {
						const ex = ev.exdate![k]
						return Math.abs(ex.getTime() - occ.getTime()) < 60_000
					})
					: false
				if (exMatch) continue
				out.push({
					uid: `${ev.uid}-${occ.toISOString()}`,
					title: str(ev.summary) ?? '(untitled)',
					description: body,
					location: str(ev.location),
					start: occ.toISOString(),
					end: new Date(occ.getTime() + duration).toISOString(),
					url: str(ev.url),
					...metaSpread,
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
			...metaSpread,
		})
	}

	out.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

	await mkdir(dirname(OUT), { recursive: true })
	await writeFile(OUT, JSON.stringify(out, null, '\t') + '\n')
	console.log(`wrote ${out.length} events to ${OUT}`)
}

main().catch(err => {
	// exit 0 so a transient gcal failure doesn't fail the build, last fetched events.json wins
	console.error('fetch-events failed:', err)
	process.exit(0)
})
