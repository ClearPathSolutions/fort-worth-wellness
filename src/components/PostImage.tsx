import Image from 'next/image';

/**
 * Renders a blog post cover. Legacy posts use local (`/…`) images and get the
 * optimized next/image pipeline; Clarion posts carry arbitrary remote cover
 * URLs (any host the author uploaded to), which next/image would reject without
 * per-host remotePatterns config — so those fall back to a plain <img>.
 *
 * Meant to fill a positioned (relative) parent, mirroring `next/image` `fill`.
 */
export default function PostImage({
  src,
  alt,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const isLocal = src.startsWith('/');
  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
      />
    );
  }
  // Remote (Clarion) cover — plain img, still object-cover + hover zoom.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
    />
  );
}
