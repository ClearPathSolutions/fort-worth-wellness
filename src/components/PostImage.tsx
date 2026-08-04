import Image from 'next/image';

/**
 * Renders an image whose host is not known at build time. Local (`/…`) sources get
 * the optimized next/image pipeline; remote ones fall back to a plain <img>, because
 * next/image REJECTS an unconfigured host at render time rather than degrading — it
 * throws and takes the page with it.
 *
 * Two sources need this, and both arrive from an API: Clarion post covers (any host the
 * author uploaded to) and portal-managed staff headshots from the support portal.
 *
 * Meant to fill a positioned (relative) parent, mirroring `next/image` `fill`.
 */
export default function PostImage({
  src,
  alt,
  priority = false,
  sizes,
  className = 'object-cover transition-transform duration-700 ease-smooth group-hover:scale-105',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Overrides the cover styling — team headshots need `object-top` so faces are not cropped. */
  className?: string;
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
        className={className}
      />
    );
  }
  // Remote cover / portal headshot — plain img, same styling.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
