import type { PricingContent } from '../types/content';

export const pricingContent: PricingContent = {
  heading: ['Pay for AI. Not Subscriptions.', ''],
  description: 'Choose the plan that suits you best and unlock the power of AI. Confused about the plan? Then start with the Play package.',
  order: ['basic', 'play', 'standard', 'pro'], popular: 'play', popularLabel: 'Most Popular', ctaLabel: 'Get Started',
  features: [
    { key: 'ai_chat', label: 'AI Chat Module' }, { key: 'topup', label: 'Top-up Instantly' },
    { key: 'unlimited_usage', label: 'Unlimited Usage (Pay as you go)' },
    { key: 'ide_integration', label: 'IDE Integration' }, { key: 'prompt_library', label: 'Prompt Library' },
    { key: 'support', label: 'Standard Support' }, { key: 'image_gen', label: 'Image Generation' },
    { key: 'video_gen', label: 'Video Generation' }, { key: 'voice_gen', label: 'Voice Generation' }, { key: 'api_access', label: 'API Access' },
  ],
  labels: {
    loading: 'Loading current plans…', error: 'Plans could not be loaded. Try again or view current plans in Alveta.',
    empty: 'No plans are available right now.', retry: 'Try again', modelsError: 'Model names are temporarily unavailable.',
    partialModels: '', noModels: 'No models listed for this plan.', usageUnknown: 'Usage varies by model.',
  },
};
