import {getCliClient} from 'sanity/cli'
import {readFile, writeFile, mkdir} from 'node:fs/promises'
import {resolve, join} from 'node:path'
import {createHash} from 'node:crypto'
import {marketingDefaults} from '../../src/content/marketing'
import assets from '../../src/content/figma-assets.json'

const root = resolve(process.cwd(), '..')
const output = join(root, '.work/sanity')
const documentId = 'Oh6YgvMTqh9o5H57ty0iDS'
const client = getCliClient({apiVersion: '2025-08-15'}).withConfig({projectId: 'iwd3xpdu', dataset: 'production', useCdn: false, perspective: 'raw'})
type Data = Record<string, any>
const isObject = (value: unknown): value is Data => !!value && typeof value === 'object' && !Array.isArray(value)

async function main() {
  await mkdir(output, {recursive: true})
  const source = JSON.parse(JSON.stringify(marketingDefaults)) as Data
  const artwork = new Map<string, {label: string; file?: string}>()
  const addAsset = (name: string, label: string) => {
    const asset = assets[name as keyof typeof assets]
    if (!asset) throw new Error(`Missing local asset: ${name}`)
    artwork.set(asset.src, {label, file: join(root, 'public', asset.src.slice(1))})
  }
  addAsset('logo5', 'Navigation logo — desktop')
  addAsset('logo-mobile', 'Navigation logo — mobile')
  for (const row of source.customerLogos.rows) for (const logo of row.logos) addAsset(logo.asset, `Customer logo — ${logo.name}`)
  for (const card of source.models.cards) addAsset(card.icon, `Model spotlight — ${card.provider}`)
  for (const provider of source.subscriptionComparison.providers) addAsset(provider.icon, `Subscription comparison — ${provider.name}`)
  addAsset('subscription-alveta', 'Subscription comparison — Alveta logo')
  for (const [path, label] of [
    ['/images/ending/footer-logo6.svg', 'Footer logo'], ['/images/ending/footer-logo5.svg', 'Footer watermark'],
    ['/images/ending/footer-logo11.svg', 'Footer product attribution logo'], ['/OpenGraphbanner.png', 'Social sharing image'],
  ]) artwork.set(path!, {label: label!, file: join(root, 'public', path!.slice(1))})
  for (const [file, label] of [
    ['feature-image1.png', 'Feature illustration background'], ['feature-product.png', 'Multi-agent workspace illustration'],
    ['feature-product1.png', 'Balance and top-ups illustration'], ['feature-product2.png', 'Private chat illustration'], ['feature-product3.png', 'File insights illustration'],
  ]) artwork.set(`/src/assets/features/${file}`, {label: label!, file: join(root, 'src/assets/features', file!)})
  artwork.set('/artwork/feature-comparison', {label: 'Optional replacement: model comparison artwork (leave empty to keep animation)'})
  artwork.set('/artwork/closing-workflow', {label: 'Optional replacement: closing CTA artwork (leave empty to keep animation)'})

  await writeFile(join(output, 'source-content.json'), JSON.stringify(source, null, 2))
  const records = await client.fetch<Data[]>('*[_id in $ids]', {ids: [documentId, `drafts.${documentId}`]})
  if (!records.some(record => record._id === documentId)) throw new Error('Expected existing published Landing Page document was not found; refusing to create a duplicate.')
  await writeFile(join(output, `backup-${Date.now()}.json`), JSON.stringify(records, null, 2))
  const inlineFiles = new Set<string>()
  function inventory(value: unknown, key = '') {
    if (Array.isArray(value)) value.forEach(item => inventory(item, key))
    else if (isObject(value)) {
      if (typeof value.src === 'string' && value.src.startsWith('/images/')) inlineFiles.add(value.src)
      else Object.entries(value).forEach(([name, item]) => inventory(item, name))
    } else if (key === 'image' && typeof value === 'string' && value.startsWith('/images/')) inlineFiles.add(value)
  }
  inventory(source)
  const plan = {project: 'iwd3xpdu', dataset: 'production', documentId, sections: Object.keys(source), existingDocuments: records.map(record => record._id), gallerySlots: artwork.size, inlineImages: inlineFiles.size, mode: process.env.SANITY_SEED_APPLY === '1' ? 'apply-missing-fields' : 'dry-run'}
  console.log(JSON.stringify(plan, null, 2))
  await writeFile(join(output, 'import-plan.json'), JSON.stringify(plan, null, 2))
  if (process.env.SANITY_SEED_APPLY !== '1') return

  const references = new Set<string>()
  const cachePath = join(output, 'media-cache.json')
  let cache: Data = {}
  try { cache = JSON.parse(await readFile(cachePath, 'utf8')) } catch { /* First import. */ }
  async function upload(file: string, alt: string) {
    const buffer = await readFile(file)
    if (!buffer.length) throw new Error(`Empty image: ${file}`)
    const key = createHash('sha256').update(buffer).digest('hex')
    if (!cache[key]) {
      const asset = await client.assets.upload('image', buffer, {filename: file.split(/[\\/]/).pop(), preserveFilename: true})
      cache[key] = asset._id
      await writeFile(cachePath, JSON.stringify(cache, null, 2))
    }
    references.add(cache[key])
    return {_type: 'image', asset: {_type: 'reference', _ref: cache[key]}, alt}
  }
  // Sequential uploads keep request volume low; checksum caching makes retries safe.
  async function transform(value: any, key = ''): Promise<any> {
    if (Array.isArray(value)) {
      const result = []
      for (const [index, item] of value.entries()) {
        const transformed = await transform(item, key)
        result.push(isObject(transformed) ? {_type: 'item', _key: `seed-${index}`, ...transformed} : transformed)
      }
      return result
    }
    if (isObject(value)) {
      if (typeof value.src === 'string' && value.src.startsWith('/images/')) return upload(join(root, 'public', value.src.slice(1)), key === 'portrait' ? 'Testimonial portrait' : 'Testimonial avatar')
      const result: Data = {}
      for (const [name, item] of Object.entries(value)) if (item !== null) result[name] = await transform(item, name)
      return result
    }
    if (key === 'image' && typeof value === 'string' && value.startsWith('/images/')) return upload(join(root, 'public', value.slice(1)), 'Marketing image')
    return value
  }
  const transformed = await transform(source)
  transformed.media = []
  for (const [path, entry] of artwork) transformed.media.push({
    _type: 'item', _key: createHash('sha1').update(path).digest('hex').slice(0, 16), source: path, label: entry.label,
    ...(entry.file ? {image: await upload(entry.file, entry.label)} : {}),
  })
  await writeFile(join(output, 'transformed-content.json'), JSON.stringify(transformed, null, 2))
  function missing(current: Data, desired: Data, prefix = ''): Data {
    const patch: Data = {}
    for (const [key, value] of Object.entries(desired)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (current[key] === undefined) patch[path] = value
      else if (isObject(current[key]) && isObject(value)) Object.assign(patch, missing(current[key], value, path))
    }
    return patch
  }
  const mutations = []
  for (const record of records) {
    const fields = missing(record, transformed)
    if (Object.keys(fields).length) await client.patch(record._id).ifRevisionId(record._rev).setIfMissing(fields).commit()
    mutations.push({id: record._id, addedFields: Object.keys(fields)})
  }
  const found = await client.fetch<number>('count(*[_id in $ids])', {ids: [...references]})
  if (found !== references.size) throw new Error('Some imported image references could not be verified.')
  const report = {...plan, assetsVerified: found, mutations}
  await writeFile(join(output, 'import-report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
