import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {marketingFields} from './marketingFields'

const titles: Record<string, string> = {
  seo: 'SEO & Sharing', navigation: 'Navigation', announcement: 'Announcement', hero: 'Hero & Chatbar',
  customerLogos: 'Customer Logos', features: 'Features', models: 'Model Spotlights', subscriptionComparison: 'Subscription Comparison',
  pricing: 'Pricing Copy', testimonials: 'Testimonials', faq: 'FAQs', articles: 'Article Previews', closingCta: 'Closing CTA', footer: 'Footer', media: 'Images & Logos',
}
export const landingPage = defineType({
  name: 'landingPage', type: 'document', icon: DocumentIcon,
  groups: Object.entries(titles).map(([name, title]) => ({name, title, default: name === 'hero'})),
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Alveta Landing Page', validation: rule => rule.required()}),
    ...marketingFields.map(field => ({...field, title: titles[field.name], group: field.name})),
  ],
  preview: {select: {title: 'title'}, prepare: ({title}) => ({title: title || 'Alveta Landing Page', subtitle: 'Marketing content; API-backed product data stays in the app'})},
})
