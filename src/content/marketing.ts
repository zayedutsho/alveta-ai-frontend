import { landingContent } from './landing';
import { testimonialsContent } from './testimonials';
import { faqContent, articlesContent, closingCtaContent, footerContent } from './landing-end';
import { pricingContent } from './pricing';
import { heroVariants } from './hero-variants';

/** Current editorial defaults; the product API remains the only source of prices/entitlements. */
export const marketingDefaults = {
  seo: {
    title: 'Alveta - Multi-Model AI Platform for Chat, Images & More',
    description: 'Access ChatGPT, Claude, Gemini, Grok, DeepSeek, and more in one AI platform. Compare responses, create images and videos, and manage your AI credits with Alveta.',
    socialImageAlt: 'Alveta.ai — All Your AI Tools in One Subscription',
  },
  navigation: {
    featuresLabel: 'Features', modelsLabel: 'Models', productsLabel: 'Products', pricingLabel: 'Pricing',
    modelsHeading: 'Leading models, one workspace', modelsEmpty: 'Explore available models in Alveta.',
    modelsCtaLabel: 'Explore models', signInLabel: 'Sign In', signupLabel: 'Get Started',
    products: [
      { label: 'AI Chat', path: '/chat' }, { label: 'Image workspace', path: '/images' },
      { label: 'Design workspace', path: '/designs' }, { label: 'Balance & top-ups', path: '/wallet' },
    ],
  },
  announcement: landingContent.announcement,
  hero: {
    ...landingContent.hero,
    variants: heroVariants.map(({ id, label, assistant, placeholder }) => ({ id, label, assistant, placeholder })),
  },
  customerLogos: { label: landingContent.customerLogos.label, rows: landingContent.customerLogos.rows.map(logos => ({ logos })) },
  features: landingContent.features,
  models: {...landingContent.models, cards: landingContent.models.cards.map(card => ({featured: false, ...card}))},
  subscriptionComparison: landingContent.subscriptionComparison,
  pricing: {
    heading: pricingContent.heading, description: pricingContent.description,
    popularLabel: pricingContent.popularLabel, ctaLabel: pricingContent.ctaLabel,
    features: pricingContent.features, labels: pricingContent.labels,
    individualLabel: 'Individual', teamLabel: 'Team Plan', modelsLabel: 'AI Models', tokenPrefix: 'Includes ',
    helpLabel: 'View current plans in Alveta',
    noScriptMessage: 'Enable JavaScript to load current prices here, or follow the link above to view plans in Alveta.',
  },
  testimonials: {...testimonialsContent, cards: testimonialsContent.cards.map(card => ({demo: false, quote: '', avatar: null, ...card}))},
  faq: { ...faqContent, columns: faqContent.columns.map(items => ({ items: items.map(item => ({open: false, ...item})) })) },
  articles: articlesContent,
  closingCta: closingCtaContent,
  footer: {...footerContent, legal: footerContent.legal.map(item => ({href: '', ...item})), features: footerContent.features.map(item => ({href: '', badge: '', ...item}))},
};

export type MarketingContent = typeof marketingDefaults;
