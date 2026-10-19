import { appLink } from '../lib/app-links';
import type { CallToAction } from '../types/content';

export interface FaqItem { id: string; question: string; answer: string; open?: boolean; }
export interface FaqContent { heading: [string, string]; description: string; notice: string; columns: FaqItem[][]; }
const tokens = { question: "How does Alveta's token system work?", answer: 'Your plan includes a token allowance. Review the current plan details and your account usage before choosing a model or adding balance.' };
const payments = { question: 'Which payment methods & currencies does Alveta support?', answer: 'Landing prices can be displayed in USD or BDT when available. Check the existing app checkout for the payment methods available to your account.' };
export const faqContent: FaqContent = {
  heading: ['Frequently Asked Questions', ''],
  description: 'Here are some common queries that comes in your mind.',
  notice: 'Preview: FAQ copy is pending editorial review; repeated questions follow the current design.',
  columns: [
    [
      { id: 'what-is-alveta', question: 'What is Alveta?', answer: 'Alveta brings multiple AI models into one workspace so you can compare responses and work with your files.' },
      { id: 'subscriptions', question: 'Do I need separate subscriptions for different AI models?', answer: 'No. Alveta is designed to give you access to multiple AI models without requiring separate subscriptions for each one. Simply purchase Alveta tokens and use them on the models you need.', open: true },
      { id: 'tokens', ...tokens }, { id: 'tokens-more', ...tokens },
    ],
    [
      { id: 'charges', question: 'Are there any hidden charges?', answer: 'Review the current package details and the final checkout total before paying. This preview does not establish tax, fee or renewal policies.' },
      { id: 'payments', ...payments }, { id: 'payments-more', ...payments }, { id: 'payments-other', ...payments },
    ],
  ],
};
export interface ArticlePreview { id: string; title: string; category: string; date: string; dateLabel: string; image: string; }
export interface ArticlesContent { heading: string; notice: string; items: ArticlePreview[]; }
export const articlesContent: ArticlesContent = {
  heading: 'Go Beyond the Basics of AI Insight',
  notice: 'Article previews from the design. Full articles are coming soon.',
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
  newsletter: { heading: 'Subscribe Newsletter', description: 'Subscribe our newsletter to get the latest news and updates!', placeholder: 'Enter your email', action: 'Subscribe', notice: 'Newsletter signup is coming soon.' },
  attribution: 'Alveta AI is a product of',
};
