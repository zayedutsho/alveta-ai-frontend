export interface TestimonialCard {
  id: 'hasin' | 'sumit' | 'atiqur' | 'sumon';
  name: string;
  role: string;
  portrait: { src: string; width: number; height: number };
  quote?: string;
  avatar?: { src: string; width: number; height: number };
}
/** Figma editorial examples. Verify attribution and consent before publication. */
export interface TestimonialsContent {
  heading: string;
  status: 'design-example';
  notice: string;
  cards: TestimonialCard[];
}
export const testimonialsContent: TestimonialsContent = {
  heading: 'What People say about Alveta',
  status: 'design-example',
  notice: 'Design preview: testimonial attribution, roles and publication consent require verification.',
  cards: [
    { id: 'hasin', name: 'Hasin Hayder', role: 'Co-Founder & Head of Ideas', portrait: { src: '/images/testimonials/hasin.webp', width: 1200, height: 1600 } },
    { id: 'sumit', name: 'Sumit Saha', role: 'Co-Founder & Head of Ideas', portrait: { src: '/images/testimonials/sumit.webp', width: 1024, height: 576 } },
    { id: 'atiqur', name: 'Atiqur Rahaman', role: 'CEO & Founder at Monks', portrait: { src: '/images/testimonials/atiqur.webp', width: 2048, height: 2048 }, avatar: { src: '/images/testimonials/avatar.webp', width: 282, height: 400 }, quote: '“Alveta brings multiple AI tools into one place, helping me compare perspectives and spend less time switching between platforms.”' },
    { id: 'sumon', name: 'Sumon Molla Selim', role: 'Co-Founder Klassroom', portrait: { src: '/images/testimonials/sumon.webp', width: 600, height: 600 } },
  ],
};
