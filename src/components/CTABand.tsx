import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import { ArrowRight, Phone } from '@/components/icons';
import Reveal from '@/components/ui/Reveal';

type Props = {
  eyebrow?: string;
  title?: string;
  body?: string;
  image?: string;
};

export default function CTABand({
  eyebrow = "We're available 24/7",
  title = 'Contact our 24/7 admissions team',
  body = 'Reaching out is the first step. Our team is here around the clock to listen, answer your questions, and help you find the right path forward — with no pressure and complete confidentiality.',
  image = '/images/facility/dji0591.jpg',
}: Props) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/50" />
      <div className="container-fw relative py-16 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow !text-sand-light">
            <span className="h-px w-6 bg-sand-light" />
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl !text-white sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={site.phone.href} className="btn-white">
              <Phone width={17} height={17} /> Call {site.phone.display}
            </a>
            <Link href="/contact-us" className="btn-outline-light">
              Send a message <ArrowRight width={16} height={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
