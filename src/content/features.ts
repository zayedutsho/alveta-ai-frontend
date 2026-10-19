import type { FeaturesContent } from '../types/content';
import { appLink } from '../lib/app-links';

const cta = { label: 'Explore Alveta', href: appLink('/register') };
export const featuresContent: FeaturesContent = {
  heading: ['Powerful AI Features for', 'Every Workflow'],
  description: 'Discover powerful AI tools in one workspace. Compare leading models, analyze files, and streamline your workflow with features built for smarter, more productive work.',
  panels: [
    {
      id: 'multi-agent-workspace', title: 'Multi-Agent AI Platform Workspace', subtitle: 'Alveta-built · Multi-vendor infrastructure',
      description: 'Access leading AI models from one unified interface. Switch between models or compare their responses to find the right approach for every task, all without jumping between platforms.',
      icon: 'feature-ungroup-layers', cta,
      benefits: [
        { label: 'Built For', description: 'Creators · Professionals · Teams', icon: 'feature-ai-swap' },
        { label: 'AI Access', description: 'Multiple leading AI models', icon: 'feature-ai-user' },
      ],
      image: { kind: 'models', alt: 'Leading AI model logos connected in one Alveta workspace' },
    },
    {
      id: 'balance-and-top-ups', title: 'Flexible Balance & Top-Ups', subtitle: 'Stay in control of your AI spending.',
      description: 'Manage your Alveta balance from one place and top up whenever you need to keep your AI workflow moving. Track your available funds and manage your spending with greater flexibility.',
      icon: 'feature-invoice02', cta,
      benefits: [
        { label: 'Flexible Top-Ups', description: 'Add funds when needed', icon: 'feature-add-money-circle' },
        { label: 'Usage Control', description: 'Monitor available balance', icon: 'feature-ai-content-generator01' },
      ],
      image: { kind: 'balance', alt: 'An AI balance and top-up illustration with a phone, cards and payment symbols' },
    },
    {
      id: 'model-comparison', title: 'Side-by-Side Model Comparison', subtitle: 'One prompt. Multiple perspectives.',
      description: 'Compare responses from multiple AI models using the same prompt, explore different approaches, and choose the insights that best fit your needs. Alveta brings different AI perspectives into one workspace.',
      icon: 'feature-invoice02', cta,
      benefits: [
        { label: 'Comparison Mode', description: 'Multiple model responses', icon: 'feature-git-compare-arrows' },
        { label: 'Core Benefit', description: 'Explore different perspectives', icon: 'feature-solar-energy' },
      ],
      image: { kind: 'comparison', alt: 'AI model responses connected around Alveta for side-by-side comparison' },
    },
    {
      id: 'private-chat', title: 'Private Chat & Vanish Mode', subtitle: 'Your conversations. Your choice.',
      description: 'Choose how you manage your AI conversations with Alveta’s private chat options. Use Private Chat or Vanish Mode for sessions you prefer to keep separate from your regular chat history.',
      icon: 'feature-incognito', cta,
      benefits: [
        { label: 'Private Chat', description: 'Access private conversation options', icon: 'feature-chat-lock01' },
        { label: 'Vanish Mode', description: 'Keep selected sessions separate from regular chat history.', icon: 'feature-bubble-chat-temporary' },
      ],
      image: { kind: 'private', alt: 'Private AI conversations illustrated with protected devices and a disappearing chat' },
    },
    {
      id: 'file-insights', title: 'Analyze Files. Uncover Insights.', subtitle: 'Your conversations. Your choice.',
      description: 'Upload supported files and let AI help you understand documents, extract key information, and explore insights without leaving your Alveta workspace. Spend less time searching through information and more time putting it to use.',
      icon: 'feature-investigation', cta,
      benefits: [
        { label: 'File Interaction', description: 'Upload supported files', icon: 'feature-file-add' },
        { label: 'AI-Powered Insights', description: 'Summarize content and extract key information', icon: 'feature-activity-spark' },
      ],
      image: { kind: 'files', alt: 'Documents emerging from a purple folder for AI analysis and insights' },
    },
  ],
};
