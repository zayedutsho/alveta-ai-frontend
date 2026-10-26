import {defineArrayMember, defineField, type FieldDefinition} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {ImageIcon} from '@sanity/icons/Image'

export const text = (name: string, title?: string) => defineField({name, title, type: 'string'})
export const paragraph = (name: string) => defineField({name, type: 'text', rows: 3})
export const fixed = (name: string) => defineField({name, type: 'string', hidden: true, readOnly: true})
export const heading = () => defineField({name: 'heading', type: 'array', of: [defineArrayMember({type: 'string'})], validation: rule => rule.length(2), description: 'Heading lines, in order. Leave the second line empty for a single-line heading.'})
export const link = (name = 'href') => defineField({name, type: 'url', validation: rule => rule.uri({allowRelative: true, scheme: ['https', 'http', 'mailto', 'tel']})})
export const image = (name: string, title?: string) => defineField({name, title, type: 'image', icon: ImageIcon, options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string', validation: rule => rule.required().warning('Describe this image for accessibility.')})]})
export const object = (name: string, fields: FieldDefinition[], description?: string) => defineField({name, type: 'object', icon: DocumentIcon, fields, description})
export const list = (name: string, fields: FieldDefinition[], fixedSlots = false) => defineField({
  name, type: 'array', of: [defineArrayMember({name: 'item', type: 'object', icon: DocumentIcon, fields,
    preview: {select: {title: 'title', name: 'name', label: 'label', question: 'question', media: 'image'}, prepare: value => ({title: value.title || value.name || value.label || value.question || 'Content item', media: value.media})},
  })],
  ...(fixedSlots ? {options: {disableActions: ['add', 'duplicate'] as ('add' | 'duplicate')[]}} : {}),
})
export const cta = (name: string) => object(name, [text('label'), link()])

export const marketingFields: FieldDefinition[] = [
  object('seo', [text('title'), paragraph('description'), text('socialImageAlt')]),
  object('navigation', [
    ...['featuresLabel', 'modelsLabel', 'productsLabel', 'pricingLabel', 'modelsHeading', 'modelsEmpty', 'modelsCtaLabel', 'signInLabel', 'signupLabel'].map(name => text(name)),
    list('products', [text('label'), fixed('path')], true),
  ]),
  object('announcement', [text('badge'), text('message'), text('shortMessage'), cta('cta')]),
  object('hero', [heading(), paragraph('description'), text('placeholder'), text('ctaLabel', 'Button Text'), paragraph('signupNote'),
    list('variants', [fixed('id'), text('label', 'Tool Name'), text('assistant', 'Feature Label'), text('placeholder')], true),
  ]),
  object('customerLogos', [text('label'), list('rows', [list('logos', [text('name'), fixed('asset'), fixed('mobileAsset')], true)], true)], 'Edit company names here. Replace their artwork in Images & Logos.'),
  object('features', [heading(), paragraph('description'), list('panels', [fixed('id'), text('title'), text('subtitle'), paragraph('description'), fixed('icon'),
    list('benefits', [text('label'), paragraph('description'), fixed('icon')], true), cta('cta'), object('image', [fixed('kind'), text('alt', 'Illustration Description')]),
  ], true)]),
  object('models', [heading(), paragraph('description'), paragraph('previewNotice'), fixed('status'), list('cards', [fixed('id'), text('provider'), text('name'), fixed('icon'), text('benchmark'), text('tested'), cta('cta'), defineField({name: 'featured', type: 'boolean'})], true)], 'Editorial spotlight cards only. Live model availability still comes from the application API.'),
  object('subscriptionComparison', [heading(), paragraph('description'), paragraph('previewNotice'), fixed('status'),
    list('providers', [fixed('id'), text('name'), fixed('icon'), text('price'), text('period')], true), object('offer', ['prefix', 'price', 'suffix', 'savings'].map(name => text(name))),
  ], 'Illustrative comparison copy, not checkout prices or subscriptions.'),
  object('pricing', [heading(), paragraph('description'), text('popularLabel'), text('ctaLabel', 'Button Text'),
    ...['individualLabel', 'teamLabel', 'modelsLabel', 'tokenPrefix', 'helpLabel'].map(name => text(name)), paragraph('noScriptMessage'),
    list('features', [fixed('key'), text('label')], true), object('labels', ['loading', 'error', 'empty', 'retry', 'modelsError', 'partialModels', 'noModels', 'usageUnknown'].map(name => text(name))),
  ], 'Only marketing copy and interface labels. Prices, packages, token allowances, features, seats, and checkout remain API-controlled.'),
  object('testimonials', [text('heading'), paragraph('notice'), fixed('status'), list('cards', [fixed('id'), text('name'), text('role'), image('portrait'), paragraph('quote'), image('avatar'), defineField({name: 'demo', title: 'Show Demo Quote Notice', type: 'boolean'})], true)]),
  object('faq', [heading(), paragraph('description'), paragraph('notice'), list('columns', [list('items', [text('id', 'Unique Question ID'), text('question'), paragraph('answer'), defineField({name: 'open', type: 'boolean'})])], true)]),
  object('articles', [text('heading'), paragraph('notice'), list('items', [text('id'), text('title'), text('category'), defineField({name: 'date', type: 'date'}), text('dateLabel'), image('image', 'Cover Image')])]),
  object('closingCta', [heading(), paragraph('description'), cta('primary'), cta('secondary')]),
  object('footer', [paragraph('description'), text('legalHeading'), text('featuresHeading'), list('legal', [text('label'), link()]), list('features', [text('label'), link(), text('badge')]), list('socials', [text('name'), image('image', 'Social Icon')]), object('newsletter', [text('heading'), paragraph('description'), text('placeholder'), text('action'), paragraph('notice')]), text('attribution')]),
  list('media', [fixed('source'), text('label', 'Image Location'), image('image', 'Replace Image')], true),
]
