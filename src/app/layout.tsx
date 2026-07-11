import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileCallBar from '@/components/MobileCallBar';
import { site } from '@/lib/site';

const serif = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Mental Health, Dual Diagnosis & Detox in Fort Worth, TX`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'mental health treatment Fort Worth',
    'residential mental health Texas',
    'dual diagnosis treatment',
    'medical detox Fort Worth',
    'psychiatric residential care DFW',
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} | Mental Health & Dual Diagnosis Treatment in Fort Worth`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/brand/icon.png',
    apple: '/brand/icon.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  width: 'device-width',
  initialScale: 1,
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: site.name,
  url: site.url,
  telephone: site.phone.display,
  email: site.email,
  image: `${site.url}/brand/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: 'TX',
    postalCode: site.address.zip,
    addressCountry: 'US',
  },
  medicalSpecialty: ['Psychiatric', 'Addiction Medicine'],
  openingHours: 'Mo-Su 00:00-23:59',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-steel focus:px-5 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCallBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
