import { appLink } from '../lib/app-links';
import type { CallToAction } from '../types/content';

export interface FaqItem { id: string; question: string; answer: string; open?: boolean; }
export interface FaqContent { heading: [string, string]; description: string; notice: string; columns: FaqItem[][]; }
export const faqContent: FaqContent = {
  heading: ['Frequently Asked Questions', ''],
  description: 'Here are some common queries that comes in your mind.',
  notice: '',
  columns: [
    [
      { id: 'what-is-alveta', question: '01. What is Alveta?', answer: 'Alveta is a multi-model AI platform that brings leading AI models like ChatGPT, Claude, Gemini, Grok, and DeepSeek together in one place. You can chat with different models, compare their responses, generate images and videos, and work with files without switching between multiple platforms.', open: true },
      { id: 'subscriptions', question: '02. Do I need separate subscriptions for different AI models?', answer: 'No. Alveta brings multiple AI models together under one personal account. Instead of managing separate accounts across different platforms, you can access supported models through Alveta using your available tokens.' },
      { id: 'tokens', question: "03. How does Alveta's token system work?", answer: 'Tokens are the credits you use to access AI features on Alveta. Different models and tasks may consume different amounts of tokens. Your balance decreases as you use the platform, and you can purchase more tokens whenever you need them.' },
      { id: 'out-of-tokens', question: '04. What happens when I run out of tokens?', answer: 'You don’t have to wait until your plan renews. You can purchase additional tokens whenever you need them and continue using Alveta without waiting for your next billing cycle.' },
      { id: 'unused-tokens', question: '05. Do unused tokens expire?', answer: 'If you have tokens left when your plan expires, you can renew your plan to get your remaining tokens back, according to the applicable plan terms. Check your plan details for the exact renewal conditions.' },
    ],
    [
      { id: 'charges', question: '06. Are there any hidden charges?', answer: 'No hidden charges. You’ll see the applicable plan price before purchasing. Additional token purchases or other paid features may incur extra charges, so always check the price before confirming a transaction.' },
      { id: 'payments', question: '07. Which payment methods and currencies does Alveta support?', answer: 'Alveta supports payments in BDT and USD. Depending on your location and checkout options, you can pay using supported local payment methods, such as bKash, Upay, and Rocket, or international payments through Stripe.' },
      { id: 'shared-account', question: '08. Is Alveta a shared account service?', answer: 'No. Alveta gives you your own personal account. You don’t need to share login credentials with other users, so your conversations and workflow stay separate from theirs.' },
      { id: 'multiple-models', question: '09. Can I use multiple AI models in the same conversation?', answer: 'Yes. You can select supported AI models and compare their responses using a single prompt. On supported comparison workflows, you can choose up to four models at once and continue with the response that works best for you.' },
    ],
  ],
};
export interface ArticlePreview { id: string; title: string; category: string; date: string; dateLabel: string; image: string; }
export interface ArticlesContent { heading: string; notice: string; items: ArticlePreview[]; }
export const articlesContent: ArticlesContent = {
  heading: 'Go Beyond the Basics of AI Insight',
  notice: '',
  items: [
    { id: 'workflows', title: 'Made for you: Deal Workflows, new MCP tools, and more.', image: '/images/ending/articles-image1.webp' },
    { id: 'multi-model', title: 'One Prompt, Better Results: A Practical Guide to Multi-Model AI', image: '/images/ending/articles-image2.webp' },
    { id: 'choose-model', title: 'ChatGPT vs Claude vs Gemini: How to Choose the Right AI Model', image: '/images/ending/articles-image3.webp' },
  ].map(item => ({ ...item, category: 'Product', date: '2026-10-16', dateLabel: '16 Oct, 2026' })),
};
export interface ClosingCtaContent { heading: [string, string]; description: string; primary: CallToAction; secondary: CallToAction; }
export const closingCtaContent: ClosingCtaContent = {
  heading: ['Best AI Workflow Starts', 'with Alveta'],
  description: 'Use Claude, GPT, Gemini, Grok, GLM, Kimi, and more in one collaborative, secure workspace built for teams and creators.',
  primary: { label: 'View Plans', href: '#pricing' }, secondary: { label: 'Let’s Try Alveta', href: appLink('/register') },
};
export interface FooterContent {
  description: string; legalHeading: string; featuresHeading: string;
  legal: { label: string; href?: string }[];
  features: { label: string; href?: string; badge?: string }[];
  socials: { name: string; image: string }[];
  newsletter: { heading: string; description: string; placeholder: string; action: string; notice: string };
  attribution: string;
}
export const footerContent: FooterContent = {
  description: 'One intelligent workspace for every leading AI model. One intelligent workspace for every leading AI model.',
  legalHeading: 'Legal', featuresHeading: 'Features',
  legal: [ { label: 'Privacy & Policy', href: appLink('/privacy') }, { label: 'Terms & Condition', href: appLink('/terms') }, { label: 'Refund Policy', href: appLink('/refund-policy') }, { label: 'Cookie Preferences' } ],
  features: [ { label: 'Top-Up Balance', href: '#balance-and-top-ups' }, { label: 'AI Modal Compare', href: '#model-comparison' }, { label: 'File Analysis', href: '#file-insights' }, { label: 'Video Generate', badge: 'Beta' } ],
  socials: ['Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube'].map((name, i) => ({ name, image: `/images/ending/footer-icon${i || ''}.svg` })),
  newsletter: { heading: 'Subscribe Newsletter', description: 'Subscribe our newsletter to get the latest news and updates!', placeholder: 'Enter your email', action: 'Subscribe', notice: '' },
  attribution: 'Alveta AI is a product of',
};
