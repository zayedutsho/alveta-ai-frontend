import type { SubscriptionComparisonContent } from '../types/content';

/** Editorial illustration values from Figma; replace through an approved data normalizer. */
export const subscriptionComparisonContent: SubscriptionComparisonContent = {
  status: 'design-example',
  heading: ['One AI Subscription.', 'Save up to 80%'],
  description: 'Replace multiple AI subscriptions with one simple plan and access the AI models you need, all from Alveta.',
  previewNotice: 'Illustrative comparison only. Prices and savings are unverified design examples, not current offers.',
  providers: [
    { id: 'chatgpt', name: 'ChatGPT', icon: 'subscription-icon2' },
    { id: 'grok', name: 'Grok', icon: 'subscription-icon' },
    { id: 'deepseek', name: 'DeepSeek', icon: 'subscription-icon1' },
    { id: 'claude', name: 'Claude', icon: 'subscription-icon3' },
    { id: 'gemini', name: 'Gemini', icon: 'subscription-gemini' },
    { id: 'kimi', name: 'Kimi', icon: 'subscription-kimi' },
  ].map(provider => ({ ...provider, price: '৳২,৪৬৪', period: '/মাস' })),
  offer: { prefix: 'মাত্র', price: '৳১৯৯', suffix: 'থেকে', savings: 'Save ৳14,800' },
};
