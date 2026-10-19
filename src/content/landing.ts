import type { LandingContent } from '../types/content';
import { appLink } from '../lib/app-links';

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
};
