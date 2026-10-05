import assert from 'node:assert/strict'
import test from 'node:test'
import { parseMeta } from '../src/lib/event-metadata'

test('parses Google Calendar nonbreaking spaces and indented delimiters', () => {
	const result = parseMeta('---\n\u00a0competition: CCDC\n\u00a0---\n\nPlease contact the captain.')
	assert.deepEqual(result, {
		meta: { competition: 'CCDC' },
		body: 'Please contact the captain.',
	})
})

test('preserves supported metadata and multiline description', () => {
	const result = parseMeta('---\r\nprivate: working group\r\ncompetition: true\r\nhost: Captain\r\ntags: ccdc, blue-team\r\n---\r\nFirst paragraph.\r\n\r\nSecond paragraph.')
	assert.deepEqual(result, {
		meta: { private: 'working group', competition: true, host: 'Captain', tags: ['ccdc', 'blue-team'] },
		body: 'First paragraph.\n\nSecond paragraph.',
	})
})

test('handles metadata without a description and false competition flags', () => {
	assert.deepEqual(parseMeta('---\ncompetition: false\ntags: [social, workshop]\n---'), {
		meta: { competition: false, tags: ['social', 'workshop'] }, body: undefined,
	})
})

test('keeps ordinary, unclosed, and invalid metadata descriptions intact', () => {
	for (const body of ['Competition workshop', '---\ncompetition: CCDC', '---\ntags: [invalid\n---\nDescription']) {
		assert.deepEqual(parseMeta(body), { meta: {}, body })
	}
	assert.deepEqual(parseMeta(undefined), { meta: {}, body: undefined })
})
