import type { SubscriptionComparisonContent } from '../types/content';

/** Editorial illustration values from Figma; replace through an approved data normalizer. */
export const subscriptionComparisonContent: SubscriptionComparisonContent = {
  status: 'design-example',
  heading: ['The Best of AI,', 'Within Your Budget'],
  description: 'Enjoy your favorite AI models at budget-friendly prices, be it ChatGPT, Claude, DeepSeek, Gemini, Grok, or Perplexity!',
  previewNotice: '',
  providers: [
    { id: 'chatgpt', name: 'ChatGPT', icon: 'subscription-icon2' },
    { id: 'grok', name: 'Grok', icon: 'subscription-icon' },
    { id: 'deepseek', name: 'DeepSeek', icon: 'subscription-icon1' },
    { id: 'claude', name: 'Claude', icon: 'subscription-icon3' },
    { id: 'gemini', name: 'Gemini', icon: 'subscription-gemini' },
    { id: 'kimi', name: 'Kimi', icon: 'subscription-kimi' },
  ].map(provider => ({ ...provider, price: '৳২,৪৬৪', period: '/মাস' })),
  offer: { prefix: 'মাত্র', price: '৳১৯৯', suffix: 'থেকে', savings: 'Save ৳১৪,৮০০' },
};
