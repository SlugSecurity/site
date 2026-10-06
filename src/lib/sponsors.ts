import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'
import { sponsors as originals } from '@/consts'

const images = import.meta.glob<ImageMetadata>('/public/_assets/sponsors/*.png', { eager: true, import: 'default' })

export const sponsors = await Promise.all(originals.map(async sponsor => {
	const src = images[`/public${sponsor.logo}`]
	if (!src) return sponsor
	// 2x the About page's 7rem height / 18rem width at its 17.6px desktop root size.
	const image = await getImage({ src, width: sponsor.aspect === 'square' ? 247 : 634, height: 247, fit: 'contain', format: 'webp' })
	return { ...sponsor, logo: image.src }
}))
