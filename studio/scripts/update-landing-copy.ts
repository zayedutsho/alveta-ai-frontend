import {getCliClient} from 'sanity/cli'
import {marketingDefaults} from '../../src/content/marketing'

const documentId = 'Oh6YgvMTqh9o5H57ty0iDS'
const client = getCliClient({apiVersion: '2025-08-15'}).withConfig({
  projectId: 'iwd3xpdu',
  dataset: 'production',
  useCdn: false,
  perspective: 'raw',
})

type Data = Record<string, any>

function withArrayKeys(desired: Data[], current: Data[] = []) {
  return desired.map((item, index) => {
    const existing = current.find((candidate) => candidate.id === item.id) ?? current[index]
    return {
      _type: 'item',
      _key: existing?._key ?? `landing-copy-${index}`,
      ...item,
      benefits: item.benefits?.map((benefit: Data, benefitIndex: number) => ({
        _type: 'item',
        _key: existing?.benefits?.[benefitIndex]?._key ?? `landing-copy-${index}-${benefitIndex}`,
        ...benefit,
      })),
    }
  })
}

function withLogoRowKeys(desired: Data[][], current: Data[] = []) {
  return desired.map((logos, rowIndex) => ({
    _type: 'item',
    _key: current[rowIndex]?._key ?? `ai-logo-row-${rowIndex}`,
    logos: logos.map((logo, logoIndex) => ({
      _type: 'item',
      _key: current[rowIndex]?.logos?.[logoIndex]?._key ?? `ai-logo-${rowIndex}-${logoIndex}`,
      ...logo,
    })),
  }))
}

function withFaqColumnKeys(desired: Data[], current: Data[] = []) {
  return desired.map((column, columnIndex) => ({
    _type: 'item',
    _key: current[columnIndex]?._key ?? `faq-column-${columnIndex}`,
    items: column.items.map((item: Data, itemIndex: number) => ({
      _type: 'item',
      _key: current[columnIndex]?.items?.[itemIndex]?._key ?? `faq-${columnIndex}-${itemIndex}`,
      ...item,
    })),
  }))
}

async function main() {
  const ids = [documentId, `drafts.${documentId}`]
  const records = await client.fetch<Data[]>('*[_id in $ids]', {ids})
  const published = records.find((record) => record._id === documentId)
  if (!published) throw new Error('Published landing page document was not found.')

  const changes = records.map((record) => ({
    id: record._id,
    hero: marketingDefaults.hero,
    customerLogos: marketingDefaults.customerLogos.rows.map((row) => row.logos.map((logo) => logo.name)),
    panels: marketingDefaults.features.panels.map((panel) => panel.title),
    models: marketingDefaults.models.heading,
    subscriptionComparison: marketingDefaults.subscriptionComparison.heading,
  }))
  console.log(JSON.stringify({mode: process.env.SANITY_CONTENT_APPLY === '1' ? 'apply' : 'dry-run', changes}, null, 2))
  if (process.env.SANITY_CONTENT_APPLY !== '1') return

  for (const record of records) {
    const panels = withArrayKeys(marketingDefaults.features.panels, record.features?.panels)
    const logoRows = withLogoRowKeys(
      marketingDefaults.customerLogos.rows.map((row) => row.logos),
      record.customerLogos?.rows,
    )
    const faqColumns = withFaqColumnKeys(marketingDefaults.faq.columns, record.faq?.columns)
    await client
      .patch(record._id)
      .ifRevisionId(record._rev)
      .set({
        'hero.heading': marketingDefaults.hero.heading,
        'hero.description': marketingDefaults.hero.description,
        'customerLogos.label': marketingDefaults.customerLogos.label,
        'customerLogos.rows': logoRows,
        'features.panels': panels,
        'models.heading': marketingDefaults.models.heading,
        'models.description': marketingDefaults.models.description,
        'subscriptionComparison.heading': marketingDefaults.subscriptionComparison.heading,
        'subscriptionComparison.description': marketingDefaults.subscriptionComparison.description,
        'subscriptionComparison.previewNotice': marketingDefaults.subscriptionComparison.previewNotice,
        'subscriptionComparison.offer.savings': marketingDefaults.subscriptionComparison.offer.savings,
        'faq.heading': marketingDefaults.faq.heading,
        'faq.description': marketingDefaults.faq.description,
        'faq.columns': faqColumns,
      })
      .unset(['faq.notice', 'articles.notice'])
      .commit()
  }

  const verification = await client.fetch<Data[]>(
    '*[_id in $ids]{_id, hero{heading, description}, features{panels[]{title}}, models{heading, description}, subscriptionComparison{heading, description, offer{savings}}, faq{notice}}',
    {ids},
  )
  console.log(JSON.stringify({updated: verification}, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
