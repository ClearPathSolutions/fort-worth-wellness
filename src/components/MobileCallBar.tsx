import Link from 'next/link';
import { site } from '@/lib/site';
import { Phone, Shield } from '@/components/icons';

/**
 * Fixed bottom action bar on phones — keeps "Call" and "Verify" one tap away
 * without cluttering the header. Hidden from md up (header shows them there).
 */
export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
        <a href={site.phone.href} className="btn-gold h-11 text-[15px]">
          <Phone width={16} height={16} /> Call Now
        </a>
        <Link href="/admissions" className="btn-primary h-11 text-[15px]">
          <Shield width={16} height={16} /> Verify
        </Link>
      </div>
    </div>
  );
}
