export function normalizeLegacyShortcodes(text: string): string {
	return text.replaceAll(':material-trademark:', '\u2122')
}

type TextNode = {
	type: string
	value?: string
	children?: TextNode[]
}

export function remarkLegacyShortcodes() {
	const walk = (node: TextNode) => {
		if (node.type === 'text' && node.value) node.value = normalizeLegacyShortcodes(node.value)
		node.children?.forEach(walk)
	}
	return walk
}
