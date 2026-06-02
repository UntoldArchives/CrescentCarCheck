import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'brief_pages/page_4.png'
const OUT = 'public/why-us'

await mkdir(OUT, { recursive: true })

// Approximate icon bounding boxes inside the 1263x893 brief render.
// Order matches the 2x3 grid top-to-bottom, left-to-right.
// Card columns: left ~245-620, right ~639-1012.
// Icon sits in top-left of each card with ~25px padding.
const ICONS = [
  { name: 'customer-service.png', left: 252, top: 240, width: 72, height: 64 },
  { name: 'independent.png',      left: 664, top: 240, width: 72, height: 64 },
  { name: 'uae-market.png',       left: 252, top: 458, width: 96, height: 74 },
  { name: 'underbody.png',        left: 664, top: 458, width: 72, height: 64 },
  { name: 'evidence.png',         left: 252, top: 688, width: 72, height: 64 },
  { name: 'findings.png',         left: 664, top: 688, width: 68, height: 64 },
]

for (const icon of ICONS) {
  await sharp(SRC)
    .extract({ left: icon.left, top: icon.top, width: icon.width, height: icon.height })
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`${OUT}/${icon.name}`)
  console.log(`✓ ${icon.name}`)
}
