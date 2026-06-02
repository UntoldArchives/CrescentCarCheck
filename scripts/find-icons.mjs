import sharp from 'sharp'

const SRC = 'brief_pages/page_4.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

// Build a boolean grid of "yellow-ish" pixels (the brief icons are #FFC600).
const isYellow = new Uint8Array(width * height)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // Roughly: high R, mid-high G, low B
    if (r > 200 && g > 140 && g < 220 && b < 110) {
      isYellow[y * width + x] = 1
    }
  }
}

// Flood-fill to find connected components.
const visited = new Uint8Array(width * height)
const components = []
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x
    if (!isYellow[idx] || visited[idx]) continue
    // BFS
    const stack = [idx]
    let minX = x, maxX = x, minY = y, maxY = y, count = 0
    while (stack.length) {
      const cur = stack.pop()
      if (visited[cur]) continue
      visited[cur] = 1
      count++
      const cy = (cur / width) | 0
      const cx = cur - cy * width
      if (cx < minX) minX = cx
      if (cx > maxX) maxX = cx
      if (cy < minY) minY = cy
      if (cy > maxY) maxY = cy
      if (cx > 0 && isYellow[cur - 1] && !visited[cur - 1]) stack.push(cur - 1)
      if (cx < width - 1 && isYellow[cur + 1] && !visited[cur + 1]) stack.push(cur + 1)
      if (cy > 0 && isYellow[cur - width] && !visited[cur - width]) stack.push(cur - width)
      if (cy < height - 1 && isYellow[cur + width] && !visited[cur + width]) stack.push(cur + width)
    }
    if (count >= 60) {
      components.push({ minX, maxX, minY, maxY, count })
    }
  }
}

// Group components that visually belong to the same icon: cluster by overlapping
// bounding boxes within a small expansion radius (icon parts like check badges
// and palm fronds are separate yellow blobs but live within the same icon box).
const EXPAND = 18
function bboxOverlap(a, b) {
  return !(
    a.maxX + EXPAND < b.minX ||
    b.maxX + EXPAND < a.minX ||
    a.maxY + EXPAND < b.minY ||
    b.maxY + EXPAND < a.minY
  )
}

const groups = []
for (const c of components) {
  let merged = false
  for (const g of groups) {
    if (g.some((m) => bboxOverlap(m, c))) {
      g.push(c)
      merged = true
      break
    }
  }
  if (!merged) groups.push([c])
}

// Iteratively merge groups that now overlap thanks to new members.
let changed = true
while (changed) {
  changed = false
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const overlap = groups[i].some((a) => groups[j].some((b) => bboxOverlap(a, b)))
      if (overlap) {
        groups[i].push(...groups[j])
        groups.splice(j, 1)
        changed = true
        break
      }
    }
    if (changed) break
  }
}

const boxes = groups
  .map((g) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, total = 0
    for (const c of g) {
      if (c.minX < minX) minX = c.minX
      if (c.maxX > maxX) maxX = c.maxX
      if (c.minY < minY) minY = c.minY
      if (c.maxY > maxY) maxY = c.maxY
      total += c.count
    }
    return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY, total }
  })
  .filter((b) => b.w > 30 && b.h > 30 && b.w < 200 && b.h < 200)
  .sort((a, b) => a.minY - b.minY || a.minX - b.minX)

console.log(`Image: ${width}x${height}`)
console.log(`Found ${boxes.length} candidate icon boxes:`)
for (const b of boxes) {
  console.log(`  x=${b.minX}-${b.maxX} (w=${b.w})  y=${b.minY}-${b.maxY} (h=${b.h})  pixels=${b.total}`)
}
