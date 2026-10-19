/** Editorial contracts, deliberately independent of a CMS SDK. */
export interface CallToAction { label: string; href: string; }
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
export interface LandingContent { announcement: AnnouncementContent; hero: HeroContent; customerLogos: CustomerLogosContent; features: FeaturesContent; }
