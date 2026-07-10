import Link from "next/link";
import { Mail, MapPin, Phone, Building2 } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon } from "@/components/site/social-icons";
import { NAV_LINKS, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { getEventSettings } from "@/lib/queries";
import { SsfLogoMark } from "@/components/site/ssf-logo";

const FIRST_COLUMN = NAV_LINKS.slice(0, 4);
const SECOND_COLUMN = NAV_LINKS.slice(4);

const D = {
  tagline: "Empowering Through Knowledge, Literature & Culture",
  phone: "+91 ",
  email: "info@ssfmalappuramsahityotsav.in",
  address: "Malappuram, Kerala, India",
  organization: "SSF Malappuram West Committee",
};

export async function Footer() {
  const settings = await getEventSettings();
  const tagline = settings?.footerTagline || D.tagline;
  const phone = settings?.footerPhone || D.phone;
  const email = settings?.footerEmail || D.email;
  const address = settings?.footerAddress || D.address;
  const organization = settings?.footerOrganization || D.organization;

  return (
    <footer className="bg-brand-dark text-white/80" style={{ backgroundColor: "#2e6ab1" }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <SsfLogoMark className="h-8 w-auto" />
            <span className="text-base font-bold text-white">{SITE_NAME}</span>
          </Link>
          <p className="max-w-md text-sm text-white/60">{tagline}</p>
          <div className="flex items-center gap-3 pt-2">
            <Link href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-[#2e6ab1] hover:text-white">
              <InstagramIcon className="size-4" />
            </Link>
            <Link href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-[#2e6ab1] hover:text-white">
              <FacebookIcon className="size-4" />
            </Link>
            <Link href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-[#2e6ab1] hover:text-white">
              <YoutubeIcon className="size-4" />
            </Link>
            <Link href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-[#2e6ab1] hover:text-white">
              <WhatsAppIcon className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:col-span-1">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {FIRST_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white invisible">More</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {SECOND_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Contact Us</h3>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 size-4 shrink-0" />{phone}</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 size-4 shrink-0" />{email}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />{address}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Organized By</h3>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/70">
              <Building2 className="size-5" />
            </span>
            <p className="text-sm text-white/60">{organization}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

