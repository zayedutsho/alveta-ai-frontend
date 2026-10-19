import type { LandingContent } from '../types/content';
import { appLink } from '../lib/app-links';
import { featuresContent } from './features';

/** Figma copy; later replaced by the published Sanity content normalizer. */
export const landingContent: LandingContent = {
  announcement: {
    badge: 'Beta',
    message: 'Alveta.ai is live! Use Alveta inside Claude, ChatGPT & more',
    shortMessage: 'Alveta.ai is live! Use Alveta inside...',
    cta: { label: 'Try it now', href: appLink('/register') },
  },
  hero: {
    heading: ['All the Best AI Models,', 'One Place'],
    description: 'Bring your AI workflow together in one place. Access multiple models, compare their responses, and choose the perspective that works for you.',
    placeholder: 'Ask me anything',
    ctaLabel: 'Generate',
  },
  customerLogos: {
    label: 'Customer logos',
    rows: [
      ['FedEx', 'Nexthink', 'Xplor Pay', 'Verifone', 'Lightspeed', 'Ericsson', 'Amazon', 'Carta'].map((name, index) => ({ name, asset: ['fedex', 'nexthink', 'xplor-pay', 'verifone', 'lightspeed', 'ericsson', 'amazon', 'cmt'].map(value => `customer-${value}`)[index]!, mobileAsset: `customer-mobile-${index}` })),
      ['FedEx', 'Lightspeed', 'Amazon', 'Ericsson', 'Nexthink', 'Verifone', 'Cisco', 'Xplor Pay', 'Carta'].map((name, index) => ({ name, asset: ['fedex', 'lightspeed', 'amazon', 'ericsson', 'nexthink', 'verifone', 'cisco', 'xplor-pay', 'cmt'].map(value => `customer-${value}`)[index]!, mobileAsset: `customer-mobile-${index + 8}` })),
    ],
  },
  features: featuresContent,
};
