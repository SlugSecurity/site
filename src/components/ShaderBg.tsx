import { Dithering } from '@paper-design/shaders-react'
import { useEffect, useState } from 'react'

export default function ShaderBg() {
	const [reduced, setReduced] = useState(false)

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		setReduced(mq.matches)
		const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
		mq.addEventListener('change', onChange)
		return () => mq.removeEventListener('change', onChange)
	}, [])

	if (reduced) {
		return <div aria-hidden className="fixed inset-0 -z-10 bg-(--color-bg)" />
	}

	return (
		<div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-(--color-bg)">
			<Dithering
				colorBack="#0a0a0a"
				colorFront="#262626"
				shape="simplex"
				type="4x4"
				size={2}
				speed={0}
				scale={1}
				style={{ width: '100%', height: '100%', opacity: 0.85 }}
			/>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse at center top, transparent 0%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.95) 100%)',
				}}
			/>
		</div>
	)
}
