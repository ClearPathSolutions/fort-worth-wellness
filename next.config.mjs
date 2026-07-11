/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Preserve the old WordPress URL structure so existing links / SEO keep working.
      { source: '/treatment-services/detox', destination: '/treatment/detox', permanent: true },
      { source: '/treatment-services/mental-health-residential', destination: '/treatment/mental-health-residential', permanent: true },
      { source: '/treatment-services/dual-diagnosis', destination: '/treatment/dual-diagnosis', permanent: true },
      { source: '/treatment-services/aftercare-planning', destination: '/treatment/aftercare-planning', permanent: true },
      { source: '/treatment-services', destination: '/treatment', permanent: true },
    ];
  },
};

export default nextConfig;
