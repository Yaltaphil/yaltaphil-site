import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const dir = './public/img/sertificates'
const files = await readdir(dir)

for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

  const input = join(dir, file)
  const name = basename(file, ext)
  const output = join(dir, `${name}.webp`)

  const before = (await stat(input)).size
  await sharp(input)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output)
  const after = (await stat(output)).size

  console.log(`${file}: ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB WebP`)
}
