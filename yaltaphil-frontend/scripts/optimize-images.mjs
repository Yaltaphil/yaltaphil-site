import sharp from 'sharp'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const KB = (n) => (n / 1024).toFixed(1).padStart(7) + ' KB'
const log = async (label, out, input) =>
  console.log(`${label.padEnd(44)} ${KB((await stat(input)).size)} → ${KB((await stat(out)).size)}`)

const raster = (dir) => readdir(dir).then((files) =>
  files.filter((f) => ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extname(f).toLowerCase())))

const fresh = async (output, input) => {
  try {
    return (await stat(output)).mtimeMs > (await stat(input)).mtimeMs
  } catch {
    return false
  }
}

for (const file of await raster('public/img/portfolio')) {
  if (file.endsWith('-card.webp')) continue
  const input = join('public/img/portfolio', file)
  const output = join('public/img/portfolio', `${basename(file, extname(file))}-card.webp`)
  if (await fresh(output, input)) { console.log(`card  ${file.padEnd(38)} cached`); continue }
  await sharp(input, { animated: true })
    .resize({ width: 512, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(output)
  await log(`card  ${file}`, output, input)
}

for (const file of await raster('public/img/certificates')) {
  if (file.endsWith('-thumb.webp')) continue
  const input = join('public/img/certificates', file)
  const output = join('public/img/certificates', `${basename(file, extname(file))}-thumb.webp`)
  if (await fresh(output, input)) { console.log(`thumb ${file.padEnd(38)} cached`); continue }
  await sharp(input)
    .resize({ width: 400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(output)
  await log(`thumb ${file}`, output, input)
}

// Y-logo.png is sparse line art (~4% opaque pixels, 120x104 mark inside 128x128),
// so the orbit ring collapses at favicon sizes. Small sizes use the bare "Y" as vector.
const brandDef = `<linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4338ca"/><stop offset="1" stop-color="#7c3aed"/>
  </linearGradient>`

const markGroup = (x, y, size, { rx = 0 } = {}) =>
  `<g transform="translate(${x} ${y}) scale(${(size / 64).toFixed(4)})">
      <rect width="64" height="64" rx="${rx}" fill="url(#brand)"/>
      <path d="M20 15 32 34 44 15" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 34v16" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    </g>`

const iconSvg = (size, rx) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>${brandDef}</defs>
  <rect width="64" height="64" rx="${rx}" fill="url(#brand)"/>
  <path d="M20 15 32 34 44 15" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 34v16" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
</svg>`

await writeFile('public/favicon.svg', iconSvg(64, 14))

const icon = async (size, output, rx) => {
  await sharp(Buffer.from(iconSvg(size, rx))).png().toFile(output)
  console.log(`${output.padEnd(44)} ${KB((await stat(output)).size)}`)
}

await icon(32, 'public/favicon-32x32.png', 14)
await icon(180, 'public/apple-touch-icon.png', 0)
await icon(192, 'public/icon-192.png', 0)
await icon(512, 'public/icon-512.png', 0)

const photoUri = `data:image/webp;base64,${(await sharp('public/img/yaltaphil.jpg')
  .resize({ width: 538, height: 630, fit: 'cover', position: 'top' })
  .webp({ quality: 88 }).toBuffer()).toString('base64')}`

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#312e81"/><stop offset="0.55" stop-color="#4f46e5"/><stop offset="1" stop-color="#9333ea"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.18" r="0.6">
      <stop offset="0" stop-color="#a78bfa" stop-opacity="0.45"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1e1b4b" stop-opacity="0.97"/><stop offset="0.6" stop-color="#1e1b4b" stop-opacity="0.62"/><stop offset="1" stop-color="#1e1b4b" stop-opacity="0"/>
    </linearGradient>
    ${brandDef}
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <image href="${photoUri}" x="662" y="0" width="538" height="630"/>
  <rect width="860" height="630" fill="url(#scrim)"/>
  ${markGroup(72, 58, 60, { rx: 14 })}
  <text x="150" y="101" font-family="sans-serif" font-size="34" font-weight="700" fill="#ffffff">yaltaphil</text>
  <text x="72" y="280" font-family="sans-serif" font-size="74" font-weight="800" fill="#ffffff">Philip Ryazankin</text>
  <text x="72" y="338" font-family="sans-serif" font-size="36" font-weight="500" fill="#e0e7ff">Frontend Developer — Vue / Nuxt</text>
  <text x="72" y="452" font-family="sans-serif" font-size="29" fill="#c7d2fe">Building fast, clean and interactive web experiences.</text>
  <text x="72" y="540" font-family="sans-serif" font-size="30" font-weight="600" fill="#a5b4fc">yaltaphil.ru</text>
</svg>`

// JPEG, not PNG: a photo composite costs 287 KB as PNG and crawlers accept either.
await sharp(Buffer.from(ogSvg)).flatten({ background: '#312e81' }).jpeg({ quality: 84 }).toFile('public/og-image.jpg')
console.log(`${'public/og-image.jpg'.padEnd(44)} ${KB((await stat('public/og-image.jpg')).size)}`)

for (const dir of ['public/img/portfolio', 'public/img/certificates']) {
  for (const file of await raster(dir)) {
    const m = await sharp(join(dir, file)).metadata()
    console.log(`dims ${String(m.width).padStart(5)}x${String(m.height).padEnd(7)} ${join(dir, file)}`)
  }
}
