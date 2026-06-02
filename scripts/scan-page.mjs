import sharp from 'sharp'

const SRC = 'brief_pages/page_4.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

// Scan the whole page for non-white, non-black pixels and report bounding
// boxes of connected regions. Looser threshold so we catch faded yellow,
// brown palm trunks, grey accent strokes, etc.
const isContent = new Uint8Array(width * height)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const r = data[i], g = data[i + 1], b = data[i + 2]
    // Skip the card background (warm off-white)
    if (r > 230 && g > 225 && b > 215) continue
    // Skip the page background (dark)
    if (r < 30 && g < 30 && b < 30) continue
    // Keep "yellowish": R high and R > B by a wide margin
    if (r > 150 && r - b > 60) isContent[y * width + x] = 1
  }
}

const visited = new Uint8Array(width * height)
const blobs = []
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x
    if (!isContent[idx] || visited[idx]) continue
    const stack = [idx]
    let minX = x, maxX = x, minY = y, maxY = y, count = 0
    while (stack.length) {
      const cur = stack.pop()
      if (visited[cur]) continue
      visited[cur] = 1
      count++
      const cy = (cur / width) | 0
      const cx = cur - cy * width
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy
      if (cx > 0 && isContent[cur - 1] && !visited[cur - 1]) stack.push(cur - 1)
      if (cx < width - 1 && isContent[cur + 1] && !visited[cur + 1]) stack.push(cur + 1)
      if (cy > 0 && isContent[cur - width] && !visited[cur - width]) stack.push(cur - width)
      if (cy < height - 1 && isContent[cur + width] && !visited[cur + width]) stack.push(cur + width)
    }
    if (count >= 30) blobs.push({ minX, maxX, minY, maxY, count })
  }
}

console.log(`Found ${blobs.length} yellow blobs >= 30px`)

// Cluster blobs into icon groups by spatial proximity.
const EXPAND = 25
function overlap(a, b) {
  return !(
    a.maxX + EXPAND < b.minX ||
    b.maxX + EXPAND < a.minX ||
    a.maxY + EXPAND < b.minY ||
    b.maxY + EXPAND < a.minY
  )
}
const groups = []
for (const c of blobs) {
  let merged = false
  for (const g of groups) {
    if (g.some((m) => overlap(m, c))) { g.push(c); merged = true; break }
  }
  if (!merged) groups.push([c])
}
let changed = true
while (changed) {
  changed = false
  outer: for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      if (groups[i].some((a) => groups[j].some((b) => overlap(a, b)))) {
        groups[i].push(...groups[j]); groups.splice(j, 1); changed = true; break outer
      }
    }
  }
}

const boxes = groups.map((g) => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, total = 0
  for (const c of g) {
    if (c.minX < minX) minX = c.minX
    if (c.maxX > maxX) maxX = c.maxX
    if (c.minY < minY) minY = c.minY
    if (c.maxY > maxY) maxY = c.maxY
    total += c.count
  }
  return { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1, total }
}).filter((b) => b.w >= 30 && b.h >= 30 && b.w <= 220 && b.h <= 220)
  .sort((a, b) => a.minY - b.minY || a.minX - b.minX)

console.log(`Image: ${width}x${height}`)
console.log(`Found ${boxes.length} icon-sized groups:`)
for (const b of boxes) {
  console.log(`  x=${b.minX}..${b.maxX} (w=${b.w})  y=${b.minY}..${b.maxY} (h=${b.h})  pixels=${b.total}`)
}
