import type { ModelsContent } from '../types/content';
import { appLink } from '../lib/app-links';

/** Figma examples, not a declaration of available models or validated benchmarks. */
export const modelsContent: ModelsContent = {
  status: 'design-example',
  heading: ['Does Alveta detect', 'the latest AI models?'],
  description: 'AI models from frontier labs like OpenAI, Anthropic, Google, Meta, DeepSeek, xAI, and more. We benchmark against 26 models (so far) and they are available to see on our model card.',
  previewNotice: 'Design examples only. Model availability, accuracy figures and test dates have not been verified.',
  cards: [
    { id: 'openai', provider: 'OpenAI', name: 'GPT 5.6', icon: 'model-thesvg-color-openai-chatgpt', benchmark: '99.6% accuracy', tested: 'Tested Jul 2026' },
    { id: 'google', provider: 'Google', name: 'Gemini 3', icon: 'model-gemini', benchmark: '99.2% accuracy', tested: 'Tested Jul 2026' },
    { id: 'anthropic', provider: 'Anthropic', name: 'Claude Opus 5', icon: 'model-devicon-claude', benchmark: '99.8% accuracy', tested: 'Tested Jul 2026', featured: true },
    { id: 'xai', provider: 'xAI', name: 'Grok 4.3', icon: 'model-logos-grok-icon', benchmark: '99.1% accuracy', tested: 'Tested Jul 2026' },
  ].map(card => ({ ...card, cta: { label: `Explore models in Alveta (${card.name} design example)`, href: appLink('/register') } })),
};
