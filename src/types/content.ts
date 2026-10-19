/** Editorial contracts, deliberately independent of a CMS SDK. */
export interface CallToAction { label: string; href: string; }
export interface PricingContent {
  heading: [string, string]; description: string; order: string[];
  popular: string; popularLabel: string; ctaLabel: string;
  features: { key: string; label: string }[];
  labels: { loading: string; error: string; empty: string; retry: string; modelsError: string; partialModels: string; noModels: string; usageUnknown: string };
}
export interface AnnouncementContent { badge: string; message: string; shortMessage: string; cta: CallToAction; }
export interface HeroContent { heading: [string, string]; description: string; placeholder: string; ctaLabel: string; }
export interface CustomerLogo { name: string; asset: string; mobileAsset: string; }
export interface CustomerLogosContent { label: string; rows: CustomerLogo[][]; }
export interface FeatureBenefit { label: string; description: string; icon: string; }
export interface FeaturePanelContent {
  id: string; title: string; subtitle: string; description: string; icon: string;
  benefits: FeatureBenefit[]; cta: CallToAction;
  image: { kind: 'models' | 'balance' | 'comparison' | 'private' | 'files'; alt: string; };
}
export interface FeaturesContent { heading: [string, string]; description: string; panels: FeaturePanelContent[]; }
export interface ModelSpotlight {
  id: string; provider: string; name: string; icon: string;
  benchmark: string; tested: string; cta: CallToAction; featured?: boolean;
}
/** Design examples only until model availability and benchmark evidence are supplied. */
export interface ModelsContent {
  heading: [string, string]; description: string; previewNotice: string;
  status: 'design-example'; cards: ModelSpotlight[];
}
export interface SubscriptionProvider {
  id: string; name: string; icon: string; price: string; period: string;
}
/** Presentation data, never checkout prices or package entitlements. */
export interface SubscriptionComparisonContent {
  heading: [string, string]; description: string; previewNotice: string;
  status: 'design-example'; providers: SubscriptionProvider[];
  offer: { prefix: string; price: string; suffix: string; savings: string; };
}
export interface LandingContent { announcement: AnnouncementContent; hero: HeroContent; customerLogos: CustomerLogosContent; features: FeaturesContent; models: ModelsContent; subscriptionComparison: SubscriptionComparisonContent; }
