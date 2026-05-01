import { calendar } from '@/consts'
import eventsData from '@/data/events.json'

export type Event = {
	uid: string
	title: string
	description?: string
	location?: string
	start: string
	end: string
	url?: string
	private?: string | boolean
	competition?: string | boolean
	host?: string
	tags?: string[]
}

export const events = eventsData as Event[]

export function fmtTimeRange(startIso: string, endIso: string): string {
	const opts = { hour: 'numeric', minute: '2-digit', timeZone: calendar.timezone } as const
	const startStr = new Date(startIso).toLocaleTimeString('en-US', opts)
	const endStr = new Date(endIso).toLocaleTimeString('en-US', opts)
	return `${startStr} \u2013 ${endStr}`
}

export function badgeText(v: string | boolean | undefined, fallback: string): string {
	if (typeof v === 'string' && v.toLowerCase() !== 'true') return `${fallback} \u00b7 ${v}`
	return fallback
}

export function truncate(s: string | undefined, max = 220): string | undefined {
	if (!s) return s
	const cleaned = s.replace(/\s+/g, ' ').trim()
	if (cleaned.length <= max) return cleaned
	return cleaned.slice(0, max).replace(/\s+\S*$/, '') + '\u2026'
}
