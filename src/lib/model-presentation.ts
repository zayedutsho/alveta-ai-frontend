import type { PublicModel } from '../types/catalog';

const providers: Record<string, { label: string; icon?: string }> = {
  openai: { label: 'OpenAI', icon: 'model-thesvg-color-openai-chatgpt.svg' },
  anthropic: { label: 'Anthropic', icon: 'model-devicon-claude.svg' },
  google: { label: 'Google', icon: 'model-gemini.png' },
  gemini: { label: 'Google', icon: 'model-gemini.png' },
  xai: { label: 'xAI', icon: 'model-logos-grok-icon.svg' },
  deepseek: { label: 'DeepSeek', icon: 'subscription-icon1.svg' },
  moonshot: { label: 'Moonshot AI', icon: 'subscription-kimi.png' },
  perplexity: { label: 'Perplexity' }, qwen: { label: 'Qwen' }, glm: { label: 'Z.ai' },
};

export function providerInfo(provider: string) {
  return providers[provider.trim().toLowerCase()] ?? { label: provider };
}

export function modelCard(model: PublicModel): HTMLAnchorElement {
  const provider = providerInfo(model.provider);
  const card = document.createElement('a');
  card.className = 'catalog-card';
  card.dataset.modelId = model.model_id;
  const icon = document.createElement('span');
  icon.className = 'catalog-icon';
  icon.setAttribute('aria-hidden', 'true');
  if (provider.icon) {
    const image = document.createElement('img');
    image.src = `/images/figma/${provider.icon}`;
    image.alt = ''; image.width = 28; image.height = 28;
    icon.append(image);
  } else icon.textContent = provider.label.slice(0, 2);
  const copy = document.createElement('span');
  copy.className = 'catalog-copy';
  const name = document.createElement('span');
  name.className = 'catalog-name'; name.textContent = model.name;
  const label = document.createElement('span');
  label.className = 'catalog-provider'; label.textContent = provider.label;
  copy.append(name, label);
  card.append(icon, copy);
  return card;
}
