import Link from "next/link";
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon } from "@/components/site/social-icons";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";

export async function Footer() {
  return (
    <footer className="border-t" style={{ backgroundColor: "#2e6ab1" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        {/* Social icons */}
        <div className="flex items-center gap-3">
          <Link href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white">
            <InstagramIcon className="size-4" />
          </Link>
          <Link href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white">
            <FacebookIcon className="size-4" />
          </Link>
          <Link href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white">
            <YoutubeIcon className="size-4" />
          </Link>
          <Link href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white">
            <WhatsAppIcon className="size-4" />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
