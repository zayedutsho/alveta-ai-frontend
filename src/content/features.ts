import type { FeaturesContent } from '../types/content';
import { appLink } from '../lib/app-links';

const cta = { label: 'Explore Alveta', href: appLink('/register') };
export const featuresContent: FeaturesContent = {
  heading: ['Powerful AI Features for', 'Every Workflow'],
  description: 'Discover powerful AI tools in one workspace. Compare leading models, analyze files, and streamline your workflow with features built for smarter, more productive work.',
  panels: [
    {
      id: 'multi-agent-workspace', title: '1. No Shared Accounts. No Interrupted Chats.', subtitle: 'Your account. Your conversations.',
      description: "Alveta doesn't offer shared accounts. You get access to multiple AI models through your own personal account. No shared logins, no mix-ups, and no risk of losing your chat in the middle of a conversation because someone else is using the same account.",
      icon: 'feature-ungroup-layers', cta,
      benefits: [
        { label: 'Your Personal Account', description: 'Use Alveta with your own account, not a shared login.', icon: 'feature-ai-swap' },
        { label: 'Your Conversations Stay Yours', description: 'Keep your chats separate and continue your work without other users getting in the way.', icon: 'feature-ai-user' },
      ],
      image: { kind: 'models', alt: 'Leading AI model logos connected in one Alveta workspace' },
    },
    {
      id: 'balance-and-top-ups', title: '2. Purchase Tokens Anytime, Any Amount', subtitle: 'Flexible AI credits when you need them.',
      description: 'Need more tokens before your plan renews? Or have some left when the month ends? Alveta gives you more flexibility to manage your AI credits.',
      icon: 'feature-invoice02', cta,
      benefits: [
        { label: 'Purchase AI Credits Anytime', description: 'Run out of tokens before your plan renews? Purchase more whenever you need them.', icon: 'feature-add-money-circle' },
        { label: 'Get Unused Tokens Back', description: 'Have tokens left when your plan expires? Renew your plan to get those remaining tokens back and continue where you left off.', icon: 'feature-ai-content-generator01' },
      ],
      image: { kind: 'balance', alt: 'An AI balance and top-up illustration with a phone, cards and payment symbols' },
    },
    {
      id: 'model-comparison', title: '3. Side-by-Side Model Comparison', subtitle: 'One prompt. Multiple perspectives.',
      description: 'Alveta lets you compare your preferred AI models using a single prompt. Get multiple responses at once and choose the one that works best for you.',
      icon: 'feature-invoice02', cta,
      benefits: [
        { label: 'Compare Up to 4 Models', description: 'Select up to four AI models and compare their responses.', icon: 'feature-git-compare-arrows' },
        { label: 'Choose the Best Response', description: 'Continue chatting with the model that best fits your needs.', icon: 'feature-solar-energy' },
      ],
      image: { kind: 'comparison', alt: 'AI model responses connected around Alveta for side-by-side comparison' },
    },
    {
      id: 'private-chat', title: '4. Private Chat & Vanish Mode', subtitle: 'Your conversations. Your choice.',
      description: 'Not every conversation needs to stay in your regular chat history. Alveta lets you keep selected chats separate or start temporary conversations that disappear automatically.',
      icon: 'feature-incognito', cta,
      benefits: [
        { label: 'Private Chat', description: 'Keep selected conversations separate from your regular chat history.', icon: 'feature-chat-lock01' },
        { label: 'Vanish Mode', description: 'Choose when your conversation should disappear, or let it vanish automatically after 24 hours.', icon: 'feature-bubble-chat-temporary' },
      ],
      image: { kind: 'private', alt: 'Private AI conversations illustrated with protected devices and a disappearing chat' },
    },
  ],
};
