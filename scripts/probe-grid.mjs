// Map the card grid: for every Y from 100..890 in steps of 10, log how many
// horizontal card spans we see (off-white background between black gutters).
import sharp from 'sharp'

const SRC = 'brief_pages/page_4.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

function isCard(r, g, b) {
  return r > 220 && g > 215 && b > 200 && Math.abs(r - g) < 25 && r > b - 5
}

for (let y = 100; y < height; y += 8) {
  const spans = []
  let inCard = false, start = 0
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const card = isCard(data[i], data[i + 1], data[i + 2])
    if (card && !inCard) { inCard = true; start = x }
    else if (!card && inCard) {
      inCard = false
      if (x - start > 100) spans.push([start, x - 1])
    }
  }
  if (inCard && width - 1 - start > 100) spans.push([start, width - 1])
  if (spans.length >= 1) {
    console.log(`y=${y}: ${spans.length} -> ${spans.map(([a, b]) => `${a}..${b} (${b - a + 1})`).join('  ')}`)
  }
}
