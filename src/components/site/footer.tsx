import Link from "next/link";
import { Leaf, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/site/social-icons";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { getEventSettings } from "@/lib/queries";

const FIRST_COLUMN = NAV_LINKS.slice(0, 4);
const SECOND_COLUMN = NAV_LINKS.slice(4);

const D = {
  tagline: "Empowering Through Knowledge, Literature & Culture",
  phone: "+91 1234 567 890",
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
  const fbHref = settings?.footerFacebook || "#";
  const igHref = settings?.footerInstagram || "#";
  const waHref = settings?.footerWhatsapp || "#";

  return (
    <footer className="bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <span className="text-base font-bold text-white">
              {SITE_NAME}
            </span>
          </Link>
          <p className="max-w-md text-sm text-emerald-200/80">
            {tagline}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={fbHref}
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-emerald-200 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <FacebookIcon className="size-4" />
            </Link>
            <Link
              href={igHref}
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-emerald-200 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <InstagramIcon className="size-4" />
            </Link>
            <Link
              href={waHref}
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-emerald-200 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:col-span-1">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              {FIRST_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white invisible">More</h3>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              {SECOND_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Contact Us</h3>
          <ul className="space-y-2.5 text-sm text-emerald-200/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              {phone}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              {email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {address}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Organized By</h3>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-emerald-200">
              <Leaf className="size-5" />
            </span>
            <p className="text-sm text-emerald-200/80">
              {organization}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-emerald-200/60">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
