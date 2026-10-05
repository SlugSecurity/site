import yaml from 'js-yaml'

export type EventMeta = {
	private?: string | boolean
	competition?: string | boolean
	host?: string
	tags?: string[]
}

export const parseMeta = (raw: string | undefined): { meta: EventMeta; body: string | undefined } => {
	if (!raw) return { meta: {}, body: undefined }
	const normalized = raw.replace(/\u00a0/g, ' ').replace(/\r\n?/g, '\n').trimStart()
	const m = normalized.match(/^---[ \t]*\n([\s\S]*?)\n[ \t]*---[ \t]*(?:\n|$)([\s\S]*)$/)
	if (!m) return { meta: {}, body: raw }
	const [, fm, rest] = m
	try {
		const parsed = (yaml.load(fm) ?? {}) as Record<string, unknown>
		const meta: EventMeta = {}
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
