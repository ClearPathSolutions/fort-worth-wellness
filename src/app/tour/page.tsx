import type { Metadata } from 'next';
import { gallery } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import Gallery from '@/components/Gallery';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import { Compass, Heart, Users } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Tour Our Private Fort Worth Mental Health Sanctuary',
  description:
    'Explore the Fort Worth Wellness campus — a calm, boutique residential estate with private suites, serene grounds, and high-end amenities designed for healing.',
};

const standards = [
  { icon: Heart, title: 'Individualized Care', body: 'Every resident is treated as a unique individual, with hand-crafted plans that adapt to their specific psychiatric needs.' },
  { icon: Compass, title: 'Integrated Psychiatric Oversight', body: 'Our medical and clinical teams collaborate in real time, keeping behavioral therapies and medication protocols perfectly in sync.' },
  { icon: Users, title: 'Intimate Resident Census', body: 'A small, intentional number of residents guarantees a high staff-to-client ratio — your progress is always a clinical priority.' },
];

export default function TourPage() {
  return (
    <>
      <PageHero
        eyebrow="Restorative Environment Meets Clinical Excellence"
        title="Tour our private sanctuary"
        subtitle="Our Fort Worth estate offers a high-end, boutique atmosphere that stands in quiet contrast to traditional clinical settings — a place designed for privacy, comfort, and deep healing."
        image="/images/facility/dji0577.jpg"
        crumbs={[{ label: 'Tour' }]}
      />

      {/* Gallery */}
      <section className="section bg-cream">
        <div className="container-wide">
          <SectionHeading
            eyebrow="A Modern, Luxury Sanctuary"
            title="Experience our restorative environment"
            intro="Our boutique property features a low-capacity census and sophisticated residential suites — curated spaces that create a tranquil environment where you can focus entirely on your wellness. Tap any photo to explore."
          />
          <div className="mt-12">
            <Gallery photos={gallery} />
          </div>
        </div>
      </section>

      {/* Standards */}
      <FeatureGrid
        bg="cream-deep"
        eyebrow="What Makes Our Sanctuary Different"
        heading="The gold standard for mental health treatment"
        features={standards}
        columns={3}
      />

      <InsuranceBand />
      <CTABand image="/images/facility/dji0584.jpg" />
    </>
  );
}
