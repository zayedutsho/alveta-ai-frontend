import type { LandingContent } from '../types/content';
import { appLink } from '../lib/app-links';
import { featuresContent } from './features';
import { modelsContent } from './models';
import { subscriptionComparisonContent } from './subscription-comparison';

/** Figma copy; later replaced by the published Sanity content normalizer. */
export const landingContent: LandingContent = {
  announcement: {
    badge: 'Beta',
    message: 'Alveta.ai is live! Use Alveta inside Claude, ChatGPT & more',
    shortMessage: 'Alveta.ai is live! Use Alveta inside...',
    cta: { label: 'Try it now', href: appLink('/register') },
  },
  hero: {
    heading: ['All Your Favorite AI Models in One Platform', ''],
    description: 'ChatGPT, Claude, Gemini, Grok, DeepSeek, and more - all in one place.',
    placeholder: 'Ask me anything',
    ctaLabel: 'Get started',
    signupNote: 'Create an account to start chatting. Text entered here will not be sent or saved.',
  },
  customerLogos: {
    label: 'AI model providers available on Alveta',
    rows: [
      [
        { name: 'ChatGPT', asset: 'model-thesvg-color-openai-chatgpt', mobileAsset: 'model-thesvg-color-openai-chatgpt' },
        { name: 'Claude', asset: 'model-devicon-claude', mobileAsset: 'model-devicon-claude' },
        { name: 'Gemini', asset: 'model-gemini', mobileAsset: 'model-gemini' },
        { name: 'Grok', asset: 'model-logos-grok-icon', mobileAsset: 'model-logos-grok-icon' },
        { name: 'DeepSeek', asset: 'subscription-icon1', mobileAsset: 'subscription-icon1' },
        { name: 'Kimi', asset: 'subscription-kimi', mobileAsset: 'subscription-kimi' },
      ],
      [
        { name: 'Grok', asset: 'model-logos-grok-icon', mobileAsset: 'model-logos-grok-icon' },
        { name: 'Gemini', asset: 'model-gemini', mobileAsset: 'model-gemini' },
        { name: 'Claude', asset: 'model-devicon-claude', mobileAsset: 'model-devicon-claude' },
        { name: 'Kimi', asset: 'subscription-kimi', mobileAsset: 'subscription-kimi' },
        { name: 'ChatGPT', asset: 'model-thesvg-color-openai-chatgpt', mobileAsset: 'model-thesvg-color-openai-chatgpt' },
        { name: 'DeepSeek', asset: 'subscription-icon1', mobileAsset: 'subscription-icon1' },
      ],
    ],
  },
  features: featuresContent,
  models: modelsContent,
  subscriptionComparison: subscriptionComparisonContent,
};
