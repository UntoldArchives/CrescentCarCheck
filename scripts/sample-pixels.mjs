import sharp from 'sharp'

const SRC = 'brief_pages/page_4.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width, channels } = info

// Sample a vertical strip down the centre of each column at known x positions
// where the brief icons should sit. We're looking for non-white pixels.
const samples = [
  { label: 'col-1 strip', x: 235 },
  { label: 'col-2 strip', x: 730 },
]

for (const s of samples) {
  console.log(`\n--- ${s.label} (x=${s.x}) ---`)
  for (let y = 200; y < 800; y += 10) {
    const i = (y * width + s.x) * channels
    const r = data[i], g = data[i + 1], b = data[i + 2]
    if (r > 240 && g > 240 && b > 240) continue // skip near-white
    if (r < 30 && g < 30 && b < 30) continue   // skip near-black
    console.log(`  y=${y}  rgb(${r},${g},${b})`)
  }
}
